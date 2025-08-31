import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Text,
  Alert,
  I18nManager,
  Platform,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { getPromotionByID, addEvent } from "@/Redux/Auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function OfferDetails() {
  const router = useRouter();
  const { offer }: any = useLocalSearchParams();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const user = useSelector((state: any) => state.auth.user);
  const dispatch: any = useDispatch();
  const [offerData, setOfferData]: any = useState({});
  const isLogged = useSelector((state: any) => state.auth.isLogged);
  const { language } = useLanguage();

  const [region, setRegion] = useState({
    latitude: 52.4823,
    longitude: 1.89,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const isRTL = language === "ar";
  const flexDirection = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  useEffect(() => {
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (offer) {
      const data = JSON.parse(offer);
      let id = data.id ? data.id : data.promotionId;
      dispatch(
        getPromotionByID(id, (status: string, response: any) => {
          if (status === "Success") {
            setOfferData(response);
          }
        })
      );
    }
  }, [offer]);

  const getDaysUntilExpiry = (expiryDateString: string): number => {
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    return Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  };

  useEffect(() => {
    if (offerData?.locations?.[0]?.coordinates?.coordinates?.length === 2) {
      const [latitude, longitude] =
        offerData.locations[0].coordinates.coordinates;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }

    if (isLogged && offerData) {
      createViewEvent();
    }
  }, [offerData]);

  const getOfferLatLng = () => {
    const coords = offerData?.locations?.[0]?.coordinates?.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      return { latitude: coords[0], longitude: coords[1] };
    }
    return { latitude: 53.4808, longitude: -2.2426 }; // Manchester fallback
  };

  const buildClickEvent = () => {
    const { latitude, longitude } = getOfferLatLng();
    return {
      promotionId: offerData?.id,
      userId: user?.id,
      categoryName: offerData?.categoryName || "",
      eventType: "click",
      source: "app",
      location: {
        type: "Point",
        coordinates: [latitude, longitude],
      },
    };
  };

  const buildViewEvent = () => {
    const { latitude, longitude } = getOfferLatLng();
    return {
      promotionId: offerData?.id,
      userId: user?.id,
      categoryName: offerData?.categoryName || "",
      eventType: "view",
      source: "app",
      location: {
        type: "Point",
        coordinates: [latitude, longitude],
      },
    };
  };

  const createEvent = async () => {
    const eventPayload = buildClickEvent();
    dispatch(addEvent(eventPayload, async (status: any, message: any) => {}));
  };

  const createViewEvent = async () => {
    const eventPayload = buildViewEvent();
    if (
      eventPayload?.promotionId &&
      eventPayload?.userId &&
      eventPayload?.categoryName &&
      eventPayload?.location?.coordinates?.length === 2
    ) {
      dispatch(
        addEvent(eventPayload, async (_status: any, _message: any) => {})
      );
    } else {
      // console.warn("Skipping event, missing required values:", eventPayload);
    }
  };

  const handleRoute = () => {
    router.push({
      pathname: "/Offers/Info",
      params: { offer: JSON.stringify(offerData) },
    });
  };

  const handleRouteReviews = () => {
    router.push({
      pathname: "/Offers/Reviews",
      params: { offer: JSON.stringify(offerData) },
    });
  };

  const handleRouteQR = () => {
    if (!isLogged) {
      Alert.alert(t("offerDetails.loginAlert"));
      return;
    }
    createEvent();
    router.push("/HomeScreens/Card");
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 bg-white pt-0"
        contentContainerStyle={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {/* Image Carousel */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            className="w-full h-64"
          >
            {offerData?.images?.map((image: any, index: any) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width, height: 256 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => router.back()}
            className={`absolute top-10 ${
              isRTL ? "right-4" : "left-4"
            } bg-lime-400 p-2 rounded-full`}
          >
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>

          <View className="absolute bottom-4 w-full flex-row justify-center space-x-2">
            {offerData?.images?.map((_: any, index: any) => (
              <View
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Restaurant Info */}
        <View className="p-4" style={{ direction: isRTL ? "rtl" : "ltr" }}>
          <View
            className="flex-row items-center space-x-2"
            style={{ flexDirection }}
          >
            <Image
              source={{
                uri:
                  offerData?.partner?.logoUrl ||
                  "https://seeklogo.com/images/K/kfc-logo-146B9635A3-seeklogo.com.png",
              }}
              className="w-8 h-8"
            />
            <Text className="text-xl font-bold" style={{ textAlign }}>
              {offerData?.locale?.[language]?.title ||
                offerData?.locale?.en?.title}
            </Text>
          </View>

          <View
            className="flex-row justify-between items-center mt-4 space-x-4"
            style={{ flexDirection }}
          >
            {/* Ratings Section */}
            <TouchableOpacity
              className="flex-1 border border-gray-300 rounded-lg p-3 flex-row justify-center items-center"
              onPress={handleRouteReviews}
              style={{ flexDirection }}
            >
              <FontAwesome name="star" size={16} color="gold" />
              <Text
                className="ml-2 text-gray-900 font-semibold"
                style={{ textAlign }}
              >
                {offerData?.averageRating || "0.0"}
              </Text>
              <Text className="ml-1 text-gray-900" style={{ textAlign }}>
                {offerData?.reviews?.length || 0} {t("offerDetails.reviews")}
              </Text>
            </TouchableOpacity>

            {/* Info Section */}
            <TouchableOpacity
              className="flex-1 border border-gray-300 rounded-lg p-3 flex-row justify-center items-center"
              onPress={handleRoute}
              style={{ flexDirection }}
            >
              <Feather name="info" size={16} color="gray" />
              <Text
                className="ml-2 text-gray-900 font-semibold"
                style={{ textAlign }}
              >
                {t("offerDetails.info")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Offer Section */}
          <Text className="text-lg font-bold mb-4" style={{ textAlign }}>
            {t("offerDetails.offer")}
          </Text>

          {/* Offer Card */}
          <View className="bg-lime-300 border-0 p-1 rounded-2xl overflow-hidden">
            <View className="p-3 bg-white rounded-xl">
              <Text
                className="text-xl font-bold text-gray-900"
                style={{ textAlign }}
              >
                {t("offerDetails.discountText", {
                  discount: offerData?.discount || 0,
                })}
              </Text>
              <Text className="text-gray-600" style={{ textAlign }}>
                {t("offerDetails.onAllOrders")}
              </Text>

              <View
                className="flex-row items-center mt-2"
                style={{ flexDirection }}
              >
                <Feather name="info" size={16} color="gray" />
                <Text className="text-gray-500 ml-2" style={{ textAlign }}>
                  {t("offerDetails.expiresIn", {
                    days: getDaysUntilExpiry(offerData?.expiryDate) || 0,
                  })}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-lime-300 p-4"
              onPress={handleRouteQR}
            >
              <Text className="text-center font-bold text-black">
                {t("offerDetails.scanQR")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map Section */}
          <Text className="mt-6 text-lg font-bold" style={{ textAlign }}>
            {t("offerDetails.viewLocation")}
          </Text>
          <View className="w-full h-48 mt-2 rounded-lg overflow-hidden">
            <MapView
              className="w-full h-full"
              provider="google"
              // provider={Platform?.OS === "android" && PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 53.462055, // UK Coordinates
                longitude: -2.208749,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              zoomEnabled={true}
            >
              <Marker
                pinColor="red"
                coordinate={{
                  latitude: region?.latitude || 25.278043,
                  longitude: region?.longitude || 55.300601,
                }}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
