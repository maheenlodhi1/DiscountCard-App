import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

interface WebViewProps {
  visible: boolean;
  hideVisible: (status: string) => void;
  url: string;
}

const MyWebView: React.FC<WebViewProps> = ({ visible, hideVisible, url }) => {
  const [currentUrl, setCurrentUrl] = useState("");
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackButtonPress = () => {
    if (webviewRef.current) {
      webviewRef.current.goBack();
      return true;
    }
    return false;
  };

  const reload = () => {
    webviewRef.current?.reload();
  };

  const handleClose = () => {
    hideVisible("");
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    setCurrentUrl(url);
    console.log("WebView URL:", url);
    if (url.includes("/payment/")) {
      checkPaymentStatus(url);
    }
  };

  const checkPaymentStatus = (url: string) => {
    console.log("url datadfrgfderfsderwf", url);

    if (url.includes("payment/success")) {
      hideVisible("Success");
    } else if (url.includes("payment/failed")) {
      hideVisible("Error");
    } else {
      hideVisible("Error");
    }
  };

  if (!visible) return null;

  return (
    <View className="flex-1 absolute top-0 left-0 bottom-0 right-0 bg-white">
      {/* WebView Header */}
      <View className="flex-row items-center justify-between p-3 bg-gray-200">
        <TouchableOpacity onPress={reload}>
          <Ionicons name="refresh" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

export default MyWebView;
