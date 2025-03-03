import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, ActivityIndicator, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";

const SearchScreen = ({ route }) => {
    const { query } = route.params || {};
    const navigation = useNavigation();
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const page = 1;
    const limit = 10;

    useEffect(() => {
        if (!query) return;

        const searchUrl = `http://10.0.2.2:3055/v1/api/product?page=${page}&limit=${limit}&searchText=${query}`;
        console.log("Fetching:", searchUrl);

        fetch(searchUrl)
            .then((res) => res.json())
            .then((data) => {
                console.log("API response:", data);

                if (data.status === 200 && data.data && Array.isArray(data.data.data)) {
                    setProducts(data.data.data);
                } else {
                    console.error("API returned unexpected format", data);
                }
            })
            .catch((error) => {
                console.error("Error fetching search results:", error);
            })
            .finally(() => setLoading(false));
    }, [query]);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            {products.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>Không tìm thấy sản phẩm nào</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flex: 1,
                                margin: 5,
                                backgroundColor: "#fff",
                                borderRadius: 8,
                                padding: 10,
                                shadowColor: "#000",
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Image
                                source={{ uri: `http://10.0.2.2:3055${item.img}` }}
                                style={{ height: 150, borderRadius: 5 }}
                                resizeMode="cover"
                            />
                            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 5 }}>
                                {item.title}
                            </Text>
                            <Text style={{ fontSize: 14, color: "green", marginVertical: 5 }}>
                                {item.price ? item.price.toLocaleString() : "0"} đ
                            </Text>
                            <Button
                                title="Xem chi tiết"
                                onPress={() => navigation.navigate("ProductDetail", { product: item })}
                            />
                            <Button
                                title="Thêm vào giỏ"
                                onPress={() => addToCart(item)}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default SearchScreen;
