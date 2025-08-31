import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { logoutUser } from "../../Redux/Auth/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { t } from "../../lib/i18n";

export default function ProfileScreen() {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const { user, isLogged, dashboardStats } = useSelector(
    (state: any) => state.auth
  );

  const handleLogout = async () => {
    try {
      dispatch(logoutUser(handleLogoutCallback));
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogoutCallback = (type: string, response: string | any) => {
    if (type === "Success") {
      Alert.alert(t("profile.logout_success"));
      router.replace("/");
    } else {
      Alert.alert(t("profile.logout_failed"));
    }
  };

  if (!isLogged) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg font-semibold mb-4">
          {t("profile.login_prompt")}
        </Text>
        <TouchableOpacity
          className="px-6 py-3 bg-lime-400 rounded-lg"
          onPress={() => router.push("/AuthScreens/LogIn")}
        >
          <Text className="text-black font-semibold">
            {t("profile.go_to_login")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gray-100">
        <View className="bg-white px-4 pt-5 pb-5 rounded-bl-3xl rounded-br-3xl">
          {/* Profile Section */}
          <View className="items-center flex flex-row space-x-4 px-3">
            <View className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {user?.photoUrl ? (
                <Image
                  source={{ uri: user?.photoUrl }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Feather name="user" size={45} color="gray" />
              )}
            </View>
            <View>
              <Text className="text-lg font-semibold">
                {user?.locale?.en?.firstName} {user?.locale?.en?.lastName}
              </Text>

              <Link href={"/Screens/EditProfile"} asChild>
                <TouchableOpacity>
                  <Text className="text-gray-500">
                    {t("profile.view_profile")}
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* QR Scans & Amount Saved */}
          <View className="flex-row justify-between mt-4">
            <View className="bg-lime-100 p-4 rounded-xl flex-1 mr-2 items-center">
              <Text className="text-lg font-bold">
                {dashboardStats?.qrScans || 0}
              </Text>
              <Text className="text-gray-500 text-xs">
                {t("profile.qr_scans")}
              </Text>
            </View>
            <View className="bg-blue-100 p-4 rounded-xl flex-1 ml-2 items-center">
              <Text className="text-lg font-bold">
                GBP {dashboardStats?.totalSavings || 0}
              </Text>
              <Text className="text-gray-500 text-xs">
                {t("profile.amount_saved")}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white mt-4 rounded-tl-3xl rounded-tr-3xl px-4 py-6 h-full">
          <View className="rounded-lg">
            <Text className="text-lg font-semibold mb-2">
              {t("profile.general")}
            </Text>
            {[
              {
                name: t("profile.premium_membership"),
                icon: "crown",
                isMaterial: true,
                route: "/Screens/PremiumMembership",
              },
              {
                name: t("profile.invite_friends"),
                icon: "gift",
                isMaterial: false,
                route: "/Screens/Invite",
              },
              {
                name: t("profile.help_center"),
                icon: "mail",
                isMaterial: false,
                route: "/Screens/HelpCenter",
              },
              {
                name: t("profile.about_us"),
                icon: "info",
                isMaterial: false,
                route: "/Screens/AboutUs",
              },
              {
                name: t("profile.terms_and_policies"),
                icon: "file-text",
                isMaterial: false,
                route: "/Screens/Terms",
              },
              {
                name: t("profile.delete_account"),
                icon: "trash",
                isMaterial: false,
                onPress: () => {
                  Alert.alert(
                    t("profile.delete_account"),
                    t("profile.delete_account_prompt"),
                    [
                      { text: t("profile.cancel"), style: "cancel" },
                      {
                        text: t("profile.yes_delete"),
                        style: "destructive",
                        onPress: () => {
                          Alert.alert(
                            t("profile.request_submitted"),
                            t("profile.request_submitted")
                          );
                        },
                      },
                    ]
                  );
                },
              },
            ].map((item: any, index: any) => {
              const content = (
                <TouchableOpacity
                  className="flex-row items-center py-4"
                  onPress={item.onPress}
                >
                  {item.isMaterial ? (
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={20}
                      color="black"
                    />
                  ) : (
                    <Feather name={item.icon} size={18} color="black" />
                  )}
                  <Text className="ml-3 flex-1">{item.name}</Text>
                  <Feather name="chevron-right" size={18} color="black" />
                </TouchableOpacity>
              );

              return item.route ? (
                <Link key={index} href={item.route} asChild>
                  {content}
                </Link>
              ) : (
                <React.Fragment key={index}>{content}</React.Fragment>
              );
            })}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="mt-3 p-4 bg-white border border-gray-200 rounded-lg items-center"
            onPress={handleLogout}
          >
            <Text className="text-black font-semibold">
              {t("profile.logout_button")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
