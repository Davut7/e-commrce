const router = require("express").Router();
const userRouter = require("./userRouter");
const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const reviewRouter = require("./reviewRouter");
const wishRouter = require("./wishRouter");
const cardRouter = require("./cardRouter");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/review", reviewRouter);
router.use("/wish-list", wishRouter);
router.use("/card", cardRouter);

module.exports = router;
