const User = require("../models/userModel");
require("dotenv").config();
const { hashPassword, comparePassword } = require("../helpers/hashPass");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
	try {
		//destructuring datas
		const { name, email, password } = req.body;
		//validation
		if (!name.trim()) {
			return res.status(400).json({ error: "Name is required!" });
		}
		if (!email.trim()) {
			return res.status(400).json({ error: "Email is required!" });
		}
		if (!password || password.length < 6) {
			return res.status(400).json({
				error: "Password must be at least 6 characters long",
			});
		}
		//if email is taken
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({
				error: "Email is already taken!",
			});
		}
		// 4. hash password
		const hashedPassword = await hashPassword(password);
		//5. register new user
		const newUser = await new User({
			name,
			email,
			password: hashedPassword,
			blogs: [],
			comments: [],
		}).save();

		// const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
		// 	expiresIn: "1d",
		// });
		return res.json({
			status: "Registration Success!",
			newUser,
		});
	} catch (error) {
		res.json(error.message);
	}
};

exports.login = async (req, res) => {
	try {
		//1. destructuring fron req.body
		const { email, password } = req.body;
		//2. validate
		if (!email) {
			res.json({ error: "Email is required" });
		}
		if (!password || password.length < 6) {
			res.json({ error: "Password must be at least 6 characters long" });
		}
		const user = await User.findOne({ email });
		if (!user) {
			res.json({ error: "User not found!" });
		}

		const matchPassword = comparePassword(password, user.password);
		if (!matchPassword) {
			res.json({ error: "Invalid email or password" });
		}

		// const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
		// 	expiresIn: "1d",
		// });
		// // Set the token as an HTTP-only cookie
		// res.cookie("auth_token", token, {
		// 	httpOnly: true,
		// 	maxAge: 86400000, // 1 day in milliseconds
		// });

		return res.json(user);
	} catch (error) {
		return res.json(error.message);
	}
};

exports.userBlogs = async (req, res) => {
	try {
		const blogs = await User.find({})
			.select("-name -email -password -comments")
			.populate("blogs");
		if (!blogs) {
			return res.json({ message: "Blogs Not found!" });
		}
		res.json(blogs);
	} catch (error) {
		return res.json(error.message);
	}
};

exports.allUsers = async (req, res) => {
	try {
		const users = await User.find({}).select("-password");
		if (!users) {
			return res.status(400).json({ error: "User not found!" });
		}
		res.json(users);
	} catch (error) {
		return res.json(error);
	}
};

exports.findUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");
		if (!user) {
			return res.json({ error: "No User Found!" });
		}
		return res.json(user);
	} catch (error) {
		return res.json(error);
	}
};
