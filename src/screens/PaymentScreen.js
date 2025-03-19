import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator
} from "react-native";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Animatable from 'react-native-animatable';

const PaymentScreen = ({ navigation, route }) => {
    const { cartItems, clearCart } = useCart();
    const { language, theme } = useSettings();
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        note: "",
        paymentMethod: "cod" // Default to COD
    });

    // Get totalAmount from route params or calculate from cartItems
    const totalAmount = route.params?.totalAmount ||
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Get cartItems from route params or from context
    const orderItems = route.params?.cartItems || cartItems;

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handlePaymentMethodChange = (method) => {
        setFormData({
            ...formData,
            paymentMethod: method
        });
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            Alert.alert(
                language === "vi" ? "Lỗi" : "Error",
                language === "vi" ? "Vui lòng nhập họ tên" : "Please enter your full name"
            );
            return false;
        }
        if (!formData.phone.trim()) {
            Alert.alert(
                language === "vi" ? "Lỗi" : "Error",
                language === "vi" ? "Vui lòng nhập số điện thoại" : "Please enter your phone number"
            );
            return false;
        }
        if (!formData.address.trim()) {
            Alert.alert(
                language === "vi" ? "Lỗi" : "Error",
                language === "vi" ? "Vui lòng nhập địa chỉ" : "Please enter your address"
            );
            return false;
        }
        if (!formData.city.trim()) {
            Alert.alert(
                language === "vi" ? "Lỗi" : "Error",
                language === "vi" ? "Vui lòng nhập thành phố" : "Please enter your city"
            );
            return false;
        }
        return true;
    };

    const handlePlaceOrder = () => {
        if (!validateForm()) return;

        setLoading(true);

        // Simulate API call for order placement
        setTimeout(() => {
            setLoading(false);

            Alert.alert(
                language === "vi" ? "Đặt hàng thành công" : "Order Placed Successfully",
                language === "vi"
                    ? "Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đang được xử lý."
                    : "Thank you for your order! Your order is being processed.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            clearCart(); // Clear the cart after successful order
                            navigation.navigate("OrderConfirmation", {
                                orderDetails: {
                                    ...formData,
                                    totalAmount,
                                    items: orderItems,
                                    orderNumber: `ORD-${Math.floor(Math.random() * 900000) + 100000}`,
                                    orderDate: new Date().toISOString()
                                }
                            });
                        }
                    }
                ]
            );
        }, 2000);
    };

    return (
        <SafeAreaView style={[
            styles.container,
            theme === "dark" && styles.darkContainer
        ]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Animatable.View animation="fadeIn" duration={300}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-left" size={20} color={theme === "dark" ? "#FFFFFF" : "#000000"} />
                        </TouchableOpacity>
                        <Text style={[
                            styles.headerTitle,
                            theme === "dark" && styles.darkText
                        ]}>
                            {language === "vi" ? "Thanh toán" : "Checkout"}
                        </Text>
                        <View style={styles.placeholder}></View>
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={300} style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
                        {language === "vi" ? "Thông tin giao hàng" : "Delivery Information"}
                    </Text>

                    <View style={[styles.inputContainer, theme === "dark" && styles.darkInputContainer]}>
                        <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Họ và tên" : "Full Name"}*
                        </Text>
                        <TextInput
                            style={[styles.input, theme === "dark" && styles.darkInput]}
                            placeholder={language === "vi" ? "Nhập họ tên" : "Enter your full name"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            value={formData.fullName}
                            onChangeText={(text) => handleInputChange("fullName", text)}
                        />
                    </View>

                    <View style={[styles.inputContainer, theme === "dark" && styles.darkInputContainer]}>
                        <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Số điện thoại" : "Phone Number"}*
                        </Text>
                        <TextInput
                            style={[styles.input, theme === "dark" && styles.darkInput]}
                            placeholder={language === "vi" ? "Nhập số điện thoại" : "Enter your phone number"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => handleInputChange("phone", text)}
                        />
                    </View>

                    <View style={[styles.inputContainer, theme === "dark" && styles.darkInputContainer]}>
                        <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Email" : "Email"}
                        </Text>
                        <TextInput
                            style={[styles.input, theme === "dark" && styles.darkInput]}
                            placeholder={language === "vi" ? "Nhập email" : "Enter your email"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange("email", text)}
                        />
                    </View>

                    <View style={[styles.inputContainer, theme === "dark" && styles.darkInputContainer]}>
                        <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Địa chỉ" : "Address"}*
                        </Text>
                        <TextInput
                            style={[styles.input, theme === "dark" && styles.darkInput]}
                            placeholder={language === "vi" ? "Nhập địa chỉ" : "Enter your address"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            value={formData.address}
                            onChangeText={(text) => handleInputChange("address", text)}
                        />
                    </View>

                    <View style={[styles.inputContainer, theme === "dark" && styles.darkInputContainer]}>
                        <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Thành phố" : "City"}*
                        </Text>
                        <TextInput
                            style={[styles.input, theme === "dark" && styles.darkInput]}
                            placeholder={language === "vi" ? "Nhập thành phố" : "Enter your city"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            value={formData.city}
                            onChangeText={(text) => handleInputChange("city", text)}
                        />
                    </View>

                    <View style={[styles.inputContainer, theme === "dark" && styles.darkInputContainer]}>
                        <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Ghi chú" : "Notes"}
                        </Text>
                        <TextInput
                            style={[styles.input, styles.textArea, theme === "dark" && styles.darkInput]}
                            placeholder={language === "vi" ? "Thông tin bổ sung cho đơn hàng" : "Additional information for your order"}
                            placeholderTextColor={theme === "dark" ? "#777" : "#999"}
                            multiline={true}
                            numberOfLines={4}
                            value={formData.note}
                            onChangeText={(text) => handleInputChange("note", text)}
                        />
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={400} style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
                        {language === "vi" ? "Phương thức thanh toán" : "Payment Method"}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            formData.paymentMethod === "cod" && styles.selectedPaymentOption,
                            theme === "dark" && styles.darkPaymentOption,
                            formData.paymentMethod === "cod" && theme === "dark" && styles.darkSelectedPaymentOption
                        ]}
                        onPress={() => handlePaymentMethodChange("cod")}
                    >
                        <Icon
                            name="money-bill-wave"
                            size={24}
                            color={formData.paymentMethod === "cod" ? "#FFFFFF" : (theme === "dark" ? "#8A7ADC" : "#6A5ACD")}
                        />
                        <View style={styles.paymentTextContainer}>
                            <Text style={[
                                styles.paymentMethodTitle,
                                formData.paymentMethod === "cod" && styles.selectedPaymentText,
                                theme === "dark" && styles.darkText,
                                formData.paymentMethod === "cod" && styles.selectedPaymentText
                            ]}>
                                {language === "vi" ? "Thanh toán khi nhận hàng" : "Cash on Delivery"}
                            </Text>
                            <Text style={[
                                styles.paymentMethodDescription,
                                formData.paymentMethod === "cod" && styles.selectedPaymentText,
                                theme === "dark" && styles.darkSubText,
                                formData.paymentMethod === "cod" && styles.selectedPaymentText
                            ]}>
                                {language === "vi" ? "Trả tiền mặt khi nhận hàng" : "Pay with cash upon delivery"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            formData.paymentMethod === "card" && styles.selectedPaymentOption,
                            theme === "dark" && styles.darkPaymentOption,
                            formData.paymentMethod === "card" && theme === "dark" && styles.darkSelectedPaymentOption
                        ]}
                        onPress={() => handlePaymentMethodChange("card")}
                    >
                        <Icon
                            name="credit-card"
                            size={24}
                            color={formData.paymentMethod === "card" ? "#FFFFFF" : (theme === "dark" ? "#8A7ADC" : "#6A5ACD")}
                        />
                        <View style={styles.paymentTextContainer}>
                            <Text style={[
                                styles.paymentMethodTitle,
                                formData.paymentMethod === "card" && styles.selectedPaymentText,
                                theme === "dark" && styles.darkText,
                                formData.paymentMethod === "card" && styles.selectedPaymentText
                            ]}>
                                {language === "vi" ? "Thẻ tín dụng/Ghi nợ" : "Credit/Debit Card"}
                            </Text>
                            <Text style={[
                                styles.paymentMethodDescription,
                                formData.paymentMethod === "card" && styles.selectedPaymentText,
                                theme === "dark" && styles.darkSubText,
                                formData.paymentMethod === "card" && styles.selectedPaymentText
                            ]}>
                                {language === "vi" ? "Thanh toán an toàn với thẻ" : "Pay securely with your card"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            formData.paymentMethod === "bank" && styles.selectedPaymentOption,
                            theme === "dark" && styles.darkPaymentOption,
                            formData.paymentMethod === "bank" && theme === "dark" && styles.darkSelectedPaymentOption
                        ]}
                        onPress={() => handlePaymentMethodChange("bank")}
                    >
                        <Icon
                            name="university"
                            size={24}
                            color={formData.paymentMethod === "bank" ? "#FFFFFF" : (theme === "dark" ? "#8A7ADC" : "#6A5ACD")}
                        />
                        <View style={styles.paymentTextContainer}>
                            <Text style={[
                                styles.paymentMethodTitle,
                                formData.paymentMethod === "bank" && styles.selectedPaymentText,
                                theme === "dark" && styles.darkText,
                                formData.paymentMethod === "bank" && styles.selectedPaymentText
                            ]}>
                                {language === "vi" ? "Chuyển khoản ngân hàng" : "Bank Transfer"}
                            </Text>
                            <Text style={[
                                styles.paymentMethodDescription,
                                formData.paymentMethod === "bank" && styles.selectedPaymentText,
                                theme === "dark" && styles.darkSubText,
                                formData.paymentMethod === "bank" && styles.selectedPaymentText
                            ]}>
                                {language === "vi" ? "Chuyển khoản trực tiếp đến tài khoản của chúng tôi" : "Direct transfer to our bank account"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={500} style={styles.orderSummary}>
                    <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
                        {language === "vi" ? "Tổng thanh toán" : "Order Summary"}
                    </Text>

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryText, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Tổng tiền hàng" : "Subtotal"}
                        </Text>
                        <Text style={[styles.summaryValue, theme === "dark" && styles.darkText]}>
                            {totalAmount.toLocaleString()} đ
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryText, theme === "dark" && styles.darkSubText]}>
                            {language === "vi" ? "Phí vận chuyển" : "Shipping Fee"}
                        </Text>
                        <Text style={[styles.summaryValue, theme === "dark" && styles.darkText]}>
                            {language === "vi" ? "Miễn phí" : "Free"}
                        </Text>
                    </View>

                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={[styles.totalText, theme === "dark" && styles.darkText]}>
                            {language === "vi" ? "Tổng thanh toán" : "Total"}
                        </Text>
                        <Text style={styles.totalValue}>
                            {totalAmount.toLocaleString()} đ
                        </Text>
                    </View>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={600} style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.placeOrderButton, loading && styles.disabledButton]}
                        onPress={handlePlaceOrder}
                        disabled={loading}
                        activeOpacity={0.7}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.placeOrderButtonText}>
                                {language === "vi" ? "Đặt hàng" : "Place Order"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F7",
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000000",
    },
    placeholder: {
        width: 40,
    },
    sectionContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 16,
        marginHorizontal: 15,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    darkText: {
        color: "#FFFFFF",
    },
    darkSubText: {
        color: "#AAAAAA",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
        color: "#000000",
    },
    inputContainer: {
        marginBottom: 16,
    },
    darkInputContainer: {
        backgroundColor: "#2A2A2A",
        borderColor: "#444",
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        color: "#555555",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: "#FAFAFA",
        color: "#333333",
    },
    darkInput: {
        backgroundColor: "#333333",
        borderColor: "#555555",
        color: "#FFFFFF",
    },
    textArea: {
        height: 100,
        paddingTop: 12,
        textAlignVertical: "top",
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
    },
    darkPaymentOption: {
        backgroundColor: "#2A2A2A",
        borderColor: "#444444",
    },
    selectedPaymentOption: {
        borderColor: "#6A5ACD",
        backgroundColor: "#6A5ACD",
    },
    darkSelectedPaymentOption: {
        borderColor: "#8A7ADC",
        backgroundColor: "#8A7ADC",
    },
    paymentTextContainer: {
        marginLeft: 15,
    },
    paymentMethodTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333333",
    },
    paymentMethodDescription: {
        fontSize: 14,
        color: "#777777",
        marginTop: 2,
    },
    selectedPaymentText: {
        color: "#FFFFFF",
    },
    orderSummary: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 16,
        marginHorizontal: 15,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 15,
        color: "#666666",
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: "500",
        color: "#333333",
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
    totalText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333333",
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#6A5ACD",
    },
    buttonContainer: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    placeOrderButton: {
        backgroundColor: "#6A5ACD",
        height: 54,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#6A5ACD",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: "#9D99BC",
    },
    placeOrderButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "600",
    }
});

export default PaymentScreen;
