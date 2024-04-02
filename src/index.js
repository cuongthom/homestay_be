const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { connect } = require("./database/database.js");
const app = express();
const configViewEngine = require("./configs/viewEngine.js");
configViewEngine(app);
const checkToken = require("./authentication/auth.js");
const userRoutes = require("./routes/User.js");
const homestayImage = require("./routes/ImageHomestay.js");
const paymentVnPay = require("./routes/PaymentVnPay.js");
const cors = require("cors");
const upload = require("express-fileupload");
app.use(upload());
app.use(cors()); // Use this after the variable declaration
// app.use(checkToken)
app.use(express.json());

app.get("/home", (req, res) => {
  res.status(200).json("Welcome, your app is working well");
});
app.use("/v1", userRoutes);
app.use("/v2", homestayImage);
app.use("/v3", paymentVnPay);
app.listen(process.env.PORT || 9090, async (req, res) => {
  await connect();
  console.log(`Example app listening on port ${process.env.PORT}`);
});
