import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Button, List, Divider, Switch } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import Icon from "react-native-vector-icons/FontAwesome5";

const UserProfileScreen = ({ navigation }) => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useSettings();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        logout();
        navigation.navigate("Login");
    };

    return (
        <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
            {/* Avatar + Thông tin cơ bản */}
            <View style={styles.profileHeader}>
                <Image
                    source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                    style={styles.avatar}
                />
                <Text style={[styles.name, theme === "dark" && styles.darkText]}>Nguyễn Văn A</Text>
                <Text style={[styles.email, theme === "dark" && styles.darkText]}>nguyenvana@example.com</Text>
            </View>

            {/* Danh sách thông tin */}
            <View style={styles.infoContainer}>
                <List.Item title="Số điện thoại" description="+84 123 456 789" left={() => <List.Icon icon="phone" />} />
                <Divider />
                <List.Item title="Ngày sinh" description="01/01/2000" left={() => <List.Icon icon="calendar" />} />
                <Divider />
                <List.Item title="Đổi mật khẩu" left={() => <List.Icon icon="lock" />} onPress={() => navigation.navigate("ChangePassword")} />
                <Divider />
                <List.Item title="Lịch sử đơn hàng" left={() => <List.Icon icon="history" />} onPress={() => navigation.navigate("OrderHistory")} />
                <Divider />
                <List.Item
                    title="Thông báo"
                    left={() => <List.Icon icon="bell" />}
                    right={() => (
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        />
                    )}
                />
                <Divider />
                <List.Item
                    title="Chế độ tối"
                    left={() => <List.Icon icon="theme-light-dark" />}
                    right={() => (
                        <Switch
                            value={theme === "dark"}
                            onValueChange={toggleTheme}
                        />
                    )}
                />
            </View>

            {/* Nút Logout */}
            <Button mode="contained" style={styles.logoutButton} onPress={handleLogout}>
                Đăng xuất
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    darkContainer: { backgroundColor: "#333" },
    profileHeader: { alignItems: "center", marginBottom: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    name: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
    email: { fontSize: 14, color: "gray" },
    darkText: { color: "#fff" },
    infoContainer: { backgroundColor: "#f9f9f9", borderRadius: 10, paddingVertical: 10 },
    logoutButton: { marginTop: 20, backgroundColor: "#ff4d4d" },
});

export default UserProfileScreen;
