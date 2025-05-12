const db = require("../config/db");

exports.getAllProducts = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
};

exports.createProduct = async (req, res) => {
  const { name, unit_price } = req.body;
  const [result] = await db.query(
    "INSERT INTO products (name, unit_price) VALUES (?, ?)",
    [name, unit_price]
  );
  res.json({ id: result.insertId });
};

exports.updateProduct = async (req, res) => {
  const { name, unit_price } = req.body;
  await db.query(
    "UPDATE products SET name = ?, unit_price = ? WHERE id = ?",
    [name, unit_price, req.params.id]
  );
  res.json({ message: "Product updated" });
};

exports.deleteProduct = async (req, res) => {
  await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted" });
};
