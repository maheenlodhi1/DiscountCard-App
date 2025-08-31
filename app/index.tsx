import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { SolidButton } from "@/components/Common/solidButton";
import { OutlineButton } from "@/components/Common/outlineButton";
import { Link } from "expo-router";
import { t } from "../lib/i18n";

const HomeScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const moveAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;

  const { width, height } = Dimensions.get("window");

  const [screen, setSetScreen] = useState(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: -20,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [moveAnim]);

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
              borderRadius: 32,
              flex: 1,
              marginTop: 12,
            },
          ]}
          className=" bg-[#E5FFC2] mb-5"
        >
          <View style={{ alignItems: "flex-start", paddingVertical: 20 }}>
            <Image
              source={require("../assets/images/kafu.png")}
              className="mt-0"
              style={{
                objectFit: "contain",
                width: 150,
                height: 140,
              }}
            />
          </View>
          {screen == 1 ? (
            <View className="px-6">
              <Text
                className="text-[37px]"
                style={{ fontFamily: "PlusJakartaSans-SemiBold" }}
              >
                {t("welcome")}
              </Text>
              <Text>{t("welcome2")}</Text>
              <Text className="text-[12px] mt-3">{t("welcome3")}</Text>
            </View>
          ) : (
            <View className="px-6">
              <Text
                className="text-[37px]"
                style={{ fontFamily: "PlusJakartaSans-SemiBold" }}
              >
                {t("welcome4")}
              </Text>
              <Text>{t("welcome5")}</Text>
              <Text className="text-[12px] mt-3">{t("welcome5")}</Text>
            </View>
          )}

          <View className="flex flex-row space-x-2 absolute left-5 bottom-6">
            <TouchableOpacity onPress={() => setSetScreen(1)}>
              <Image
                source={require("../assets/images/icons/BackButton.png")}
                className="mt-0"
                style={{
                  objectFit: "contain",
                  width: 60,
                  height: 60,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSetScreen(2)}>
              <Image
                source={require("../assets/images/icons/NextButton.png")}
                className="mt-0"
                style={{
                  objectFit: "contain",
                  width: 60,
                  height: 60,
                }}
              />
            </TouchableOpacity>
          </View>

          <Image
            source={require("../assets/images/EllipseLeft.png")}
            className="mt-0 absolute -bottom-9 right-2"
            style={{
              objectFit: "contain",
              width: width * 0.38,
              height: height * 0.38,
            }}
          />
          <Image
            source={require("../assets/images/EllipseRight.png")}
            className="mt-0 absolute -right-0 bottom-4"
            style={{
              objectFit: "contain",
              width: width * 0.2,
              height: height * 0.2,
            }}
          />

          <View className="absolute -bottom-3 right-4">
            <Animated.View
              style={{
                transform: [{ translateY: moveAnim }],
                marginTop: 15,
              }}
            >
              <Image
                source={require("../assets/images/icons/discount.png")}
                className="mt-0"
                style={{
                  objectFit: "contain",
                  width: width * 0.3,
                  height: height * 0.28,
                }}
              />
            </Animated.View>
          </View>
        </View>
        <View className="mb-4">
          <View className="mb-3">
            <Link href={"/AuthScreens/LogIn"} asChild>
              <SolidButton
                title={t("login")}
                onPress={() => {}}
                disabled={false}
              />
            </Link>
          </View>

          <View>
            <Link href={"/HomeScreens"} asChild>
              <OutlineButton title={t("skip")} onPress={() => {}} />
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#acacac",
  },
  splashImage: {
    resizeMode: "cover",
  },
  shadow: {
    overflow: "hidden",
    shadowColor: "gray",
    shadowRadius: 20,
    shadowOpacity: 0,
    elevation: 3,
  },
});

export default HomeScreen;
