import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate("MainTabs");
        }
    }, [isLoggedIn, navigation]);

    const handleLogin = async () => {
        // Giả lập quá trình đăng nhập thành công
        const token = "dummy-token";
        await login(token); // Chờ cập nhật trạng thái isLoggedIn

        // Đợi React Navigation cập nhật trước khi navigate
        setTimeout(() => {
            navigation.navigate("MainTabs");
        }, 100);
    };


    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>
            <TextInput
                style={{ height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={{ height: 40, borderColor: "#ccc", borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => navigation.navigate("Register")} />
        </View>
    );
};

export default LoginScreen;
