const router =
require("express").Router();

const controller =
require("../controllers/bungalowAdminController");

const auth =
require("../middleware/authMiddleware");

const role =
require("../middleware/roleMiddleware");


// Assign Admin

router.post(
 "/assign-admin",
 auth,
 role("SUPER_ADMIN"),
 controller.assignAdmin
);


// Bungalow Bookings

router.get(
 "/my-bookings",
 auth,
 role(
  "ADMIN",
  "SUPER_ADMIN"
 ),
 controller.getMyBungalowBookings
);


// Calendar

router.get(
 "/calendar",
 auth,
 controller.calendar
);


// Cancel Booking

router.put(
 "/cancel/:id",
 auth,
 controller.cancelBooking
);


// Check In

router.put(
 "/checkin/:id",
 auth,
 role(
  "ADMIN",
  "SUPER_ADMIN"
 ),
 controller.checkIn
);


// Check Out

router.put(
 "/checkout/:id",
 auth,
 role(
  "ADMIN",
  "SUPER_ADMIN"
 ),
 controller.checkOut
);


// Occupancy Report

router.get(
 "/occupancy-report",
 auth,
 role(
  "ADMIN",
  "SUPER_ADMIN"
 ),
 controller.occupancyReport
);

module.exports = router;