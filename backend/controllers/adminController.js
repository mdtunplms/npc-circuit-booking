const {
  Booking,
  User,
  Room,
  Bungalow
} = require("../models");

const sendEmail =
require("../services/emailService");


// Get All Bookings

exports.getAllBookings = async(req,res)=>{

try{

const bookings =
await Booking.findAll({

 include:[
  User,
  Bungalow,
  {
   model:Room,
   as:"rooms"
  }
 ],

 order:[
  ["createdAt","DESC"]
 ]

});

res.json(bookings);

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};


// Approve Booking

exports.approveBooking =
async(req,res)=>{

try{

const booking =
await Booking.findByPk(
 req.params.id,
  {
  include:[User]
 }
);

if(!booking){

 return res.status(404).json({
  message:
  "Booking Not Found"
 });

}

booking.status =
"APPROVED";

await booking.save();

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
 `

);

res.json({

 message:
 "Booking Approved",

 booking

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};


// Reject Booking

exports.rejectBooking =
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

booking.status =
"REJECTED";

await booking.save();

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
 `

);

res.json({

 message:
 "Booking Rejected",

 booking

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};


// Dashboard Statistics

exports.dashboard =
async(req,res)=>{

try{

const totalBookings =
await Booking.count();

const pendingBookings =
await Booking.count({

 where:{
  status:"PENDING"
 }

});

const approvedBookings =
await Booking.count({

 where:{
  status:"APPROVED"
 }

});

const rejectedBookings =
await Booking.count({

 where:{
  status:"REJECTED"
 }

});

res.json({

 totalBookings,

 pendingBookings,

 approvedBookings,

 rejectedBookings

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};