const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const mongoose = require("mongoose");

// exports.createComment = async (req, res) => {
// 	try {
// 		const { blogId } = req.params;
// 		const { text, userId } = req.body;

// 		const existingBlog = await Blog.findById(blogId);
// 		if (!existingBlog) {
// 			return res.status(404).json({ error: "Blog not found" });
// 		}

// 		const existingUser = await User.findById(userId);
// 		// Pass the user ID, blog ID, and comment text to the createComment controller
// 		const commentResult = new Comment({
// 			text,
// 			userId,
// 			blogId,
// 		});
// 		try {
// 			const session = await mongoose.startSession();
// 			session.startTransaction();
// 			await commentResult.save({ session });
// 			existingBlog.comments.push(commentResult._id);
// 			await existingBlog.save({ session });
// 			existingUser.comments.push(commentResult._id);
// 			await existingUser.save({ session });
// 			await session.commitTransaction();
// 		} catch (error) {
// 			return res.json(error.message);
// 		}
// 		res.json(commentResult);
// 	} catch (error) {
// 		return res.json(error.message);
// 	}
// };

exports.createComment = async (req, res) => {
	try {
		const { blogId } = req.params;
		const { text, user } = req.body;
		console.log("userId:", user);
		console.log("blogId:", blogId);
		// Find the user who is creating the comment
		const existingUser = await User.findById(user);
		if (!existingUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Create the comment
		const comment = new Comment({ text, user: user, blog: blogId });
		await comment.save();

		// Update the user's comments array
		existingUser.comments.push(comment._id);
		await existingUser.save();

		// Update the blog's comments array
		const blog = await Blog.findById(blogId);
		if (!blog) {
			return res.status(404).json({ error: "Blog not found" });
		}
		blog.comments.push(comment._id);
		await blog.save();

		res.json(comment);
	} catch (error) {
		console.error(error);
		console.error("Error finding user:", error);
		res.status(500).json({ error: "Server error" });
	}
};
