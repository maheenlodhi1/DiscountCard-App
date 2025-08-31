import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";

const LanguageBottomSheet = ({
  sheetRef,
  setLanguage,
  selectedLanguage,
}: {
  sheetRef: any;
  setLanguage: any;
  selectedLanguage: any;
}) => {
  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "Arabic" },
  ];

  const [selected, setSelected] = useState(selectedLanguage);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={["60%"]}
      backgroundStyle={{ backgroundColor: "white", borderRadius: 20 }}
      containerStyle={{ zIndex: 10 }}
      handleIndicatorStyle={{
        backgroundColor: "#D0D5DC",
        width: 135,
        height: 5,
      }}
      enablePanDownToClose={true}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-3 pb-6 bg-white">
          {/* Close Button */}
          <TouchableOpacity
            onPressIn={() => sheetRef.current?.close()}
            className="absolute left-4 top-3"
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-lg font-semibold text-center mb-6">
            Language
          </Text>

          {/* Language Options */}
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              className="flex-row justify-between items-center py-4"
              onPress={() => setSelected(lang.code)}
            >
              <Text className="text-base">{lang.label}</Text>
              {selected === lang.code && (
                <Feather name="check" size={20} color="green" />
              )}
            </TouchableOpacity>
          ))}

          {/* Save Button */}
          <TouchableOpacity
            onPress={() => {
              setLanguage(selected);
              sheetRef.current?.close();
            }}
            className="mt-6 bg-[#AEF353] py-2 rounded-lg items-center"
          >
            <Text className="text-black font-semibold text-lg">Save</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default LanguageBottomSheet;
