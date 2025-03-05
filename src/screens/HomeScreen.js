import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSettings } from "../context/SettingsContext";

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const { language, theme } = useSettings();

  // State cho 3 loại sản phẩm: Đầm, Giày, Túi đeo
  const [dresses, setDresses] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy 3 sản phẩm của từng loại
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API Đầm
        const res1 = await fetch(
          "http://10.0.2.2:3055/v1/api/product?page=1&limit=3&priceRange=0%2C10000000000&status=&category=67b88373ece26a7c1401f954&searchText="
        );
        const data1 = await res1.json();
        if (data1 && data1.status === 200 && Array.isArray(data1.data)) {
          setDresses(data1.data);
        } else {
          setDresses([]);
        }

        // API Giày
        const res2 = await fetch(
          "http://10.0.2.2:3055/v1/api/product?page=1&limit=3&priceRange=0%2C10000000000&status=&category=67b93c8c722783a60c162f3e&searchText="
        );
        const data2 = await res2.json();
        if (data2 && data2.status === 200 && Array.isArray(data2.data)) {
          setShoes(data2.data);
        } else {
          setShoes([]);
        }

        // API Túi đeo
        const res3 = await fetch(
          "http://10.0.2.2:3055/v1/api/product?page=1&limit=3&priceRange=0%2C10000000000&status=&category=67b93e2d722783a60c163466&searchText="
        );
        const data3 = await res3.json();
        if (data3 && data3.status === 200 && Array.isArray(data3.data)) {
          setBags(data3.data);
        } else {
          setBags([]);
        }
      } catch (err) {
        console.error("Lỗi fetch API:", err);
        setDresses([]);
        setShoes([]);
        setBags([]);
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
      <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, theme === "dark" && styles.darkContainer]} showsVerticalScrollIndicator={false}>
      {/* Tiêu đề */}
      <Text style={[styles.title, theme === "dark" && styles.darkText]}>
        {language === "vi" ? "Chào mừng đến cửa hàng" : "Welcome to the store"}
      </Text>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={language === "vi" ? "Tìm kiếm sản phẩm..." : "Search products..."}
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Các nút điều hướng */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Pants")}>
        <Icon name="shopping-bag" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>
          {language === "vi" ? "XEM QUẦN" : "VIEW PANTS"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Shirts")}>
        <Icon name="tshirt" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>
          {language === "vi" ? "XEM ÁO" : "VIEW SHIRTS"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TopRated")}>
        <Icon name="star" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>
          {language === "vi" ? "SẢN PHẨM ĐÁNH GIÁ CAO" : "TOP RATED PRODUCTS"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cart")}>
        <Icon name="shopping-cart" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>
          {language === "vi" ? "GIỎ HÀNG" : "CART"}
        </Text>
      </TouchableOpacity>

      {/* Danh mục Đầm */}
      <TouchableOpacity 
        style={styles.categoryButton}
        onPress={() => navigation.navigate("DressScreen")}
      >
        <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
          {language === "vi" ? "Đầm" : "Dresses"}
        </Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productRow}>
        {dresses.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.productCard}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          >
            <Image
              source={{ uri: `http://10.0.2.2:3055${item.img}` }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <Text style={styles.productName} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh mục Giày */}
      <TouchableOpacity 
        style={styles.categoryButton}
        onPress={() => navigation.navigate("ShoesScreen")}
      >
        <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
          {language === "vi" ? "Giày" : "Shoes"}
        </Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productRow}>
        {shoes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.productCard}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          >
            <Image
              source={{ uri: `http://10.0.2.2:3055${item.img}` }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <Text style={styles.productName} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh mục Túi đeo */}
      <TouchableOpacity 
        style={styles.categoryButton}
        onPress={() => navigation.navigate("BagsScreen")}
      >
        <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
          {language === "vi" ? "Túi đeo" : "Bags"}
        </Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productRow}>
        {bags.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.productCard}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          >
            <Image
              source={{ uri: `http://10.0.2.2:3055${item.img}` }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <Text style={styles.productName} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
  },
  darkContainer: {
    backgroundColor: "#333",
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
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: "#6A5ACD",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6A5ACD",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 5,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  productRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  productCard: {
    width: 120,
    marginRight: 10,
    alignItems: "center",
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  productName: {
    fontSize: 13,
    textAlign: "center",
  },
});

export default HomeScreen;
