import mongoose from "mongoose";
import submitModel from "./model.js";
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

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
    await submission.save();
    res.status(201).send();
  } catch (err) {
    next(err);
  }
});

export default mainRouter;
