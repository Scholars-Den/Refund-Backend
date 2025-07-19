import axios from "axios";

export const otpVerification = async (otp, mobileNumber) => {
  console.log("${process.env.FAST2SMS_API_KEY}", process.env.FAST2SMS_API_KEY);
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

export const messageForApprovalStatus = async ({ name, rollNo, mobileNumber }) => {
  const message = `Dear Parent, your Caution Money Refund Form for ${name}, Roll No: ${rollNo} has been approved. – Scholars Den`;
  const options = {
    method: "GET",
    url: `http://sms.hspsms.com/sendSMS?username=Scholarsden&message=${message}&sendername=SCHDEN&smstype=TRANS&numbers=${mobileNumber}&apikey=44bd7839-a2f8-4957-b0e4-f07a49fdd11f`,
  };

  const response = await axios.get(options.url);

  console.log("response", response);

  return response;
};

export const messageForSubmittedStatus = async ({ name, rollNo, mobileNumber }) => {
  const message = `Dear Parent, your Caution Money Refund Form for ${name}, Roll No: ${rollNo} has been submitted successfully. We will notify you once it is reviewed. – Scholars Den`;
  const options = {
    method: "GET",
    url: `http://sms.hspsms.com/sendSMS?username=Scholarsden&message=${message}&sendername=SCHDEN&smstype=TRANS&numbers=${mobileNumber}&apikey=44bd7839-a2f8-4957-b0e4-f07a49fdd11f`,
  };

  const response = await axios.get(options.url);

  console.log("response", response);

  return response;
};

