const db = require("../db/db");
const config = require("../configs/config");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const create = async (user) => {
	const { username, password } = user;
	const time = new Date().toISOString();
	const id = uuidv4();

	const salt = bcrypt.genSaltSync();
	const hashPassword = bcrypt.hashSync(password, salt);

	const existUser = await findByUsername(username);
	if (existUser) throw { status: 400, message: "Username is exist!" };

	const results = await db.query(
		"INSERT INTO user (id, username, password, created_at, updated_at) VALUES(?, ?, ?, ?, ?)",
		[id, username, hashPassword, time, time]
	);

	return {
		user,
	};
};

const login = async (username, password) => {
	const user = await findByUsername(username);
	if (!user) {
		throw { status: 401, message: "Username is not exist!" };
	}

	const isPasswordMatch = bcrypt.compareSync(password, user.password);
	if (!isPasswordMatch) {
		throw { status: 401, message: "Password incorrect!" };
	}

	const token = jwt.sign({ id: user.id, role: user.role }, config.accessTokenSecret);

	return { ...user, token };
};

const findByUsername = async (username) => {
	const results = await db.query("select * from user where username = ?", [username]);

	if (results[0]) {
		const { created_at, updated_at } = results[0];

		const user = {
			...results[0],
			createdAt: created_at,
			updatedAt: updated_at,
		};
		delete user.created_at;
		delete user.updated_at;
		return user;
	}

	return null;
};

const findById = async (id) => {
	const results = await db.query("select * from user where id = ?", [id]);

	if (results[0]) {
		const { created_at, updated_at } = results[0];

		const user = {
			...results[0],
			createdAt: created_at,
			updatedAt: updated_at,
		};
		delete user.created_at;
		delete user.updated_at;
		return user;
	}

	return null;
};

module.exports = {
	create,
	findByUsername,
	login,
	findById
};
