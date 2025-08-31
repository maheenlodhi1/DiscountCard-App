import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const OfferRedeemedScreen = () => {
  const router = useRouter();
  const data = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPressIn={() => router.replace("/Partner/HomeScreens/Profile")}
        >
          <Feather name="x" size={24} />
        </TouchableOpacity>
      </View>

      {/* Success Content */}
      <View style={styles.contentContainer}>
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            {/* This is a simplified checkmark icon */}
            <View style={styles.checkmarkCircle}>
              <View style={styles.checkmark} />
            </View>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.successTitle}>Offer Redeemed Successfully</Text>
          <Text style={styles.successSubtitle}>
            Amount Paid after discount {data?.discountedAmount} GBP
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  successIcon: {
    width: 101,
    height: 101,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 101,
    height: 101,
    borderRadius: 50.5,
    backgroundColor: "#62AD00",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 40,
    height: 20,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }],
  },
  messageContainer: {
    alignItems: "center",
    gap: 16,
  },
  successTitle: {
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 19,
    color: "#121712",
    textAlign: "center",
  },
  successSubtitle: {
    fontFamily: "System",
    fontWeight: "500",
    fontSize: 16,
    color: "#121712",
    textAlign: "center",
  },
});

export default OfferRedeemedScreen;
