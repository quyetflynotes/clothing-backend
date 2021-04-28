const env = process.env;

const config = {
    db: {
        host: env.DB_HOST,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
    },
    pageSize: 10,
    accessTokenSecret: env.ACCESS_TOKEN_SECRET,
}

module.exports = config
