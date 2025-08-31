import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SolidButton } from "@/components/Common/solidButton";
import { OutlineButton } from "@/components/Common/outlineButton";
import Input from "../../components/Common/Input";
import TabSelector from "../../components/Common/TabSelector";
import Checkbox from "../../components/Common/CheckBox";
import PhoneInput from "../../components/Common/PhoneInput";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../Redux/Auth/authActions";
import { t } from "../../lib/i18n";

const SignUp = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Customer");
  const [conditionsAccepted, setConditionsAccepted] = useState(false);

  const [customerData, setCustomerData]: any = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "customer",
    phoneNo: "",
  });

  const [partnerData, setPartnerData]: any = useState({
    businessName: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    type: "partner",
    phoneNo: "",
  });

  const [errors, setErrors]: any = useState({});

  const updateTab = (tab: string) => {
    setErrors({});
    setSelectedTab(tab);
  };

  const toggleCheckBox = (checked: boolean) => {
    setConditionsAccepted(checked);
    setErrors((prev: any) => ({
      ...prev,
      conditionsAccepted: checked ? "" : t("conditionsAccepted"),
    }));
  };

  const handleInputChange = (tab: string, fieldName: string, value: string) => {
    if (tab === "Customer") {
      setCustomerData((prev: any) => ({ ...prev, [fieldName]: value }));
    } else {
      setPartnerData((prev: any) => ({ ...prev, [fieldName]: value }));
    }
    setErrors((prev: any) => ({ ...prev, [fieldName]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const updatedErrors: any = {};
    const data = selectedTab === "Customer" ? customerData : partnerData;

    if (!data.firstName) {
      updatedErrors.firstName = t("firstNameRequired");
      isValid = false;
    }

    if (!data.lastName) {
      updatedErrors.lastName = t("lastNameRequired");
      isValid = false;
    }

    if (!data.email) {
      updatedErrors.email = t("emailRequired");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      updatedErrors.email = t("emailInvalid");
      isValid = false;
    }

    if (!data.phoneNo) {
      updatedErrors.phoneNo = t("phoneNoRequired");
      isValid = false;
    }

    if (!data.password) {
      updatedErrors.password = t("passwordRequired");
      isValid = false;
    } else if (data.password.length < 8) {
      updatedErrors.password = t("passwordMinLength");
      isValid = false;
    }

    if (!data.confirmPassword) {
      updatedErrors.confirmPassword = t("confirmPasswordRequired");
      isValid = false;
    }

    if (data.password !== data.confirmPassword) {
      updatedErrors.confirmPassword = t("passwordsDoNotMatch");
      isValid = false;
    }

    if (selectedTab === "Partner" && !partnerData.businessName) {
      updatedErrors.businessName = t("businessNameRequired");
      isValid = false;
    }

    if (!conditionsAccepted) {
      updatedErrors.conditionsAccepted = t("conditionsAccepted");
      isValid = false;
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const handleSignUp = () => {
    if (!validateForm()) return;
    const { confirmPassword, ...payload } =
      selectedTab === "Customer" ? customerData : partnerData;
    setLoading(true);
    dispatch(
      register(payload, (status: string, message: string) => {
        if (status === "Success") {
          Alert.alert(t("signUpSuccess"), t("signUpSuccessMessage"));
          router.push({
            pathname: "/AuthScreens/EnterCode",
            params: { email: payload.email, type: "register" },
          });
          setLoading(false);
        } else {
          setLoading(false);
          Alert.alert(t("signUpFailed"), t("signUpFailedMessage"));
        }
      })
    );
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#acacac"} />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={styles.title}>{t("title")}</Text>
        <Text style={styles.subtitle}>{t("subtitle")}</Text>

        <TabSelector selectedTab={selectedTab} onTabChange={updateTab} />

        <ScrollView>
          {selectedTab === "Customer" ? (
            <>
              {[
                { label: t("firstName"), key: "firstName" },
                { label: t("lastName"), key: "lastName" },
                { label: t("email"), key: "email" },
              ].map(({ label, key }) => (
                <View key={key} className="relative">
                  <Input
                    onChange={(value) =>
                      handleInputChange("Customer", key, value)
                    }
                    placeholder={t("enter") + " " + label}
                    value={customerData[key]}
                    label={label}
                    type="text"
                    editable={true}
                  />
                  {errors?.[key] && (
                    <View className="mb-2 mt-1">
                      <Text
                        className="absolute -bottom-0"
                        style={styles.errorText}
                      >
                        {errors?.[key]}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              <View className="relative">
                <PhoneInput
                  value={customerData.phoneNo}
                  onChange={(value) =>
                    handleInputChange("Customer", "phoneNo", value)
                  }
                />
                <View className="mt-1 mb-2">
                  {errors.phoneNo ? (
                    <Text
                      className="absolute -bottom-1"
                      style={styles.errorText}
                    >
                      {errors.phoneNo}
                    </Text>
                  ) : null}
                </View>
              </View>
              {[
                { label: t("password"), key: "password", type: "password" },
                {
                  label: t("confirmPassword"),
                  key: "confirmPassword",
                  type: "password",
                },
              ].map(({ label, key, type }) => (
                <View key={key} className="relative">
                  <Input
                    onChange={(value) =>
                      handleInputChange("Customer", key, value)
                    }
                    placeholder={t("enter") + " " + label}
                    value={customerData[key]}
                    label={label}
                    type={type}
                    editable={true}
                  />
                  {errors?.[key] && (
                    <View className="mb-2 mt-1">
                      <Text
                        className="absolute -bottom-0"
                        style={styles.errorText}
                      >
                        {errors?.[key]}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          ) : (
            <>
              {[
                { label: t("businessName"), key: "businessName" },
                { label: t("businessEmail"), key: "email" },
                { label: t("firstName"), key: "firstName" },
                { label: t("lastName"), key: "lastName" },
              ].map(({ label, key }) => (
                <View key={key} className="relative">
                  <Input
                    onChange={(value) =>
                      handleInputChange("Partner", key, value)
                    }
                    placeholder={t("enter") + " " + label}
                    value={partnerData[key]}
                    label={label}
                    type="text"
                    editable={true}
                  />
                  {errors?.[key] && (
                    <View className="mb-2 mt-1">
                      <Text
                        className="absolute -bottom-0"
                        style={styles.errorText}
                      >
                        {errors?.[key]}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              <View className="relative">
                <PhoneInput
                  value={partnerData.phoneNo}
                  onChange={(value) =>
                    handleInputChange("Partner", "phoneNo", value)
                  }
                />
                <View className="mt-1 mb-2">
                  {errors.phoneNo ? (
                    <Text
                      className="absolute -bottom-1"
                      style={styles.errorText}
                    >
                      {errors.phoneNo}
                    </Text>
                  ) : null}
                </View>
              </View>

              {[
                { label: t("password"), key: "password", type: "password" },
                {
                  label: t("confirmPassword"),
                  key: "confirmPassword",
                  type: "password",
                },
              ].map(({ label, key, type }) => (
                <View key={key} className="relative">
                  <Input
                    onChange={(value) =>
                      handleInputChange("Partner", key, value)
                    }
                    placeholder={t("enter") + " " + label}
                    value={partnerData[key]}
                    label={label}
                    type={type}
                    editable={true}
                  />
                  {errors?.[key] && (
                    <View className="mb-2 mt-1">
                      <Text
                        className="absolute -bottom-0"
                        style={styles.errorText}
                      >
                        {errors?.[key]}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}

          <View className="relative">
            <Checkbox value={conditionsAccepted} onChange={toggleCheckBox} />
            <View className="mt-5 ">
              {errors.conditionsAccepted ? (
                <Text className="absolute -bottom-1" style={styles.errorText}>
                  {errors.conditionsAccepted}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="w-full flex flex-col gap-y-5 items-center pt-6">
            <View className="w-full">
              <SolidButton
                title={
                  loading ? (
                    <ActivityIndicator size={19} color="black" />
                  ) : (
                    t("title")
                  )
                }
                onPress={handleSignUp}
                disabled={loading}
              />
            </View>
            <View className="flex flex-row items-center justify-center gap-x-1 pb-4">
              <Text>{t("alreadyMember")}</Text>
              <Link href={"/AuthScreens/LogIn"} replace>
                <Text className="text-[#62AD00] font-medium">
                  {t("signIn")}
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
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

export default SignUp;
