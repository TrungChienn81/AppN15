import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    ActivityIndicator,
    ScrollView
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Animatable from 'react-native-animatable';
import { useSettings } from "../context/SettingsContext";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, isLoggedIn } = useAuth();
    const { language, theme } = useSettings();

    useEffect(() => {
        if (isLoggedIn) {
            console.log("✅ User logged in, navigating to Main...");
            navigation.reset({
                index: 0,
                routes: [{ name: "Main" }]
            });
        }
    }, [isLoggedIn, navigation]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(
                language === "vi" ? "Đăng nhập thất bại" : "Login Failed",
                language === "vi" ? "Vui lòng nhập email và mật khẩu." : "Email and password are required."
            );
            return;
        }

        setLoading(true);

        try {
            console.log("📩 Sending login request...");
            console.log("👉 Email:", email);
            console.log("👉 Password:", password);

            const response = await axios.post("http://10.0.2.2:3055/v1/api/login", { email, password });

            console.log("✅ API Response:", response.data);
            console.log("✅ Full API Response:", JSON.stringify(response.data, null, 2));

            const token = response.data.data.tokens.accessToken;

            if (!token) {
                console.error("❌ Token not found in response:", response.data);
                Alert.alert(
                    language === "vi" ? "Đăng nhập thất bại" : "Login Failed",
                    language === "vi" ? "Token không tìm thấy trong phản hồi." : "Token not found in response."
                );
                return;
            }

            await login(token);
        } catch (error) {
            if (error.response) {
                console.error("Login error response:", error.response.data);
                Alert.alert(
                    language === "vi" ? "Đăng nhập thất bại" : "Login Failed",
                    error.response.data.message || (language === "vi" ? "Email hoặc mật khẩu không hợp lệ." : "Invalid email or password.")
                );
            } else if (error.request) {
                console.error("Login error request:", error.request);
                Alert.alert(
                    language === "vi" ? "Đăng nhập thất bại" : "Login Failed",
                    language === "vi" ? "Không có phản hồi từ máy chủ. Vui lòng thử lại sau." : "No response from server. Please try again later."
                );
            } else {
                console.error("Login error message:", error.message);
                Alert.alert(
                    language === "vi" ? "Đăng nhập thất bại" : "Login Failed",
                    language === "vi" ? "Đã xảy ra lỗi. Vui lòng thử lại." : "An error occurred. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[
            styles.container,
            theme === "dark" && styles.darkContainer
        ]}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Animatable.View
                    animation="fadeIn"
                    duration={800}
                    style={styles.logoContainer}
                >
                    <Icon name="shopping-bag" size={60} color={theme === "dark" ? "#8A7ADC" : "#6A5ACD"} />
                    <Animatable.Text
                        animation="fadeIn"
                        delay={300}
                        style={[
                            styles.title,
                            theme === "dark" && styles.darkText
                        ]}
                    >
                        {language === "vi" ? "Đăng Nhập" : "Login"}
                    </Animatable.Text>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={800} delay={400}>
                    <View style={[
                        styles.inputContainer,
                        theme === "dark" && styles.darkInputContainer
                    ]}>
                        <Icon name="envelope" size={18} color={theme === "dark" ? "#8A7ADC" : "#6A5ACD"} style={styles.inputIcon} />
                        <TextInput
                            style={[
                                styles.input,
                                theme === "dark" && styles.darkInput
                            ]}
                            placeholder={language === "vi" ? "Email" : "Email"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" duration={800} delay={600}>
                    <View style={[
                        styles.passwordContainer,
                        theme === "dark" && styles.darkPasswordContainer
                    ]}>
                        <Icon name="lock" size={18} color={theme === "dark" ? "#8A7ADC" : "#6A5ACD"} style={styles.inputIcon} />
                        <TextInput
                            style={[
                                styles.passwordInput,
                                theme === "dark" && styles.darkInput
                            ]}
                            placeholder={language === "vi" ? "Mật khẩu" : "Password"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color={theme === "dark" ? "#aaa" : "#333"} />
                        </TouchableOpacity>
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeIn" delay={700} style={styles.forgotPasswordContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                        <Text style={[
                            styles.forgotPasswordText,
                            theme === "dark" && { color: "#8A7ADC" }
                        ]}>
                            {language === "vi" ? "Quên mật khẩu?" : "Forgot password?"}
                        </Text>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={800}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            loading && styles.buttonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {language === "vi" ? "Đăng Nhập" : "Login"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View animation="fadeIn" delay={900} style={styles.registerContainer}>
                    <Text style={[styles.registerText, theme === "dark" && styles.darkSubText]}>
                        {language === "vi" ? "Chưa có tài khoản?" : "Don't have an account?"}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={[styles.registerLink, theme === "dark" && { color: "#8A7ADC" }]}>
                            {language === "vi" ? "Đăng ký" : "Register"}
                        </Text>
                    </TouchableOpacity>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 15,
        color: "#333",
    },
    darkText: {
        color: "#FFFFFF",
    },
    darkSubText: {
        color: "#AAAAAA",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: "#fff",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    darkInputContainer: {
        backgroundColor: "#2A2A2A",
        borderColor: "#444",
    },
    inputIcon: {
        marginLeft: 15,
    },
    input: {
        flex: 1,
        height: 55,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#333",
    },
    darkInput: {
        color: "#FFFFFF",
        backgroundColor: "transparent",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: "#fff",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    darkPasswordContainer: {
        backgroundColor: "#2A2A2A",
        borderColor: "#444",
    },
    passwordInput: {
        flex: 1,
        height: 55,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    toggleButton: {
        padding: 15,
    },
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: "#6A5ACD",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#6A5ACD",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#6A5ACD",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: "#9D99BC",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    registerText: {
        fontSize: 14,
        color: "#666",
    },
    registerLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#6A5ACD",
        marginLeft: 5,
    },
});

export default LoginScreen;
