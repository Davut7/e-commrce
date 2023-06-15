const router = require("express").Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/auth-middleware");
const reviewController = require("../controllers/reviewController");

router.post("/", authMiddleware, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getOneProduct);
router.delete("/:id", productController.deleteOneProduct);
router.patch("/:id", productController.updateOneProduct);
router.get("/search/products", productController.searchProduct);
router.get("/:id/reviews", reviewController.getAllReviews);
router.get("/brands", productController.getAllBrands);

module.exports = router;
