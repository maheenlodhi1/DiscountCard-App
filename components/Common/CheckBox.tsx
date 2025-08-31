import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { t } from "../../lib/i18n";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  formError?: string;
}

const openTerms = () => {
  Linking.openURL("https://www.discountcard.com/en/terms");
};

const Checkbox = ({ value, onChange, formError }: Props) => {
  return (
    <View className="flex items-start w-full relative">
      <TouchableOpacity
        onPress={() => onChange(!value)}
        activeOpacity={0.7}
        className="flex flex-row items-center space-x-2 w-full"
      >
        <View
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
            value
              ? "bg-lime-400 border-lime-500"
              : "border-gray-400 bg-transparent"
          }`}
        >
          {value && <Ionicons name="checkmark-sharp" size={15} color="black" />}
        </View>

        <View className="flex flex-row flex-wrap items-center w-11/12">
          <Text className="text-[13px] text-gray-700 font-medium">
            {t("termsAgreement.part1")}{" "}
          </Text>
          <TouchableOpacity onPress={openTerms}>
            <Text className="text-[13px] text-lime-500 font-semibold underline">
              {t("termsAgreement.terms")}
            </Text>
          </TouchableOpacity>
          <Text className="text-[13px] text-gray-700 font-medium">
            {" "}
            {t("termsAgreement.part2")}
          </Text>
        </View>
      </TouchableOpacity>

      {formError && (
        <Text className="absolute -bottom-6 left-0 text-red-500 text-xs w-full">
          {formError}
        </Text>
      )}
    </View>
  );
};

export default Checkbox;
