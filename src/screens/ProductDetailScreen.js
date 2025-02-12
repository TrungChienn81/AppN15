// src/screens/ProductDetailScreen.js
import React from "react";
import { View, Text, Image } from "react-native";

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Image source={{ uri: `http://10.0.2.2:3055${product.img}` }} style={{ width: "100%", height: 300, resizeMode: "contain" }} />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>{product.title}</Text>
      <Text style={{ fontSize: 18, color: "red", marginVertical: 5 }}>{product.price?.toLocaleString()} đ</Text>
      <Text style={{ fontSize: 16, color: "#555" }}>{product.description}</Text>
    </View>
  );
};

export default ProductDetailScreen;
