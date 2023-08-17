const express = require("express");
const { createComment } = require("../controllers/commentControllers");
// const { requireSignIn } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/blogs/comments/:blogId", createComment);

module.exports = router;
