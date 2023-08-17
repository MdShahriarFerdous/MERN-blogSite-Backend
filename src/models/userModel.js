const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxLength: 32,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
			min: 6,
			max: 64,
		},
		blogs: [
			{
				type: ObjectId,
				ref: "Blog",
			},
		],
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

const User = mongoose.model("User", userSchema);
module.exports = User;
