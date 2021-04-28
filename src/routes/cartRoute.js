const express = require("express");
const route = express.Router();
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");

const requireAuth = require("../middleware/authMiddleware");

route.get("/", requireAuth, async (req, res, next) => {
	const { role, id } = req.userAuth;
	
	try {
		const result = await cartController.findAll(id);

		res.json(result);
	} catch (err) {
		console.error(`Error while getting programming languages `, err.message);
		next(err);
	}
});

route.put("/update", requireAuth, async (req, res, next) => {
	const { role, id } = req.userAuth;
	const { productId, quantity } = req.body;

	try {
		const results = await cartController.updateCart(id, productId, quantity);

		res.json(results);
	} catch (err) {
		console.error(`Error while getting programming languages `, err.message);
		next(err);
	}
});

module.exports = route;
