import React, { useEffect, useState, useRef } from "react";
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

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
        console.log("Dữ liệu API:", JSON.stringify(data, null, 2));
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

  const renderItem = ({ item }) => {
    if (!item || typeof item !== "object") return null;

    return (
      <Animated.View
        style={[
          styles.productContainer,
          theme === "dark" && styles.darkProductContainer,
          { opacity: fadeAnim },
        ]}
      >
        {/* Vùng ảnh */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `http://10.0.2.2:3055${item.img}` }}
            style={styles.productImage}
            resizeMode="contain"
            onError={() => console.log("Lỗi tải ảnh:", item.img)}
          />
        </View>

        {/* Tên sản phẩm (rút gọn nếu dài) */}
        <Text
          style={[styles.productTitle, theme === "dark" && styles.darkText]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        {/* Giá sản phẩm */}
        <Text style={[styles.productPrice, theme === "dark" && styles.darkText]}>
          {item.price?.toLocaleString()} đ
        </Text>

        {/* Danh sách size */}
        <View style={styles.sizeContainer}>
          {Array.isArray(item.sizes) && item.sizes.length > 0 ? (
            item.sizes.map((sizeObj, index) => (
              <Text key={index} style={styles.sizeTag}>
                {sizeObj.size}
              </Text>
            ))
          ) : (
            <Text style={styles.noSizeText}>Không có size</Text>
          )}
        </View>

        {/* Hai nút bấm */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          >
            <Text style={styles.buttonText}>
              {language === "vi" ? "Xem chi tiết" : "View Details"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.buttonText}>
              {language === "vi" ? "Thêm vào giỏ" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) =>
        item._id ? `${item._id}_${index}` : `${index}`
      }
      numColumns={2} // Mỗi hàng 2 sản phẩm
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={styles.flatListContent}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  /* Khung chứa toàn bộ FlatList */
  flatListContent: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },

  /* Mỗi card sản phẩm (item) */
  productContainer: {
    width: "47%",
    height: 340,         // Cố định chiều cao card
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 6,
    padding: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkProductContainer: {
    backgroundColor: "#444",
  },

  /* Vùng ảnh (cố định chiều cao) */
  imageContainer: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },

  /* Tiêu đề sản phẩm */
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
  darkText: {
    color: "#fff",
  },

  /* Giá sản phẩm */
  productPrice: {
    fontSize: 14,
    color: "green",
    marginVertical: 5,
    textAlign: "center",
  },

  /* Danh sách size */
  sizeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 5,
  },
  sizeTag: {
    backgroundColor: "#007AFF",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 35,
  },
  noSizeText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },

  /* Hai nút bấm */
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto", // Đẩy nút xuống cuối card
  },
  button: {
    flex: 1,
    paddingVertical: 5,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  /* Thông báo lỗi */
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
