import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductModal = ({ onClose, onSave, initialData }) => {
  const isEdit = !!initialData;

  const [productsList, setProductsList] = useState([]);
  const [selectedId, setSelectedId] = useState(initialData?.id || "");
  const [qty, setQty] = useState(initialData?.qty || 1);

  useEffect(() => {
    axios
      .get("https://ordenes-backend-production-3e1a.up.railway.app/api/products")
      .then((res) => setProductsList(res.data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const handleSave = () => {
    const selectedProduct = productsList.find(
      (p) => p.id === parseInt(selectedId)
    );

    if (!selectedProduct || qty < 1) {
      alert("Please select a valid product and quantity.");
      return;
    }

    const productToSave = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      unitPrice: parseFloat(selectedProduct.unit_price),
      qty: parseInt(qty)
    };

    onSave(productToSave);
    onClose();
  };

  return (
    <div className="modal">
      <h3>{isEdit ? "Edit Product" : "Add Product"}</h3>

      <label>
        Product:
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={isEdit}
        >
          <option value="">-- Select --</option>
          {productsList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} – ${parseFloat(p.unit_price).toFixed(2)}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Quantity:
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </label>
      <br />

      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ProductModal;
