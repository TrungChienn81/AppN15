import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useAuth } from "../context/AuthContext";

const ChangePasswordScreen = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const { token } = useAuth();

    const validatePassword = (password) => {
        // Kiểm tra không có khoảng trắng
        if (password.includes(" ")) {
            return false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert("Change Password Failed", "All fields are required.");
            return;
        }

        if (newPassword === currentPassword) {
            Alert.alert("Change Password Failed", "New password cannot be the same as the current password.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert("Change Password Failed", "New passwords do not match.");
            return;
        }

        if (!validatePassword(newPassword)) {
            Alert.alert("Change Password Failed", "New password must be at least 6 characters long, contain no spaces, start with an uppercase letter, and include a special character.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3055/v1/api/reset-password", {
                currentPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                Alert.alert("Change Password Successful", "Your password has been changed.");
                navigation.navigate("UserProfile");
            } else {
                Alert.alert("Change Password Failed", response.data.message || "Failed to change password.");
            }
        } catch (error) {
            console.error("Change password error:", error);
            if (error.response && error.response.data) {
                Alert.alert("Change Password Failed", error.response.data.message || "An error occurred. Please try again.");
            } else {
                Alert.alert("Change Password Failed", "An error occurred. Please try again.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                    <Icon name={showCurrentPassword ? "eye-slash" : "eye"} size={20} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                >
                    <Icon name={showNewPassword ? "eye-slash" : "eye"} size={20} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry={!showConfirmNewPassword}
                />
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                >
                    <Icon name={showConfirmNewPassword ? "eye-slash" : "eye"} size={20} color="#333" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
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
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 20,
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
});

export default ChangePasswordScreen;
