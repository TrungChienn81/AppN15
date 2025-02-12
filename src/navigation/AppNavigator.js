// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import các màn hình
import HomeScreen from "../screens/HomeScreen";
import PantsScreen from "../screens/PantsScreen";
import ShirtsScreen from "../screens/ShirtsScreen";
import TopRatedScreen from "../screens/TopRatedScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Pants" component={PantsScreen} />
        <Stack.Screen name="Shirts" component={ShirtsScreen} />
        <Stack.Screen name="TopRated" component={TopRatedScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
