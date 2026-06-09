const router =
require("express").Router();

const adminController =
require("../controllers/adminController");

const auth =
require("../middleware/authMiddleware");

const role =
require("../middleware/roleMiddleware");


// View All Bookings

router.get(
 "/bookings",
 auth,
 role(
  "SUPER_ADMIN",
  "ADMIN"
 ),
 adminController.getAllBookings
);


// Approve Booking

router.put(
 "/bookings/:id/approve",
 auth,
 role(
  "SUPER_ADMIN",
  "ADMIN"
 ),
 adminController.approveBooking
);


// Reject Booking

router.put(
 "/bookings/:id/reject",
 auth,
 role(
  "SUPER_ADMIN",
  "ADMIN"
 ),
 adminController.rejectBooking
);


// Dashboard

router.get(
 "/dashboard",
 auth,
 role(
  "SUPER_ADMIN",
  "ADMIN"
 ),
 adminController.dashboard
);

// dashboard role based

router.get(
 "/role-dashboard",
 auth,
 adminController.roleDashboard
);

module.exports = router;