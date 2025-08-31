import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfferDetails() {
  const router = useRouter();
  const { offer }: any = useLocalSearchParams();
  const offerData = offer ? JSON.parse(offer) : {};

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white pt-0">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={22} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold flex-1 text-center">
            {offerData?.partner?.locale?.en?.businessName}
          </Text>
        </View>

        {/* Image Section */}
        <Image
          source={{
            uri: offerData?.images?.[0] || "https://via.placeholder.com/400",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        {/* About Section */}
        <View className="px-5 mt-4">
          <Text className="text-lg font-semibold">About</Text>
          <Text className="text-gray-600 text-sm mt-2 leading-relaxed">
            {offerData?.description}
          </Text>
        </View>

        {/* Details Section */}
        <View className="px-5 mt-5">
          <Text className="text-lg font-semibold">Details</Text>

          {/* Phone */}
          <View className="flex-row items-center mt-3">
            <View className="bg-lime-400 p-2 rounded-lg">
              <Feather name="phone" size={18} color="black" />
            </View>
            <Text className="text-black text-sm ml-3">
              {/* {offerData?.partner?.phoneNo} */}
              073603249
            </Text>
          </View>

          {/* Timing */}
          <View className="flex-row items-center mt-3">
            <View className="bg-lime-400 p-2 rounded-lg mr-2">
              <Feather name="clock" size={18} color="black" />
            </View>
            {offerData?.days?.map((day: any, index: number) => (
              <View>
                <Text className="text-black text-sm ml-1">{day}</Text>
              </View>
            ))}

            <Text className="text-gray-500 text-sm ml-3">|</Text>
            <Text className="text-black text-sm ml-3">
              {offerData?.offerAvailTime?.startTime}
              {" -"}
              {offerData?.offerAvailTime?.endTime}
            </Text>
          </View>

          {/* Address */}
          <View className="flex-row items-center mt-3">
            <View className="bg-lime-400 p-2 px-2.5 rounded-lg">
              <FontAwesome5 name="map-marker-alt" size={18} color="black" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-black text-sm">
                {offerData && offerData?.locations[0]?.address}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
