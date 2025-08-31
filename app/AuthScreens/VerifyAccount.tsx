import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";

const VerifyAccount = () => {
  const handleClick = () => {
    console.log("Hello");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#acacac"} />
      <View style={styles.contentContainer}>
        <Link href={"/AuthScreens/LogIn"} replace asChild>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/Back.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </Link>
        <View className="pt-10">
          <Text className="uppercase" style={styles.title}>
            Verify Your Account
          </Text>
          <Text style={styles.subtitle}>Choose how do you want to verify?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {/* Option 1 */}
          <Link
            href={"/AuthScreens/Common/EmailSentConfirmation"}
            asChild
            replace
          >
            <TouchableOpacity onPress={handleClick} style={styles.option}>
              <MaterialIcons name="mail-outline" size={24} color="#2F4451" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Via Email</Text>
                <Text style={styles.optionSubtitle}>
                  maheen@discountcard.com
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Option 2 */}
          <TouchableOpacity onPress={handleClick} style={styles.option}>
            <Feather name="phone" size={24} color="black" />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Via Phone</Text>
              <Text style={styles.optionSubtitle}>+123456789</Text>
            </View>
          </TouchableOpacity>
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
    gap: 16,
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

export default VerifyAccount;
