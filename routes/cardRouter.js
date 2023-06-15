const router = require("express").Router();
const cardController = require("../controllers/cardController");

router.get("/", cardController.getAllProduct);
router.get("/:id", cardController.getOne);
router.delete("/:id", cardController.deleteOneProduct);
router.post("/:id", cardController.addProduct);

module.exports = router;
