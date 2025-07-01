import axios from "axios";

export const otpVerification = async (otp, mobileNumber) => {
  console.log("otp from otpVerification", otp, mobileNumber);
  const options = {
    method: "POST",
    url: "https://www.fast2sms.com/dev/bulkV2",
    headers: {
      authorization: `${process.env.FAST2SMS_API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      route: "dlt",
      sender_id: "SCHDEN",
      message: "182187",
      variables_values: `${otp}|`,
      flash: 0,
      numbers: `${mobileNumber}`,
    },
  };

  const response = await axios.post(options.url, options.data, {
    headers: options.headers,
  });

  return response;
};
