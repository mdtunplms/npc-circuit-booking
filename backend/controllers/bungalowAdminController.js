const { Op } = require("sequelize");
const {
  Booking,
  User,
  Bungalow,
  Room
} = require("../models");


// Bookings for Assigned Bungalow

exports.getMyBungalowBookings =
async(req,res)=>{

try{

const admin =
await User.findByPk(
 req.user.id
);

const bookings =
await Booking.findAll({

 where:{
  BungalowId:
  admin.assigned_bungalow_id
 },

 include:[
  User,
  Bungalow,
  {
   model:Room,
   as:"rooms"
  }
 ]

});

res.json(bookings);

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Assign admin to bungalow

exports.assignAdmin =
async(req,res)=>{

try{

const user =
await User.findByPk(
 req.body.userId
);

if(!user){

 return res.status(404).json({
  message:"User Not Found"
 });

}

user.role = "ADMIN";

user.assigned_bungalow_id =
req.body.bungalowId;

await user.save();

res.json({

 message:
 "Admin Assigned",

 user

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Calendar API

exports.calendar =
async(req,res)=>{

try{

const bookings =
await Booking.findAll({

 include:[
  Bungalow,
  {
   model:Room,
   as:"rooms"
  }
 ]

});

const calendar =
bookings.map(item=>({

 title:
 item.booking_reference,

 start:
 item.check_in,

 end:
 item.check_out,

 status:
 item.status,

 bungalow:
 item.Bungalow.name

}));

res.json(calendar);

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Cancel booking

exports.cancelBooking =
async(req,res)=>{

try{

const booking =
await Booking.findByPk(
 req.params.id
);

if(!booking){

 return res.status(404).json({
  message:
  "Booking Not Found"
 });

}

if(
 booking.UserId !==
 req.user.id
){

 return res.status(403).json({
  message:
  "Not Your Booking"
 });

}

booking.status =
"CANCELLED";

await booking.save();

const user =
await User.findByPk(
 booking.UserId
);

await sendEmail(

 user.email,

 "Booking Cancelled",

 `
 <h2>Booking Cancelled</h2>

 <p>
 Reference:
 ${booking.booking_reference}
 </p>

 <p>
 Status:
 CANCELLED
 </p>
 `

);

res.json({

 message:
 "Booking Cancelled"

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Check In

exports.checkIn =
async(req,res)=>{

try{

const booking =
await Booking.findByPk(
 req.params.id
);

booking.status =
"CHECKED_IN";

await booking.save();

res.json({

 message:
 "Guest Checked In"

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Check Out

exports.checkOut =
async(req,res)=>{

try{

const booking =
await Booking.findByPk(
 req.params.id
);

booking.status =
"CHECKED_OUT";

await booking.save();

res.json({

 message:
 "Guest Checked Out"

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// today checkIN

exports.todayCheckins =
async (req, res) => {

  try {

    const start = new Date();
    start.setHours(
      0,0,0,0
      );
    const end = new Date();
    end.setHours(
    23,59,59,999
    );
    
    const bookings =
      await Booking.findAll({

      where:{

        check_in:{
          [Op.between]:
          [start,end]
        },

        status:"APPROVED"
      },

        include: [
          User,
          Bungalow
        ]

      });

    res.json(bookings);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

// today checkOUT

exports.todayCheckouts =
async (req, res) => {

  try {

    const start = new Date();
    start.setHours(
      0,0,0,0
      );
    const end = new Date();
    end.setHours(
    23,59,59,999
    );

    const bookings =
      await Booking.findAll({

        where:{

          check_in:{
            [Op.between]:
            [start,end]
          },

          status:"APPROVED"
        },

        include: [
          User,
          Bungalow
        ]

      });

    res.json(bookings);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

// Occupancy Report

exports.occupancyReport =
async(req,res)=>{

try{

const total =
await Booking.count();

const occupied =
await Booking.count({

 where:{
  status:"CHECKED_IN"
 }

});

const occupancy =
total > 0
? ((occupied/total)*100)
.toFixed(2)
: 0;

res.json({

 totalBookings:total,

 occupiedBookings:
 occupied,

 occupancyRate:
 occupancy + "%"

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};