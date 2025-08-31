import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getPromotions } from "../../Redux/Auth/authActions";
import { t } from "../../lib/i18n";
import { useLanguage } from "../../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const categories = useSelector((state: any) => state.auth.categories);
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const dispatch: any = useDispatch();
  const { language, changeLanguage } = useLanguage();
  const [search, setSearch] = useState("");

  const handleRoute = (query: string) => {
    dispatch(getPromotions(query));
    router.push("/Offers/All");
  };

  const filteredData = categories?.results?.filter((item: any) => {
    const query = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.locale.en.title.toLowerCase().includes(query) ||
      item.locale.ar.title.includes(query)
    );
  });

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          {t("home.greeting")} {user?.locale?.[language]?.firstName}
          <View className="relative">
            {/* Notification icon commented out */}
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row items-center bg-gray-100 px-3 py-2 rounded-xl">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder={t("home.searchPlaceholder")}
            className="ml-2 flex-1 text-gray-600 py-2"
            onChangeText={(value) => setSearch(value)}
          />
        </View>

        {/* Categories Grid */}
        <ScrollView className="mt-2 mb-2">
          <View className="flex-wrap flex-row justify-between">
            {filteredData?.map((category: any, index: any) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] bg-gray-100 p-4 rounded-xl items-center mb-4"
                onPress={() =>
                  handleRoute(
                    `limit=100000&categoryName=${category?.locale?.en?.title}`
                  )
                }
              >
                <Image
                  source={{ uri: category?.img }}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
                <Text className="text-center text-black font-medium mt-2">
                  {category?.locale?.[language]?.title ||
                    category?.locale?.en?.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
