const router = require("express").Router();

const controller = require("../controllers/userManagementController");

const auth = require("../middleware/authMiddleware");

const role = require("../middleware/roleMiddleware");

router.use(auth);

router.use(role("SUPER_ADMIN"));

router.get("/", controller.getUsers);

router.get("/bungalows", controller.getBungalows);

router.put("/assign-admin", controller.assignAdmin);

router.get("/:id", controller.getUser);

router.post("/", controller.createUser);

router.put("/:id", controller.updateUser);

router.delete("/:id", controller.deleteUser);

module.exports = router;
