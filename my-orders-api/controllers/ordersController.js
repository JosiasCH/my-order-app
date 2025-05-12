const db = require("../config/db");

// GET todas las órdenes
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// GET una orden por ID
exports.getOrderById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// POST nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { orderNumber, orderDate, finalPrice, status } = req.body;

    const [result] = await db.query(
      "INSERT INTO orders (order_number, order_date, final_price, status) VALUES (?, ?, ?, ?)",
      [orderNumber, orderDate, finalPrice, status || "Pending"]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// PUT actualizar orden
exports.updateOrder = async (req, res) => {
  try {
    console.log("Updating order with:", req.body);

    const { orderNumber, orderDate, finalPrice, status } = req.body;

    const [result] = await db.query(
      "UPDATE orders SET order_number = ?, order_date = ?, final_price = ?, status = ? WHERE id = ?",
      [orderNumber, orderDate, finalPrice, status ?? "Pending", req.params.id]
    );

    console.log("Rows affected:", result.affectedRows);

    res.json({ message: "Order updated" });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// DELETE eliminar orden
exports.deleteOrder = async (req, res) => {
  try {
    await db.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
