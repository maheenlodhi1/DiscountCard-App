import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { BackHandler } from "react-native";
import { getPromotions } from "../../Redux/Auth/authActions";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const offers = useSelector((state: any) => state.auth.promotions);
  const categories = useSelector((state: any) => state.auth.categories);
  const router = useRouter();
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { language, changeLanguage } = useLanguage();

  const handleRoute = (offer: any) => {
    router.push({
      pathname: "/Offers/Details",
      params: {
        offer: JSON.stringify(offer),
      },
    });
  };

  const getOfferByCategory = (query: string) => {
    dispatch(getPromotions(query));
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(getPromotions("limit=10"));
  //   }, [dispatch])
  // );

  const filteredOffers = offers?.results?.filter((offer: any) => {
    const query = search.toLowerCase();
    return (
      offer?.title?.toLowerCase().includes(query) ||
      offer?.description?.toLowerCase().includes(query) ||
      offer?.categoryName?.toLowerCase().includes(query) ||
      offer?.partner?.locale?.en?.businessName?.toLowerCase().includes(query) ||
      offer?.partner?.locale?.ar?.businessName?.includes(query)
    );
  });

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-white flex-1 p-4 pt-5">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold">
            {t("home.greeting")} {user?.locale?.[language]?.firstName}
          </Text>
          <View className="relative">
            {/* Notification icon commented out */}
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row items-center bg-gray-100 px-3 py-1 rounded-xl">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder={t("home.searchPlaceholder")}
            className="ml-2 py-3 flex-1 text-gray-600"
            onChangeText={(value) => setSearch(value)}
          />
        </View>

        {/* Categories */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {categories?.results?.map((category: any, index: any) => (
              <TouchableOpacity
                key={index}
                className={`mr-3 px-4 py-2 ${
                  selectedCategory === category?.locale?.en?.title
                    ? "bg-lime-300"
                    : "bg-gray-200"
                } rounded-full`}
                onPress={() => {
                  setSelectedCategory(category?.locale?.en?.title);
                  getOfferByCategory(
                    `limit=100000&categoryName=${category?.locale?.en?.title}`
                  );
                }}
              >
                <Text className="text-gray-600">
                  {category?.locale?.[language]?.title ||
                    category?.locale?.en?.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Offers */}
        <View className="mt-2 pb-24">
          <ScrollView className="mb-16">
            {filteredOffers?.map((offer: any, index: any) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRoute(offer)}
                activeOpacity={0.8}
              >
                <View className="mb-2 bg-white shadow-lg rounded-lg overflow-hidden">
                  <Image
                    source={{ uri: offer?.images[0] }}
                    className="w-full h-48"
                  />
                  {/* <View className="absolute top-4 right-4 bg-lime-400 px-3 py-1 rounded-full">
                  <Text className="text-black text-xs font-bold">
                    {t("home.recommendedBadge")}
                  </Text>
                </View> */}
                  <View className="px-1 py-4 pb-0 flex flex-row justify-between">
                    <View>
                      <Text className="text-lg font-medium">
                        {offer?.locale?.[language]?.title ||
                          offer?.locale?.en?.title}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        {offer?.locale?.[language]?.categoryName ||
                          offer?.locale?.en?.categoryName}
                      </Text>
                    </View>

                    {/* Rating */}
                    <View>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-gray-600 text-sm">
                          {offer?.averageRating}
                        </Text>
                        <Text className="text-gray-600 text-sm ml-1">
                          ({offer?.reviews.length} {t("home.reviews")})
                        </Text>
                        <FontAwesome
                          name="star"
                          size={14}
                          color="gold"
                          className="ml-1"
                        />
                      </View>
                      <View className="flex flex-row items-center">
                        <Text className="text-gray-500 text-sm pr-1">
                          2 Miles
                        </Text>
                        <Feather name="send" size={15} color="green" />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
