import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";

const CartScreen = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => `${item._id}_${index}`}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
                        <Text>{item.title}</Text>
                        <Text>{item.price?.toLocaleString()} đ</Text>
                        <Button title="Remove" onPress={() => removeFromCart(item._id)} />
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
});

export default CartScreen;
