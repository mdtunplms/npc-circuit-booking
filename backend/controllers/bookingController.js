const {
  Booking,
  Room,
  BookingRoom,
  Bungalow
} = require("../models");

const { Op } = require("sequelize");

const sendEmail =
require("../services/emailService");

const { User } =
require("../models");


// Generate Booking Reference

function generateReference() {

  return (
    "CB-" +
    Date.now()
  );

}

function normalizeRoomIds(roomIds) {
  if (!roomIds) {
    return [];
  }

  if (Array.isArray(roomIds)) {
    return roomIds.map(Number).filter(Boolean);
  }

  return String(roomIds)
    .split(",")
    .map(Number)
    .filter(Boolean);
}

function dateRangeIsInvalid(checkIn, checkOut) {
  return (
    !checkIn ||
    !checkOut ||
    new Date(checkIn) >= new Date(checkOut)
  );
}

async function findConflictingBookings(roomId, checkIn, checkOut) {
  return Booking.findAll({
    include:[
      {
        model: Room,
        as: "rooms",
        where:{ id: roomId }
      }
    ],

    where:{
      status:{
        [Op.in]:[
          "PENDING",
          "APPROVED"
        ]
      },

      [Op.and]:[
        {
          check_in:{
            [Op.lt]:checkOut
          }
        },

        {
          check_out:{
            [Op.gt]:checkIn
          }
        }
      ]
    }
  });
}

async function getAvailableRooms({
  bungalowId,
  roomType,
  checkIn,
  checkOut,
  guestsCount
}) {
  const rooms =
  await Room.findAll({
    where:{
      BungalowId:bungalowId,
      room_type:roomType,
      status:"AVAILABLE",
      max_guests:{
        [Op.gte]:guestsCount
      }
    },
    include:[Bungalow],
    order:[
      ["price","ASC"],
      ["room_number","ASC"]
    ]
  });

  const availableRooms = [];

  for(const room of rooms){
    const conflicts =
    await findConflictingBookings(
      room.id,
      checkIn,
      checkOut
    );

    if(conflicts.length === 0){
      availableRooms.push(room);
    }
  }

  return availableRooms;
}


// Check Availability API

exports.checkAvailability =
async (req,res)=>{

  try{

    const {
      roomId,
      bungalowId,
      room_type,
      check_in,
      check_out,
      guests_count = 1
    } = req.body;

    if(dateRangeIsInvalid(check_in, check_out)){
      return res.status(400).json({
        available:false,
        message:"Check out date must be after check in date"
      });
    }

    if(bungalowId && room_type){
      const availableRooms =
      await getAvailableRooms({
        bungalowId,
        roomType:room_type,
        checkIn:check_in,
        checkOut:check_out,
        guestsCount:Number(guests_count || 1)
      });

      if(availableRooms.length === 0){
        return res.json({
          available:false,
          message:"No available room or hall for the selected dates"
        });
      }

      return res.json({
        available:true,
        message:"Room or hall available",
        rooms:availableRooms
      });
    }

    const conflicts =
      await findConflictingBookings(
        roomId,
        check_in,
        check_out
      );

    if(conflicts.length > 0){

      return res.json({

        available:false,

        message:
          "Room already booked"

      });

    }

    res.json({

      available:true,

      message:
        "Room Available"

    });

  }catch(err){

    res.status(500).json({
      message:err.message
    });

  }

};

exports.createBooking =
async(req,res)=>{

try{

let {

	 bungalowId,

	 roomIds,

	 room_type,

	 check_in,

 check_out,

 purpose,

 guests_count

	} = req.body;

	roomIds = normalizeRoomIds(roomIds);

	const guestsCount =
	Number(guests_count || 1);

	if(dateRangeIsInvalid(check_in, check_out)){
	 return res.status(400).json({
	  message:"Check out date must be after check in date"
	 });
	}

	if(!purpose || !purpose.trim()){
	 return res.status(400).json({
	  message:"Visit purpose is required"
	 });
	}

	if(!req.file){
	 return res.status(400).json({
	  message:"Approval form PDF is required"
	 });
	}

const bungalow =
await Bungalow.findByPk(
 bungalowId
);

if(!bungalow){

 return res.status(404).json({
  message:"Bungalow Not Found"
 });

	}

	if(roomIds.length === 0 && room_type){
	 const availableRooms =
	 await getAvailableRooms({
	  bungalowId,
	  roomType:room_type,
	  checkIn:check_in,
	  checkOut:check_out,
	  guestsCount
	 });

	 if(availableRooms.length === 0){
	  return res.status(400).json({
	   message:"No available room or hall for the selected dates"
	  });
	 }

	 roomIds = [
	  availableRooms[0].id
	 ];
	}

	if(roomIds.length === 0){
	 return res.status(400).json({
	  message:"Please select a room type or room"
	 });
	}


	// CHECK ALL ROOMS

	for(const roomId of roomIds){

	 const room =
	 await Room.findByPk(roomId);

	 if(!room){
	  return res.status(404).json({
	   message:`Room ${roomId} not found`
	  });
	 }

	 if(Number(room.BungalowId) !== Number(bungalowId)){
	  return res.status(400).json({
	   message:`Room ${roomId} does not belong to selected bungalow`
	  });
	 }

	 if(room_type && room.room_type !== room_type){
	  return res.status(400).json({
	   message:`Room ${roomId} does not match selected type`
	  });
	 }

	 if(room.status !== "AVAILABLE"){
	  return res.status(400).json({
	   message:`Room ${roomId} is not available for booking`
	  });
	 }

	 if(Number(room.max_guests) < guestsCount){
	  return res.status(400).json({
	   message:`Room ${roomId} cannot hold ${guestsCount} guests`
	  });
	 }

	 const conflicts =
	 await findConflictingBookings(
	  roomId,
	  check_in,
	  check_out
	 );

 if(conflicts.length>0){

  return res.status(400).json({

   message:
   `Room ${roomId} already booked`

  });

 }

}


// CREATE BOOKING

const booking =
await Booking.create({

 UserId:req.user.id,

 BungalowId:bungalowId,

 booking_reference:
 generateReference(),

 check_in,

	 check_out,

		 guests_count:guestsCount,

		 room_type,

		 purpose,

 form_file:
 req.file
 ? req.file.filename
 : null

});


// ATTACH ROOMS

let totalAmount = 0;

const rooms =
await Room.findAll({

 where:{
  id:roomIds
 }

});

for(const room of rooms){

 totalAmount +=
 parseFloat(room.price);

 await BookingRoom.create({

  BookingId:booking.id,

  RoomId:room.id,

  room_price:room.price

 });

}


// Number of days

const days =
Math.ceil(

 (
  new Date(check_out)
  -
  new Date(check_in)
 ) /
 (1000*60*60*24)

);

booking.total_amount =
days * totalAmount;

await booking.save();

// email notify

const user =
await User.findByPk(
 req.user.id
);

await sendEmail(

 user.email,

 "Booking Request Submitted",

 `
 <h2>Booking Request Received</h2>

 <p>
 Reference:
 ${booking.booking_reference}
 </p>

 <p>
 Status:
 ${booking.status}
 </p>
 `

);

res.status(201).json({

 message:
 "Booking Created",

 booking

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

exports.myBookings =
async(req,res)=>{

try{

const bookings =
await Booking.findAll({

 where:{
  UserId:req.user.id
 },

include:[
 {
  model:Room,
  as:"rooms"
 },
 Bungalow
]

});

res.json(bookings);

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};
