import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SolidButton } from "@/components/Common/solidButton";
import { OutlineButton } from "@/components/Common/outlineButton";
import Input from "../../components/Common/Input";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUserDetails,
  fetchCustomerDashboardStats,
  login,
} from "../../Redux/Auth/authActions";
import { t } from "../../lib/i18n";

const LoginScreen = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (name: string, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    let updatedErrors = { email: "", password: "" };

    if (!userData.email) {
      updatedErrors.email = t("emailRequired");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      updatedErrors.email = t("emailInvalid");
      isValid = false;
    }

    if (!userData.password) {
      updatedErrors.password = t("passwordRequired");
      isValid = false;
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (!validateForm()) return;
    setLoading(true);
    dispatch(login(userData, handleLoginCallback));
  };

  const handleLoginCallback = (type: string, response: string | any) => {
    setLoading(false);
    if (type === "Success") {
      Alert.alert(t("loginSuccess"), t("loginSuccess"));
      dispatch(fetchCurrentUserDetails());

      if (response?.userType === "partner") {
        router.replace("/Partner/HomeScreens");
      } else {
        router.replace("/HomeScreens");
        dispatch(fetchCustomerDashboardStats(() => {}));
      }
    } else {
      Alert.alert(t("loginFailure"), response);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          flexDirection: "column",
        },
      ]}
      className="bg-white"
    >
      <StatusBar barStyle={"dark-content"} backgroundColor={"#acacac"} />
      <View
        style={{
          flex: 1,
          paddingTop: 0,
          flexDirection: "column",
        }}
        className="bg-white mt-0 px-5"
      >
        <View
          style={[
            {
              paddingVertical: 0,
              flex: 1,
              marginTop: 12,
            },
          ]}
          className="mb-5 pt-10 font-bold"
        >
          <View>
            <Text
              className="text-[37px] uppercase font-semibold"
              style={{ fontFamily: "PlusJakartaSans-SemiBold" }}
            >
              {t("loginScreenTitle")}
            </Text>
            <Text className="text-[14px] mt-2 font-medium">
              {t("loginScreenSubtitle")}
            </Text>
          </View>

          <View
            style={[
              {
                paddingVertical: 0,
                flex: 1,
                marginTop: 12,
              },
            ]}
            className="mb-5 pt-10 font-bold"
          >
            <View className="flex flex-col space-y-4 pt-10">
              <View className="relative">
                <Input
                  onChange={(value) => handleInputChange("email", value)}
                  placeholder={t("emailPlaceholder")}
                  value={userData.email}
                  label={t("email")}
                  type="email"
                  required
                />
                {errors.email ? (
                  <Text className="absolute -bottom-1" style={styles.errorText}>
                    {errors.email}
                  </Text>
                ) : null}
              </View>
              <View className="relative">
                <Input
                  onChange={(value) => handleInputChange("password", value)}
                  placeholder={t("passwordPlaceholder")}
                  value={userData.password}
                  label={t("password")}
                  type="password"
                  onForgotPassword={() =>
                    router.push("/AuthScreens/ForgotPassword")
                  }
                  required
                />
                {errors.password ? (
                  <Text className="absolute -bottom-1" style={styles.errorText}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>
            </View>
            <View className="w-full flex flex-col gap-y-8 mt-8 items-center">
              <View className="w-full">
                <SolidButton
                  title={
                    loading ? (
                      <ActivityIndicator size={19} color="black" />
                    ) : (
                      t("loginButton")
                    )
                  }
                  onPress={handleLogin}
                  disabled={loading}
                />
              </View>
              <View className="">
                <Text>{t("orText")}</Text>
              </View>
              <View className="w-full">
                <Link href={"/AuthScreens/SignUp"} asChild>
                  <OutlineButton
                    title={t("createAccountText")}
                    onPress={() => {}}
                  />
                </Link>
              </View>
            </View>
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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    fontWeight: "400",
  },
  formContainer: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;
