import React from "react";
import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  View,
} from "react-native";

type CustomButtonProps = {
  title: string | any;
  onPress: (event: GestureResponderEvent) => void;
  disabled: boolean;
};

export const SolidButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View className={`rounded-[8px] px-3 py-3 bg-[#AEF353] border-none`}>
        <Text
          className={`text-black font-semibold text-center text-[14px]`}
          style={{ fontFamily: "PlusJakartaSans-SemiBold" }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
