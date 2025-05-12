import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import MyOrders from './pages/MyOrders.jsx';
import AddEditOrder from './pages/AddEditOrder.jsx';
import Products from "./pages/Products";
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/add-order/:id" element={<AddEditOrder />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  </BrowserRouter>
);


