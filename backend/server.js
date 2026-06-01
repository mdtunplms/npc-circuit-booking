require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize =
require("./config/db");

require("./models");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
 "/uploads",
 express.static("uploads")
);

app.use(
 "/api/auth",
 require("./routes/authRoutes")
);

app.use(
 "/api/bookings",
 require("./routes/bookingRoutes")
);

sequelize.sync()
.then(()=>{

 console.log(
   "Database Connected"
 );

 app.listen(
   process.env.PORT,
   ()=>{

    console.log(
      "Server Running"
    );

   }
 );

});