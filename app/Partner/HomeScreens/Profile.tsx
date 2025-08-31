import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { logoutUser } from "@/Redux/Auth/authActions";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import BottomSheet from "@gorhom/bottom-sheet";
import LanguageBottomSheet from "@/components/Common/LanguageSwitcher";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const isLogged = useSelector((state: any) => state.auth.isLogged);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const languageSheetRef = useRef<BottomSheet>(null);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser(handleLogoutCallback));
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogoutCallback = (type: string) => {
    if (type === "Success") {
      Alert.alert("Logout Successful");
      router.replace("/");
    } else {
      Alert.alert("Logout Failed");
    }
  };

  if (!isLogged) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg font-semibold mb-4">
          Please login or create a new account
        </Text>
        <TouchableOpacity
          className="px-6 py-3 bg-lime-400 rounded-lg"
          onPress={() => router.push("/AuthScreens/LogIn")}
        >
          <Text className="text-black font-semibold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView className="flex-1 bg-gray-100">
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
              <Link href="/Partner/EditProfile" asChild>
                <TouchableOpacity>
                  <Text className="text-gray-500">View Profile</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        <View className="bg-white mt-4 rounded-tl-3xl rounded-tr-3xl px-4 py-6 h-full">
          <View className="rounded-lg">
            <Text className="text-lg font-semibold mb-2">General</Text>
            {[
              {
                name: "Language",
                icon: "language-outline",
                isIon: true,
                action: () => languageSheetRef.current?.snapToIndex(0),
              },
              {
                name: "Help Center",
                icon: "mail",
                isMaterial: false,
                route: "/Screens/AboutUs",
              },
              {
                name: "About Us",
                icon: "info",
                isMaterial: false,
                route: "/Screens/AboutUs",
              },
              {
                name: "Terms & Policies",
                icon: "file-text",
                isMaterial: false,
                route: "/Screens/Terms",
              },
              {
                name: "Delete Account",
                icon: "trash",
                isMaterial: false,
                onPress: () => {
                  Alert.alert(
                    "Delete Account",
                    "Are you sure you want to delete your account?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Yes, Delete",
                        style: "destructive",
                        onPress: () => {
                          // You can call an API or Redux action here
                          Alert.alert(
                            "Request Submitted",
                            "Your account deletion request has been submitted."
                          );
                        },
                      },
                    ]
                  );
                },
              },
            ].map((item: any, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-4"
                onPress={() => {
                  if (item.action) item.action();
                  else if (item.route) router.push(item.route);
                }}
              >
                {item.isIon ? (
                  <Ionicons name={item.icon} size={18} color="black" />
                ) : (
                  <Feather name={item.icon} size={18} color="black" />
                )}
                <Text className="ml-3 flex-1">{item.name}</Text>
                <Feather name="chevron-right" size={18} color="black" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="mt-6 p-4 bg-white border border-gray-200 rounded-lg items-center"
            onPress={handleLogout}
          >
            <Text className="text-black font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Language Bottom Sheet */}
        <LanguageBottomSheet
          sheetRef={languageSheetRef}
          setLanguage={setSelectedLanguage}
          selectedLanguage={selectedLanguage}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
