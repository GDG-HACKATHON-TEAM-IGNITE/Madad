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
// 
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function mail({ to, html }) {
  await emailApi.sendTransacEmail({
    sender: {
      email: "pinaki82499730@gmail.com",
      name: "Dept Verification",
    },
    to: [{ email: to }],
    subject: "Dept verification code",
    htmlContent: html,
  });

  console.log("Email sent via Brevo API ");
}
