const mysql = require("mysql2/promise");
const config = require("../configs/config");

const query = async (sql, params = []) => {
	const connection = await mysql.createConnection({
		...config.db,
		connectTimeout: 5000,
		connectionLimit: 10,
	});
	const [rows, fields] = await connection.execute(sql, params);

	return rows;
};

const findOne = async (table, field, value) => {
	const connection = await mysql.createConnection({ ...config.db });
	const [rows, fields] = await connection.execute(
		`Select * from ${table} where ${field} = ${value}`
	);

	if (rows[0]) {
		const { created_at, updated_at } = rows[0];

		const result = {
			...rows[0],
			createdAt: created_at,
			updatedAt: updated_at,
		};
		delete result.created_at;
		delete result.updated_at;

		return result;
	}
	return rows[0];
};

module.exports = {
	query,
	findOne,
};
