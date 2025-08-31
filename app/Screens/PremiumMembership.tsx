import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Animated,
  Clipboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import {
  getSubscription,
  buySubscription,
  applyCoupons,
  checkMembership,
} from "@/Redux/Auth/authActions";
import MyWebView from "../../components/Payments/webView";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { FontAwesome5, Feather, AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Rect } from "react-native-svg";
import SvgRenderer from "@/components/SVGRender/SVGRender";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PremiumMembership() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const [subscriptions, setSubscriptions]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [paymentURL, setPaymentURL] = useState("");
  const [visibleWebView, setVisibleWebView] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [400, 450], []);
  const [promoCode, setPromoCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [membershipData, setMembershipdata]: any = useState(null);
  const isFocused = useIsFocused();
  const [error, setError] = useState("");

  const [subID, setSubID] = useState();

  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const openReviewModal = () => bottomSheetRef.current?.snapToIndex(0);
  const closeReviewModal = () => {
    setPromoCode("");
    setError("");
    setTermsAccepted(false);
    bottomSheetRef.current?.close();
  };

  const getSubscriptions = () => {
    setLoading(true);
    dispatch(
      getSubscription("membership", (status: string, response: any) => {
        if (status === "Success") {
          setLoading(false);
          setSubscriptions(response);
        } else {
          setLoading(false);
        }
      })
    );
  };

  useEffect(() => {
    getSubscriptions();
    checkMembershipStatus();
  }, [isFocused]);

  const makePaymentRequest = async () => {
    let code = promoCode.trim();
    let payload = `subscriptionType=${subID}`;

    if (code !== "") {
      payload += `&code=${code}`;
    }

    ToastAndroid.show(
      "Please wait while payment is processing",
      ToastAndroid.LONG
    );
    setPayLoading(true);
    dispatch(buySubscription(payload, handleCallBack));
  };

  const handleCallBack = (type: string, response: any) => {
    setPayLoading(false);
    if (type === "Success") {
      setPaymentURL(response.url);
      setVisibleWebView(true);
    } else {
      Alert.alert("Payment Error", response);
    }
  };

  const handlePaymentResponse = async (e: string) => {
    setVisibleWebView(false);
    closeReviewModal();
    if (e === "Success") {
      Alert.alert(
        "Payment Success",
        "You have successfully subscribed the membership"
      );
      checkMembershipStatus();
    } else if (e === "Error") {
      Alert.alert(
        "Payment Not Success",
        "Payment could not be completed, please try again"
      );
    } else {
      Alert.alert(
        "Payment Not Success",
        "Payment could not be completed, please try again"
      );
    }
  };

  const applyPromoCode = async () => {
    if (promoCode === "") {
      setError("Please enter promo code");
      return;
    }
    let payload = {
      itemId: subID,
      code: promoCode,
    };
    dispatch(
      applyCoupons(payload, (status: string, response: any) => {
        if (status === "Success") {
          setIsApplied(true);
          setError("");
        } else {
          setError(response);
        }
      })
    );
  };

  const checkMembershipStatus = async () => {
    dispatch(
      checkMembership((status: string, response: any) => {
        if (status === "Success") {
          setMembershipdata(response);
          //   console.log(response);
        } else {
          //   Alert.alert("Error", response);
          setMembershipdata(null);
          //   setError(response);
        }
      })
    );
  };

  // Flip Animation
  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  // Front & Back Interpolation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const cardNumber = "218910651999481";

  const copyToClipboard = () => {
    Clipboard.setString(cardNumber);
    ToastAndroid.show("Card Number Copied!", ToastAndroid.SHORT);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        {!membershipData ? (
          <View className="flex-1 bg-white px-4 pt-5">
            {/* Header */}
            <Text className="text-center text-lg font-semibold">
              Become a Premium Member!
            </Text>

            {loading ? (
              <View className="mt-10 flex items-center justify-center">
                <ActivityIndicator size="large" color="#62AD00" />
              </View>
            ) : (
              <View className="mt-6 space-y-6">
                {subscriptions.length > 0 ? (
                  subscriptions.map((plan: any, index: number) => (
                    <View
                      key={index}
                      className="bg-[#AEF353] rounded-2xl p-5 relative overflow-hidden"
                    >
                      {/* Crown Icon */}
                      <View className="bg-white w-10 h-10 rounded-lg flex items-center justify-center mb-2">
                        <MaterialCommunityIcons
                          name="crown"
                          size={30}
                          color="#F7AA1B"
                        />
                      </View>

                      {/* Absolute Positioned Image */}
                      <Image
                        source={require("../../assets/images/icons/card-crown.png")}
                        style={{
                          position: "absolute",
                          right: 15,
                          top: 15,
                          width: 90,
                          height: 80,
                          transform: [{ rotate: "-5deg" }],
                        }}
                      />

                      {/* Membership Title */}
                      <Text className="text-2xl font-bold text-black">
                        {plan.name}
                      </Text>

                      {/* Benefits List */}
                      <View className="mt-3 space-y-2">
                        {[
                          "Access to exclusive discounts",
                          "Deals on car rentals & transportation",
                          "Discounts on entertainment experiences",
                          "Membership Loyalty program for additional benefits and rewards",
                        ].map((text, index) => (
                          <View
                            key={index}
                            className="flex-row items-center pb-2"
                          >
                            <View className="bg-white w-5 h-5 rounded-full flex items-center justify-center">
                              <Feather name="check" size={14} color="black" />
                            </View>
                            <Text className="ml-2 text-black">{text}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Price */}
                      <Text className="text-3xl font-bold text-black mt-4">
                        GBP {plan.amount}
                      </Text>

                      {/* Get Started Button */}
                      <TouchableOpacity
                        className="bg-white p-3 rounded-lg mt-4"
                        // onPress={() => makePaymentRequest(plan?.id)}
                        onPress={() => {
                          setSubID(plan?.id);
                          openReviewModal();
                        }}
                      >
                        {payLoading ? (
                          <ActivityIndicator />
                        ) : (
                          <Text className="text-black text-center font-medium">
                            Get Started
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text className="text-center text-gray-500 mt-5">
                    No subscription plans available.
                  </Text>
                )}
              </View>
            )}

            <BottomSheet
              ref={bottomSheetRef}
              index={-1}
              snapPoints={snapPoints}
              backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
              handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
              //   enableHandlePanningGesture={false}
              //   enableContentPanningGesture={false}
              enablePanDownToClose={false}
              //   enableDynamicSizing={true}
            >
              <BottomSheetView style={{ flex: 1 }}>
                <View className="px-5 py-4 b">
                  {/* Header */}
                  <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity
                      onPress={() => {
                        closeReviewModal();
                      }}
                    >
                      <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold">Subscribe Now</Text>
                    <View></View>
                  </View>

                  {/* Apply Promo Code */}
                  <Text className="text-base font-semibold">
                    Apply Promo Code
                  </Text>
                  <Text className="text-gray-500 text-sm mb-2">
                    Lorem ipsum dolor sit amet, adipiscing elit. Sed at gravida
                    nulla tempor
                  </Text>

                  {/* Promo Code Input + Applied Button */}
                  <View className="flex-row items-center">
                    <View className="flex-1 bg-gray-100 p-3 rounded-lg flex-row items-center">
                      <TextInput
                        className="flex-1 text-black"
                        placeholder="Enter Promo Code"
                        value={promoCode}
                        onChangeText={setPromoCode}
                      />
                      {isApplied && (
                        <Feather name="check" size={18} color="gray" />
                      )}
                    </View>

                    <TouchableOpacity
                      disabled={isApplied}
                      className={`ml-2 p-3 rounded-lg bg-lime-400`}
                      onPress={() => applyPromoCode()}
                    >
                      <Text className="text-black font-medium">
                        {isApplied ? "Applied" : "Apply"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {error !== "" && (
                    <Text className="text-red-500">{error}</Text>
                  )}

                  {/* Terms & Conditions Checkbox */}
                  <View className="flex-row items-center mt-4">
                    <TouchableOpacity
                      onPress={() => setTermsAccepted(!termsAccepted)}
                    >
                      <View
                        className={`w-6 h-6 rounded-md flex items-center justify-center ${
                          termsAccepted ? "bg-lime-400" : "bg-gray-200"
                        }`}
                      >
                        {termsAccepted && (
                          <AntDesign name="check" size={16} color="black" />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text className="ml-2 text-black">
                      <Text className="font-bold underline">
                        Terms & Conditions
                      </Text>{" "}
                      applied
                    </Text>
                  </View>

                  {/* Subscribe Button */}
                  <TouchableOpacity
                    disabled={!termsAccepted}
                    className={`p-4 rounded-lg mt-4 ${
                      termsAccepted ? "bg-lime-400" : "bg-gray-200"
                    }`}
                    onPress={() => makePaymentRequest()}
                  >
                    <Text className="text-black text-center font-semibold">
                      Subscribe
                    </Text>
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            </BottomSheet>

            <MyWebView
              visible={visibleWebView}
              url={paymentURL}
              hideVisible={(e: any) => handlePaymentResponse(e)}
            />
          </View>
        ) : (
          <View className="flex-1 bg-gray-100">
            <View className="bg-white px-4 pt-5 pb-4 rounded-bl-3xl rounded-br-3xl">
              {/* Header */}
              <View className="items-center">
                <View className="flex flex-row justify-between w-full items-center">
                  <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-0"
                  >
                    <Feather name="arrow-left" size={22} color="black" />
                  </TouchableOpacity>
                  <View className="bg-white w-10 h-10 rounded-lg flex items-center justify-center mb-2">
                    <MaterialCommunityIcons
                      name="crown"
                      size={40}
                      color="#F7AA1B"
                    />
                  </View>
                  <View></View>
                </View>
                <Text className="text-lg font-semibold">
                  You are a Premium Member!
                </Text>
              </View>

              <View className="mt-6 space-y-6">
                <View className="bg-[#AEF353] rounded-2xl p-5 relative overflow-hidden">
                  {/* Crown Icon */}
                  <View className="bg-white w-10 h-10 rounded-lg flex items-center justify-center mb-2">
                    <MaterialCommunityIcons
                      name="crown"
                      size={30}
                      color="#F7AA1B"
                    />
                  </View>

                  {/* Absolute Positioned Image */}
                  <Image
                    source={require("../../assets/images/icons/card-crown.png")}
                    style={{
                      position: "absolute",
                      right: 15,
                      top: 15,
                      width: 90,
                      height: 80,
                      transform: [{ rotate: "-5deg" }],
                    }}
                  />

                  {/* Membership Title */}
                  <Text className="text-2xl font-bold text-black">
                    Benefits you enjoy
                  </Text>

                  {/* Benefits List */}
                  <View className="mt-3 space-y-2">
                    {[
                      "Access to exclusive discounts",
                      "Deals on car rentals & transportation",
                      "Discounts on entertainment experiences",
                      "Membership Loyalty program for additional benefits and rewards",
                    ].map((text, index) => (
                      <View key={index} className="flex-row items-center pb-2">
                        <View className="bg-white w-5 h-5 rounded-full flex items-center justify-center">
                          <Feather name="check" size={14} color="black" />
                        </View>
                        <Text className="ml-2 text-black">{text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    position: "absolute",
  },
});
