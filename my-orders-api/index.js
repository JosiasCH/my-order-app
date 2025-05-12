const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ordersRoutes = require("./routes/ordersRoutes");
const orderProductsRoutes = require("./routes/orderProductsRoutes");
const productsRoutes = require("./routes/productsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/orders", ordersRoutes);
app.use("/api/order-products", orderProductsRoutes);
app.use("/api/products", productsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

