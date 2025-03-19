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

// Bỏ comment các import
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: language === "vi" ? "Trang chủ" : "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: language === "vi" ? "Tìm kiếm" : "Search",
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: language === "vi" ? "Giỏ hàng" : "Cart",
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarLabel: language === "vi" ? "Người dùng" : "User",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();
  const { language } = useSettings();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Chi tiết sản phẩm" : "Product Detail",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
            <Stack.Screen 
              name="TopRated" 
              component={TopRatedScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Sản phẩm nổi bật" : "Top Rated",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
            <Stack.Screen 
              name="Logout" 
              component={LogoutScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Đăng xuất" : "Logout",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
            
            {/* Giữ nguyên các màn hình Pants và Shirts */}
            <Stack.Screen 
              name="Pants" 
              component={PantsScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Quần" : "Pants",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
            <Stack.Screen 
              name="Shirts" 
              component={ShirtsScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Áo" : "Shirts",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
            
            {/* Sửa tên màn hình để khớp với HomeScreen.js */}
            <Stack.Screen 
              name="ShoesScreen" 
              component={ShoesScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Giày" : "Shoes",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
            <Stack.Screen 
              name="BagsScreen" 
              component={BagsScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Túi" : "Bags",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
            <Stack.Screen 
              name="DressScreen" 
              component={DressScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Váy" : "Dress",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ 
                headerShown: false 
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ 
                headerShown: true,
                title: language === "vi" ? "Đăng ký" : "Register",
                headerBackTitle: language === "vi" ? "Quay lại" : "Back"
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <SettingsProvider>
      <AppNavigator />
    </SettingsProvider>
  </AuthProvider>
);

export default App;
