import React, { useEffect, useState, useRef } from "react";
import { FlatList, ActivityIndicator, View, Text, Image, Button, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

const ProductList = ({ apiUrl }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { theme, language } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => (item._id ? `${item._id}_${index}` : `${index}`)}
      numColumns={2}
      renderItem={({ item }) => (
        <Animated.View style={[styles.productContainer, theme === "dark" && styles.darkProductContainer, { opacity: fadeAnim }]}>
          <Image source={{ uri: `http://10.0.2.2:3055${item.img}` }} style={styles.productImage} resizeMode="cover" />
          <Text style={[styles.productTitle, theme === "dark" && styles.darkText]}>{item.title}</Text>
          <Text style={[styles.productPrice, theme === "dark" && styles.darkText]}>{item.price?.toLocaleString()} đ</Text>
          <View style={styles.buttonContainer}>
            <Button title={language === "vi" ? "Xem chi tiết" : "View Details"} color="#6200EE" onPress={() => navigation.navigate("ProductDetail", { product: item })} />
            <Button title={language === "vi" ? "Thêm vào giỏ" : "Add to Cart"} color="#6200EE" onPress={() => addToCart(item)} />
          </View>
        </Animated.View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  darkProductContainer: {
    backgroundColor: "#444",
  },
  productImage: {
    height: 150,
    borderRadius: 5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "green",
    marginVertical: 5,
  },
  darkText: {
    color: "#fff",
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default ProductList;
