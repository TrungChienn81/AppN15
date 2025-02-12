// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, View, Text, Image, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProductList = ({ apiUrl }) => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu API trả về:", data);
        if (data.status === 200) {
          setProducts(data.data);
        }
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => (item._id ? `${item._id}_${index}` : `${index}`)}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: 5, backgroundColor: "#fff", borderRadius: 8, padding: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Image source={{ uri: `http://10.0.2.2:3055${item.img}` }} style={{ height: 150, borderRadius: 5 }} resizeMode="cover" />
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 5 }}>{item.title}</Text>
          <Text style={{ fontSize: 14, color: "green", marginVertical: 5 }}>{item.price?.toLocaleString()} đ</Text>
          <Button title="Xem chi tiết" color="#6200EE" onPress={() => navigation.navigate("ProductDetail", { product: item })} />
        </View>
      )}
    />
  );
};

export default ProductList;
