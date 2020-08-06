import "dotenv/config";
import express from "express";
import bodyparser from "body-parser";
// import http from "http";
import cors from "cors";
import auth from "./route/auth";
import post from "./route/post";
import mongoose from "mongoose";
import { isAuthenticated } from "./helper/JWT";
const app = express();
const { CONNECTION_URI } = process.env;

// middleware
app.use(bodyparser.json());
// app.options("*", cors());
app.use(cors());
app.use("/", auth);

app.use("/post",isAuthenticated, post);
// Data base connection
mongoose.connect(
  `mongodb+srv://elSpectra:123@123@cluster0.g0sig.mongodb.net/elSpectra?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (mongooseError) => {
    if (mongooseError) {
      console.log("DB connection error");
    } else {
      console.log("DB Connected Sucess");
    }
  }
);
const port = process.env.port || 80;
app.listen(port, () => console.log(`http Server is running on port `+port));
