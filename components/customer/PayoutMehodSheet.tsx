import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import Input from "../Common/Input";
import PhoneInput from "../Common/PhoneInput";
import { useDispatch } from "react-redux";
import { managePayoutDetails } from "@/Redux/Auth/authActions";

// Define a proper type for the errors object
interface FormErrors {
  phone?: string;
  bankName?: string;
  beneficiaryName?: string;
  accountNumber?: string;
  iban?: string;
  [key: string]: string | undefined;
}

const SetPayoutSheet = ({
  bottomSheetRef,
  closeSheet,
}: {
  bottomSheetRef: any;
  closeSheet: () => void;
}) => {
  const dispatch = useDispatch<any>();
  // Use selectedTab instead of paymentMethod to match the sign-up structure
  const [selectedTab, setSelectedTab] = useState("alansari");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate dynamic snap points based on content
  const snapPoints = useMemo(() => {
    return selectedTab === "bank" ? ["60%", "75%"] : ["50%"];
  }, [selectedTab]);
  console.log("rerendring app");
  const handleInputChange = (fieldName: string, value: string) => {
    // Clear error when input changes
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));

    // Update the appropriate state based on field name
    switch (fieldName) {
      case "phone":
        setPhone(value);
        break;
      case "bankName":
        setBankName(value);
        break;
      case "beneficiaryName":
        setBeneficiaryName(value);
        break;
      case "accountNumber":
        setAccountNumber(value);
        break;
      case "name":
        setName(value);
        break;
      case "iban":
        setIban(value);
        break;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const updatedErrors: FormErrors = {};

    if (!phone) {
      updatedErrors.phone = "Phone number is required.";
      isValid = false;
    }

    if (selectedTab === "alansari") {
      if (!name) {
        updatedErrors.name = "Name is required.";
        isValid = false;
      }
    }

    if (selectedTab === "bank") {
      if (!bankName) {
        updatedErrors.bankName = "Bank name is required.";
        isValid = false;
      }

      if (!beneficiaryName) {
        updatedErrors.beneficiaryName = "Beneficiary name is required.";
        isValid = false;
      }

      if (!accountNumber) {
        updatedErrors.accountNumber = "Account number is required.";
        isValid = false;
      }

      if (!iban) {
        updatedErrors.iban = "IBAN is required.";
        isValid = false;
      }
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const handleProceed = () => {
    if (!validateForm()) return;
    // Handle proceed logic
    let payload = {};
    if (selectedTab == "bank") {
      payload = {
        type: "bank",
        beneficiaryName,
        bankName,
        phoneNo: phone,
        accountNumber,
      };
    } else {
      payload = { type: "alansari", name, phoneNo: phone };
    }
    dispatch(
      managePayoutDetails(payload, (status: string, response: any) => {
        if (status === "Success") {
          closeSheet();
        } else {
          Alert.alert("Error while updating the payout details");
        }
      })
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: "white", borderRadius: 20 }}
      containerStyle={{ zIndex: 10 }}
      handleIndicatorStyle={{
        backgroundColor: "#D0D5DC",
        width: 135,
        height: 5,
      }}
      enablePanDownToClose={true}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
    >
      <View style={{ flex: 1 }}>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={true}
        >
          <View className="px-6 pt-2 pb-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={closeSheet}>
                <Feather name="x" size={24} color="#2F4451" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-[#3A3D42] font-['Plus_Jakarta_Sans']">
                Set Payout
              </Text>
              <View className="w-6" />
            </View>

            {/* Payment Method Selection - Custom Tabs */}
            <View className="mb-2">
              <View className="flex-row bg-[#F4F9FB] p-1.5 rounded-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTab("alansari");
                    setErrors({});
                  }}
                  className={`flex-1 py-2.5 px-2.5 rounded-md flex items-center justify-center ${
                    selectedTab === "alansari" ? "bg-[#D5FF9F]" : ""
                  }`}
                >
                  <Text
                    className={`text-center font-medium text-sm ${
                      selectedTab === "alansari"
                        ? "text-[#3A3D42]"
                        : "text-[#768A91]"
                    }`}
                  >
                    Al ansari Exchange
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedTab("bank");
                    setErrors({});
                  }}
                  className={`flex-1 py-2.5 px-2.5 rounded-md flex items-center justify-center ${
                    selectedTab === "bank" ? "bg-[#D5FF9F]" : ""
                  }`}
                >
                  <Text
                    className={`text-center font-semibold text-sm ${
                      selectedTab === "bank"
                        ? "text-[#3A3D42]"
                        : "text-[#768A91]"
                    }`}
                  >
                    Bank Transfer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Content */}
            <ScrollView>
              {/* Phone Input - Always visible */}
              <View className="relative">
                <PhoneInput
                  value={phone}
                  onChange={(value) => handleInputChange("phone", value)}
                />
                <View className="mt-1 mb-2">
                  {errors.phone ? (
                    <Text
                      className="absolute -bottom-1"
                      style={styles.errorText}
                    >
                      {errors.phone}
                    </Text>
                  ) : null}
                </View>
                {selectedTab === "alansari" && (
                  <>
                    <Input
                      required
                      type="text"
                      label={"Name"}
                      onChange={(value) => handleInputChange("name", value)}
                      value={name}
                    />
                    <View className="mt-1 mb-2">
                      {errors.name && (
                        <Text
                          className="absolute -bottom-1"
                          style={styles.errorText}
                        >
                          {errors.name}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </View>

              {/* Bank Details - Only visible when Bank Transfer is selected */}
              {selectedTab === "bank" && (
                <>
                  <View className="relative mb-2">
                    <Input
                      required
                      type="text"
                      label="Bank Name"
                      onChange={(value) => handleInputChange("bankName", value)}
                      value={bankName}
                    />
                    {errors.bankName && (
                      <Text style={styles.errorText}>{errors.bankName}</Text>
                    )}
                  </View>

                  <View className="relative mb-2">
                    <Input
                      required
                      type="text"
                      label="Beneficiary Name"
                      onChange={(value) =>
                        handleInputChange("beneficiaryName", value)
                      }
                      value={beneficiaryName}
                    />
                    {errors.beneficiaryName && (
                      <Text style={styles.errorText}>
                        {errors.beneficiaryName}
                      </Text>
                    )}
                  </View>

                  <View className="relative mb-2">
                    <Input
                      required
                      type="text"
                      label="Account Number"
                      onChange={(value) =>
                        handleInputChange("accountNumber", value)
                      }
                      value={accountNumber}
                    />
                    {errors.accountNumber && (
                      <Text style={styles.errorText}>
                        {errors.accountNumber}
                      </Text>
                    )}
                  </View>

                  <View className="relative mb-2">
                    <Input
                      required
                      type="text"
                      label="IBAN"
                      onChange={(value) => handleInputChange("iban", value)}
                      value={iban}
                    />
                    {errors.iban && (
                      <Text style={styles.errorText}>{errors.iban}</Text>
                    )}
                  </View>
                </>
              )}

              {/* Proceed Button */}
              <View className="w-full flex flex-col items-center">
                <TouchableOpacity
                  className="bg-[#AEF353] py-3 rounded-md w-full flex items-center justify-center"
                  onPress={handleProceed}
                >
                  <Text className="text-center font-semibold text-black">
                    Proceed
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
};

// Add styles with higher z-index for the bottom sheet
const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default SetPayoutSheet;
