import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSettings } from "../context/SettingsContext";

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const { language, theme } = useSettings();

  const handleSearch = () => {
    if (query.trim()) {
      console.log(`Navigating to SearchScreen with query: ${query}`);
      navigation.navigate("Search", { query });
    }
  };

  return (
    <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
      <Text style={[styles.title, theme === "dark" && styles.darkText]}>
        {language === "vi" ? "Chào mừng đến cửa hàng" : "Welcome to the store"}
      </Text>
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
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Pants")}>
        <Icon name="shopping-bag" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>{language === "vi" ? "XEM QUẦN" : "VIEW PANTS"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Shirts")}>
        <Icon name="tshirt" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>{language === "vi" ? "XEM ÁO" : "VIEW SHIRTS"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TopRated")}>
        <Icon name="star" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>{language === "vi" ? "SẢN PHẨM ĐÁNH GIÁ CAO" : "TOP RATED PRODUCTS"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cart")}>
        <Icon name="shopping-cart" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>{language === "vi" ? "GIỎ HÀNG" : "CART"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
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
    marginVertical: 10,
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
};

export default HomeScreen;
