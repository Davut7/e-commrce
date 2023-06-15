const dotenv = require("dotenv");


dotenv.config({ path: "./.env" });
const port = process.env.PORT || 5000;
const app = require("./app");
process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down..");
  console.log(err.name, err.message);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
