import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SolidButton } from "../../components/Common/solidButton";
import axios from "axios";
import { API_URL } from "../../Utils/utils";
import { useDispatch } from "react-redux";
import { verifyOTP, sendOTP } from "@/Redux/Auth/authActions";
import { t } from "../../lib/i18n";

const EnterCode = () => {
  const router = useRouter();
  const { email, type } = useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const dispatch: any = useDispatch();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(60);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isCounting && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsCounting(false);
    }
    return () => clearInterval(interval);
  }, [timer, isCounting]);

  const handleInputChange = (value: string, index: number) => {
    const newCode = [...code];
    if (value === "") {
      newCode[index] = "";
      setCode(newCode);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }
    if (!/^\d$/.test(value)) return;
    newCode[index] = value;
    setCode(newCode);

    if (index < newCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else {
      handleVerifyOTP(newCode.join(""));
    }
  };

  const handleVerifyOTP = (enteredOTP: string) => {
    const otp = code.join("");
    if (enteredOTP.length !== 6) {
      Alert.alert(t("otpInvalid"));
      return;
    }
    setLoading(true);
    const payload = {
      recipient: email,
      otp: enteredOTP,
      context: type,
    };

    dispatch(
      verifyOTP(payload, (status: string, message: any) => {
        setLoading(false);
        if (status === "Success") {
          Alert.alert(t("verificationSuccess"), t("verificationSuccess"));
          checkRoute(message);
        } else {
          Alert.alert(t("verificationFailure"), message);
        }
      })
    );
  };

  const handleResendOTP = () => {
    const payload = {
      recipient: email,
    };

    dispatch(
      sendOTP(payload, (status: string, message: any) => {
        setLoading(false);
        if (status === "Success") {
          setTimer(60);
          setIsCounting(true);
          Alert.alert(t("otpResendSuccess"), t("otpResendSuccess"));
        } else {
          Alert.alert(t("otpResendFailure"), message);
        }
      })
    );
  };

  const checkRoute = (message: any) => {
    if (message && message?.resetPasswordToken) {
      router.push({
        pathname: "/AuthScreens/NewPassword",
        params: { token: message?.resetPasswordToken },
      });
    } else {
      router.replace("/AuthScreens/Common/VerifiedModal");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#acacac"} />
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/Back.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <View className="pt-10">
          <Text className="uppercase" style={styles.title}>
            {t("enterCodeScreenTitle")}
          </Text>
          <Text style={styles.subtitle}>
            {t("enterCodeScreenSubtitle")} {email}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {code.map((item, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={item}
              onChangeText={(value) => handleInputChange(value, index)}
              style={styles.input}
              placeholder=""
              placeholderTextColor="#768A91"
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        <View className="pt-10">
          <SolidButton
            title={
              loading ? (
                <ActivityIndicator size={19} color="black" />
              ) : (
                t("verifyButton")
              )
            }
            onPress={() => handleVerifyOTP(code.join(""))}
            disabled={loading}
          />
          <View className="flex flex-row items-center justify-center gap-x-1 pt-4">
            <Text>{t("didNotReceiveCode")}</Text>
            {isCounting ? (
              <Text className="text-gray-500 font-medium">
                {t("resendInTimer")} {timer}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text className="text-[#62AD00] font-medium">
                  {t("resendCodeText")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    fontWeight: "400",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 0,
  },
  input: {
    width: "14%",
    height: 45,
    borderRadius: 8,
    backgroundColor: "#EDF3F5",
    textAlign: "center",
    fontSize: 18,
    color: "#000",
  },
});

export default EnterCode;
