const router =
require("express").Router();

const fs = require("fs");
const path = require("path");

const booking =
require("../controllers/bookingController");

const auth =
require("../middleware/authMiddleware");

const multer =
require("multer");

const storage =
multer.diskStorage({

 destination:(req,file,cb)=>{

  const uploadDir = path.join(__dirname, "..", "..", "uploads");

  fs.mkdirSync(uploadDir, {
   recursive:true
  });

  cb(null,uploadDir);

 },

 filename:(req,file,cb)=>{

  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");

  cb(
   null,
   Date.now()
   + "-"
   + safeName
  );

 }

});

const upload =
multer({
 storage,
 limits:{
  fileSize:5 * 1024 * 1024
 },
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
 (req,res,next)=>{
  upload.single("form")(req,res,(err)=>{
   if(err){
    return res.status(400).json({
     message:err.message
    });
   }

   next();
  });
 },
 booking.createBooking
);


// MY BOOKINGS

router.get(
 "/my-bookings",
 auth,
 booking.myBookings
);

module.exports = router;
