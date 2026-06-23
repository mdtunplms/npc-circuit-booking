const {
  Booking,
  User,
  Bungalow,
  Room
} = require("../models");
const sendEmail = require("../services/emailService");

async function getBookingForAdmin(req, bookingId) {
  const booking = await Booking.findByPk(bookingId, {
    include: [
      User,
      Bungalow,
      {
        model: Room,
        as: "rooms"
      }
    ]
  });

  if (!booking) {
    return {
      error: {
        status: 404,
        message: "Booking Not Found"
      }
    };
  }

  if (
    req.user.role === "ADMIN" &&
    Number(booking.BungalowId) !== Number(req.user.assigned_bungalow_id)
  ) {
    return {
      error: {
        status: 403,
        message: "Access Denied"
      }
    };
  }

  return { booking };
}


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

 where:
 req.user.role === "SUPER_ADMIN"
 ? {}
 : {
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

const bungalow =
await Bungalow.findByPk(
 req.body.bungalowId
);

if(!bungalow){

 return res.status(404).json({
  message:"Bungalow Not Found"
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

if(!["PENDING", "APPROVED"].includes(booking.status)){

 return res.status(400).json({
  message:
  "This booking cannot be cancelled"
 });

}

booking.status =
"CANCELLED";

await booking.save();

const user =
await User.findByPk(
 booking.UserId
);

if(user?.email){
 try{
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
 }catch(emailError){
  console.error("Booking cancellation email failed", emailError);
 }
}

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
await getBookingForAdmin(req, req.params.id);

if(booking.error){
 return res.status(booking.error.status).json({
  message:booking.error.message
 });
}

if(booking.booking.status !== "APPROVED"){
 return res.status(400).json({
  message:"Only approved bookings can be checked in"
 });
}

booking.booking.status =
"CHECKED_IN";

await booking.booking.save();

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
await getBookingForAdmin(req, req.params.id);

if(booking.error){
 return res.status(booking.error.status).json({
  message:booking.error.message
 });
}

if(booking.booking.status !== "CHECKED_IN"){
 return res.status(400).json({
  message:"Only checked-in bookings can be checked out"
 });
}

booking.booking.status =
"CHECKED_OUT";

await booking.booking.save();

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

    const today = new Date()
      .toISOString()
      .split("T")[0];
    
    const bookings =
      await Booking.findAll({

      where:{

        check_in:today,

        status:"APPROVED",

        ...(req.user.role === "ADMIN"
          ? { BungalowId:req.user.assigned_bungalow_id }
          : {})
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

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const bookings =
      await Booking.findAll({

        where:{

          check_out:today,

          status:"CHECKED_IN",

          ...(req.user.role === "ADMIN"
            ? { BungalowId:req.user.assigned_bungalow_id }
            : {})
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
await Booking.count({
 where:
 req.user.role === "ADMIN"
 ? { BungalowId:req.user.assigned_bungalow_id }
 : {}
});

const occupied =
await Booking.count({

 where:{
  status:"CHECKED_IN",
  ...(req.user.role === "ADMIN"
   ? { BungalowId:req.user.assigned_bungalow_id }
   : {})
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
