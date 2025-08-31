import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Audio } from "expo-av";
import { SolidButton } from "@/components/Common/solidButton";
import Input from "@/components/Common/Input";
import { checkSub, getPromotionByID } from "@/Redux/Auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import { setPartnerOffer } from "@/Redux/Auth/authSlice";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [membershipID, setMembershipID] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch: any = useDispatch();
  const { partnerOffer, currentUser } = useSelector((state: any) => state.auth);

  const verifyCode = async (code: any) => {
    setLoading(true);
    dispatch(
      checkSub(code, (status: string, response: any) => {
        if (status === "Success") {
          Alert.alert("Success", "Success");
          console.log("Resposne of t", response);
          router.push({
            pathname: "/Screens/partner/CardVerification",
            params: { ...response, cardName: response?.locale?.en?.cardName },
          });
        } else {
          Alert.alert("Error", response);
        }
        setLoading(false);
      })
    );
  };

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const playBeep = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/audio/beep.mp3")
    );
    await sound.playAsync();
    setTimeout(() => sound.unloadAsync(), 1000);
  };

  async function handleBarCodeScanned({ data }: any) {
    if (!scanned) {
      setScanned(true);
      setMembershipID(data);
      await playBeep();
      setTimeout(() => setScanned(false), 1000);
    }
  }

  useEffect(() => {
    if (currentUser?.offers.length > 0 && !partnerOffer?.isActive) {
      dispatch(
        getPromotionByID(
          currentUser?.offers?.[0]?.id,
          (status: any, data: any) => {
            if (status === "Success") {
              dispatch(setPartnerOffer(data));
            }
          }
        )
      );
    }
  }, [currentUser?.offers, partnerOffer?.isActive, dispatch]);

  if (!permission) return <View />;

  if (!partnerOffer?.isActive) {
    return (
      <View className="flex flex-1 items-center justify-center p-4">
        <Text className="text-xl text-center italic font-medium">
          You haven't any active offer to provide discounts
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-gray-100">
          <View
            className={`relative bg-gray-300 rounded-b-3xl ${
              keyboardVisible ? "flex-[3]" : "flex-[6]"
            }`}
          >
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing={facing}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            <Text className="absolute top-4 left-0 right-0 mx-auto text-white text-lg font-bold text-center">
              Scan QR / Barcode
            </Text>
          </View>

          <View
            className={`flex-1 p-5 bg-white rounded-t-3xl mt-2  ${
              keyboardVisible ? "flex-[7]" : "flex-[4]"
            }`}
          >
            <Text className="text-lg font-semibold mb-3">
              Or Enter Membership ID
            </Text>

            <Input
              onChange={(value) => setMembershipID(value)}
              placeholder="Enter ID"
              value={membershipID}
              label="Enter ID"
              type="text"
              editable={true}
            />
            <View className="w-full">
              <SolidButton
                title={
                  loading ? (
                    <ActivityIndicator size={19} color="black" />
                  ) : (
                    "Verify"
                  )
                }
                disabled={loading}
                onPress={() => verifyCode(membershipID)}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
