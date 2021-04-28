const { Router } = require("express");
const route = Router();
const userController = require("../../controllers/userController");
const jwt = require("jsonwebtoken");
const requireAuth = require("../../middleware/authMiddleware");

route.post("/", async (req, res, next) => {
	try {
		const user = await userController.create(req.body);

		res.json(user);
	} catch (error) {
		next(error);
	}
});

route.post("/login", async (req, res, next) => {
	const { username, password } = req.body;
	try {
		const userWithToken = await userController.login(username, password);
		if (userWithToken.role !== "admin") {
			return next({ status: 403, message: "Forbidden" });
		}
		res.cookie("jwt", userWithToken.token, { httpOnly: true, maxAge: 7000000 });
		res.json(userWithToken);
	} catch (error) {
		next(error);
	}
});

route.get("/me", requireAuth, async (req, res, next) => {
	const { role } = req.userAuth;

	if (role !== "admin") {
		return res.sendStatus(403);
	}

	try {
		const user = await userController.findById(req.userAuth.id);
		res.json(user);
	} catch (error) {
		next(error);
	}
});

route.post("/logout", async (req, res, next) => {
	try {
		res.clearCookie("jwt");
		res.json("Logout successfully!");
	} catch (error) {
		next(error);
	}
});

module.exports = route;
