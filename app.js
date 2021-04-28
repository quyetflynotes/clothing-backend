const express = require("express");
const cors = require("cors");
const app = express();
const port = 3002;
require("dotenv").config();
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const productRoute = require("./src/routes/productRoute");
const userRoute = require("./src/routes/userRoute");
const cartRoute = require("./src/routes/cartRoute");

const userRouteAdmin = require("./src/routes/admin/user.adminRoute");
const requireAuth = require("./src/middleware/authMiddleware");

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);


app.use("/admin/product", productRoute);
app.use("/admin/user", userRouteAdmin);

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Internal server error!";
	res.status(status).json({ status, message });

	return;
});

app.listen(port, () => {
	console.log("App listening at localhost:", port);
});
