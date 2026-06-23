const { Booking, User, Room, Bungalow } = require("../models");
const { Op } = require("sequelize");

const sendEmail = require("../services/emailService");

const ACTIVE_BOOKING_STATUSES = ["APPROVED", "CHECKED_IN"];

async function bookingHasConflicts(booking) {
  for (const room of booking.rooms || []) {
    const conflicts = await Booking.findAll({
      include: [
        {
          model: Room,
          as: "rooms",
          where: { id: room.id },
        },
      ],
      where: {
        id: {
          [Op.ne]: booking.id,
        },
        status: {
          [Op.in]: ACTIVE_BOOKING_STATUSES,
        },
        [Op.and]: [
          {
            check_in: {
              [Op.lt]: booking.check_out,
            },
          },
          {
            check_out: {
              [Op.gt]: booking.check_in,
            },
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return true;
    }
  }

  return false;
}

// Get All Bookings

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where:
        req.user.role === "ADMIN"
          ? { BungalowId: req.user.assigned_bungalow_id }
          : {},
      include: [
        User,
        Bungalow,
        {
          model: Room,
          as: "rooms",
        },
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

// Approve Booking

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Room,
          as: "rooms",
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking Not Found",
      });
    }

    if (
      req.user.role === "ADMIN" &&
      Number(booking.BungalowId) !== Number(req.user.assigned_bungalow_id)
    ) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending bookings can be approved",
      });
    }

    if (await bookingHasConflicts(booking)) {
      return res.status(409).json({
        message: "Booking conflicts with an already approved booking",
      });
    }

    booking.status = "APPROVED";

    await booking.save();

    if (booking.User?.email) {
      try {
        await sendEmail(
          booking.User.email,
          "Booking Approved",
          `
 <h2>Booking Approved</h2>

 <p>
 Reference:
 ${booking.booking_reference}
 </p>

 <p>
 Status:
 APPROVED
 </p>

 <p>
 Your room booking has been approved.
 </p>
 `,
        );
      } catch (emailError) {
        console.error("Booking approval email failed", emailError);
      }
    }

    res.json({
      message: "Booking Approved",

      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Reject Booking

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [User],
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking Not Found",
      });
    }

    if (
      req.user.role === "ADMIN" &&
      Number(booking.BungalowId) !== Number(req.user.assigned_bungalow_id)
    ) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    if (!["PENDING", "APPROVED"].includes(booking.status)) {
      return res.status(400).json({
        message: "This booking cannot be rejected",
      });
    }

    booking.status = "REJECTED";

    await booking.save();

    if (booking.User?.email) {
      try {
        await sendEmail(
          booking.User.email,
          "Booking Rejected",
          `
 <h2>Booking Rejected</h2>

 <p>
 Reference:
 ${booking.booking_reference}
 </p>

 <p>
 Status:
 REJECTED
 </p>
 `,
        );
      } catch (emailError) {
        console.error("Booking rejection email failed", emailError);
      }
    }

    res.json({
      message: "Booking Rejected",

      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Dashboard Statistics

exports.dashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.count();

    const pendingBookings = await Booking.count({
      where: {
        status: "PENDING",
      },
    });

    const approvedBookings = await Booking.count({
      where: {
        status: "APPROVED",
      },
    });

    const rejectedBookings = await Booking.count({
      where: {
        status: "REJECTED",
      },
    });

    res.json({
      totalBookings,

      pendingBookings,

      approvedBookings,

      rejectedBookings,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// rolebased dashboard

exports.roleDashboard = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "SUPER_ADMIN") {
      const totalUsers = await User.count();

      const totalRooms = await Room.count();

      const totalBungalows = await Bungalow.count();

      const totalBookings = await Booking.count();

      return res.json({
        role,

        totalUsers,

        totalRooms,

        totalBungalows,

        totalBookings,
      });
    }

    if (role === "ADMIN") {
      const pendingBookings = await Booking.count({
        where: {
          status: "PENDING",
        },
      });

      const approvedBookings = await Booking.count({
        where: {
          status: "APPROVED",
        },
      });

      return res.json({
        role,

        pendingBookings,

        approvedBookings,
      });
    }

    const myBookings = await Booking.count({
      where: {
        UserId: req.user.id,
      },
    });

    const pendingRequests = await Booking.count({
      where: {
        UserId: req.user.id,
        status: "PENDING",
      },
    });

    const approvedRequests = await Booking.count({
      where: {
        UserId: req.user.id,
        status: "APPROVED",
      },
    });

    res.json({
      role,

      myBookings,

      pendingRequests,

      approvedRequests,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
