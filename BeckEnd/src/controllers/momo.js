import axios from "axios";
import crypto from "crypto";
export const Payment = async (req, res) => {
  const { amounts, ordersId: orderIdFromBody } = req.body;
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var accessKey = "F8BBA842ECF85";
  var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = `http://localhost:5173/orders/`;
  var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
  var requestType = "payWithMethod";
  var amount = amounts;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = "";

  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  //signature

  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });
  const option = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    let data = await axios(option);
    return res.status(200).json(data.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const callblack =
//   ("/",
//   async (req, res) => {
//     /**
//       resultCode = 0: giao dịch thành công.
//       resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
//       resultCode <> 0: giao dịch thất bại.
//      */
//     console.log("callback: ");
//     console.log(req.body);
//     /**
//      * Dựa vào kết quả này để update trạng thái đơn hàng
//      * Kết quả log:
//      * {
//           partnerCode: 'MOMO',
//           orderId: 'MOMO1712108682648',
//           requestId: 'MOMO1712108682648',
//           amount: 10000,
//           orderInfo: 'pay with MoMo',
//           orderType: 'momo_wallet',
//           transId: 4014083433,
//           resultCode: 0,
//           message: 'Thành công.',
//           payType: 'qr',
//           responseTime: 1712108811069,
//           extraData: '',
//           signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
//         }
//      */

//     return res.status(204).json(req.body);
//   });

// export const transaction =
//   ("/check-status-transaction",
//   async (req, res) => {
//     const { orderId } = req.body;

//     // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
//     // &requestId=$requestId
//     var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
//     var accessKey = "F8BBA842ECF85";
//     const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

//     const signature = crypto
//       .createHmac("sha256", secretKey)
//       .update(rawSignature)
//       .digest("hex");

//     const requestBody = JSON.stringify({
//       partnerCode: "MOMO",
//       requestId: orderId,
//       orderId: orderId,
//       signature: signature,
//       lang: "vi",
//     });

//     // options for axios
//     const options = {
//       method: "POST",
//       url: "https://test-payment.momo.vn/v2/gateway/api/query",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: requestBody,
//     };

//     const result = await axios(options);

//     return res.status(200).json(result.data);
//   });