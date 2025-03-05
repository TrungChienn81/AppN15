import React, { useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { useCart } from "../context/CartContext";

const CartScreen = ({ navigation }) => {
    const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    const handleCheckout = () => {
        // Add your checkout logic here
        Alert.alert("Checkout", "Proceeding to checkout...");
    };

    const applyPromoCode = () => {
        // Add your promo code logic here
        if (promoCode === "DISCOUNT10") {
            setDiscount(0.1); // 10% discount
            Alert.alert("Promo Code Applied", "You have received a 10% discount.");
        } else {
            Alert.alert("Invalid Promo Code", "The promo code you entered is not valid.");
        }
    };

    const calculateTotal = () => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return total - total * discount;
    };

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <Button title="Continue Shopping" onPress={() => navigation.navigate("Home")} />
            </View>
        );
    }

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
                            <Text style={styles.details}>Color: {item.color}, Size: {item.size}</Text>
                            <Text style={styles.price}>{item.price?.toLocaleString()} đ</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity - 1)}>
                                    <Text style={styles.quantityButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity + 1)}>
                                    <Text style={styles.quantityButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Button title="Remove" onPress={() => removeFromCart(item._id)} />
                        </View>
                    </View>
                )}
            />
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Order Summary</Text>
                <Text style={styles.summaryItem}>Subtotal: {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} đ</Text>
                <Text style={styles.summaryItem}>Shipping: 0 đ</Text>
                <View style={styles.promoContainer}>
                    <TextInput
                        style={styles.promoInput}
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChangeText={setPromoCode}
                    />
                    <Button title="Apply" onPress={applyPromoCode} />
                </View>
                <Text style={styles.summaryItem}>Discount: {discount * 100}%</Text>
                <Text style={styles.total}>Total: {calculateTotal().toLocaleString()} đ</Text>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        marginBottom: 20,
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
    details: {
        fontSize: 14,
        color: "gray",
        marginVertical: 5,
    },
    price: {
        fontSize: 14,
        color: "green",
        marginVertical: 5,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    quantityButton: {
        fontSize: 20,
        paddingHorizontal: 10,
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    summaryContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    summaryItem: {
        fontSize: 16,
        marginVertical: 5,
    },
    promoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    promoInput: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    total: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    checkoutButton: {
        backgroundColor: "#6A5ACD",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    checkoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CartScreen;
