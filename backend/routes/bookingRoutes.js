const router =
require("express").Router();

const fs = require("fs");

const booking =
require("../controllers/bookingController");

const auth =
require("../middleware/authMiddleware");

const multer =
require("multer");

const storage =
multer.diskStorage({

 destination:(req,file,cb)=>{

  fs.mkdirSync("uploads", {
   recursive:true
  });

  cb(null,"uploads/");

 },

 filename:(req,file,cb)=>{

  cb(
   null,
   Date.now()
   + "-"
   + file.originalname
  );

 }

});

const upload =
multer({
 storage,
 fileFilter:(req,file,cb)=>{
  if(file.mimetype !== "application/pdf"){
   return cb(
    new Error("Approval form must be a PDF")
   );
  }

  cb(null,true);
 }
});


// CHECK AVAILABILITY

router.post(
 "/check-availability",
 auth,
 booking.checkAvailability
);


// CREATE BOOKING

router.post(
 "/create",
 auth,
 upload.single("form"),
 booking.createBooking
);


// MY BOOKINGS

router.get(
 "/my-bookings",
 auth,
 booking.myBookings
);

module.exports = router;
