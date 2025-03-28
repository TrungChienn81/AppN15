import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSettings } from "../context/SettingsContext";

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const { language, theme } = useSettings();
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy sản phẩm nổi bật
        const response = await fetch(
          "http://10.0.2.2:3055/v1/api/product-top-rate"
        );
        const data = await response.json();
        if (data.status === 200 && Array.isArray(data.data)) {
          setTopRatedProducts(data.data);
        } else {
          setTopRatedProducts([]);
        }
      } catch (err) {
        console.error("Lỗi fetch API:", err);
        setTopRatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      navigation.navigate("Search", { query });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, theme === "dark" && styles.darkContainer]}>
      <Text style={[styles.title, theme === "dark" && styles.darkText]}>
        {language === "vi" ? "Chào mừng đến với cửa hàng của Nhóm 15" : "Welcome to the store"}
      </Text>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, theme === "dark" && styles.darkInput]}
          placeholder={language === "vi" ? "Tìm kiếm..." : "Search..."}
          placeholderTextColor={theme === "dark" ? "#999" : "#777"}
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Các nút danh mục */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => navigation.navigate("Pants")}
        >
          <View style={styles.categoryIcon}>
          <Image
              source={require('../assets/icons/pants_icon.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.categoryText, theme === "dark" && styles.darkText]}>
            {language === "vi" ? "Quần" : "Pants"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => navigation.navigate("Shirts")}
        >
          <View style={styles.categoryIcon}>
          <Image
              source={require('../assets/icons/shirts_icon.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.categoryText, theme === "dark" && styles.darkText]}>
            {language === "vi" ? "Áo" : "Shirts"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => navigation.navigate("ShoesScreen")}
        >
          <View style={styles.categoryIcon}>
          <Image
              source={require('../assets/icons/shoes_icon.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.categoryText, theme === "dark" && styles.darkText]}>
            {language === "vi" ? "Giày" : "Shoes"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => navigation.navigate("BagsScreen")}
        >
          <View style={styles.categoryIcon}>
          <Image
              source={require('../assets/icons/bag_icon.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.categoryText, theme === "dark" && styles.darkText]}>
            {language === "vi" ? "Túi" : "Bags"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nút váy */}
      <View style={styles.dressButtonContainer}>
        <TouchableOpacity 
          style={styles.categoryButton}
          onPress={() => navigation.navigate("DressScreen")}
        >
          <View style={styles.categoryIcon}>
            <Image
              source={require('../assets/icons/dress_icon.png')}
              style={styles.iconImage}
            />
          </View>
          <Text style={[styles.categoryText, theme === "dark" && styles.darkText]}>
            {language === "vi" ? "Váy" : "Dress"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sản phẩm nổi bật */}
      <View style={styles.productSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
              {language === "vi" ? " Sản phẩm nổi bật" : " Top Rated Products"}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("TopRated")}
          >
            <Text style={styles.viewAllText}>
              {language === "vi" ? "Xem tất cả" : "View all"}
            </Text>
            <Icon name="arrow-forward" size={16} color="#6A5ACD" />
          </TouchableOpacity>
        </View>

        <View style={styles.productList}>
          {topRatedProducts.slice(0, 3).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productItem}
              onPress={() => navigation.navigate("ProductDetail", { product: item })}
            >
              <Text style={[styles.productName, theme === "dark" && styles.darkText]}>
                {item.title}
              </Text>
              <Text style={styles.productPrice}>
                {item.price?.toLocaleString()} đ
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 46,
    backgroundColor: "#fff",
    borderRadius: 23,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkInput: {
    backgroundColor: "#2A2A2A",
    color: "#fff",
  },
  searchButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#6A5ACD",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  categoryButton: {
    alignItems: "center",
    width: "22%",
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6A5ACD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconImage: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  dressButtonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  productSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: "#6A5ACD",
    marginRight: 4,
  },
  productList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6A5ACD",
  },
});

export default HomeScreen;
