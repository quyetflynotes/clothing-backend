const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");
const config = require("../configs/config");

const requireAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const unauthorized = { status: 401, message: "Unauthorized" };

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, config.accessTokenSecret, async (err, decoded) => {
			if (err) {
				return next(unauthorized);
			} else {
				const user = await userController.findById(decoded.id);

				req.userAuth = user;
				next();
			}
		});
	} else {
		next(unauthorized);
	}
};

module.exports = requireAuth;
