import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import { t } from "../../lib/i18n";
interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handlePhoneChange = (text: string) => {
    if (text.trim() === "") {
      onChange("");
    } else {
      onChange(`+${callingCode}${text}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countryPickerContainer}
          onPress={() => setPickerVisible(true)}
        >
          <CountryPicker
            countryCode={countryCode}
            withCallingCode
            withFlag
            withFilter
            visible={isPickerVisible}
            onClose={() => setPickerVisible(false)}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
              if (value.trim() !== "") {
                onChange(
                  `+${country.callingCode[0]}${value.replace(/^\+\d+/, "")}`
                );
              }
            }}
          />
          <Text>+{callingCode}</Text>
          <Ionicons name="chevron-down" size={16} color="#555" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t("phonePlaceholder")}
            value={value.replace(`+${callingCode}`, "")}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginBottom: 16,
    position: "relative",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    color: "#768A91",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  countryPickerContainer: {
    backgroundColor: "#EDF3F5",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#EDF3F5",
    borderRadius: 8,
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#EDF3F5",
    color: "black",
    borderRadius: 8,
  },
});

export default PhoneInput;
