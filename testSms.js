import axios from "axios";

 const otpVerification = async () => {


//   console.log("${process.env.FAST2SMS_API_KEY}", process.env.FAST2SMS_API_KEY);
//   console.log("otp from otpVerification", otp, mobileNumber);
const mobileNumber = "9719706242"


const name = "Jatin"
const rollNo = "7998089"


const message = `Dear Parent, your Caution Money Refund Form for ${name}, Roll No: ${rollNo} has been approved. – Scholars Den`
  const options = {
    method: "GET",
    url: `http://sms.hspsms.com/sendSMS?username=Scholarsden&message=${message}&sendername=SCHDEN&smstype=TRANS&numbers=${mobileNumber}&apikey=44bd7839-a2f8-4957-b0e4-f07a49fdd11f`,
    // headers: {
      // authorization: `${process.env.FAST2SMS_API_KEY}`,
      // "Content-Type": "application/x-www-form-urlencoded",
    // },
    // data: {
    //   route: "dlt",
    //   sender_id: "SCHDEN",
    //   message: "182187",
    //   variables_values: `${otp}|`,
    //   flash: 0,
    //   numbers: `${mobileNumber}`,
    // },
  };

  const response = await axios.get(options.url);

  console.log("response", response);

//   return response;
};


otpVerification();