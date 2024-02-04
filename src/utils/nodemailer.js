import nodemailer from "nodemailer";
import "dotenv/config";

export const sendEmail = async (emailBody) => {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        port: 587,
        auth: {
          user: process.env.NODEMAILER_AUTH_EMAIL,
          pass: process.env.NODEMAILER_AUTH_PASSWORD,
        },
      });
  
      const info = await transporter.sendMail(emailBody);
      if(info.accepted.length > 0){
        return true
      }
      return false
      
    } catch (error) {
      console.log(error);
      return error
    }
  };

export const emailOtp = (code, email, name ) => {
    const emailBody = {
      from: `"Spend Wise", <${process.env.NODEMAILER_AUTH_EMAIL}>`,
      to: email,
      subject: `${name},${code} is your one-time code.`,
      text: `Use the following OTP to reset your password: ${code}`,
      html: `
      <b>Hi ${name},</b>
      <br/>
      <p>Here is your OTP to reset your password in SpendWise.</p>
      <br/>
      <h4>${code}</h4>
      <br/>
      <p>Enter this code to reset your password.</p>
      <p>This code will be valid for 60 minutes only.</p>
      <br/>
      <p>Regards,<br/>Spend Wise team</p>
  `,
    };
  
    return sendEmail(emailBody);
  };
