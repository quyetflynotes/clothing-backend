const db = require("../db/db");
const config = require("../configs/config");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const productController = require("./productController");

const findAll = async (userId) => {
	const results = await db.query("select * from cart_item where user_id = ?", [userId]);
	const map = Promise.all(
		results.map(async (item) => {
			return { ...item, product: await productController.findById(item.product_id) };
		})
	)
	return map;
};

const updateCart = async (userId, productId, quantity) => {
	const results = await findItemInCart(userId, productId);
	const id = uuidv4();
	const time = new Date().toISOString();

	console.log(results);

	if (results.length > 0) {
		if (quantity > 0) {
			await db.query(
				"UPDATE cart_item SET quantity= ?, updated_at= ? where user_id = ? and product_id = ?",
				[quantity, new Date().toISOString(), userId, productId]
			);
		} else {
			await db.query("DELETE FROM cart_item where user_id = ? and product_id = ?", [
				userId,
				productId,
			]);
		}
	} else {
		await db.query(
			"INSERT INTO clothing.cart_item (id, product_id, user_id, quantity, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?)",
			[id, productId, userId, quantity, time, time]
		);
	}
	return await findAll(userId);
};

const findItemInCart = async (userId, productId) => {
	const results = await db.query("select * from cart_item where user_id = ? and product_id = ?", [
		userId,
		productId,
	]);

	return results;
};

module.exports = {
	updateCart,
	findAll,
};
