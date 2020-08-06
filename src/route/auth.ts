import { isAuthenticated } from "../helper/JWT";

const express = require("express");
const router = express.Router();
const { createUser, signIn,signUp } = require("../controller/user");
const { body, validationResult } = require('express-validator');


router.post("/createuser",isAuthenticated, createUser);
router.post("/signup", signUp);
router.post("/signin", signIn);
export default router;
