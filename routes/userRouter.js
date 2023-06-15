const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth-middleware");

router.post("/update", authMiddleware, userController.updateMe);
router.post("/password", authMiddleware, userController.updatePassword);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
router.get("/get-me", authMiddleware, userController.getMe);

module.exports = router;
