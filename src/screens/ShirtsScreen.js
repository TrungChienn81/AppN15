// src/screens/ShirtsScreen.js
import React from "react";
import ProductList from "../components/ProductList";

const API_URL = "http://10.0.2.2:3055/v1/api/product-type/áo";

const ShirtsScreen = () => {
  return <ProductList apiUrl={API_URL} />;
};

export default ShirtsScreen;
