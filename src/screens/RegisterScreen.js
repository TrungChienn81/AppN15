import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/;
        return regex.test(password);
    };

    const handleRegister = () => {
        if (!username || !email || !phone || !password || !confirmPassword) {
            Alert.alert("Registration Failed", "All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Registration Failed", "Passwords do not match.");
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert("Registration Failed", "Password must be at least 6 characters long, contain an uppercase letter and a special character.");
            return;
        }

        console.log("Attempting to register with:", { username, email, phone, password });
        fetch("http://10.0.2.2:3055/v1/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, phone, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Register API response:", data);
                if (data.status === 200) {
                    Alert.alert("Registration Successful", "You have successfully registered.");
                    navigation.navigate("Login");
                } else {
                    Alert.alert("Registration Failed", data.message);
                }
            })
            .catch((error) => {
                console.error("Error registering:", error);
                Alert.alert("Registration Failed", "An error occurred. Please try again.");
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Icon name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#333" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Back to Login</Text>
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

export default RegisterScreen;
