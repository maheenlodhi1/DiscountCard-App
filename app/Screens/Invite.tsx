import {
  createPayoutRequest,
  getCustomerPayoutDetails,
} from "@/Redux/Auth/authActions";
import WithdrawIcon from "@/assets/images/icons/Withdraw";
import SetPayoutSheet from "@/components/customer/PayoutMehodSheet";
import PayoutRequests from "@/components/customer/PayoutRequests";
import { Feather, FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";

export default function InviteFriendsScreen() {
  const dispatch = useDispatch<any>();
  const { currentUser } = useSelector((state: any) => state.auth);
  const [fetchPayoutRequests, setFetchPayoutRequests] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [accountDetails, setAccountDetails] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openSetPayoutSheet = () => bottomSheetRef.current?.snapToIndex(0);
  const closeSetPayoutSheet = () => {
    bottomSheetRef.current?.close();
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(currentUser?.referralHistory?.referralLink);
    Alert.alert("Success", "Invitation link copied to clipboard!");
  };

  const fetchCustomerPayoutDetails = () => {
    dispatch(
      getCustomerPayoutDetails((status: string, response: any) => {
        if (status === "Success") {
          setAccountDetails(response);
        }
      })
    );
  };
  useEffect(() => {
    fetchCustomerPayoutDetails();
  }, []);

  const getAccountIcon = (company: string) => {
    switch (company) {
      case "ALANSARI":
        return (
          <Image
            source={require("../../assets/images/alansari-logo.png")}
            className="rounded-full"
          />
        );
      default:
        return <FontAwesome name="bank" size={15} color="black" />;
    }
  };

  const handleWithdrawPress = () => {
    setIsModalVisible(true);
  };

  const handleConfirmWithdrawal = () => {
    setIsLoading(true);
    dispatch(
      createPayoutRequest((status: string, message: string) => {
        setIsLoading(false);
        setIsModalVisible(false);
        Alert.alert(status, message);
      })
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 bg-[#EDF3F5]">
          <StatusBar backgroundColor="#AEF353" barStyle="dark-content" />

          {/* Header */}
          <View className="bg-[#AEF353] pt-6 pb-10 px-4 flex-row items-center justify-between rounded-b-[20px]">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Feather name="arrow-left" size={24} color="#2F4451" />
            </TouchableOpacity>
            <Text className="text-base font-bold text-[#3A3D42] font-['Plus_Jakarta_Sans']">
              Invite Friends
            </Text>
            <View className="w-8 opacity-0">
              <Feather name="arrow-left" size={24} color="#2F4451" />
            </View>
          </View>

          {/* Available Credit Card - Overlapping */}
          <View
            className="absolute top-[70px] left-0 right-0 px-4"
            style={{ zIndex: 5 }}
          >
            <View className="w-full bg-[#E5FFC2] rounded-[12px] py-2 flex items-center shadow-sm">
              <Text className="text-xs font-medium text-[#768A91]">
                Available Credit
              </Text>
              <View className="flex-row items-center mt-1.5">
                <Text className="text-lg font-bold text-[#3A3D42]">
                  GBP {currentUser?.wallet?.balance || 0}.00
                </Text>
                <View className="w-[1px] h-4 bg-[#D7E1EB] mx-2" />

                {/* Withdraw Button */}
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={handleWithdrawPress}
                >
                  <WithdrawIcon />
                  <Text className="ml-1 text-xs font-medium text-[#3A3D42]">
                    Withdraw
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* MOdal confirmation  */}
          <Modal
            transparent
            animationType="slide"
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <View className="bg-white p-6 rounded-lg w-80">
                <Text className="text-lg font-bold text-[#3A3D42] mb-2">
                  Confirm Withdrawal
                </Text>
                <Text className="text-sm text-[#3A3D42] mb-4">
                  Are you sure you want to withdraw
                  <Text className="font-bold">
                    GBP {currentUser?.wallet?.balance || 0}
                  </Text>
                  ?
                </Text>
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    className="px-4 py-2 border border-gray-300 rounded-lg mr-2"
                    onPress={() => setIsModalVisible(false)}
                    disabled={isLoading}
                  >
                    <Text className="text-gray-600">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 bg-green-500 rounded-lg"
                    onPress={handleConfirmWithdrawal}
                    disabled={isLoading}
                  >
                    <Text className="text-white">
                      {isLoading ? "Processing..." : "Confirm"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Main Content */}
          <View className="flex-1 bg-white rounded-t-[20px] mt-4 px-4 pt-12 pb-4">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* How to Earn Credit */}
              <View className="w-full mb-6">
                <Text className="text-base font-bold text-[#3A3D42] font-['Plus_Jakarta_Sans'] mb-4">
                  How to Earn Credit
                </Text>

                <View className="flex-row items-center mb-2">
                  <Image
                    source={require("../../assets/images/hands.png")}
                    width={40}
                    height={40}
                    className="h-8 w-8"
                  />
                  <Text className="ml-2 text-sm font-bold text-[#3A3D42] font-['Plus_Jakarta_Sans']">
                    Copy Link and Invite a friend
                  </Text>
                </View>

                <View className="flex-row items-center bg-[#EDF3F5] rounded-lg p-2.5">
                  <Text
                    numberOfLines={1}
                    className="flex-1 text-sm font-medium text-[#768A91] font-['Plus_Jakarta_Sans']"
                  >
                    {currentUser?.referralHistory?.referralLink}
                  </Text>
                  <TouchableOpacity onPress={copyToClipboard}>
                    <Feather name="copy" size={20} color="#2F4451" />
                  </TouchableOpacity>
                </View>

                {/* Bonus Info */}
                <View className="bg-[#E5FFC2] rounded-[12px] p-2.5 mt-2">
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../assets/images/cash.png")}
                      width={40}
                      height={40}
                      className="h-10 w-10"
                    />
                    <Text className="ml-2 text-sm font-bold text-[#3A3D42] font-['Plus_Jakarta_Sans']">
                      You get up to 50 GBP of bonus!
                    </Text>
                  </View>
                  <Text className="text-[12.7px] text-[#3A3D42] font-['Poppins'] mt-2 leading-[19px]">
                    You can withdraw the credit amount by attaching a bank
                    account to your DiscountCard App.
                  </Text>
                </View>
              </View>
              {/* Payout Method */}
              <View className="w-full mb-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-base font-bold text-[#3A3D42] font-['Plus_Jakarta_Sans']">
                    Payout Method
                  </Text>
                  <TouchableOpacity onPress={() => openSetPayoutSheet()}>
                    <Text className="text-xs font-medium text-[#3A3D42] font-['Plus_Jakarta_Sans']">
                      Set Payout
                    </Text>
                  </TouchableOpacity>
                </View>

                {!!accountDetails && (
                  <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 rounded-full items-center justify-center">
                      <Text className="text-white text-xs">
                        {getAccountIcon(accountDetails?.company)}
                      </Text>
                    </View>
                    <Text className="ml-2 text-sm font-semibold text-[#768A91] font-['Plus_Jakarta_Sans']">
                      {accountDetails?.accountNumber}
                    </Text>
                  </View>
                )}
              </View>
              <PayoutRequests
                fetchPayoutRequests={fetchPayoutRequests}
                setFetchPayoutRequests={setFetchPayoutRequests}
              />
            </ScrollView>
          </View>

          {/* Bottom Indicator */}
          <View className="absolute bottom-1 left-0 w-full flex items-center">
            <View className="w-[135px] h-[5px] bg-[#D0D5DC] rounded-full" />
          </View>
        </SafeAreaView>
        <SetPayoutSheet
          closeSheet={closeSetPayoutSheet}
          bottomSheetRef={bottomSheetRef}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
