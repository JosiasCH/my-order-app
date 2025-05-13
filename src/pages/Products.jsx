import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://ordenes-backend-production-3e1a.up.railway.app/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    if (!name || !unitPrice) {
      alert("Please fill in both fields.");
      return;
    }

    const payload = { name, unit_price: parseFloat(unitPrice) };

    try {
      if (editingId) {
        await axios.put(
          `https://ordenes-backend-production-3e1a.up.railway.app/api/products/${editingId}`,
          payload
        );
        alert("Product updated.");
      } else {
        await axios.post(
          "https://ordenes-backend-production-3e1a.up.railway.app/api/products",
          payload
        );
        alert("Product added.");
      }

      setName("");
      setUnitPrice("");
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      alert("Something went wrong while saving the product.");
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setUnitPrice(product.unit_price);
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`https://ordenes-backend-production-3e1a.up.railway.app/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Could not delete product.");
    }
  };

  return (
    <div>
      <h1>Manage Products</h1>

      <div style={{ marginBottom: "1rem" }}>
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>{" "}
        <label>
          Unit Price:{" "}
          <input
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </label>{" "}
        <button onClick={handleSave}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${parseFloat(p.unit_price).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
