import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        console.log("Attempting to register with:", { email, password });
        fetch("http://10.0.2.2:3055/v1/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
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
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Register</Text>
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
            <Button title="Register" onPress={handleRegister} />
            <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
        </View>
    );
};

export default RegisterScreen;
