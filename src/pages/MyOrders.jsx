import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersWithProductCount = async () => {
      try {
        const res = await axios.get("https://ordenes-backend-production-3e1a.up.railway.app/api/orders");
        const ordersData = res.data;

        const updatedOrders = await Promise.all(
          ordersData.map(async (order) => {
            try {
              const productRes = await axios.get(
                `https://ordenes-backend-production-3e1a.up.railway.app/api/order-products/${order.id}`
              );

              // Sum total qty from order_products
              const qtyTotal = productRes.data.reduce((sum, item) => sum + item.qty, 0);

              return {
                ...order,
                productCount: qtyTotal,
              };
            } catch (err) {
              console.error("Error fetching products for order", order.id, err);
              return {
                ...order,
                productCount: 0,
              };
            }
          })
        );

        setOrders(updatedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrdersWithProductCount();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://ordenes-backend-production-3e1a.up.railway.app/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      alert("Order deleted successfully.");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete the order.");
    }
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      await axios.put(`https://ordenes-backend-production-3e1a.up.railway.app/api/orders/${orderId}`, {
        orderNumber: order.order_number,
        orderDate: order.order_date.slice(0, 10),
        finalPrice: parseFloat(order.final_price),
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update order status.");
    }
  };

  return (
    <div>
      <h1>My Orders</h1>
      <button onClick={() => navigate("/add-order/new")}>Add New Order</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order #</th>
            <th>Date</th>
            <th># Products</th>
            <th>Final Price</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.order_number}</td>
              <td>{order.order_date.slice(0, 10)}</td>
              <td>{order.productCount}</td>
              <td>${parseFloat(order.final_price).toFixed(2)}</td>
              <td>
                <select
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    handleChangeStatus(order.id, e.target.value)
                  }
                  disabled={order.status === "Completed"}
                >
                  <option value="Pending">Pending</option>
                  <option value="InProgress">InProgress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => navigate(`/add-order/${order.id}`)}
                  disabled={order.status === "Completed"}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  disabled={order.status === "Completed"}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
