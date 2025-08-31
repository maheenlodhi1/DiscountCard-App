import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Input from "../../components/Common/Input";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SolidButton } from "../../components/Common/solidButton";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../Redux/Auth/authActions";
import { t } from "../../lib/i18n";

const NewPassword = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const dispatch: any = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    password: "",
    newPassword: "",
  });

  const [errors, setErrors]: any = useState({});

  const validateForm = () => {
    let isValid = true;
    const updatedErrors: any = {};

    if (!userData.password) {
      updatedErrors.password = t("passwordRequired");
      isValid = false;
    } else if (userData.password.length < 8) {
      updatedErrors.password = t("passwordMinLength");
      isValid = false;
    }

    if (!userData.newPassword) {
      updatedErrors.newPassword = t("confirmPasswordRequired");
      isValid = false;
    }

    if (userData.password !== userData.newPassword) {
      updatedErrors.newPassword = t("passwordsDoNotMatch");
      isValid = false;
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const handleClick = () => {
    if (!validateForm()) return;
    let payload = {
      token: token,
      password: userData?.password,
    };
    setLoading(true);
    dispatch(
      resetPassword(payload, (status: string, message: string) => {
        if (status === "Success") {
          Alert.alert(t("passwordChangedSuccess"), t("passwordChangedMessage"));
          router.replace("/AuthScreens/LogIn");
        } else {
          Alert.alert(t("passwordNotUpdated"), t("passwordNotUpdatedMessage"));
        }
      })
    );
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setUserData((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#acacac"} />
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/images/Back.png")}
          style={styles.image}
        />
        <View className="pt-10">
          <Text className="uppercase" style={styles.title}>
            {t("enterNew")}
          </Text>
          <Text style={styles.subtitle}>{t("setPass")}</Text>
        </View>

        <View style={styles.optionsContainer}>
          <Input
            onChange={(value) => handleInputChange("password", value)}
            placeholder={t("passwordPlaceholder")}
            value={userData.password}
            label={t("passwordLabel")}
            type="password"
          />
          {errors?.password && (
            <View className="mb-2 mt-1">
              <Text className="absolute -bottom-0 text-red-500">
                {errors?.password}
              </Text>
            </View>
          )}
          <Input
            onChange={(value) => handleInputChange("newPassword", value)}
            placeholder={t("passwordPlaceholder")}
            value={userData.newPassword}
            label={t("confirmPasswordLabel")}
            type="password"
          />
          {errors?.newPassword && (
            <View className="mb-2 mt-1">
              <Text className="absolute -bottom-0 text-red-500">
                {errors?.newPassword}
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
                t("submitButton")
              )
            }
            onPress={handleClick}
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
