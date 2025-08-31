import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import VerificationModal from "./VerifiedModal";
import { Link } from "expo-router";

const EmailSentConfirmation = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#acacac"} />
      <View style={styles.contentContainer}>
        <Link href={"/AuthScreens/LogIn"} replace asChild>
          <TouchableOpacity>
            <Image
              source={require("../../../assets/images/Back.png")}
              style={styles.image}
            />
          </TouchableOpacity>
        </Link>
        <View className="w-full flex items-center justify-center pt-6">
          <Image
            source={require("../../../assets/images/Email.png")}
            style={styles.mailImage}
          />
        </View>
        <View className="pt-6 flex items-center">
          <Text style={styles.title}>An Email has been Sent</Text>
          <Text className="w-[90%] text-center" style={styles.subtitle}>
            A recovery email has been sent to the registered email
          </Text>
        </View>
        {/* <VerificationModal /> */}
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
  mailImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    fontWeight: "400",
  },
});

export default EmailSentConfirmation;
