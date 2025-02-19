import React from "react";
import { View, Text, Button } from "react-native";
import { useSettings } from "../context/SettingsContext";

const OtherScreen = () => {
    const { language, theme } = useSettings();

    return (
        <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
            <Text style={[styles.text, theme === "dark" && styles.darkText]}>
                {language === "vi" ? "Nội dung khác" : "Other Content"}
            </Text>
        </View>
    );
};

const styles = {
    container: {
        // ...existing code...
    },
    darkContainer: {
        backgroundColor: "#333",
    },
    text: {
        // ...existing code...
    },
    darkText: {
        color: "#fff",
    },
    // ...existing code...
};

export default OtherScreen;
