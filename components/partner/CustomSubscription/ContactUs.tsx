import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Input from "@/components/Common/Input";
import { SolidButton } from "@/components/Common/solidButton";
import { PostSubscriptionRequest } from "@/Redux/Auth/authActions";

type ContactFormProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  snapPoints: number[];
  onClose: () => void;
};

const ContactForm = ({
  bottomSheetRef,
  snapPoints,
  onClose,
}: ContactFormProps) => {
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  const [subject] = useState("Custom Subscription Inquiry");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Custom Validation Function
  const validateForm = () => {
    if (!message.trim()) {
      setError("Message is required");
      return false;
    }
    if (message.length < 10) {
      setError("Message must be at least 10 characters");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);
    dispatch(
      PostSubscriptionRequest((status: string, responseMessage: string) => {
        setLoading(false);
        alert(`${status}: ${responseMessage}`);
        if (status === "Success") onClose();
      })
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
      handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
      enablePanDownToClose={false}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="px-3 py-0 pb-10">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Contact Us</Text>
            <View></View>
          </View>

          {/* Subject Input (Read-only) */}
          <Input
            onChange={() => {}}
            placeholder="Subject"
            value={subject}
            label="Subject"
            type="text"
            editable={false}
          />

          {/* Message Input */}
          <Text className="mb-1 text-[#768A91] text-[12px] font-medium">
            Message
          </Text>
          <TextInput
            className={`border ${
              error ? "border-red-500" : "border-gray-200"
            } rounded-md p-3 bg-[#EDF3F5] text-gray-700`}
            placeholder="Write your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
          />
          {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

          {/* Submit Button */}
          <View className="mt-3">
            <SolidButton
              title={
                loading ? <ActivityIndicator size={20} color="black" /> : "Send"
              }
              onPress={handleSubmit}
              disabled={loading}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ContactForm;
