import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import {config} from 'dotenv';
config();

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("./"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./"),
  extName: ".hbs",
};

const sendEmail = (to, subject, template, context) => {
  transport.sendMail(
    {
      from: `Bookify ${process.env.EMAIL_USERNAME}`,
      to,
      subject,
      template: `email/${template}`,
      context: {
        location: `${process.env.COMPANY_LOCATION}`,
        app_name: `${process.env.APP_NAME}`,
        customer_care: `${process.env.CUSTOMER_CARE_EMAIL_USERNAME}`,
        facebookURL: `https://${process.env.FACEBOOK_URL}`,
        twitterURL: `https://${process.env.TWITTER_URL}`,
        youtubeURL: `https://${process.env.YOUTUBE_URL}`,
        instagramURL: `https://${process.env.INSTAGRAM_URL}`,
        ...context
      },
      attachments: [
        {
          filename: "logo.png",
          path: "./email/images/logo.png",
          cid: "logo",
        },
        {
          filename: "facebook.svg",
          path: "./email/images/facebook.png",
          cid: "facebook",
        },
        {
          filename: "instagram.png",
          path: "./email/images/instagram.png",
          cid: "instagram",
        },
        {
          filename: "youtube.png",
          path: "./email/images/youtube.png",
          cid: "youtube",
        },
        {
          filename: "twitter-x.png",
          path: "./email/images/twitter-x.png",
          cid: "twitter-x",
        },
      ],
    },
    (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.messageId);
      }
    }
  );
};

transport.use("compile", hbs(handlebarOptions));

export default sendEmail;