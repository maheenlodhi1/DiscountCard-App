import CalendarIcon from "@/assets/images/icons/Calendar";
import CreditCardIcon from "@/assets/images/icons/CreditCard";
import { getCustomerPayoutRequests } from "@/Redux/Auth/authActions";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import moment from "moment";

const PayoutRequests = ({
  fetchPayoutRequests,
  setFetchPayoutRequests,
}: {
  fetchPayoutRequests: boolean;
  setFetchPayoutRequests: any;
}) => {
  const dispatch = useDispatch<any>();
  const [payoutRequests, setPayoutRequests] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(
      getCustomerPayoutRequests("CUSTOMER_ID", (status: string, data: any) => {
        if (status === "Success") {
          setPayoutRequests(data.results || []);
        } else {
          setError(data || "Failed to load payout requests");
        }
        setFetchPayoutRequests(false);
        setLoading(false);
      })
    );
  }, [dispatch, fetchPayoutRequests]);

  return (
    <View className="w-full mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-[#3A3D42]">
          Payout History
        </Text>
        {/* <TouchableOpacity>
          <Text className="text-xs font-medium text-[#3A3D42]">View All</Text>
        </TouchableOpacity> */}
      </View>

      {/* Loading & Error Handling */}
      {loading && <ActivityIndicator size="large" color="#3A3D42" />}
      {error && <Text className="text-red-500">{error}</Text>}

      {/* No Data */}
      {!loading && !error && payoutRequests.length === 0 && (
        <Text className="text-center text-gray-500">
          No payout requests found
        </Text>
      )}

      {/* Payout List */}
      {!loading &&
        !error &&
        payoutRequests.map((request: any, index: number) => (
          <View key={request._id} className="mb-1">
            {/* Transaction Info */}
            <View className="flex-row justify-between items-start">
              <Text className="text-base font-medium text-[#2F4451]">
                #{request._id.slice(-6)}{" "}
                {/* Extract last 6 digits of MongoDB ObjectID */}
              </Text>
              <Text className="text-base font-medium text-[#2F4451]">
                {request.amount} GBP
              </Text>
            </View>

            {/* Status */}
            <View className="flex-row justify-between items-center mt-1">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-[#EDF3F5] rounded items-center justify-center">
                  <CreditCardIcon />
                </View>
                <Text className="ml-2 text-xs font-medium text-[#768A91]">
                  Status
                </Text>
              </View>
              <View
                className={`px-2 py-0.5 rounded-[10px] ${
                  request.status === "Approved"
                    ? "bg-[#EEFCDD]"
                    : "bg-[#FDECEA]"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    request.status === "Approved"
                      ? "text-[#61A30C]"
                      : "text-[#D9534F]"
                  }`}
                >
                  {request.status}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View className="flex-row justify-between items-center mt-1">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-[#EDF3F5] rounded items-center justify-center">
                  <CalendarIcon />
                </View>
                <Text className="ml-2 text-xs font-medium text-[#768A91]">
                  Date
                </Text>
              </View>
              <Text className="text-sm font-medium text-[#3A3D42]">
                {moment(request.date).format("DD MMM YYYY")} {/* Format date */}
              </Text>
            </View>

            {/* Divider */}
            {index < payoutRequests.length - 1 && (
              <View className="h-[1px] w-full bg-[#E1E8E9] my-2" />
            )}
          </View>
        ))}
    </View>
  );
};

export default PayoutRequests;
