const router =
require("express").Router();

const auth =
require("../middleware/authMiddleware");

const controller =
require("../controllers/calendarController");

router.get(
 "/room/:roomId",
 auth,
 controller.roomAvailability
);

router.get(
 "/bungalow/:bungalowId",
 auth,
 controller.bungalowCalendar
);

router.get(
 "/monthly-occupancy",
 auth,
 controller.monthlyOccupancy
);

router.get(
 "/today-movements",
 auth,
 controller.todayMovements
);

module.exports = router;