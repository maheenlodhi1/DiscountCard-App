import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Input from "../../components/Common/Input";
import { SolidButton } from "../../components/Common/solidButton";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../Redux/Auth/authActions";
import { t } from "../../lib/i18n";

const NewPassword = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
  });

  const [errors, setErrors]: any = useState({});

  const handleInputChange = (fieldName: string, value: string) => {
    setUserData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const updatedErrors: any = {};

    if (!userData.email) {
      updatedErrors.email = t("emailErrReq");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      updatedErrors.email = t("emailErrInv");
      isValid = false;
    }
    setErrors(updatedErrors);
    return isValid;
  };

  const handleForgotPassword = () => {
    if (!validateForm()) return;
    let payload = {
      recipient: userData.email,
    };
    setLoading(true);
    dispatch(
      forgotPassword(payload, (status: string, message: string) => {
        if (status === "Success") {
          setLoading(false);
          Alert.alert(t("otpSent"), t("signUpSuccessMessage"));
          router.push({
            pathname: "/AuthScreens/EnterCode",
            params: { email: payload.recipient, type: "resetPassword" },
          });
        } else {
          setLoading(false);
          Alert.alert(t("pwdFail"), message);
        }
      })
    );
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
            {t("emailTitle")}
          </Text>
          <Text style={styles.subtitle}>{t("emailSub")}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <Input
            onChange={(value) => handleInputChange("email", value)}
            placeholder={t("emailPh")}
            value={userData.email}
            label={t("emailLbl")}
            type="email"
          />
          {errors?.email && (
            <View className="mb-2 mt-1">
              <Text className="absolute -bottom-0 text-red-500">
                {errors?.email}
              </Text>
            </View>
          )}
        </View>
        <View className="pt-4">
          <SolidButton
            title={
              loading ? (
                <ActivityIndicator size={19} color="black" />
              ) : (
                t("btnConfirm")
              )
            }
            onPress={handleForgotPassword}
            disabled={false}
          />
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
  optionsContainer: {
    marginTop: 40,
    flexDirection: "column",
    gap: 2,
  },
  option: {
    width: "100%",
    backgroundColor: "#F4F9FB",
    borderColor: "#EDF3F5",
    borderWidth: 1,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    gap: "4",
  },
  optionTextContainer: {
    marginLeft: 10,
    flexDirection: "column",
    gap: "4",
  },
  optionTitle: {
    fontSize: 14,
    color: "#000",
  },
  optionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NewPassword;
