import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import CountryFlag from "react-native-country-flag"; // Ensure this package is installed
import axios from "axios";

const UserScreen = ({ navigation }) => {
    const { language, theme, toggleTheme, changeLanguage } = useSettings();
    const { logout, token } = useAuth();
    const [user, setUser] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token || token === "null" || token === "undefined") {
                console.warn("⚠️ No valid token found, redirecting to login...");
                navigation.navigate("Login");
                return;
            }

            console.log("🔑 Using token:", token);

            try {
                const response = await axios.get("http://10.0.2.2:3055/v1/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Ensure correct format
                    },
                });

                console.log("✅ User data:", response.data);
                setUser({
                    name: response.data.userName,
                    email: response.data.email,
                    phone: response.data.phone
                });

            } catch (error) {
                console.error("❌ Error fetching user data:", error);

                if (error.response?.status === 401) {
                    console.log("❌ Unauthorized, logging out...");
                    Alert.alert("Error", "Unauthorized access. Please log in again.");
                    logout();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Login" }]
                    });
                } else {
                    Alert.alert("Error", error.response?.data?.message || "An error occurred. Please try again.");
                }
            }
        };

        fetchUserData();
    }, [token, navigation]); // ✅ Add navigation dependency

    const getLanguageFlag = () => {
        return language === "vi" ? "VN" : "US";
    };

    const getThemeIcon = () => {
        return theme === "light" ? "sun" : "moon";
    };

    return (
        <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
            <Text style={[styles.title, theme === "dark" && styles.darkText]}>
                {language === "vi" ? "Cài đặt người dùng" : "User Settings"}
            </Text>
            <Text style={styles.label}>{language === "vi" ? "Tên: " : "Name: "}{user.name}</Text>
            <Text style={styles.label}>{language === "vi" ? "Email: " : "Email: "}{user.email}</Text>
            <Text style={styles.label}>{language === "vi" ? "Số điện thoại: " : "Phone: "}{user.phone}</Text>

            <TouchableOpacity style={styles.button} onPress={() => changeLanguage(language === "vi" ? "en" : "vi")}>
                <CountryFlag isoCode={getLanguageFlag()} size={20} style={styles.icon} />
                <Text style={styles.buttonText}>{language === "vi" ? "Tiếng Việt" : "English"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleTheme}>
                <Icon name={getThemeIcon()} size={20} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>{theme === "light" ? "Light Mode" : "Dark Mode"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ChangePassword")}>
                <Icon name="key" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>{language === "vi" ? "Đổi mật khẩu" : "Change Password"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={() => {
                logout();
                navigation.navigate("Login"); // Navigate to Login screen after logout
            }}>
                <Icon name="sign-out-alt" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>{language === "vi" ? "Đăng xuất" : "Logout"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        padding: 20,
    },
    darkContainer: {
        backgroundColor: "#333",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#333",
    },
    darkText: {
        color: "#fff",
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: "#333",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6A5ACD",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF6347",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default UserScreen;
