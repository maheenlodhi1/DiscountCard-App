import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Pressable,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  getPromotions,
  getTrendingPromotions,
  getRecommendedPromotions,
} from "../../Redux/Auth/authActions";
import { useIsFocused } from "@react-navigation/native";
import { LocationPermission } from "../../components/Permissions/Location";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const categories = useSelector((state: any) => state.auth.categories);
  const offers = useSelector((state: any) => state.auth.promotions);
  const trendingOffers = useSelector(
    (state: any) => state.auth.trendingPromotions
  );
  const recommededOffers = useSelector(
    (state: any) => state.auth.recommendedPromotions
  );
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [limit, setLimit] = useState(10);
  const isFocused = useIsFocused();
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getPromotions(`limit=10`));
    dispatch(getTrendingPromotions(`top_n=10`));
    if (user) dispatch(getRecommendedPromotions(`${user?.id}?top_n=10`));
  }, []);

  const handleRoute = (query: string) => {
    dispatch(getPromotions(query));
    router.push("/Offers/All");
  };

  const handleRouteTrending = (query: string) => {
    dispatch(getTrendingPromotions(query));
    router.push("/Offers/Trending");
  };

  const handleRouteRecommendedOffer = (query: string) => {
    dispatch(getRecommendedPromotions(query));
    router.push("/Offers/Recommended");
  };

  const handleRouteOffer = (offer: any) => {
    router.push({
      pathname: "/Offers/Details",
      params: {
        offer: JSON.stringify(offer),
      },
    });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const result = await LocationPermission();
      if (!result) {
        ToastAndroid.show(t("permissions.locationDenied"), ToastAndroid.LONG);
      }
    };
    fetchLocation();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-white px-4 pt-5">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold">
            {t("home.greeting")} {user?.locale?.[language]?.firstName}
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row items-center bg-gray-100 px-3 py-1 rounded-xl">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder={t("home.searchPlaceholder")}
            className="ml-2 flex-1 text-gray-600 py-3"
          />
        </View>

        {/* Promo Banner */}
        <View className="mt-4 bg-green-100 rounded-xl flex-row items-center px-4 py-5 relative">
          <View className="flex flex-row items-center">
            <Text className="text-black font-medium">
              {t("home.promoTextStart")}{" "}
            </Text>
            <Text className="bg-white px-1 py-0 rounded-md text-lg font-semibold">
              {t("home.promoDiscount")}
            </Text>
            <Text className="text-black font-medium">
              {" "}
              {t("home.promoTextEnd")}
            </Text>
          </View>
          <Image
            source={require("../../assets/images/black-friday.png")}
            className="w-24 h-24 ml-auto absolute right-2"
          />
        </View>

        {/* Categories Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">
              {t("home.categories.title")}
            </Text>
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-gray-500">
                {t("home.categories.seeAll")}
              </Text>
              <Link href={"/Categories/All"} asChild>
                <TouchableOpacity className="p-1 bg-gray-100 rounded-md">
                  <Feather name="chevron-right" size={16} color="black" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {categories?.results?.map((category: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  handleRoute(
                    `limit=100000&categoryName=${category?.locale?.en?.title}`
                  )
                }
              >
                <CategoryItem
                  icon={category.img}
                  text={
                    category.locale[language]?.title || category.locale.en.title
                  }
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trendig Offers Section */}
        <View className="mt-6 pb-0">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">Trending Deals</Text>
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-gray-500">
                {t("home.categories.seeAll")}
              </Text>
              <TouchableOpacity
                className="p-1 bg-gray-100 rounded-md"
                onPress={() => handleRouteTrending(`top_n=100`)}
              >
                <Feather name="chevron-right" size={16} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {trendingOffers?.trending_deals?.map(
              (offer: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRouteOffer(offer)}
                  activeOpacity={0.8}
                >
                  <OfferCard
                    offer={offer}
                    language={language}
                    type="trending"
                  />
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        {/* Recommended Offers Section */}

        {user && (
          <View className="mt-2 pb-0">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold">Deals For You</Text>
              <View className="flex flex-row items-center space-x-2">
                <Text className="text-gray-500">
                  {t("home.categories.seeAll")}
                </Text>
                <TouchableOpacity
                  className="p-1 bg-gray-100 rounded-md"
                  onPress={() =>
                    handleRouteRecommendedOffer(`${user.id}?top_n=100`)
                  }
                >
                  <Feather name="chevron-right" size={16} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4"
            >
              {recommededOffers?.recommended_deals?.map(
                (offer: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRouteOffer(offer)}
                    activeOpacity={0.8}
                  >
                    <OfferCard
                      offer={offer}
                      language={language}
                      type="recommended"
                    />
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
        )}

        {/* Exclusive Offers Section */}
        <View className="mt-2 pb-10">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">Exclusive Deals</Text>
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-gray-500">
                {t("home.categories.seeAll")}
              </Text>
              <TouchableOpacity
                className="p-1 bg-gray-100 rounded-md"
                onPress={() => handleRoute(`limit=100000`)}
              >
                <Feather name="chevron-right" size={16} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {offers?.results?.map((offer: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRouteOffer(offer)}
                activeOpacity={0.8}
              >
                <OfferCard offer={offer} language={language} type="normal" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CategoryItem({ icon, text }: { icon: any; text: string }) {
  return (
    <View className="items-center w-24 mx-2">
      <View className="bg-gray-100 p-4 rounded-full">
        <Image
          source={{ uri: icon }}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </View>
      <Text className="text-gray-700 text-sm mt-2 text-center">{text}</Text>
    </View>
  );
}

function OfferCard({
  offer,
  language,
  type,
}: {
  offer: any;
  language: string;
  type: string;
}) {
  return (
    <View className="bg-white shadow-md relative rounded-lg overflow-hidden mx-2 w-64">
      <Image
        source={{ uri: offer?.images[0] }}
        className="w-full h-40"
        resizeMode="cover"
      />
      {type === "trending" && (
        <View className="absolute bg-[#F7561B] right-3 top-2 px-3 py-1 rounded-xl">
          <Text className="text-white text-[11px]">HOT</Text>
        </View>
      )}

      {type === "recommended" && (
        <View className="absolute bg-[#AEF353] right-3 top-2 px-3 py-1 rounded-xl">
          <Text className="text-black text-[11px]">RECOMMENDED</Text>
        </View>
      )}

      <View className="p-4">
        <Text className="text-lg font-medium">
          {offer?.locale?.[language]?.title || offer?.locale?.en.title}
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          {offer?.locale?.[language]?.categoryName ||
            offer?.locale?.en.categoryName}
        </Text>
        <View className="flex-row items-center mt-2 justify-between">
          <View className="flex-row items-center">
            <FontAwesome name="star" size={14} color="gold" />
            <Text className="text-gray-600 text-sm ml-1">
              {offer?.averageRating} ({offer?.reviews.length})
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-sm">2 Miles</Text>
            <Feather name="send" size={15} color="green" className="ml-1" />
          </View>
        </View>
      </View>
    </View>
  );
}
