const router = require("express").Router();

const roomController =
require("../controllers/roomController");

const auth =
require("../middleware/authMiddleware");

const role =
require("../middleware/roleMiddleware");


// Create Room

router.post(
  "/",
  auth,
  role("SUPER_ADMIN", "ADMIN"),
  roomController.createRoom
);


// Get All Rooms

router.get(
  "/",
  auth,
  roomController.getAllRooms
);


// Get Rooms By Bungalow

router.get(
  "/bungalow/:bungalowId",
  auth,
  roomController.getRoomsByBungalow
);


// Update Room

router.put(
  "/:id",
  auth,
  role("SUPER_ADMIN", "ADMIN"),
  roomController.updateRoom
);


// Delete Room

router.delete(
  "/:id",
  auth,
  role("SUPER_ADMIN", "ADMIN"),
  roomController.deleteRoom
);

module.exports = router;