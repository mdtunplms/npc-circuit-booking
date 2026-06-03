const {
  Booking,
  Bungalow,
  Room
} = require("../models");

const { Op } = require("sequelize");

const sequelize =
require("../config/db");

exports.roomAvailability =
async(req,res)=>{

try{

const roomId =
req.params.roomId;

const bookings =
await Booking.findAll({

 include:[
  {
   model:Room,
   as:"rooms",
   where:{ id: roomId }
  }
 ],

 where:{
  status:{
   [Op.in]:[
    "PENDING",
    "APPROVED",
    "CHECKED_IN"
   ]
  }
 }

});

const events =
bookings.map(item=>({

 start:item.check_in,

 end:item.check_out,

 status:item.status,

 booking_reference:
 item.booking_reference

}));

res.json(events);

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Show all bookings of a bungalow

exports.bungalowCalendar =
async(req,res)=>{

try{

const bookings =
await Booking.findAll({

 where:{
  BungalowId:
  req.params.bungalowId
 },

 include:[
  {
   model:Room,
   as:"rooms"
  }
 ]

});

const events =
bookings.map(item=>({

 id:item.id,

 title:
 item.booking_reference,

 start:
 item.check_in,

 end:
 item.check_out,

 status:
 item.status

}));

res.json(events);

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Monthly Occupancy Report

exports.monthlyOccupancy =
async(req,res)=>{

try{

const result =
await Booking.findAll({

 attributes:[

 [
  sequelize.fn(
   "MONTH",
   sequelize.col(
    "check_in"
   )
  ),
  "month"
 ],

 [
  sequelize.fn(
   "COUNT",
   sequelize.col("id")
  ),
  "totalBookings"
 ]

 ],

 group:[
  sequelize.fn(
   "MONTH",
   sequelize.col(
    "check_in"
   )
  )
 ]

});

res.json(result);

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

// Today's Check-ins / Check-outs

exports.todayMovements =
async(req,res)=>{

try{

const today =
new Date()
.toISOString()
.split("T")[0];

const checkIns =
await Booking.findAll({

 where:{
  check_in:today,
  status:"APPROVED"
 }

});

const checkOuts =
await Booking.findAll({

 where:{
  check_out:today,
  status:"CHECKED_IN"
 }

});

res.json({

 date:today,

 checkIns,

 checkOuts

});

}catch(err){

 res.status(500).json({
  message:err.message
 });

}

};

