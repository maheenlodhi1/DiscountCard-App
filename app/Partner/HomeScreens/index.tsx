import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import { getPartnerDashboardStats } from "@/Redux/Auth/authActions";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainComponent() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const isFocused = useIsFocused();
  const options = ["Today", "7 days", "30 days", "90 days"];
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const user = useSelector((state: any) => state.auth.user);

  // Fetch Dashboard Data
  const fetchDashboardStats = async () => {
    setLoading(true);
    const periodQuery = ["today", "7days", "30days", "90days"][selected];
    dispatch(
      getPartnerDashboardStats((status: string, data: any) => {
        if (status === "Success") {
          setDashboardData(data);
        }
        setLoading(false);
      }, periodQuery)
    );
  };

  // Fetch data when component mounts or selected period changes
  useEffect(() => {
    if (isFocused) {
      fetchDashboardStats();
    }
  }, [isFocused, selected]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center bg-white pt-5 pb-6 px-4 rounded-b-3xl">
          <Text className="text-xl font-semibold">Hi, {user?.firstName}</Text>
          <View className="flex flex-row items-center space-x-2">
            <TouchableOpacity className="p-4 bg-gray-100 rounded-xl flex flex-row gap-x-2 items-center justify-center">
              <View className="bg-green-400 h-2 w-2 rounded-full" />
              <Text>Open Now</Text>
            </TouchableOpacity>
            <View className="relative">
              <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
                <Feather name="bell" size={20} color="black" />
              </TouchableOpacity>
              <View className="absolute top-0 right-0 bg-green-400 h-2 w-2 rounded-full" />
            </View>
          </View>
        </View>

        {/* Overview */}
        <View className="w-full mt-3 pt-5 px-4 bg-white rounded-t-3xl flex-1 pb-4">
          <Text className="text-lg font-semibold">Overview</Text>

          {/* Period Selection */}
          <ScrollView
            className="mt-4 flex flex-row gap-x-2"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                className={`w-20 h-10 flex justify-center items-center border ${
                  i === selected
                    ? " border-[#83CE21] bg-[#F0FFDE]"
                    : " border-gray-300"
                } rounded-lg`}
                onPress={() => setSelected(i)}
              >
                <Text>{opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Loader */}
          {loading ? (
            <View className="flex items-center justify-center mt-10">
              <ActivityIndicator size="large" color="#83CE21" />
            </View>
          ) : (
            <>
              {/* Stats */}
              <View className="w-full flex flex-row space-x-3 mt-6 justify-between">
                <View className="flex flex-col gap-y-1 flex-1 py-4 bg-[#FFE2D2] rounded-xl items-center justify-center">
                  <Text className="font-bold text-lg">
                    {dashboardData?.visitors || 0}
                  </Text>
                  <Text className="text-gray-500">Visitors</Text>
                </View>

                <View className="flex flex-col gap-y-1 flex-1 py-4 bg-[#D9F6FF] rounded-xl items-center justify-center">
                  <Text className="font-bold text-lg">
                    {dashboardData?.qrScans || 0}
                  </Text>
                  <Text className="text-gray-500">QR Scans</Text>
                </View>
              </View>

              {/* Revenue */}
              <View className="w-full mt-6">
                <View className="w-full flex flex-col gap-y-2 py-3 px-6 bg-[#E5FFC2] rounded-xl">
                  <Text className="text-sm text-gray-500">Revenue</Text>
                  <View className="relative">
                    <Text className="font-semibold text-2xl">
                      {dashboardData?.revenue || 0} GBP
                      <Text className="text-sm align-super font-bold text-gray-500">
                        -10%
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Graph */}
              <View className="w-full my-6 flex justify-center items-center pb-12">
                <LineChart
                  data={dashboardData?.graphData || []}
                  width={300}
                  height={200}
                  areaChart
                  spacing={50}
                  color="green"
                  startFillColor="#AEF353"
                  endFillColor="white"
                  yAxisColor="transparent"
                  xAxisColor="gray"
                  yAxisTextStyle={{ color: "gray" }}
                  xAxisLabelTextStyle={{ color: "#666" }}
                  showValuesAsDataPointsText
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
