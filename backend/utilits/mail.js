import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAILID,
//     pass: process.env.EMAILPASS,
//   },
//   pool: true,
//   maxConnections: 3,
//   maxMessages: 100,
// });
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLS on 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP ERROR:", err);
  } else {
    console.log("SMTP READY");
  }
});
export const mail =async ({to,html}) => {
  const info = await transporter.sendMail({
    from:process.env.EMAILID,
    to,
    subject: "Dept verification code",
    html, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
}