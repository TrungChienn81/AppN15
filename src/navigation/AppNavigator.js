import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import PantsScreen from "../screens/PantsScreen";
import ShirtsScreen from "../screens/ShirtsScreen";
import CartScreen from "../screens/CartScreen";
import UserScreen from "../screens/UserScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LogoutScreen from "../screens/LogoutScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import TopRatedScreen from "../screens/TopRatedScreen";

// Import additional category screens
import DressScreen from "../screens/DressScreen";
import ShoesScreen from "../screens/ShoesScreen";
import BagsScreen from "../screens/BagsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { language } = useSettings();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name={language === "vi" ? "Trang chủ" : "Home"}
        component={HomeScreen}
        options={{
          tabBarLabel: language === "vi" ? "Trang chủ" : "Home",
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={language === "vi" ? "Quần" : "Pants"}
        component={PantsScreen}
        options={{
          tabBarLabel: language === "vi" ? "Quần" : "Pants",
          tabBarIcon: ({ color, size }) => <Icon name="shopping-bag" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={language === "vi" ? "Áo" : "Shirts"}
        component={ShirtsScreen}
        options={{
          tabBarLabel: language === "vi" ? "Áo" : "Shirts",
          tabBarIcon: ({ color, size }) => <Icon name="tshirt" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={language === "vi" ? "Giỏ hàng" : "Cart"}
        component={CartScreen}
        options={{
          tabBarLabel: language === "vi" ? "Giỏ hàng" : "Cart",
          tabBarIcon: ({ color, size }) => <Icon name="shopping-cart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={language === "vi" ? "Người dùng" : "User"}
        component={UserScreen}
        options={{
          tabBarLabel: language === "vi" ? "Người dùng" : "User",
          tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="Pants" component={PantsScreen} />
              <Stack.Screen name="Shirts" component={ShirtsScreen} />
              <Stack.Screen name="DressScreen" component={DressScreen} />
              <Stack.Screen name="ShoesScreen" component={ShoesScreen} />
              <Stack.Screen name="BagsScreen" component={BagsScreen} />
              <Stack.Screen name="TopRated" component={TopRatedScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Logout" component={LogoutScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;
