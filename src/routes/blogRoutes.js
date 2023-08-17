const express = require("express");
const {
	getAllBlogs,
	createBlog,
	getBlogById,
	updateBlog,
	deleteBlog,
	blogSearch,
	userBlog,
} = require("../controllers/blogControllers");
const { requireSignIn } = require("../middlewares/authMiddleware");
const router = express.Router();

//Create Blog
router.post("/create-blog", createBlog);

//Get all Blogs
router.get("/blogs", getAllBlogs);

//Get Blogs by Id
router.get("/blog/:id", getBlogById);

//Update Blog by Id
router.put("/update-blog/:id", updateBlog);

//Delete Blog by Id
router.delete("/delete-blog/:id", deleteBlog);

//search for a blog
router.get("/blogSearch/:keyword", blogSearch);

//getting userBlog
router.get("/user/:id", userBlog);
module.exports = router;
