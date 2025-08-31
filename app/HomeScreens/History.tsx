import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { getTransactions } from "@/Redux/Auth/authActions";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { t } from "../../lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const [transactions, setTransactions]: any = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const isLogged = useSelector((state: any) => state.auth.isLogged);
  const isFocused = useIsFocused();

  const transactionsData = useSelector((state: any) => state.auth.transactions);

  // const filteredData = transactionsData?.results?.filter((item: any) =>
  //   item?.partner?.firstName
  //     ?.toLowerCase()
  //     ?.includes(searchQuery?.toLowerCase())
  // );

  const getHistory = () => {
    dispatch(
      getTransactions(user?.id, (status: string, response: any) => {
        if (status === "Success") {
          // Success handling if needed
        } else {
          // Error handling if needed
        }
      })
    );
  };

  useEffect(() => {
    getHistory();
  }, [isFocused]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleRoute = (id: string) => {
    router.push({
      pathname: "/Screens/HistoryDetails",
      params: { id: id },
    });
  };

  if (!isLogged) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg font-semibold mb-4">
          {t("history.loginPrompt")}
        </Text>
        <TouchableOpacity
          className="px-6 py-3 bg-lime-400 rounded-lg"
          onPress={() => router.push("/AuthScreens/LogIn")}
        >
          <Text className="text-black font-semibold">
            {t("history.goToLogin")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white px-4 pt-5 pb-12">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-xl">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder={t("history.searchPlaceholder")}
            className="ml-2 flex-1 text-gray-600 py-2"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        {/* Transaction List */}
        <FlatList
          data={transactionsData?.results}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListEmptyComponent={
            <Text className="text-center mt-10 text-gray-500">
              {t("history.noResults")}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white p-4 mt-4 rounded-lg border border-gray-200 shadow-sm"
              onPress={() => handleRoute(item?.id)}
            >
              {/* Top Section - Order ID, Category & Amount */}
              <View className="flex-col">
                <Text className="text-[14px] font-semibold text-gray-800">
                  {t("history.orderIdPrefix")}
                  {item.id}
                </Text>
                <View className="flex flex-row justify-between items-center mt-2">
                  <View className="bg-gray-100 px-3 py-1 rounded-full">
                    <Text className="text-gray-600 text-xs">
                      {item?.promotionId?.locale?.en?.categoryName ||
                        t("history.categoryLabel")}
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.totalBill} {t("history.amountLabel")}
                  </Text>
                </View>
              </View>

              {/* Details */}
              <View className="mt-3">
                {/* Partner */}
                <View className="flex-row items-center justify-between mb-1">
                  <View className="bg-gray-100 p-2 rounded-md mr-1">
                    <FontAwesome name="user" size={14} color="green" />
                  </View>
                  <Text className="text-gray-500 text-sm">
                    {t("history.partnerDetails")}
                  </Text>
                  <Text className="ml-auto text-gray-700 font-medium">
                    {item?.partner?.businessName}
                  </Text>
                </View>

                {/* Location */}
                <View className="flex-row items-center justify-between mb-1">
                  <View className="bg-gray-100 p-2 rounded-md mr-1">
                    <FontAwesome name="map-marker" size={17} color="green" />
                  </View>
                  <Text className="text-gray-500 text-sm">
                    {t("history.location")}
                  </Text>
                  <Text className="ml-auto text-gray-700 font-medium text-[12px]">
                    {item?.promotionId?.locations[0]?.address?.length > 30
                      ? item?.promotionId?.locations[0]?.address?.slice(0, 30) +
                        "..."
                      : item?.promotionId?.locations[0]?.address ||
                        t("history.noLocation")}
                  </Text>
                </View>

                {/* Date */}
                <View className="flex-row items-center justify-between">
                  <View className="bg-gray-100 p-2 rounded-md mr-1">
                    <FontAwesome name="calendar" size={14} color="green" />
                  </View>
                  <Text className="text-gray-500 text-sm">
                    {t("history.date")}
                  </Text>
                  <Text className="ml-auto text-gray-700 font-medium">
                    {formatDate(item?.date)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
