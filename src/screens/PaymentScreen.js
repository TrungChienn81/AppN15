import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking
} from "react-native";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import { WebView } from 'react-native-webview';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm phân tích query params từ URL (thay thế URLSearchParams)
const parseQueryParams = (url) => {
  try {
    const queryString = url.split('?')[1];
    if (!queryString) return {};
    
    const params = {};
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value || '');
    });
    
    return params;
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    return {};
  }
};

// Component WebView để hiển thị trang thanh toán
const PaymentWebView = ({ paymentUrl, onNavigationStateChange, onClose, language }) => {
  return (
    <SafeAreaView style={styles.webViewContainer}>
      <View style={styles.webViewHeader}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.webViewHeaderTitle}>
          {language === "vi" ? "Thanh toán VNPAY" : "VNPAY Payment"}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <WebView 
        source={{ uri: paymentUrl }}
        style={styles.webView}
        onNavigationStateChange={onNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6A5ACD" />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const PaymentScreen = ({ navigation, route }) => {
  const { cartItems, clearCart } = useCart();
  const { language, theme } = useSettings();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [directPaymentMode, setDirectPaymentMode] = useState(false);
  const [accessToken, setAccessToken] = useState(token);

  // Lấy token từ AsyncStorage khi component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        if (storedToken) {
          setAccessToken(storedToken);
          console.log("Loaded token from storage");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    getToken();
  }, []);

  // Form state - LOẠI BỎ TRƯỜNG CITY theo yêu cầu
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: ""
  });

  // Cấu hình VNPAY
  const VNP_TMNCODE = 'MHANHND2';
  const VNP_HASHSECRET = 'HUSXH1330A8TUE57O1UAS2Q5KBJYL1GD';
  const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const VNP_RETURN_URL = 'http://localhost:5173/vnpay_return';

  // Tính tổng tiền
  const totalAmount = route.params?.totalAmount ||
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Lấy danh sách sản phẩm
  const orderItems = route.params?.cartItems || cartItems;

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
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

    return true;
  };

  // Hàm sắp xếp tham số VNPAY - giữ nguyên từ file gốc
  const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (let key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  };

  // Tạo URL thanh toán trực tiếp - với định dạng mã đơn MongoDB
  const createDirectPaymentUrl = () => {
    const amount = Math.round(totalAmount * 100);
    const date = new Date();
    const createDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
    
    // Sử dụng định dạng tương tự với MongoDB ObjectId
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0');
    const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    const orderId = timestamp + machineId + processId + counter;
    
    // Tạo đối tượng tham số VNPAY
    let vnpParams = {};
    vnpParams['vnp_Version'] = '2.1.0';
    vnpParams['vnp_Command'] = 'pay';
    vnpParams['vnp_TmnCode'] = VNP_TMNCODE;
    vnpParams['vnp_Locale'] = 'vn';
    vnpParams['vnp_CurrCode'] = 'VND';
    vnpParams['vnp_TxnRef'] = orderId;
    vnpParams['vnp_OrderInfo'] = `Thanh toan don hang ${orderId}`;
    vnpParams['vnp_OrderType'] = 'other';
    vnpParams['vnp_Amount'] = amount;
    vnpParams['vnp_ReturnUrl'] = VNP_RETURN_URL;
    vnpParams['vnp_IpAddr'] = '127.0.0.1';
    vnpParams['vnp_CreateDate'] = createDate;
    
    // Sắp xếp tham số theo thứ tự
    vnpParams = sortObject(vnpParams);
    
    // Tạo chuỗi querystring
    let queryString = '';
    let i = 0;
    for (const key in vnpParams) {
      if (i === 0) {
        queryString = `${key}=${vnpParams[key]}`;
      } else {
        queryString += `&${key}=${vnpParams[key]}`;
      }
      i++;
    }
    
    // Tạo chữ ký
    let hmac = CryptoJS.HmacSHA512(queryString, VNP_HASHSECRET);
    let secureHash = hmac.toString(CryptoJS.enc.Hex);
    
    // Thêm chữ ký vào querystring
    return `${VNP_URL}?${queryString}&vnp_SecureHash=${secureHash}`;
  };

  // Tạo đơn hàng trong hệ thống - ĐÃ SỬA THEO ĐÚNG ĐỊNH DẠNG API BACKEND
  const createOrderAfterPayment = async (vnpResponseData) => {
    try {
      if (!accessToken) {
        console.error("No token available");
        Alert.alert(
          language === "vi" ? "Cần đăng nhập" : "Login Required",
          language === "vi" ? "Vui lòng đăng nhập để hoàn tất đơn hàng" : "Please login to complete your order"
        );
        return null;
      }
      
      // Tạo payload theo đúng cấu trúc trong order.service.js
      const orderPayload = {
        recipientName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: "vnpay",
        totalAmount: parseInt(vnpResponseData.vnp_Amount) / 100 || totalAmount,
        // Định dạng cart đúng theo order.service.js
        cart: orderItems.map(item => ({
          product: item.id,      // ID của sản phẩm
          quantity: item.quantity,
          price: item.price,
          size: item.size || "M"  // Mặc định size nếu không có
        }))
      };

      console.log("Creating order with payload:", JSON.stringify(orderPayload));
      console.log("Using token:", accessToken);

      // Gọi API tạo đơn hàng
      const response = await fetch("http://10.0.2.2:3055/v1/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(orderPayload)
      });

      // Log chi tiết response để debug
      const responseText = await response.text();
      console.log(`Server response (${response.status}):`, responseText);

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing response JSON:", e);
        data = { success: true };
      }
      
      console.log("Order created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Nếu đã chọn thanh toán trực tiếp
    if (directPaymentMode) {
      const directUrl = createDirectPaymentUrl();
      setPaymentUrl(directUrl);
      setShowWebView(true);
      setLoading(false);
      return;
    }
    
    // Chuẩn bị dữ liệu để gửi lên server - ĐÃ SỬA LOẠI BỎ CITY
    const payload = {
      recipientName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      totalAmount,
      orderItems: orderItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };
    
    // Gọi API payment
    fetch("http://10.0.2.2:3055/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken || token || ""}`
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (Status: ${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      setLoading(false);
      console.log("Payment API response:", data);
      
      if (data && data.data) {
        console.log("Payment URL:", data.data);
        setPaymentUrl(data.data);
        setShowWebView(true);
      } else {
        Alert.alert(
          language === "vi" ? "Lỗi" : "Error",
          language === "vi" ? "Không thể tạo URL thanh toán" : "Cannot create payment URL"
        );
      }
    })
    .catch(error => {
      setLoading(false);
      console.error("Error:", error);
      
      // Hiện hộp thoại hỏi người dùng có muốn thử phương thức thanh toán trực tiếp không
      Alert.alert(
        language === "vi" ? "Lỗi kết nối" : "Connection Error",
        language === "vi" 
          ? "Không thể kết nối đến server. Bạn có muốn thử phương thức thanh toán trực tiếp không?" 
          : "Cannot connect to server. Would you like to try direct payment method?",
        [
          {
            text: language === "vi" ? "Hủy" : "Cancel",
            style: "cancel"
          },
          {
            text: language === "vi" ? "Đồng ý" : "Yes",
            onPress: () => {
              setDirectPaymentMode(true);
              const directUrl = createDirectPaymentUrl();
              setPaymentUrl(directUrl);
              setShowWebView(true);
            }
          }
        ]
      );
    });
  };

  // Xử lý kết quả thanh toán từ VNPAY
  const handleWebViewNavigationStateChange = (navState) => {
    console.log("Current URL:", navState.url);
    
    // Xử lý URLs có thể mở ứng dụng khác (như app ngân hàng)
    if (navState.url.startsWith('viba:') || 
        navState.url.startsWith('vcb:') || 
        navState.url.startsWith('vietin:') ||
        navState.url.startsWith('vietcom:') ||
        navState.url.startsWith('tpbank:') ||
        navState.url.startsWith('momo:')) {
      
      Linking.canOpenURL(navState.url).then(supported => {
        if (supported) {
          Linking.openURL(navState.url);
        } else {
          console.log("Không thể mở URL:", navState.url);
        }
      });
      return;
    }
    
    // Kiểm tra nếu URL chứa vnpay_return (URL callback)
    if (navState.url.includes("vnpay_return")) {
      // Xử lý kết quả thanh toán
      setShowWebView(false);
      
      // Parse thông tin từ URL response
      const params = parseQueryParams(navState.url);
      const vnpResponseCode = params['vnp_ResponseCode'];
      const vnpTxnRef = params['vnp_TxnRef']; // Mã đơn hàng từ VNPAY
      
      // Tạo đối tượng lưu thông tin VNPAY
      const vnpResponseData = {
        vnp_ResponseCode: vnpResponseCode,
        vnp_OrderInfo: params['vnp_OrderInfo'],
        vnp_TransactionNo: params['vnp_TransactionNo'],
        vnp_TxnRef: vnpTxnRef,
        vnp_Amount: params['vnp_Amount'],
        vnp_BankCode: params['vnp_BankCode'],
        vnp_PayDate: params['vnp_PayDate']
      };
      
      console.log("VNPAY Response:", vnpResponseData);
      
      // Kiểm tra kết quả thanh toán từ URL
      if (vnpResponseCode === '00') {
        // Thanh toán thành công - TẠO ĐƠN HÀNG TRONG HỆ THỐNG
        createOrderAfterPayment(vnpResponseData)
          .then((orderResult) => {
            // Xóa giỏ hàng
            clearCart();
            
            // Chuyển đến trang xác nhận đơn hàng
            navigation.navigate("OrderConfirmation", {
              orderDetails: {
                ...formData,
                totalAmount: parseInt(vnpResponseData.vnp_Amount) / 100 || totalAmount,
                items: orderItems,
                orderNumber: vnpTxnRef, // Sử dụng đúng mã đơn hàng từ VNPAY
                orderDate: new Date().toISOString(),
                paymentStatus: language === "vi" ? "Đã thanh toán" : "Paid",
                paymentMethod: "vnpay"
              }
            });
          })
          .catch(error => {
            console.error("Failed to process order after payment:", error);
            // Vẫn hiển thị màn hình xác nhận dù có lỗi
            navigation.navigate("OrderConfirmation", {
              orderDetails: {
                ...formData,
                totalAmount,
                items: orderItems,
                orderNumber: vnpTxnRef, // Vẫn dùng mã từ VNPAY
                orderDate: new Date().toISOString(),
                paymentStatus: language === "vi" ? "Đã thanh toán" : "Paid"
              }
            });
          });
      } else {
        // Thanh toán thất bại
        Alert.alert(
          language === "vi" ? "Thông báo" : "Notification",
          language === "vi" ? "Thanh toán không thành công hoặc bị hủy" : "Payment failed or cancelled"
        );
      }
    }
  };

  // Hiển thị WebView nếu có URL thanh toán
  if (showWebView && paymentUrl) {
    return (
      <PaymentWebView
        paymentUrl={paymentUrl}
        language={language}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onClose={() => setShowWebView(false)}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, theme === "dark" && styles.darkContainer]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={theme === "dark" ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, theme === "dark" && styles.darkText]}>
          {language === "vi" ? "Thanh toán" : "Checkout"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionContainer, theme === "dark" && styles.darkSectionContainer]}>
          <Text style={[styles.sectionTitle, theme === "dark" && styles.darkText]}>
            {language === "vi" ? "Thông tin giao hàng" : "Delivery Information"}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
              {language === "vi" ? "Họ và tên" : "Full Name"}*
            </Text>
            <TextInput
              style={[styles.input, theme === "dark" && styles.darkInput]}
              placeholder={language === "vi" ? "Nhập họ tên" : "Enter your name"}
              placeholderTextColor={theme === "dark" ? "#999999" : "#BBBBBB"}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange("fullName", text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
              {language === "vi" ? "Số điện thoại" : "Phone Number"}*
            </Text>
            <TextInput
              style={[styles.input, theme === "dark" && styles.darkInput]}
              placeholder={language === "vi" ? "Nhập số điện thoại" : "Enter phone number"}
              placeholderTextColor={theme === "dark" ? "#999999" : "#BBBBBB"}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
              {language === "vi" ? "Địa chỉ" : "Address"}*
            </Text>
            <TextInput
              style={[styles.input, theme === "dark" && styles.darkInput]}
              placeholder={language === "vi" ? "Nhập địa chỉ đầy đủ" : "Enter full address"}
              placeholderTextColor={theme === "dark" ? "#999999" : "#BBBBBB"}
              value={formData.address}
              onChangeText={(text) => handleInputChange("address", text)}
            />
          </View>

          {/* Thêm lựa chọn phương thức thanh toán */}
          <View style={styles.paymentMethodContainer}>
            <Text style={[styles.inputLabel, theme === "dark" && styles.darkSubText]}>
              {language === "vi" ? "Phương thức thanh toán" : "Payment Method"}
            </Text>
            <View style={styles.methodOptions}>
              <TouchableOpacity 
                style={[styles.methodOption, !directPaymentMode && styles.methodOptionActive]} 
                onPress={() => setDirectPaymentMode(false)}
              >
                <Text style={[styles.methodText, !directPaymentMode && styles.methodTextActive]}>
                  {language === "vi" ? "Qua tài khoản" : "Via account"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.methodOption, directPaymentMode && styles.methodOptionActive]} 
                onPress={() => setDirectPaymentMode(true)}
              >
                <Text style={[styles.methodText, directPaymentMode && styles.methodTextActive]}>
                  {language === "vi" ? "Thanh toán trực tiếp" : "Direct payment"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.orderSummary, theme === "dark" && styles.darkSectionContainer]}>
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
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6A5ACD" />
        ) : (
          <TouchableOpacity 
            style={[styles.placeOrderButton, directPaymentMode && styles.directPaymentButton]} 
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderButtonText}>
              {directPaymentMode 
                ? (language === "vi" ? "Thanh toán trực tiếp" : "Direct Payment")
                : (language === "vi" ? "Đặt hàng" : "Place Order")
              }
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
  darkSectionContainer: {
    backgroundColor: "#1E1E1E",
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
  orderSummary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
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
  directPaymentButton: {
    backgroundColor: "#4CAF50",
  },
  placeOrderButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 10,
  },
  webViewHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  paymentMethodContainer: {
    marginTop: 10,
  },
  methodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  methodOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  methodOptionActive: {
    borderColor: '#6A5ACD',
    backgroundColor: '#F0EEFA',
  },
  methodText: {
    color: '#666666',
  },
  methodTextActive: {
    color: '#6A5ACD',
    fontWeight: '600',
  }
});

export default PaymentScreen;
