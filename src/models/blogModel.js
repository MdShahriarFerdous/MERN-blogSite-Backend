const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
			min: 10,
			max: 100,
		},
		content: {
			type: String,
			required: true,
			min: 32,
			max: 300,
		},
		author: {
			type: ObjectId,
			ref: "User",
		},
		image: {
			type: String,
		},
		comments: [
			{
				type: ObjectId,
				ref: "Comment",
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
