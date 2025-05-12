const db = require("../config/db");

exports.getProductsByOrderId = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM order_products WHERE order_id = ?", [req.params.orderId]);
  res.json(rows);
};

exports.addProductToOrder = async (req, res) => {
  const { orderId, productId, productName, unitPrice, qty } = req.body;
  const [result] = await db.query(
    "INSERT INTO order_products (order_id, product_id, product_name, unit_price, qty) VALUES (?, ?, ?, ?, ?)",
    [orderId, productId, productName, unitPrice, qty]
  );
  res.json({ id: result.insertId });
};

exports.updateProductInOrder = async (req, res) => {
  const { productName, unitPrice, qty } = req.body;
  await db.query(
    "UPDATE order_products SET product_name = ?, unit_price = ?, qty = ? WHERE id = ?",
    [productName, unitPrice, qty, req.params.id]
  );
  res.json({ message: "Product updated" });
};

exports.deleteProductFromOrder = async (req, res) => {
  await db.query("DELETE FROM order_products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted" });
};
