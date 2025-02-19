import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import CountryFlag from "react-native-country-flag"; // Ensure this package is installed

const UserScreen = ({ navigation }) => {
    const { language, theme, toggleTheme, changeLanguage } = useSettings();
    const { logout } = useAuth();

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
            <TouchableOpacity style={styles.button} onPress={() => changeLanguage(language === "vi" ? "en" : "vi")}>
                <CountryFlag isoCode={getLanguageFlag()} size={20} style={styles.icon} />
                <Text style={styles.buttonText}>{language === "vi" ? "Tiếng Việt" : "English"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleTheme}>
                <Icon name={getThemeIcon()} size={20} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>{theme === "light" ? "Light Mode" : "Dark Mode"}</Text>
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
