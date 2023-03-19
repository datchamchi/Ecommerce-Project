const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "config.env" });

//CONNECT SERVER
const PORT = process.env.PORT || 8080;
const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db)
  .then(() => {
    console.log("DATABASE connect succesfully!");
  })
  .catch(() => {
    console.log("ERROR 💥");
  });
// Use app

//
app.listen(PORT, () => {
  console.log(`Server starting at PORT ${PORT}`);
  console.log(process.env.NODE_ENV);
});
