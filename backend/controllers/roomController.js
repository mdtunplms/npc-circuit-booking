const { Room, Bungalow } = require("../models");


// Create Room

exports.createRoom = async (req, res) => {

  try {
    const availableBeds =
      req.body.room_type === "HALL"
        ? Number(req.body.available_beds || req.body.max_guests || 0)
        : Number(req.body.available_beds || 0);

    if (req.body.room_type === "HALL" && availableBeds < 1) {
      return res.status(400).json({
        message: "Available beds are required for halls"
      });
    }

    const room = await Room.create({

      room_number: req.body.room_number,

      room_type: req.body.room_type,

      max_guests:
        req.body.room_type === "HALL"
          ? availableBeds
          : req.body.max_guests,

      available_beds: availableBeds,

      price: req.body.price,

      BungalowId: req.body.bungalowId

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

    await room.update({

      room_number:
        req.body.room_number || room.room_number,

      room_type: nextRoomType,

      max_guests:
        nextRoomType === "HALL"
          ? availableBeds
          : req.body.max_guests || room.max_guests,

      available_beds: availableBeds,

      price:
        req.body.price || room.price,

      status:
        req.body.status || room.status,

      BungalowId:
        req.body.bungalowId || req.body.BungalowId || room.BungalowId

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
