const router = require("express").Router();
const wishController = require("../controllers/wishController");

router.post("/:id", wishController.addProductToWishList);
router.delete("/:id", wishController.deleteProductFromWishList);
router.get("/:id", wishController.getOneProductFromWishList);
router.get("/", wishController.getAllProductFromWishes);
router.patch("/:id", wishController.updateOneWish);

module.exports = router;
