const router = require("express").Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/auth-middleware");

router.post("/:id", reviewController.createReview);
router.delete("/:id", reviewController.deleteReview);
router.get("/:id", reviewController.getOneReview);

module.exports = router;
