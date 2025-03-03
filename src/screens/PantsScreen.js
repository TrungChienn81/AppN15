// src/screens/PantsScreen.js
import React from "react";
import ProductList from "../components/ProductList";

// Cập nhật URL API cho loại quần
const API_URL = "http://10.0.2.2:3055/v1/api/product-type/quần";

const PantsScreen = () => {
  return <ProductList apiUrl={API_URL} />;
};

export default PantsScreen;
