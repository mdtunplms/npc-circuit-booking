const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const sequelize = require("../config/db");
const {
  Booking,
  Room,
  BookingRoom,
  Bungalow,
  User,
} = require("../models");
const sendEmail = require("../services/emailService");

const VALID_ROOM_TYPES = ["AC", "NON_AC", "HALL"];
const ACTIVE_BOOKING_STATUSES = ["PENDING", "APPROVED", "CHECKED_IN"];

function generateReference() {
  return `CB-${Date.now()}`;
}

function safeDeleteUploadedFile(file) {
  if (!file?.path) {
    return;
  }

  fs.unlink(path.resolve(file.path), () => {});
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function normalizeRoomIds(roomIds) {
  const values = Array.isArray(roomIds)
    ? roomIds
    : String(roomIds || "").split(",");

  return [
    ...new Set(
      values
        .map(Number)
        .filter((value) => Number.isInteger(value) && value > 0),
    ),
  ];
}

function parseDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function validateDateRange(checkIn, checkOut) {
  const checkInDate = parseDateOnly(checkIn);
  const checkOutDate = parseDateOnly(checkOut);

  if (!checkInDate || !checkOutDate) {
    return "Check in and check out dates are required";
  }

  if (checkInDate >= checkOutDate) {
    return "Check out date must be after check in date";
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return "Check in date cannot be in the past";
  }

  return null;
}

async function findConflictingBookings(roomId, checkIn, checkOut, options = {}) {
  return Booking.findAll({
    include: [
      {
        model: Room,
        as: "rooms",
        where: { id: roomId },
      },
    ],
    where: {
      status: {
        [Op.in]: ACTIVE_BOOKING_STATUSES,
      },
      [Op.and]: [
        {
          check_in: {
            [Op.lt]: checkOut,
          },
        },
        {
          check_out: {
            [Op.gt]: checkIn,
          },
        },
      ],
    },
    transaction: options.transaction,
  });
}

async function getAvailableRooms({
  bungalowId,
  roomType,
  checkIn,
  checkOut,
  guestsCount,
  transaction,
}) {
  const rooms = await Room.findAll({
    where: {
      BungalowId: bungalowId,
      room_type: roomType,
      status: "AVAILABLE",
      max_guests: {
        [Op.gte]: guestsCount,
      },
    },
    include: [Bungalow],
    order: [
      ["price", "ASC"],
      ["room_number", "ASC"],
    ],
    transaction,
  });

  const availableRooms = [];

  for (const room of rooms) {
    const conflicts = await findConflictingBookings(
      room.id,
      checkIn,
      checkOut,
      { transaction },
    );

    if (conflicts.length === 0) {
      availableRooms.push(room);
    }
  }

  return availableRooms;
}

exports.checkAvailability = async (req, res) => {
  try {
    const {
      roomId,
      bungalowId,
      room_type,
      check_in,
      check_out,
      guests_count = 1,
    } = req.body;

    const dateError = validateDateRange(check_in, check_out);

    if (dateError) {
      return res.status(400).json({
        available: false,
        message: dateError,
      });
    }

    const guestsCount = Number(guests_count || 1);

    if (!isPositiveInteger(guestsCount)) {
      return res.status(400).json({
        available: false,
        message: "Guest count must be at least 1",
      });
    }

    if (bungalowId && room_type) {
      if (!isPositiveInteger(bungalowId)) {
        return res.status(400).json({
          available: false,
          message: "Valid bungalow is required",
        });
      }

      if (!VALID_ROOM_TYPES.includes(room_type)) {
        return res.status(400).json({
          available: false,
          message: "Invalid room type",
        });
      }

      const bungalow = await Bungalow.findByPk(bungalowId);

      if (!bungalow) {
        return res.status(404).json({
          available: false,
          message: "Bungalow not found",
        });
      }

      const availableRooms = await getAvailableRooms({
        bungalowId,
        roomType: room_type,
        checkIn: check_in,
        checkOut: check_out,
        guestsCount,
      });

      if (availableRooms.length === 0) {
        return res.json({
          available: false,
          message: "No available room or hall for the selected dates",
        });
      }

      return res.json({
        available: true,
        message: "Room or hall available",
        rooms: availableRooms,
      });
    }

    if (!isPositiveInteger(roomId)) {
      return res.status(400).json({
        available: false,
        message: "Valid room is required",
      });
    }

    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({
        available: false,
        message: "Room not found",
      });
    }

    if (room.status !== "AVAILABLE") {
      return res.json({
        available: false,
        message: "Room is under maintenance",
      });
    }

    if (Number(room.max_guests) < guestsCount) {
      return res.json({
        available: false,
        message: `Room cannot hold ${guestsCount} guests`,
      });
    }

    const conflicts = await findConflictingBookings(
      roomId,
      check_in,
      check_out,
    );

    if (conflicts.length > 0) {
      return res.json({
        available: false,
        message: "Room already booked",
      });
    }

    res.json({
      available: true,
      message: "Room Available",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.createBooking = async (req, res) => {
  let createdBooking;

  try {
    let {
      bungalowId,
      roomIds,
      room_type,
      check_in,
      check_out,
      purpose,
      guests_count,
    } = req.body;

    roomIds = normalizeRoomIds(roomIds);
    const guestsCount = Number(guests_count || 1);
    const dateError = validateDateRange(check_in, check_out);

    if (dateError) {
      throw createHttpError(400, dateError);
    }

    if (!isPositiveInteger(bungalowId)) {
      throw createHttpError(400, "Valid bungalow is required");
    }

    if (!isPositiveInteger(guestsCount)) {
      throw createHttpError(400, "Guest count must be at least 1");
    }

    if (room_type && !VALID_ROOM_TYPES.includes(room_type)) {
      throw createHttpError(400, "Invalid room type");
    }

    if (!purpose || !purpose.trim()) {
      throw createHttpError(400, "Visit purpose is required");
    }

    if (!req.file) {
      throw createHttpError(400, "Approval form PDF is required");
    }

    await sequelize.transaction(async (transaction) => {
      const bungalow = await Bungalow.findByPk(bungalowId, { transaction });

      if (!bungalow) {
        throw createHttpError(404, "Bungalow Not Found");
      }

      if (roomIds.length === 0 && room_type) {
        const availableRooms = await getAvailableRooms({
          bungalowId,
          roomType: room_type,
          checkIn: check_in,
          checkOut: check_out,
          guestsCount,
          transaction,
        });

        if (availableRooms.length === 0) {
          throw createHttpError(
            400,
            "No available room or hall for the selected dates",
          );
        }

        roomIds = [availableRooms[0].id];
      }

      if (roomIds.length === 0) {
        throw createHttpError(400, "Please select a room type or room");
      }

      const rooms = [];

      for (const roomId of roomIds) {
        const room = await Room.findByPk(roomId, { transaction });

        if (!room) {
          throw createHttpError(404, `Room ${roomId} not found`);
        }

        if (Number(room.BungalowId) !== Number(bungalowId)) {
          throw createHttpError(
            400,
            `Room ${roomId} does not belong to selected bungalow`,
          );
        }

        if (room_type && room.room_type !== room_type) {
          throw createHttpError(
            400,
            `Room ${roomId} does not match selected type`,
          );
        }

        if (room.status !== "AVAILABLE") {
          throw createHttpError(
            400,
            `Room ${roomId} is not available for booking`,
          );
        }

        if (Number(room.max_guests) < guestsCount) {
          throw createHttpError(
            400,
            `Room ${roomId} cannot hold ${guestsCount} guests`,
          );
        }

        const conflicts = await findConflictingBookings(
          roomId,
          check_in,
          check_out,
          { transaction },
        );

        if (conflicts.length > 0) {
          throw createHttpError(400, `Room ${roomId} already booked`);
        }

        rooms.push(room);
      }

      const booking = await Booking.create(
        {
          UserId: req.user.id,
          BungalowId: bungalowId,
          booking_reference: generateReference(),
          check_in,
          check_out,
          guests_count: guestsCount,
          room_type: room_type || rooms[0]?.room_type,
          purpose: purpose.trim(),
          form_file: req.file.filename,
        },
        { transaction },
      );

      let nightlyTotal = 0;

      for (const room of rooms) {
        nightlyTotal += parseFloat(room.price);

        await BookingRoom.create(
          {
            BookingId: booking.id,
            RoomId: room.id,
            room_price: room.price,
          },
          { transaction },
        );
      }

      const days = Math.ceil(
        (new Date(`${check_out}T00:00:00.000Z`) -
          new Date(`${check_in}T00:00:00.000Z`)) /
          (1000 * 60 * 60 * 24),
      );

      booking.total_amount = days * nightlyTotal;

      await booking.save({ transaction });

      createdBooking = booking;
    });

    const user = await User.findByPk(req.user.id);

    if (user?.email) {
      try {
        await sendEmail(
          user.email,
          "Booking Request Submitted",
          `
 <h2>Booking Request Received</h2>
 <p>Reference: ${createdBooking.booking_reference}</p>
 <p>Status: ${createdBooking.status}</p>
 `,
        );
      } catch (emailError) {
        console.error("Booking confirmation email failed", emailError);
      }
    }

    res.status(201).json({
      message: "Booking Created",
      booking: createdBooking,
    });
  } catch (err) {
    if (!createdBooking) {
      safeDeleteUploadedFile(req.file);
    }

    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        UserId: req.user.id,
      },
      include: [
        {
          model: Room,
          as: "rooms",
        },
        Bungalow,
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
