const express = require("express");
const route = express.Router();
const productController = require("../controllers/productController");
const requireAuth = require("../middleware/authMiddleware");

route.get("/:id", async (req, res, next) => {
	const { id } = req.params;
	try {
		const paging = await productController.findById(id);
		res.json(paging);
	} catch (err) {
		console.error(`Error while getting programming languages `, err.message);
		next(err);
	}
});

route.get("/", async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;

		const paging = await productController.findAll(page, pageSize);

		res.json(paging);
	} catch (err) {
		console.error(`Error while getting programming languages `, err.message);
		next(err);
	}
});

route.post("/", requireAuth, async (req, res, next) => {
	const { role } = req.userAuth;

	if (role !== "admin") {
		return next({ status: 403, message: "Forbidden" });
	}

	try {
		const product = await productController.create(req.body);

		res.json(product);
	} catch (err) {
		console.error(`Error while getting programming languages `, err.message);
		next(err);
	}
});

route.put("/", requireAuth, async (req, res, next) => {
	const { role } = req.userAuth;

	if (role !== "admin") {
		return res.sendStatus(403);
	}

	try {
		const product = await productController.update(req.body);

		res.json(product);
	} catch (err) {
		console.error(`Error while getting programming languages `, err.message);
		next(err);
	}
});

route.delete("/", requireAuth, async (req, res, next) => {
	const { role } = req.userAuth;

	if (role !== "admin") {
		return res.sendStatus(403);
	}

	try {
		await productController.remove(req.query.id);
		res.json({
			status: 200,
			message: "Delete successfully!",
		});
	} catch (err) {
		console.error(`Error while getting programming languages `, err.message);
		next(err);
	}
});

module.exports = route;
