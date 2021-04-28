const db = require("../db/db");
const config = require("../configs/config");
const { v4: uuidv4 } = require("uuid");

const findAll = async (page = 1, pageSize = config.pageSize) => {
	const offset = (page - 1) * pageSize;

	const totalResult = await db.query("select * from product", [page.toString(), pageSize.toString()]);
	const totalLimit = await db.query("select * from product  order by created_at desc limit ?,? ", [
		offset.toString(),
		pageSize.toString(),
	]);

	return {
		page: Number(page),
		pageSize: Number(pageSize),
		rows: totalLimit,
		total: totalResult.length,
		totalPages: Math.ceil(totalResult.length / pageSize),
	};
};

const findById = async (id) => {
	const totalResult = await db.query("select * from product where id = ?", [id]);

	if (!totalResult[0]) throw { status: 404, message: "Not found!" };

	const { created_at, updated_at } = totalResult[0];

	const prod = {
		...totalResult[0],
		createdAt: created_at,
		updatedAt: updated_at,
	};

	delete prod.created_at;
	delete prod.updated_at;

	return prod;
};

const create = async (product) => {
	const { name, price, description, images } = product;
	const time = new Date().toISOString();
	const id = uuidv4();

	const totalResult = await db.query(
		"INSERT INTO clothing.product (id, name, price, description, images, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?)",
		[id, name, price, description, images && images.length > 0 ? images : null, time, time]
	);
	return {
		id,
		name,
		price,
		description,
		images,
		createdAt: time,
		updateAt: time,
	};
};

const update = async (product) => {
	let { id, name, price, description, images } = product;

	const totalResult = await db.query(
		"UPDATE clothing.product SET name= ?, price= ?, description=?, images=?, updated_at=? WHERE id=?",
		[name, price, description, images, new Date().toISOString(), id]
	);
	const prod = await findById(id);

	console.log(prod);

	return {
		id,
		name,
		price,
		description,
		images,
		createdAt: prod.createdAt,
		updateAt: prod.updatedAt,
	};
};

const remove = async (id) => {
	await findById(id);
	const totalResult = await db.query("DELETE FROM clothing.product WHERE id=?", [id]);
	return totalResult[0];
};

module.exports = {
	findAll,
	create,
	update,
	remove,
	findById,
};
