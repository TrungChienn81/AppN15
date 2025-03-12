import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                console.log("🔑 Token from storage:", token);

                if (token) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("❌ Error reading AsyncStorage:", error);
            }
        };

        initializeAuth();
    }, []);

    const login = async (token) => {
        if (!token) {
            console.error("❌ Token is undefined, cannot store in AsyncStorage");
            return;
        }

        try {
            await AsyncStorage.setItem("userToken", token);
            console.log("✅ Token saved successfully!");
            setIsLoggedIn(true);
        } catch (error) {
            console.error("❌ AsyncStorage error during login:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userToken");
            console.log("🚪 Logged out, token removed!");
            setIsLoggedIn(false);
        } catch (error) {
            console.error("❌ AsyncStorage error during logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
