import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(`email sender error: ${error.message}`);
  } else {
    console.log(`email send to server message`);
  }
});

export const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `Your message: ${process.env.GOOGLE_USER}`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Message Send ${info.messageId}, messageData: ${info}`);
    console.log(`preview url ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    console.log(`send gmail message server error: ${error.message}`)
  }
};
