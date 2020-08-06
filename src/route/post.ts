const express = require("express");
const router = express.Router();
const { createPost,getPost } = require("../controller/post");
const { body, validationResult } = require('express-validator');


router.post("/", createPost);
router.get("/", getPost);
export default router;
