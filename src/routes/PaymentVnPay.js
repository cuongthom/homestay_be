const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { paymentVn, payReturn } = require("../controllers/PaymentVnPay");

router.get("/", function (req, res, next) {
  res.render("orderlist", { title: "Danh sách đơn hàng" });
});

router.get("/create_payment_url", function (req, res, next) {
  res.render("order", { title: "Tạo mới đơn hàng", amount: 10000 });
});

router.get("/querydr", function (req, res, next) {
  let desc = "truy van ket qua thanh toan";
  res.render("querydr", { title: "Truy vấn kết quả thanh toán" });
});

router.get("/refund", function (req, res, next) {
  let desc = "Hoan tien GD thanh toan";
  res.render("refund", { title: "Hoàn tiền giao dịch thanh toán" });
});

router.post("/create_payment_url", paymentVn);
router.get("/vnpay_return", payReturn);

module.exports = router;
