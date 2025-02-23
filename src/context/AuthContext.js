import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            // Clear AsyncStorage for a clean state
            await AsyncStorage.clear();
            const token = await AsyncStorage.getItem("userToken");
            if (token) {
                setIsLoggedIn(true);
            }
        };
        initializeAuth();
    }, []);

    const login = async (token) => {
        await AsyncStorage.setItem("userToken", token);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
