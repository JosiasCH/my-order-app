import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductModal from "../components/ProductModal";
import axios from "axios";

const AddEditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== "new";

  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [products, setProducts] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [orderStatus, setOrderStatus] = useState("Pending");

  const [showModal, setShowModal] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setOrderDate(today);

    if (isEdit) {
      // Cargar productos asociados a la orden
      axios
        .get(`https://ordenes-backend-production-3e1a.up.railway.app/api/order-products/${id}`)
        .then((res) => {
          const formatted = res.data.map((p) => ({
            id: p.product_id,
            name: p.product_name,
            unitPrice: parseFloat(p.unit_price),
            qty: p.qty,
            dbId: p.id,
          }));
          setProducts(formatted);
        })
        .catch((err) => console.error("Error loading order products:", err));

      // Cargar datos de la orden
      axios
        .get(`https://ordenes-backend-production-3e1a.up.railway.app/api/orders/${id}`)
        .then((res) => {
          setOrderNumber(res.data.order_number);
          setOrderDate(res.data.order_date.slice(0, 10));
          setOrderStatus(res.data.status || "Pending");
        })
        .catch((err) => console.error("Error loading order info:", err));
    }
  }, [id]);

  useEffect(() => {
    const total = products.reduce((sum, p) => sum + p.unitPrice * p.qty, 0);
    setFinalPrice(total.toFixed(2));
  }, [products]);

  const handleAddProduct = () => {
    setEditingProductIndex(null);
    setShowModal(true);
  };

  const handleEditProduct = (index) => {
    setEditingProductIndex(index);
    setShowModal(true);
  };

  const handleDeleteProduct = async (index) => {
    const confirmDelete = confirm("Are you sure you want to remove this product?");
    if (!confirmDelete) return;

    const toDelete = products[index];
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);

    if (isEdit && toDelete?.dbId) {
      try {
        await axios.delete(
          `https://ordenes-backend-production-3e1a.up.railway.app/api/products/${toDelete.dbId}`
        );
      } catch (err) {
        console.error("Failed to delete from backend:", err);
      }
    }
  };

  const handleSaveProduct = (product) => {
    if (editingProductIndex !== null) {
      const updated = [...products];
      updated[editingProductIndex] = product;
      setProducts(updated);
    } else {
      setProducts([...products, product]);
    }
  };

  const handleSaveOrder = async () => {
    try {
      if (!orderNumber || (!isEdit && products.length === 0)) {
        alert("Please enter an order number and at least one product.");
        return;
      }

      const orderPayload = {
        orderNumber,
        orderDate,
        finalPrice: parseFloat(finalPrice),
        status: orderStatus,
      };

      let savedOrderId = id;

      if (isEdit) {
        await axios.put(
          `https://ordenes-backend-production-3e1a.up.railway.app/api/orders/${id}`,
          orderPayload
        );
      } else {
        const res = await axios.post(
          "https://ordenes-backend-production-3e1a.up.railway.app/api/orders",
          orderPayload
        );
        savedOrderId = res.data.id;
      }

      for (const p of products) {
        if (p.dbId) continue;
        await axios.post(
          "https://ordenes-backend-production-3e1a.up.railway.app/api/order-products",
          {
            orderId: savedOrderId,
            productId: p.id,
            productName: p.name,
            unitPrice: p.unitPrice,
            qty: p.qty,
          }
        );
      }

      alert("Order saved successfully!");
      navigate("/my-orders");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("An error occurred while saving the order.");
    }
  };

  if (orderStatus === "Completed") {
    return (
      <div>
        <h1>Edit Order</h1>
        <p>
          This order is marked as <strong>Completed</strong> and cannot be modified.
        </p>
        <button onClick={() => navigate("/my-orders")}>← Back to Orders</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{isEdit ? "Edit Order" : "Add Order"}</h1>

      <button onClick={() => navigate("/my-orders")} style={{ marginBottom: "1rem" }}>
        ← Back to Orders
      </button>

      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Order #:
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
        </label>
        <br />

        <label>
          Date:
          <input type="date" value={orderDate} disabled />
        </label>
        <br />

        <label>
          # Products:
          <input type="number" value={products.length} disabled />
        </label>
        <br />

        <label>
          Final Price:
          <input type="text" value={`$${finalPrice}`} disabled />
        </label>
        <br />

        <button type="button" onClick={handleAddProduct}>
          Add Product
        </button>
      </form>

      <h2>Products in Order</h2>
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={index}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.unitPrice}</td>
                <td>{p.qty}</td>
                <td>{(p.unitPrice * p.qty).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEditProduct(index)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button onClick={handleSaveOrder}>Save Order</button>

      {showModal && (
        <ProductModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
          initialData={editingProductIndex !== null ? products[editingProductIndex] : null}
        />
      )}
    </div>
  );
};

export default AddEditOrder;
