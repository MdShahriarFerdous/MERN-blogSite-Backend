const express = require("express");
const {
	register,
	allUsers,
	login,
	userBlogs,
	findUser,
} = require("../controllers/userControllers");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", allUsers);
router.get("/user-blogs", userBlogs);
router.get("/user-details/:id", findUser);

module.exports = router;
