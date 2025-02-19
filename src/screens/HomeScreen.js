import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến cửa hàng</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Pants")}>
        <Icon name="shopping-bag" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>XEM QUẦN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Shirts")}>
        <Icon name="tshirt" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>XEM ÁO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TopRated")}>
        <Icon name="star" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>SẢN PHẨM ĐÁNH GIÁ CAO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cart")}>
        <Icon name="shopping-cart" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>GIỎ HÀNG</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
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
