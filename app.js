const fs = require("fs");
const path = require("path");

//main
const express = require("express");
const mongoose = require("mongoose");
const DB = process.env.DB;

//Routes
const router = require("./routes/index");
//middleware
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");
const errorMiddleware = require("./middleware/error-middleware");
const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "./logs/log.log"), {
  flags: "a",
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(hpp());
app.use("*", cors());
app.use(morgan("combined", logStream));

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP, try again later",
});

app.use("/api/user/login", limiter);

mongoose.set("strictQuery", true);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to Mongoose");
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//Routes
app.use("/api", router);
app.use(errorMiddleware);
module.exports = app;
