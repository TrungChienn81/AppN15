import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (size) => {
    if (!size) {
      Alert.alert("Lỗi", "Vui lòng chọn kích thước");
      return;
    }
    
    addToCart({
      ...product,
      quantity: 1,
      size: size
    });
    
    Alert.alert(
      "Thành công",
      "Đã thêm sản phẩm vào giỏ hàng",
      [
        {
          text: "Tiếp tục mua sắm",
          style: "cancel"
        },
        {
          text: "Đến giỏ hàng",
          onPress: () => navigation.navigate("Cart")
        }
      ]
    );
  };

  // Xử lý URL hình ảnh
  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "";
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    } else {
      return `http://10.0.2.2:3055${imgUrl}`;
    }
  };

  // Lấy các sản phẩm cùng loại
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        let apiUrl = "";
        // Xác định loại sản phẩm từ tên hoặc category
        if (product.title.toLowerCase().includes("áo")) {
          apiUrl = "http://10.0.2.2:3055/v1/api/product-type/áo";
        } else if (product.title.toLowerCase().includes("quần")) {
          apiUrl = "http://10.0.2.2:3055/v1/api/product-type/quần";
        } else if (product.title.toLowerCase().includes("giày")) {
          apiUrl = "http://10.0.2.2:3055/v1/api/product?category=67b93c8c722783a60c162f3e";
        } else if (product.title.toLowerCase().includes("túi")) {
          apiUrl = "http://10.0.2.2:3055/v1/api/product?category=67b93e2d722783a60c163466";
        } else if (product.category && product.category._id) {
          // Nếu có thông tin category, dùng category ID
          apiUrl = `http://10.0.2.2:3055/v1/api/product?category=${product.category._id}`;
        }

        if (apiUrl) {
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.status === 200) {
            let productsList = [];
            if (Array.isArray(data.data)) {
              productsList = data.data;
            } else if (data.data && Array.isArray(data.data.data)) {
              productsList = data.data.data;
            }

            // Lọc bỏ sản phẩm hiện tại và lấy ngẫu nhiên 3 sản phẩm
            const filteredProducts = productsList
              .filter(item => item._id !== product._id)
              .sort(() => 0.5 - Math.random())
              .slice(0, 3);
            setRelatedProducts(filteredProducts);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product._id, product.title, product.category]);

  // Thêm nút điều hướng đến giỏ hàng trong header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate("Cart")}
        >
          <Icon name="shopping-cart" size={24} color="#FF4081" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {/* Phần hình ảnh sản phẩm */}
      <View style={styles.imageContainer}>
        <TouchableOpacity 
          onPress={() => setShowZoomedImage(true)}
          activeOpacity={0.9}
        >
          {imageLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF4081" />
            </View>
          )}
          <Image
            source={{ uri: getImageUrl(product.img) }}
            style={styles.mainImage}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomIconContainer}>
          <Icon name="zoom-in" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal hiển thị ảnh phóng to */}
      {showZoomedImage && (
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowZoomedImage(false)}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: getImageUrl(product.img) }}
            style={styles.zoomedImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Thông tin sản phẩm */}
      <View style={styles.infoContainer}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>{product.price?.toLocaleString()} đ</Text>

        {/* Kích thước và tình trạng kho */}
        <View style={styles.sizeContainer}>
          {product.sizes && product.sizes.length > 0 ? (
            product.sizes.map((sizeItem, index) => (
              <View key={index} style={styles.sizeRow}>
                <Text style={styles.sizeText}>{`Size ${sizeItem.size}`}</Text>
                {sizeItem.quantity > 0 ? (
                  <Text style={styles.stockText}>{`Số lượng: ${sizeItem.quantity}`}</Text>
                ) : (
                  <Text style={styles.outOfStockText}>Hết hàng</Text>
                )}
                {sizeItem.quantity > 0 ? (
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddToCart(sizeItem.size)}
                  >
                    <Text style={styles.addButtonText}>Giỏ hàng</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.soldOutBadge}>
                    <Text style={styles.soldOutText}>Hết hàng</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text>Không có thông tin kích thước</Text>
          )}
        </View>

        {/* Mã sản phẩm */}
        <Text style={styles.productCode}>Mã số: #{product._id?.substring(0, 7) || "0024228"}</Text>
        <Text style={styles.productFullTitle}>{product.title}</Text>

        {/* Mô tả sản phẩm */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>1. Kiểu sản phẩm: {product.title.split(" ")[0]}</Text>
          <Text style={styles.descriptionTitle}>2. Ưu điểm:</Text>
          {product.description ? (
            <Text style={styles.descriptionPoint}>{product.description}</Text>
          ) : (
            <>
              <Text style={styles.descriptionPoint}>• Chất liệu Polyester Pique Coffee giúp thoát ẩm nhanh, mang lại cảm giác mát mẻ, thoải mái khi mặc.</Text>
              <Text style={styles.descriptionPoint}>• Với cổ áo nâng chống tia UV, bảo vệ làn da khỏi tác hại của ánh nắng mặt trời.</Text>
              <Text style={styles.descriptionPoint}>• Chất liệu khô nhanh, giúp bạn luôn cảm thấy dễ chịu, đặc biệt trong những ngày thời tiết ẩm ướt.</Text>
            </>
          )}

          {!showFullDescription && (
            <TouchableOpacity 
              style={styles.readMoreButton}
              onPress={() => setShowFullDescription(true)}
            >
              <Text style={styles.readMoreText}>Đọc tiếp</Text>
            </TouchableOpacity>
          )}

          {showFullDescription && (
            <Text style={styles.descriptionPoint}>• Giúp loại bỏ mùi hôi, mang lại cảm giác tự tin suốt ngày dài.</Text>
          )}
        </View>
      </View>

     

      {/* Có thể bạn quan tâm */}
      {relatedProducts.length > 0 && (
        <View style={styles.relatedContainer}>
          <Text style={styles.relatedTitle}>CÓ THỂ BẠN QUAN TÂM</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedProducts.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.relatedItem}
                onPress={() => navigation.navigate("ProductDetail", { product: item })}
              >
                <Image 
                  source={{ uri: getImageUrl(item.img) }} 
                  style={styles.relatedImage} 
                />
                <Text style={styles.relatedName}>{item.title}</Text>
                <Text style={styles.relatedPrice}>{item.price?.toLocaleString()} đ</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: 400,
    position: "relative",
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  zoomIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  zoomedImage: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 20,
    color: "#FF4081",
    fontWeight: "bold",
    marginBottom: 15,
  },
  sizeContainer: {
    marginBottom: 15,
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  sizeText: {
    fontSize: 14,
    width: "30%",
  },
  stockText: {
    fontSize: 14,
    width: "30%",
  },
  outOfStockText: {
    fontSize: 14,
    width: "30%",
    color: "#FF4081",
    fontWeight: "bold",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
  },
  availabilityText: {
    fontSize: 14,
    color: "red",
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  soldOutBadge: {
    backgroundColor: "#FF4081",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  soldOutText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  productCode: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  productFullTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  readMoreButton: {
    marginTop: 5,
  },
  readMoreText: {
    color: "#6A5ACD",
    fontWeight: "bold",
  },
  relatedContainer: {
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  relatedItem: {
    width: 150,
    marginRight: 15,
  },
  relatedImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginBottom: 5,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  relatedName: {
    fontSize: 14,
    marginBottom: 5,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF4081",
  },
  addToCartContainer: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  addToCartButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
