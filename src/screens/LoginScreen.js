import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome5";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            console.log("✅ User logged in, navigating to MainTabs...");
            navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }]
            });
        }
    }, [isLoggedIn, navigation]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Login Failed", "Email and password are required.");
            return;
        }
        try {
            console.log("📩 Sending login request...");
            console.log("👉 Email:", email);
            console.log("👉 Password:", password);

            const response = await axios.post("http://10.0.2.2:3055/v1/api/login", { email, password });

            console.log("✅ API Response:", response.data); // Check API response
            console.log("✅ Full API Response:", JSON.stringify(response.data, null, 2));

            const token = response.data.data.tokens.accessToken; // Get token from data

            if (!token) {
                console.error("❌ Token not found in response:", response.data);
                Alert.alert("Login Failed", "Token not found in response.");
                return;
            }

            await login(token);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Login error response:", error.response.data);
                Alert.alert("Login Failed", error.response.data.message || "Invalid email or password.");
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Login error request:", error.request);
                Alert.alert("Login Failed", "No response from server. Please try again later.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Login error message:", error.message);
                Alert.alert("Login Failed", "An error occurred. Please try again.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#333" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Register")}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
    },
    toggleButton: {
        padding: 10,
    },
    button: {
        backgroundColor: "#6A5ACD",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    link: {
        alignItems: "center",
    },
    linkText: {
        color: "#6A5ACD",
        fontSize: 14,
    },
});

export default LoginScreen;
