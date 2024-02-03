import nodemailer from "nodemailer";
import "dotenv/config";


export const sendEmail = async (emailBody) => {
    try {
      //config
      const transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        port: 587,
        auth: {
          user: process.env.NODEMAILER_AUTH_EMAIL,
          pass: process.env.NODEMAILER_AUTH_PASSWORD,
        },
      });
  
      //send email
      const info = await transporter.sendMail(emailBody);
      const link = nodemailer.getTestMessageUrl(info);
      console.log(link)
      return link
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.log(error);
    }
  };

export const emailOtp = (code, email, name ) => {
  console.log(code, email)
    const emailBody = {
      from: `"Spend Wise", <${process.env.NODEMAILER_AUTH_EMAIL}>`,
      to: email,
      subject: `${name},${code} is your one-time code.`,
      text: "Use the following otp to reset your password " + code,
      html: `
          <b>
              Hi ${name},
          </b>
          <br>
          
          <p>
          Here is your opt to reset your password in SpendWise.
          </p>
          <br >
          <h4>
            ${code}
          </h4>
      <br>

      <p>
          Enter this code to reset your password.
      </p>
      <p>
          This code will be valid for 60 minutes only.
      </p>
      <br>
      <p>
      Regards, 
      <br>
     Spend Wise team
  </p>
          `,
    };
  
    return sendEmail(emailBody);
  };
