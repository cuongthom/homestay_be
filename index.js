const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { connect } = require("./src/database/database.js");
const app = express();

// const checkToken = require("./authentication/auth.js");
const userRoutes = require("./src/routes/User.js");
const homestayImage = require("./src/routes/ImageHomestay.js");
const paymentVnPay = require("./src/routes/PaymentVnPay.js");
// const uploadfile = require("./src/routes/UploadFile.js");
const cors = require("cors");
const upload = require("express-fileupload");
app.use(upload());
app.use(cors()); // Use this after the variable declaration
// app.use(checkToken)
app.use(express.json());


app.get("/", function (req, res, next) {
  res.send("hello");
  console.log("hello");
});
app.use("/v1", userRoutes);
app.use("/v2", homestayImage);
app.use("/v3", paymentVnPay);
// app.use("/v4", uploadfile);
app.listen(process.env.PORT || 9090, async (req, res) => {
  await connect();
  console.log(`Example app listening on port ${process.env.PORT}`);
});
