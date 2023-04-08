import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

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

mainSchema.plugin(autoIncrement.plugin, {
  model: "charityItems",
  field: "itemNumber",
  startAt: 1,
  incrementBy: 1,
});

export default model("charityItems", mainSchema);
