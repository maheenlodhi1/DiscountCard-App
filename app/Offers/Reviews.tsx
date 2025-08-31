import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getPromotionReviews } from "@/Redux/Auth/authActions";
import { formatReviewDate } from "@/Utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewsScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ["50%"], []);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const dispatch: any = useDispatch();
  const isLogged = useSelector((state: any) => state.auth.isLogged);
  const user = useSelector((state: any) => state.auth.user);

  const openReviewModal = () => bottomSheetRef.current?.snapToIndex(0);
  const closeReviewModal = () => bottomSheetRef.current?.close();

  const [loading, setLoading] = useState(false);
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("highestRated");

  const router = useRouter();
  const { offer }: any = useLocalSearchParams();
  const offerData = offer ? JSON.parse(offer) : {};

  // Fetch reviews data when component mounts or filter changes
  const fetchReviews = (sortBy = "") => {
    if (offerData?.id) {
      setReviewsLoading(true);
      dispatch(
        getPromotionReviews(
          offerData.id,
          sortBy,
          (status: string, response: any) => {
            if (status === "Success") {
              setReviewsData(response);
            } else {
              Alert.alert("Error", "Failed to load reviews");
            }
            setReviewsLoading(false);
          }
        )
      );
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReviews(activeFilter);
  }, [offerData?.id, dispatch]);

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    fetchReviews(filter);
  };

  const submitReview = () => {
    const payload = {
      customer: user?.id,
      customerName: user?.firstName + " " + user?.lastName,
      customerImage: user?.photoUrl,
      partner: offerData?.partner?.id,
      promotion: offerData?.id,
      rating: Number(rating),
      comment: reviewText,
    };
    setLoading(true);
    try {
      dispatch(
        addReview(payload, (status: string, response: string) => {
          if (status === "Success") {
            Alert.alert("Success", "Review submitted successfully");
            closeReviewModal();
            setLoading(false);
            setReviewText("");

            // Refresh reviews after submitting a new one
            fetchReviews(activeFilter);
          } else {
            setLoading(false);
            Alert.alert("Failed", "Review not submitted, please try again");
          }
        })
      );
    } catch (error) {
      setLoading(false);
      Alert.alert("Failed", "Review not submitted, please try again");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-white px-4 pt-1">
          {/* Header */}
          <View className="flex-row items-center px-0 py-3 pb-6">
            <TouchableOpacity onPress={() => router.back()} className="p-0">
              <Feather name="arrow-left" size={22} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold flex-1 text-center">
              Reviews and Ratings
            </Text>
          </View>

          {reviewsLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          ) : (
            <>
              <View className="flex-row items-center">
                {/* Average Rating */}
                <View className="items-center mr-6">
                  <Text className="text-4xl font-bold text-black">
                    {reviewsData?.ratingStats?.averageRating || "0.0"}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    out of {reviewsData?.ratingStats?.totalReviews || 0}
                  </Text>
                </View>

                {/* Star Rating Distribution */}
                <View>
                  {reviewsData?.ratingStats?.ratingBreakdown
                    ?.slice()
                    .sort((a: any, b: any) => b.star - a.star) // Sort from 5 stars to 1 star
                    .map((item: any) => (
                      <View
                        key={item.star}
                        className="flex-row items-center space-x-2 mb-1"
                      >
                        {/* Stars */}
                        <View className="flex-row">
                          {Array.from({ length: 5 }, (_, index) => (
                            <FontAwesome
                              key={index}
                              name="star"
                              size={14}
                              color={index < item.star ? "gold" : "lightgray"}
                            />
                          ))}
                        </View>

                        {/* Progress Bar */}
                        <View className="h-1 bg-gray-300 rounded-full w-40">
                          <View
                            className="h-1 bg-yellow-400 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </View>
                      </View>
                    ))}
                </View>
              </View>

              {/* Filter Buttons */}
              <View className="flex-row flex-wrap mt-3 mb-2">
                <TouchableOpacity
                  onPress={() => handleFilterChange("highestRated")}
                  className={`mr-2 mb-2 px-3 py-1 rounded-md ${
                    activeFilter === "highestRated"
                      ? "bg-lime-100 border border-lime-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      activeFilter === "highestRated"
                        ? "text-lime-700"
                        : "text-gray-700"
                    }
                  >
                    Highest Rated
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFilterChange("lowestRated")}
                  className={`mr-2 mb-2 px-3 py-1 rounded-md ${
                    activeFilter === "lowestRated"
                      ? "bg-lime-100 border border-lime-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      activeFilter === "lowestRated"
                        ? "text-lime-700"
                        : "text-gray-700"
                    }
                  >
                    Lowest Rated
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFilterChange("newest")}
                  className={`mr-2 mb-2 px-3 py-1 rounded-md ${
                    activeFilter === "newest"
                      ? "bg-lime-100 border border-lime-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      activeFilter === "newest"
                        ? "text-lime-700"
                        : "text-gray-700"
                    }
                  >
                    Newest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFilterChange("oldest")}
                  className={`mr-2 mb-2 px-3 py-1 rounded-md ${
                    activeFilter === "oldest"
                      ? "bg-lime-100 border border-lime-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      activeFilter === "oldest"
                        ? "text-lime-700"
                        : "text-gray-700"
                    }
                  >
                    Oldest
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Reviews List */}
              {reviewsData?.reviews?.length > 0 ? (
                <FlatList
                  data={reviewsData.reviews}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View className="border-b border-gray-300 py-3">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-black font-semibold">
                          {item.customerName}
                        </Text>
                        <View className="flex-row items-center">
                          <FontAwesome name="star" size={14} color="gold" />
                          <Text className="text-black text-sm ml-1">
                            {item.rating}.0
                          </Text>
                        </View>
                      </View>
                      <Text className="text-gray-400 text-xs">
                        {formatReviewDate(item.date)}
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        {item.comment}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-gray-500">No reviews yet</Text>
                </View>
              )}
            </>
          )}

          {/* Add Review Button */}
          <TouchableOpacity
            onPress={() => {
              if (!isLogged) {
                Alert.alert("Please login or create an account!!");
                return;
              }
              openReviewModal();
            }}
            className="bg-gray-100 p-4 mb-3 rounded-full mt-4 items-center"
          >
            <Text className="text-black font-semibold">Add a Review</Text>
          </TouchableOpacity>

          {/* Bottom Sheet for Adding Review */}
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
          >
            <BottomSheetScrollView style={{ flex: 1 }}>
              <View className="p-5">
                {/* Close Button */}
                <TouchableOpacity
                  onPress={closeReviewModal}
                  className="absolute top-3 left-4"
                >
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>

                {/* Title */}
                <Text className="text-lg font-bold text-center">
                  Give a Review
                </Text>

                {/* Star Rating */}
                <View className="flex-row justify-center space-x-3 my-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <FontAwesome
                        name="star"
                        size={28}
                        color={star <= rating ? "gold" : "lightgray"}
                        className="mx-1"
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Review Input */}
                <Text className="text-gray-600 font-semibold mb-1">
                  Review Details
                </Text>
                <TextInput
                  className="border border-gray-200 rounded-md p-3 bg-gray-100 text-gray-700"
                  placeholder="Write your review..."
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                  numberOfLines={5}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={submitReview}
                  className="bg-lime-400 p-3 mt-5 rounded-lg items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text className="text-black font-bold">Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
