let querystring = require("qs");
let crypto = require("crypto");
const config = require("../config/default.json");
const moment = require("moment");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const paymentVnBank = async ( req, res ) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");

    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;
    const orderId = moment(date).format("DDHHmmss");
    const amount = req.body.amount || 100000;
    const bankCode = req.body.bankCode || "VNBANK";

    let locale = req.body.language || "vn";
    if (!locale) {
      locale = "vn";
    }
    const currCode = "VND";

    // Prepare VNPay parameters
    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sort parameters alphabetically
    const sortedParams = sortObject(vnp_Params);

    // Create signed hash
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Add signed hash to parameters
    sortedParams.vnp_SecureHash = signed;

    // Generate final URL
    const finalUrl = `${vnpUrl}?${querystring.stringify(sortedParams, {
      encode: false,
    })}`;
    console.log("finalUrl", finalUrl);
    // Redirect to VNPay URL
    res.redirect(finalUrl);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { paymentVnBank };
