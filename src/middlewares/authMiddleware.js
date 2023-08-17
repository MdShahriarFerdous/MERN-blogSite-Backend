const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.requireSignIn = async (req, res, next) => {
	try {
		const tokenFromBrowser = req.cookies.auth_token;
		// const tokenFromPostman = req.headers.authorization;
		if (!tokenFromBrowser) {
			return res
				.status(401)
				.json({ error: "Unauthorized: No token provided" });
		}
		const decode = jwt.verify(tokenFromBrowser, process.env.SECRET_KEY);
		req.headers.auth = decode;
		req.userId = decode.id;
		console.log(req.headers.auth);
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ status: error.message, failed: "Unauthorized" });
	}
};
