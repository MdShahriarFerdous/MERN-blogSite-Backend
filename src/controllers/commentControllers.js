const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");

exports.createComment = async (req, res) => {
	try {
		const { blogId } = req.params;
		const { text, user } = req.body;
		// console.log("userId:", user);
		// console.log("blogId:", blogId);
		// Find the user who is creating the comment
		const existingUser = await User.findById(user);
		if (!existingUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Create the comment
		const comment = new Comment({
			text,
			user: user,
			blog: blogId,
		});
		await comment.save();

		const createdComment = await Comment.findById(comment._id).populate(
			"user",
			"name"
		);
		// Update the user's comments array
		existingUser.comments.push(comment._id);
		await existingUser.save();

		// Update the blog's comments array
		const blog = await Blog.findById(blogId);

		blog.comments.push(comment._id);
		await blog.save();

		res.json(createdComment);
	} catch (error) {
		console.error(error);
		console.error("Error finding user:", error);
		res.status(500).json({ error: "Server error" });
	}
};
