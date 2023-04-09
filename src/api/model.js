import mongoose from "mongoose";


const { Schema, model } = mongoose;

const mainSchema = new Schema(
  {
    itemName: { type: String, required: true },
    itemDesc: { type: String, required: true },
    submitterName: { type: String, required: true },
    itemNumber: { type: Number },
    image: { type: String, required: true },
  },
  { timestamps: true }
);


export default model("charityItems", mainSchema);
