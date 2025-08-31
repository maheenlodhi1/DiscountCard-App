import React from "react";
import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  View,
} from "react-native";

type CustomButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
};

export const OutlineButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`rounded-[8px] px-3 py-3 bg-white border border-black text-center`}
      >
        <Text
          className={`text-black font-medium text-[14px] text-center`}
          style={{ fontFamily: "PlusJakartaSans-SemiBold" }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
