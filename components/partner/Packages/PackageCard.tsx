import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type FeatureItem = {
  title: string;
  items: string[];
};

type Feature = string | FeatureItem;

type PackageProps = {
  title: string;
  price: string;
  description: string;
  features: Feature[];
  color: string;
  index: number;
  onActionPress: (feature: string, index: number) => void;
};

const PackageCard = ({
  title,
  price,
  description,
  features,
  color,
  index,
  onActionPress,
}: PackageProps) => {
  return (
    <View
      className={`mb-4 rounded-xl shadow-lg overflow-hidden ${
        index === 3 ? "bg-[#2F4451] text-white" : "bg-[#EFF5F7]"
      } ${index === 3 && "mb-8"}`}
    >
      <View className="p-6">
        <Text
          className={`text-2xl font-bold mb-2 ${
            index === 3 ? "text-white" : ""
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-3xl font-bold mb-4 ${
            index === 3 ? "text-white" : ""
          }`}
        >
          {price}
        </Text>
        <Text
          className={`mb-4 ${index === 3 ? "text-white" : "text-gray-600"}`}
        >
          {description}
        </Text>
      </View>

      <View
        className={`${
          index === 3 ? "bg-[#2F4451] text-white" : "bg-[#EFF5F7]"
        } px-6`}
      >
        {features.map((feature, fIndex) => {
          if (typeof feature === "string") {
            return (
              <TouchableOpacity
                key={fIndex}
                className={`${
                  feature === "Contact Us"
                    ? "bg-[#AEF353]"
                    : "bg-[#EFF5F7] border-2"
                } rounded-lg py-3 mb-4`}
                onPress={() => onActionPress(feature, index)}
              >
                <Text className="text-black text-center font-bold">
                  {feature}
                </Text>
              </TouchableOpacity>
            );
          }
          return (
            <View key={fIndex} className="mb-2">
              <Text
                className={`font-bold text-lg mb-2 ${
                  index === 3 ? "text-white" : ""
                }`}
              >
                {feature.title}
              </Text>
              {feature.items.map((item, itemIndex) => (
                <View key={itemIndex} className="flex-row items-start mb-2">
                  <Text
                    className={`${
                      index === 3 ? "text-white" : "text-gray-600"
                    }`}
                  >
                    • {item}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PackageCard;
