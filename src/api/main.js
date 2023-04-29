import mongoose, { get } from "mongoose";
import submitModel from "./model.js";
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { getPDFReadableStream } from "../lib/pdf-tools.js";
import { pipeline } from "stream";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

const mainRouter = express.Router();

const cloudinaryUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "griffish",
    },
  }),
}).single("image");

mainRouter.post("/", cloudinaryUpload, async (req, res, next) => {
  try {
    const submission = new submitModel({
      ...req.body,
      image: req.file.path,
    });
    const finalSub = await submission.save();

    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          api_key: process.env.SG_API,
        },
      })
    );

    const pdf = await getPDFReadableStream(finalSub);

    const mailOptions = {
      from: "c.ferguson1997@gmail.com",
      to: "c.ferguson1997@gmail.com",
      subject: "New Charity Submission",
      text: "There has been a new charity submission, see attached pdf.",
      attachments: [{
        filename: "submission.pdf",
        content: pdf,
      }],
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        next(console.log(err));
      }
      res.status(201).send();
    });
  } catch (err) {
    next(err);
  }
});

export default mainRouter;
