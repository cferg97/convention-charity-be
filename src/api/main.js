import mongoose from "mongoose";
import submitModel from "./model.js";
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { google } from "googleapis";

const docs = google.docs({
  version: "v1",
  auth: process.env.GOOGLE_API_KEY,
});

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
    const { itemName, itemDesc, submitterName, image } =
      await submission.save();

    const updateDocument = await docs.documents.batchUpdate({
      documentId: process.env.DOCUMENT_ID,
      requestBody: {
        requests: [
          {
            insertText: {
              endOfSegmentLocation: {},
              text: [itemName, itemDesc, submitterName],
            },
          },
        ],
      },
    });

    res.status(201).send();
  } catch (err) {
    next(err);
  }
});

export default mainRouter;
