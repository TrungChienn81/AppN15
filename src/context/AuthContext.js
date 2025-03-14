import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("userToken");
                console.log("🔑 Token from storage:", storedToken);

                if (storedToken && storedToken !== "null" && storedToken !== "undefined") {
                    // Validate token format before setting
                    if (typeof storedToken === 'string' && storedToken.trim() !== '') {
                        setToken(storedToken);
                        setIsLoggedIn(true);
                        console.log("✅ User authenticated with stored token");
                    } else {
                        console.error("❌ Invalid token format in storage");
                        await AsyncStorage.removeItem("userToken");
                    }
                } else {
                    console.log("ℹ️ No token found, user not authenticated");
                }
            } catch (error) {
                console.error("❌ Error reading AsyncStorage:", error);
            }
        };

        initializeAuth();
    }, []);

    const login = async (newToken) => {
        if (!newToken || newToken === "null" || newToken === "undefined") {
            console.error("❌ Token is invalid, cannot store in AsyncStorage");
            return;
        }

        try {
            // Double-check the token structure
            const parts = newToken.split('.');
            if (parts.length !== 3) {
                console.error("❌ Token format is invalid (not a proper JWT)");
                return;
            }

            await AsyncStorage.setItem("userToken", newToken);
            console.log("✅ Token saved successfully!");
            setToken(newToken);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("❌ AsyncStorage error during login:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userToken");
            console.log("🚪 Logged out, token removed!");
            setToken(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("❌ AsyncStorage error during logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
