"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { contactUs } from "@/Redux/Auth/authActions";

const HelpCenterScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ subject: "", details: "" });

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { subject: "", details: "" };

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!details.trim()) {
      newErrors.details = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const handleCallBack = (status: string, message: string) => {
      setIsLoading(false);
      if (status === "Success") {
        Alert.alert("Success", message);
        setSubject("");
        setDetails("");
      } else {
        Alert.alert("Error", message || "Something went wrong");
      }
    };
    dispatch(contactUs({ subject, details }, handleCallBack));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color="#2F4451" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subject Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Subject"
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor="#768A91"
            />
            {errors.subject ? (
              <Text style={styles.errorText}>{errors.subject}</Text>
            ) : null}
          </View>

          {/* Details Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Details</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter details"
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#768A91"
            />
            {errors.details ? (
              <Text style={styles.errorText}>{errors.details}</Text>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.submitButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Home indicator */}
        <View style={styles.homeIndicatorContainer}>
          <View style={styles.homeIndicator} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#121712",
    fontFamily: "PlusJakartaSans-Bold",
  },
  placeholder: {
    width: 40, // To balance the header
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#768A91",
    marginBottom: 6,
    fontFamily: "PlusJakartaSans-Medium",
    letterSpacing: -0.27,
  },
  input: {
    backgroundColor: "#EDF3F5",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#000000",
    height: 44,
    fontFamily: "PlusJakartaSans-Medium",
  },
  textArea: {
    backgroundColor: "#EDF3F5",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#000000",
    height: 92,
    textAlignVertical: "top",
    fontFamily: "PlusJakartaSans-Medium",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#AEF353",
    borderRadius: 6,
    padding: 8,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  homeIndicatorContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  homeIndicator: {
    width: 135,
    height: 5,
    backgroundColor: "#D0D5DC",
    borderRadius: 100,
  },
});

export default HelpCenterScreen;
