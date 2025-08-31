import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getPromotions } from "../../Redux/Auth/authActions";
import { useIsFocused } from "@react-navigation/native";
import { t } from "../../lib/i18n";
import { useLanguage } from "../../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const categories = useSelector((state: any) => state.auth.categories);
  const offers = useSelector((state: any) => state.auth.promotions);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [limit, setLimit] = useState(10);
  const isFocused = useIsFocused();
  const { language, changeLanguage } = useLanguage();
  const [search, setSearch] = useState("");

  const handleRoute = (query: string) => {
    dispatch(getPromotions(query));
    router.push("/Offers/All");
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white px-4 pt-5">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold">
            {t("home.greeting")} {user?.locale?.[language]?.firstName}
          </Text>
          <View className="relative">
            {/* Notification icon (commented out) */}
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-4 bg-gray-100 px-3 py-2 rounded-xl flex-row items-center">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder={t("search.search_placeholder")}
            className="ml-2 flex-1 text-gray-600 py-2"
            returnKeyType="search"
            onChangeText={(value) => setSearch(value)}
            onSubmitEditing={() => {
              handleRoute(`limit=100000&{"search":"${search}"}`);
            }}
          />
        </View>

        {/* Filter Buttons */}
        <View className="mt-4 flex-row justify-between">
          <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg">
            <Feather name="map-pin" size={18} color="black" />
            <Text className="ml-2 text-black">{t("search.location")}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg">
            <Feather name="grid" size={18} color="black" />
            <Text className="ml-2 text-black">{t("search.category")}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg">
            <Feather name="filter" size={18} color="black" />
            <Text className="ml-2 text-black">{t("search.sort")}</Text>
          </TouchableOpacity>
        </View>

        {/* Map View */}
        <View className="mt-4 flex-1 rounded-xl overflow-hidden">
          <MapView
            className="w-full h-full"
            provider="google"
            // provider={Platform.OS === "android" ? PROVIDER_GOOGLE : ""}
            initialRegion={{
              latitude: 53.462055, // UK Coordinates
              longitude: -2.208749,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
