import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import mainRouter from "./api/main.js";
import autoIncrement from "mongoose-auto-increment";

const server = express();
const port = process.env.port;

server.use(cors());
server.use(express.json());

server.use("/submit", mainRouter);

mongoose.connect(process.env.MONGO_URL);

autoIncrement.initialize(mongoose.connection);

mongoose.connection.on("connected", () => {
  console.log("Connected to DB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
