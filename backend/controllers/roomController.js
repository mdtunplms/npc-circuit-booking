const { Room, Bungalow } = require("../models");

const VALID_ROOM_TYPES = ["AC", "NON_AC", "HALL"];
const VALID_ROOM_STATUSES = ["AVAILABLE", "MAINTENANCE"];

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

// Create Room

exports.createRoom = async (req, res) => {

  try {
    const {
      room_number,
      room_type,
      max_guests,
      price,
      bungalowId,
    } = req.body;

    if (!room_number || !String(room_number).trim()) {
      return res.status(400).json({
        message: "Room number is required"
      });
    }

    if (!VALID_ROOM_TYPES.includes(room_type)) {
      return res.status(400).json({
        message: "Invalid room type"
      });
    }

    if (!isPositiveNumber(price)) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    if (!isPositiveInteger(bungalowId)) {
      return res.status(400).json({
        message: "Valid bungalow is required"
      });
    }

    const bungalow = await Bungalow.findByPk(bungalowId);

    if (!bungalow) {
      return res.status(404).json({
        message: "Bungalow not found"
      });
    }

    const availableBeds =
      room_type === "HALL"
        ? Number(req.body.available_beds || max_guests || 0)
        : Number(req.body.available_beds || 0);

    if (room_type === "HALL" && !isPositiveInteger(availableBeds)) {
      return res.status(400).json({
        message: "Available beds are required for halls"
      });
    }

    if (room_type !== "HALL" && !isPositiveInteger(max_guests)) {
      return res.status(400).json({
        message: "Maximum guests must be at least 1"
      });
    }

    const room = await Room.create({

      room_number: String(room_number).trim(),

      room_type,

      max_guests:
        room_type === "HALL"
          ? availableBeds
          : Number(max_guests),

      available_beds: availableBeds,

      price,

      BungalowId: bungalowId

    });

    res.status(201).json(room);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Get All Rooms

exports.getAllRooms = async (req, res) => {

  try {

    const rooms = await Room.findAll({

      include: [Bungalow]

    });

    res.json(rooms);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// Get All Bungalows

exports.getBungalows = async (req, res) => {

  try {

    const bungalows = await Bungalow.findAll({

      attributes: ["id", "name", "location"],

      order: [["name", "ASC"]]

    });

    res.json(bungalows);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Get Rooms By Bungalow

exports.getRoomsByBungalow = async (req, res) => {

  try {

    const rooms = await Room.findAll({

      where: {
        BungalowId: req.params.bungalowId
      }

    });

    res.json(rooms);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Update Room

exports.updateRoom = async (req, res) => {

  try {

    const room = await Room.findByPk(req.params.id);

    if (!room) {

      return res.status(404).json({
        message: "Room Not Found"
      });

    }

    const nextRoomType =
      req.body.room_type || room.room_type;

    if (!VALID_ROOM_TYPES.includes(nextRoomType)) {
      return res.status(400).json({
        message: "Invalid room type"
      });
    }

    const nextStatus = req.body.status || room.status;

    if (!VALID_ROOM_STATUSES.includes(nextStatus)) {
      return res.status(400).json({
        message: "Invalid room status"
      });
    }

    const nextBungalowId =
      req.body.bungalowId || req.body.BungalowId || room.BungalowId;

    if (!isPositiveInteger(nextBungalowId)) {
      return res.status(400).json({
        message: "Valid bungalow is required"
      });
    }

    const bungalow = await Bungalow.findByPk(nextBungalowId);

    if (!bungalow) {
      return res.status(404).json({
        message: "Bungalow not found"
      });
    }

    const nextPrice = req.body.price ?? room.price;

    if (!isPositiveNumber(nextPrice)) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    const availableBeds =
      nextRoomType === "HALL"
        ? Number(
            req.body.available_beds ??
            req.body.max_guests ??
            room.available_beds ??
            room.max_guests ??
            0
          )
        : Number(req.body.available_beds ?? room.available_beds ?? 0);

    if (nextRoomType === "HALL" && availableBeds < 1) {
      return res.status(400).json({
        message: "Available beds are required for halls"
      });
    }

    const nextMaxGuests =
      nextRoomType === "HALL"
        ? availableBeds
        : Number(req.body.max_guests ?? room.max_guests);

    if (!isPositiveInteger(nextMaxGuests)) {
      return res.status(400).json({
        message: "Maximum guests must be at least 1"
      });
    }

    await room.update({

      room_number:
        req.body.room_number
          ? String(req.body.room_number).trim()
          : room.room_number,

      room_type: nextRoomType,

      max_guests: nextMaxGuests,

      available_beds: availableBeds,

      price: nextPrice,

      status: nextStatus,

      BungalowId: nextBungalowId

    });

    res.json(room);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Delete Room

exports.deleteRoom = async (req, res) => {

  try {

    const room = await Room.findByPk(req.params.id);

    if (!room) {

      return res.status(404).json({
        message: "Room Not Found"
      });

    }

    await room.destroy();

    res.json({
      message: "Room Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
