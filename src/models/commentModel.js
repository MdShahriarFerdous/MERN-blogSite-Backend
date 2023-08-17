const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			trim: true,
			maxLength: 100,
			required: true,
		},
		user: {
			type: ObjectId,
			ref: "User",
		},
		blog: {
			type: ObjectId,
			ref: "Blog",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
