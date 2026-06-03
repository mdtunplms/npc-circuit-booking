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


// Check Availability API

exports.checkAvailability =
async (req,res)=>{

  try{

    const {
      roomId,
      check_in,
      check_out
    } = req.body;

    const conflicts =
      await Booking.findAll({

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
                [Op.lte]:check_out
              }
            },

            {
              check_out:{
                [Op.gte]:check_in
              }
            }
          ]
        }

      });

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

 check_in,

 check_out,

 purpose,

 guests_count

} = req.body;

// Convert roomIds string to array
if(typeof roomIds === "string"){
    roomIds = roomIds.split(",").map(Number);
}

console.log(roomIds);

const bungalow =
await Bungalow.findByPk(
 bungalowId
);

if(!bungalow){

 return res.status(404).json({
  message:"Bungalow Not Found"
 });

}


// CHECK ALL ROOMS

for(const roomId of roomIds){

 const conflicts =
 await Booking.findAll({

 include:[
  {
      model: Room,
      as: "rooms",
      where:{ id: roomId }
    }
 ],

 where:{

 status:{
 [Op.in]:
 ["PENDING","APPROVED"]
 },

 [Op.and]:[
  {
   check_in:{
    [Op.lte]:
    check_out
   }
  },

  {
   check_out:{
    [Op.gte]:
    check_in
   }
  }
 ]

 }

 });

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

 guests_count,

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