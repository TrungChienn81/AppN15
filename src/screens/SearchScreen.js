import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, Image, Button, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";

const SearchScreen = ({ route }) => {
    const { query } = route.params;
    const navigation = useNavigation();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(`Searching for: ${query}`);
        fetch(`http://10.0.2.2:3055/v1/api/search?query=${query}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Search API response:", data);
                if (data.status === 200) {
                    setProducts(data.data);
                } else {
                    console.error("Search API error:", data.message);
                }
            })
            .catch((error) => console.error("Error fetching search results:", error))
            .finally(() => setLoading(false));
    }, [query]);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    return (
        <FlatList
            data={products}
            keyExtractor={(item, index) => (item._id ? `${item._id}_${index}` : `${index}`)}
            numColumns={2}
            renderItem={({ item }) => (
                <View style={{ flex: 1, margin: 5, backgroundColor: "#fff", borderRadius: 8, padding: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                    <Image source={{ uri: `http://10.0.2.2:3055${item.img}` }} style={{ height: 150, borderRadius: 5 }} resizeMode="cover" />
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 5 }}>{item.title}</Text>
                    <Text style={{ fontSize: 14, color: "green", marginVertical: 5 }}>{item.price?.toLocaleString()} đ</Text>
                    <Button title="Xem chi tiết" color="#6200EE" onPress={() => navigation.navigate("ProductDetail", { product: item })} />
                    <Button title="Thêm vào giỏ" color="#6200EE" onPress={() => addToCart(item)} />
                </View>
            )}
        />
    );
};

export default SearchScreen;
