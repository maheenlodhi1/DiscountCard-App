import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { getTransactionByID } from "@/Redux/Auth/authActions";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const { id } = useLocalSearchParams();

  const [transaction, setTransaction]: any = useState();

  const getTransaction = (idx: any) => {
    dispatch(
      getTransactionByID(idx, (status: string, response: any) => {
        if (status === "Success") {
          setTransaction(response);
        } else {
          Alert.alert("Verification Failed", response);
        }
      })
    );
  };

  useEffect(() => {
    if (id) {
      getTransaction(id);
    }
  }, [id]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-white px-4 pt-5">
        {/* Header */}
        <View className="flex-row items-center pb-3">
          <TouchableOpacity onPress={() => router.back()} className="p-0">
            <Feather name="arrow-left" size={22} color="black" />
          </TouchableOpacity>
          <Text className="text-[14px] font-semibold flex-1 text-center">
            Order{" "}
            <Text className="text-black font-bold">#{transaction?.id}</Text>
          </Text>
        </View>

        {/* Partner Details */}
        <View className="mt-2">
          {/* Partner Name */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-lime-300 p-2 px-2.5 rounded-md mr-1">
              <FontAwesome name="user" size={14} color="black" />
            </View>
            <Text className="text-gray-500 text-sm">Partner Name</Text>
            <Text className="ml-auto text-gray-700 font-medium">
              {transaction?.partner?.locale?.en?.businessName}
            </Text>
          </View>

          {/* Partner ID */}
          <View className="flex-row items-center justify-between">
            <View className="bg-lime-300 p-2 rounded-md mr-1">
              <FontAwesome5 name="id-card" size={12} color="black" />
            </View>
            <Text className="text-gray-500 text-sm">Partner ID</Text>
            <Text className="ml-auto text-gray-700 font-medium">
              #{transaction?.partner?.id}
            </Text>
          </View>
        </View>

        {/* Offer Details */}
        <Text className="mt-6 text-lg font-bold">Offer Details</Text>
        <View className="mt-2 border-[5px] border-lime-400 rounded-2xl p-4 bg-white">
          <Text className="text-2xl font-bold text-black">
            {transaction?.promotion?.title}
          </Text>
          <Text className="text-gray-600 text-sm">
            {transaction?.promotion?.description}
          </Text>
          <View className="flex-row items-center mt-2">
            <FontAwesome name="info-circle" size={14} color="gray" />
            <Text className="ml-2 text-gray-600 text-sm">
              {formatDate(transaction?.date)}
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View className="mt-6">
          {/* Location */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-lime-300 p-2 px-2.5 rounded-md mr-1">
              <FontAwesome name="map-marker" size={14} color="black" />
            </View>
            <Text className="text-gray-500 text-sm">Location</Text>
            <Text className="ml-auto text-gray-700 font-medium">
              {transaction?.promotion?.locations[0]?.address}
            </Text>
          </View>

          <View className="h-[2px] bg-gray-300 mt-3 mb-4" />

          {/* Transaction ID */}
          <View className="flex-row items-center justify-around mb-2">
            <View className="bg-lime-300 p-2 px-2.5 rounded-md mr-1">
              <FontAwesome5 name="receipt" size={14} color="black" />
            </View>
            <Text className="text-gray-500 text-sm">Transaction ID</Text>
            <Text className="ml-auto text-gray-700 font-medium text-[12px]">
              #{transaction?.id}
            </Text>
          </View>

          {/* Total Bill */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-lime-300 p-2 rounded-md mr-1">
              <FontAwesome name="money" size={14} color="black" />
            </View>
            <Text className="text-gray-500 text-sm">Total Bill</Text>
            <Text className="ml-auto text-gray-700 font-medium">
              GBP {transaction?.totalBill}
            </Text>
          </View>

          {/* Total Discount */}
          <View className="flex-row items-center justify-between">
            <View className="bg-lime-300 p-2 rounded-md mr-1">
              <FontAwesome5 name="percent" size={14} color="black" />
            </View>
            <Text className="text-gray-500 text-sm">Total Discount</Text>
            <Text className="ml-auto text-gray-700 font-medium">
              GBP {transaction?.offerDiscount}
            </Text>
          </View>
        </View>

        <View className="h-[2px] bg-gray-300 mt-5 mb-0" />

        {/* Review Section */}
        <View className="mt-6 px-1">
          <View className="flex flex-row justify-between">
            <View>
              <Text className="text-lg font-bold">Review</Text>
              <Text className="text-gray-500 text-xs">a month ago</Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome name="star" size={14} color="gold" />
              <Text className="ml-1 text-black text-sm font-medium">5.0</Text>
            </View>
          </View>
          <Text className="text-gray-600 text-sm mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in dui
            ultricies eros vestibulum aliquam id eu nisl. Nulla suscipit, enim
            vitae fringilla dignissim, ante lacus ullamcorper risus.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
