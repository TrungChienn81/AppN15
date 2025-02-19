import React from "react";
import { View, Text, Button } from "react-native";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";

const UserScreen = () => {
    const { language, theme, toggleTheme, changeLanguage } = useSettings();
    const { logout } = useAuth();

    return (
        <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
            <Text style={[styles.title, theme === "dark" && styles.darkText]}>
                {language === "vi" ? "Cài đặt người dùng" : "User Settings"}
            </Text>
            <Button title={language === "vi" ? "Đổi ngôn ngữ" : "Change Language"} onPress={() => changeLanguage(language === "vi" ? "en" : "vi")} />
            <Button title={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"} onPress={toggleTheme} />
            <Button title={language === "vi" ? "Đăng xuất" : "Logout"} onPress={logout} />
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
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
};

export default UserScreen;
