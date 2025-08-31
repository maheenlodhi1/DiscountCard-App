import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { t } from "../../lib/i18n";

type InputType = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  required?: boolean;
  onForgotPassword?: () => void;
  editable?: boolean;
};

const Input: React.FC<InputType> = ({
  label,
  placeholder = "Enter",
  value,
  onChange,
  type,
  required,
  onForgotPassword,
  editable = true,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text className="" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          style={styles.input}
          placeholderTextColor="#768A91"
          secureTextEntry={type === "password" && !isPasswordVisible}
          keyboardType={type === "email" ? "email-address" : "default"}
          editable={editable}
        />
        {type === "password" && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={18}
              color="#768A91"
            />
          </TouchableOpacity>
        )}
      </View>
      {type === "password" && onForgotPassword && (
        <TouchableOpacity onPress={onForgotPassword}>
          <Text
            className="w-full text-right absolute"
            style={styles.forgotPassword}
          >
            {t("forgotPassword")}?
          </Text>
        </TouchableOpacity>
      )}
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
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: "#EDF3F5",
    color: "black",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  forgotPassword: {
    marginTop: 8,
    fontSize: 12,
    color: "#fffff",
    fontWeight: "500",
  },
});

export default Input;
