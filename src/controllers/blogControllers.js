const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

//Create Blog
exports.createBlog = async (req, res) => {
	try {
		const { title, content, author, image } = req.body;
		// const userId = req.userId;
		// const userId = localStorage.getItem("userId");
		const existingUser = await User.findById(author);
		if (!existingUser) {
			return res.json({ error: "Unable to find a user" });
		}
		if (!title || !title.trim()) {
			return res.status(400).json({ error: "Title is required!" });
		}
		if (!content.trim()) {
			return res.status(400).json({ error: "Content is required!" });
		}
		const newBlog = new Blog({
			...req.body,
		});
		try {
			const session = await mongoose.startSession();
			session.startTransaction();
			await newBlog.save({ session });
			existingUser.blogs.push(newBlog);
			await existingUser.save({ session });
			await session.commitTransaction();
		} catch (error) {
			return res.json(error.message);
		}
		res.json(newBlog);
	} catch (error) {
		res.json(error.message);
	}
};

//Get All Blogs
exports.getAllBlogs = async (req, res) => {
	try {
		const allBlogs = await Blog.find({}).populate("author");
		res.json(allBlogs);
	} catch (error) {
		return res.json(error.message);
	}
};

//Get Blog by Id
exports.getBlogById = async (req, res) => {
	try {
		const findBlog = await Blog.findById(req.params.id)
			.populate("author", "name") // Populate the author's name
			.populate("comments", "text user createdAt");
		if (!findBlog) {
			res.status(404).json({ error: "Blog not found" });
		} else {
			res.json(findBlog);
		}
	} catch (error) {
		return res.json(error.message);
	}
};

//Updating Blog
exports.updateBlog = async (req, res) => {
	try {
		const { title, content, author, image } = req.body;
		if (!title || !title.trim()) {
			return res.status(400).json({ error: "Title is required!" });
		}
		if (!content || !content.trim()) {
			return res.status(400).json({ error: "Content is required!" });
		}
		const updateBlog = await Blog.findByIdAndUpdate(
			req.params.id,
			{ ...req.body },
			{ new: true }
		);
		res.json(updateBlog);
	} catch (error) {
		return res.json(error.message);
	}
};

//Delete blog
exports.deleteBlog = async (req, res) => {
	try {
		const blogDelete = await Blog.findByIdAndDelete(req.params.id).populate(
			"author"
		);
		await blogDelete.author.blogs.pull(blogDelete);
		await blogDelete.author.save();
		res.json(blogDelete);
	} catch (error) {
		return res.json(error.message);
	}
};

//search Blog
exports.blogSearch = async (req, res) => {
	try {
		const { keyword } = req.params;
		const results = await Blog.find({
			$or: [
				{ title: { $regex: keyword, $options: "i" } },
				{ content: { $regex: keyword, $options: "i" } },
			],
		});
		res.json(results);
	} catch (error) {
		res.json(error.message);
	}
};

exports.userBlog = async (req, res) => {
	try {
		const blog = await User.findById(req.params.id).populate("blogs");
		if (!blog) {
			return res.json({ msg: "Blog is not found!" });
		}
		res.json(blog);
	} catch (error) {
		return res.json(error.message);
	}
};
