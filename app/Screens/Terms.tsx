import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RenderHTML from "react-native-render-html";
import TermsData from "../../data/Terms.json";

import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../lib/i18n";

export default function PremiumMembership() {
  const router = useRouter();
  const { language, changeLanguage } = useLanguage();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white px-4 pt-0 pb-4">
        <View className="items-center">
          <View className="flex flex-row justify-between w-full items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-0">
              <Feather name="arrow-left" size={22} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold pb-4">
              Terms & Conditions
            </Text>
            <View></View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <RenderHTML source={{ html: TermsData.terms[language] }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
