import {sendMail} from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILID,
    pass: process.env.EMAILPASS,
  },
});
const mail =async ({to,html}) => {
  const info = await transporter.sendMail({
    from:process.env.EMAILID,
    to,
    subject: "Dept verification code",
    html, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
}