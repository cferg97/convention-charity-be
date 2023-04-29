import mongoose from "mongoose";
import submitModel from "./model.js";
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { getPDFReadableStream } from "../lib/pdf-tools.js";
import { pipeline } from "stream";

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

    res.setHeader("Content-Disposition", "attachment; filename=item_sub.pdf");
    const source = await getPDFReadableStream(finalSub);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (err) {
    next(err);
  }
});

export default mainRouter;
