const { Booking } = require("../models");

exports.createBooking = async(req,res)=>{

  try{

    const booking =
      await Booking.create({

        UserId:req.user.id,

        BungalowId:req.body.bungalowId,

        check_in:req.body.check_in,

        check_out:req.body.check_out,

        form_file:req.file
          ? req.file.filename
          : null

      });

    res.json(booking);

  }catch(err){

    res.status(500).json(err);

  }

};

exports.myBookings = async(req,res)=>{

  const bookings =
    await Booking.findAll({

      where:{
        UserId:req.user.id
      }

    });

  res.json(bookings);

};