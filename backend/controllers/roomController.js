const { Room, Bungalow } = require("../models");


// Create Room

exports.createRoom = async (req, res) => {

  try {

    const room = await Room.create({

      room_number: req.body.room_number,

      room_type: req.body.room_type,

      max_guests: req.body.max_guests,

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

    await room.update({

      room_number:
        req.body.room_number || room.room_number,

      room_type:
        req.body.room_type || room.room_type,

      max_guests:
        req.body.max_guests || room.max_guests,

      price:
        req.body.price || room.price,

      status:
        req.body.status || room.status

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