import React from "react";
import { View, Text, FlatList, Button, StyleSheet, Image } from "react-native";
import { useCart } from "../context/CartContext";

const CartScreen = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => `${item._id}_${index}`}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: `http://10.0.2.2:3055${item.img}` }} style={styles.image} />
                        <View style={styles.infoContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.price}>{item.price?.toLocaleString()} đ</Text>
                            <Button title="Remove" onPress={() => removeFromCart(item._id)} />
                        </View>
                    </View>
                )}
            />
            <Button title="Clear Cart" onPress={clearCart} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    cartItem: {
        flexDirection: "row",
        marginVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    price: {
        fontSize: 14,
        color: "green",
        marginVertical: 5,
    },
});

export default CartScreen;
