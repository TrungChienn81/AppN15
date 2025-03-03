// src/screens/PantsScreen.js
import React from "react";
import ProductList from "../components/ProductList";

// API mới lấy danh sách quần
const API_URL = "http://localhost:3055/v1/api/product?page=1&limit=6&priceRange=0%2C10000000000&status=&category=67b87b044c53e8e91ac45129&searchText=";

const PantsScreen = () => {
  return <ProductList apiUrl={API_URL} />;
};

export default PantsScreen;

// src/components/ProductList.js
import React, { useEffect, useState, useRef } from "react";
import { FlatList, ActivityIndicator, View, Text, Image, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const ProductList = ({ apiUrl }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const { theme, language } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setProducts(data.data || []);
        } else {
          setError("Không có sản phẩm nào.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setError("Lỗi kết nối. Vui lòng thử lại.");
      })
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => item._id || `${index}`}
      numColumns={2}
      renderItem={({ item }) => (
        <Animated.View style={[styles.productContainer, { opacity: fadeAnim }]}>          
          <Image source={{ uri: `http://localhost:3055${item.img}` }} style={styles.productImage} resizeMode="cover" />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>{item.price?.toLocaleString()} đ</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          >
            <Text style={styles.buttonText}>{language === "vi" ? "Xem chi tiết" : "View Details"}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 150,
    borderRadius: 5,
  },
  productInfo: {
    paddingVertical: 5,
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
  button: {
    backgroundColor: "#6200EE",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default ProductList;
