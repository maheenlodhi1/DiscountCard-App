import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { SolidButton } from "@/components/Common/solidButton";
import { useDispatch, useSelector } from "react-redux";
import {
  createPromotion,
  fetchCurrentUserDetails,
  getCategories,
  getPromotionByID,
  updatePromotion,
  uploadImages,
} from "@/Redux/Auth/authActions";
import LocationPicker from "./LocationPicker";
import {
  daysOptions,
  DEFAULT_COORDINATES,
  durationOptions,
} from "@/constants/constants";
import { generateTimeOptions } from "@/Utils/utils";
import { setPartnerOffer } from "@/Redux/Auth/authSlice";

type OfferFormProps = {
  onSubmit: (offerData: any) => void;
  /** full offer object or undefined for create flow */
  existingOffer?: any;
};

const timeOptions = generateTimeOptions();

const OfferForm = ({ onSubmit, existingOffer }: OfferFormProps) => {
  const dispatch = useDispatch<any>();
  const { categories, currentUser } = useSelector((state: any) => state.auth);

  // ── Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [startTimeDisplay, setStartTimeDisplay] = useState("");
  const [endTimeDisplay, setEndTimeDisplay] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES);
  const [images, setImages] = useState<{ uri: string }[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // ── UI state
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Bottom sheets
  const bottomSheetRefCategory = useRef<BottomSheet>(null);
  const bottomSheetRefDuration = useRef<BottomSheet>(null);
  const bottomSheetRefDays = useRef<BottomSheet>(null);
  const bottomSheetRefLocation = useRef<BottomSheet>(null);
  const bottomSheetRefStartTime = useRef<BottomSheet>(null);
  const bottomSheetRefEndTime = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [500, 550], []);

  // ── Derived time labels
  useEffect(() => {
    const fmt = (val: string) => {
      const [h, m = "00"] = val.split(":");
      const hour = parseInt(h, 10);
      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? "AM" : "PM";
      return `${hour12}:${m} ${ampm}`;
    };
    setStartTimeDisplay(fmt(startTime));
    setEndTimeDisplay(fmt(endTime));
  }, [startTime, endTime]);

  // ── Load categories
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // ── Pre-fill when editing
  useEffect(() => {
    if (!existingOffer) return;

    setTitle(existingOffer?.title ?? "");
    setDescription(existingOffer?.description ?? "");
    setCategory(existingOffer?.categoryName ?? "");
    setDiscount(
      typeof existingOffer?.discount === "number"
        ? String(existingOffer.discount)
        : existingOffer?.discount ?? ""
    );
    setDuration(existingOffer?.duration ?? "");
    setSelectedDays(
      Array.isArray(existingOffer?.days) ? existingOffer.days : []
    );
    setStartTime(existingOffer?.offerAvailTime?.startTime ?? "09:00");
    setEndTime(existingOffer?.offerAvailTime?.endTime ?? "18:00");
    setLocation(existingOffer?.locations?.[0]?.address ?? "");

    // Your backend seems to store [lat, lng] (non-GeoJSON). Keep consistent
    const coords = existingOffer?.locations?.[0]?.coordinates?.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      setCoordinates({ latitude: coords[0], longitude: coords[1] });
    } else {
      setCoordinates(DEFAULT_COORDINATES);
    }

    const imgs: string[] = Array.isArray(existingOffer?.images)
      ? existingOffer.images
      : [];
    setImages(imgs.map((u) => ({ uri: u })));
    setUploadedImageUrls(imgs);
  }, [existingOffer]);

  // ── Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Offer title is required";
    if (!category) newErrors.category = "Category is required";
    if (!description.trim()) newErrors.description = "Description is required";

    if (!existingOffer) {
      // Only require/validate these if creating (you already lock fields when editing)
      if (!discount) newErrors.discount = "Discount is required";
      else if (
        isNaN(Number(discount)) ||
        Number(discount) < 0 ||
        Number(discount) > 100
      ) {
        newErrors.discount = "Discount must be between 0 and 100";
      }
      if (!duration) newErrors.duration = "Duration is required";
    }

    if (selectedDays.length === 0)
      newErrors.days = "At least one day must be selected";
    if (!location) newErrors.location = "Location is required";
    if (uploadedImageUrls.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    title,
    category,
    description,
    discount,
    duration,
    selectedDays,
    location,
    uploadedImageUrls,
    existingOffer,
  ]);

  // ── Submit
  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      partner: currentUser?.id,
      title,
      description,
      categoryName: category,
      discount: Number(discount || 0),
      duration,
      days: selectedDays,
      offerAvailTime: { startTime, endTime },
      locations: [
        {
          address: location,
          // Your DB currently uses [lat, lng]; keep this consistent
          coordinates: {
            coordinates: [coordinates.latitude, coordinates.longitude],
          },
        },
      ],
      images: uploadedImageUrls,
    };

    if (existingOffer?.id) {
      // For update: your original logic excluded duration/discount when editing
      const { duration: _d, discount: _di, ...updateOnly } = payload;
      dispatch(
        updatePromotion(
          existingOffer.id,
          updateOnly,
          (status: string, message: string) => {
            setLoading(false);
            if (status === "Success") {
              // refresh cached offer + user
              const firstOfferId = currentUser?.offers?.[0];
              if (firstOfferId) {
                dispatch(
                  getPromotionByID(firstOfferId, (_s: any, data: any) => {
                    if (_s === "Success") dispatch(setPartnerOffer(data));
                  })
                );
              }
              dispatch(fetchCurrentUserDetails());
              Alert.alert("Success", message);
            } else {
              Alert.alert("Error", message);
            }
          }
        )
      );
    } else {
      dispatch(
        createPromotion(payload, (status: string, message: string) => {
          setLoading(false);
          if (status === "Success") {
            dispatch(fetchCurrentUserDetails());
            Alert.alert("Success", message);
          } else {
            Alert.alert("Error", message);
          }
        })
      );
    }

    // Optional: if parent wants raw payload
    onSubmit?.(payload);
  }, [
    validateForm,
    currentUser?.id,
    title,
    description,
    category,
    discount,
    duration,
    selectedDays,
    startTime,
    endTime,
    location,
    coordinates,
    uploadedImageUrls,
    existingOffer?.id,
    dispatch,
    onSubmit,
    currentUser?.offers,
  ]);

  // ── Image upload
  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant photo library access.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      uploadImage(result.assets[0].uri);
    }
  }, []);

  const uploadImage = useCallback(
    async (uri: string) => {
      try {
        setUploadingImage(true);
        const form = new FormData();
        form.append("files", {
          uri,
          name: "offer-image.jpg",
          type: "image/jpeg",
        } as any);

        dispatch(
          uploadImages(form, (status: string, response: any) => {
            setUploadingImage(false);
            if (status === "Success") {
              const imageUrl = response?.[0]?.location;
              if (imageUrl) {
                setImages((prev) => [...prev, { uri }]);
                setUploadedImageUrls((prev) => [...prev, imageUrl]);
              } else {
                Alert.alert("Error", "Upload succeeded but no URL returned.");
              }
            } else {
              Alert.alert("Error", "Failed to upload image.");
            }
          })
        );
      } catch (e) {
        setUploadingImage(false);
        Alert.alert("Error", "Failed to upload image.");
      }
    },
    [dispatch]
  );

  const handleDayToggle = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  const handleLocationSelect = useCallback(
    (selectedLocation: string, selectedCoordinates: any) => {
      setLocation(selectedLocation);
      setCoordinates(selectedCoordinates);
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="bg-white flex-1">
        <View className="p-4 mb-12">
          <Text className="text-lg font-semibold text-center mb-4">
            Offer Details
          </Text>

          {/* Title */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Offer Title*</Text>
            <TextInput
              className={`border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 bg-[#EDF3F5] text-gray-700`}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter offer title"
            />
            {!!errors.title && (
              <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>
            )}
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Category*</Text>
            <TouchableOpacity
              className={`border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 bg-[#EDF3F5] flex-row justify-between items-center`}
              onPress={() => bottomSheetRefCategory.current?.snapToIndex(0)}
            >
              <Text className="text-gray-700">
                {category || "Select category"}
              </Text>
              <Feather name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>
            {!!errors.category && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.category}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Description*</Text>
            <TextInput
              className={`border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 bg-[#EDF3F5] text-gray-700`}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your offer here"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            {!!errors.description && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.description}
              </Text>
            )}
          </View>

          {/* Discount */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Discount %*</Text>
            <TextInput
              className={`border ${
                errors.discount ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 bg-[#EDF3F5] text-gray-700`}
              value={discount}
              onChangeText={setDiscount}
              placeholder="Enter discount percentage"
              keyboardType="numeric"
              // editable={!existingOffer?.discount} // lock when editing if desired
            />
            {!!errors.discount && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.discount}
              </Text>
            )}
          </View>

          {/* Duration */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Duration*</Text>
            <TouchableOpacity
              className={`border ${
                errors.duration ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 bg-[#EDF3F5] flex-row justify-between items-center`}
              onPress={() => bottomSheetRefDuration.current?.snapToIndex(0)}
              // disabled={!!existingOffer?.duration}
            >
              <Text className="text-gray-700">
                {duration || "Select duration"}
              </Text>
              <Feather name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>
            {!!errors.duration && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.duration}
              </Text>
            )}
          </View>

          {/* Days */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Offer Days*</Text>
            <TouchableOpacity
              className={`border ${
                errors.days ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 bg-[#EDF3F5] flex-row justify-between items-center`}
              onPress={() => bottomSheetRefDays.current?.snapToIndex(0)}
            >
              <Text className="text-gray-700">
                {selectedDays.length
                  ? selectedDays
                      .map(
                        (d) =>
                          daysOptions.find((x) => x.value === d)?.label ?? d
                      )
                      .join(", ")
                  : "Select days"}
              </Text>
              <Feather name="chevron-down" size={20} color="gray" />
            </TouchableOpacity>
            {!!errors.days && (
              <Text className="text-red-500 text-xs mt-1">{errors.days}</Text>
            )}
          </View>

          {/* Time */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">
              Offer Available Time*
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="border border-gray-300 rounded-md p-3 bg-[#EDF3F5] flex-1 mr-2 flex-row justify-between items-center"
                onPress={() => bottomSheetRefStartTime.current?.snapToIndex(0)}
              >
                <Text className="text-gray-700">{startTimeDisplay}</Text>
                <Feather name="clock" size={20} color="gray" />
              </TouchableOpacity>
              <Text className="self-center mx-2">to</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-md p-3 bg-[#EDF3F5] flex-1 ml-2 flex-row justify-between items-center"
                onPress={() => bottomSheetRefEndTime.current?.snapToIndex(0)}
              >
                <Text className="text-gray-700">{endTimeDisplay}</Text>
                <Feather name="clock" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Location*</Text>
            <TouchableOpacity
              className={`border ${
                errors.location ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 bg-[#EDF3F5] flex-row justify-between items-center`}
              onPress={() => bottomSheetRefLocation.current?.snapToIndex(0)}
            >
              <View className="flex-row items-center flex-1">
                <Feather
                  name="map-pin"
                  size={20}
                  color="gray"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-gray-700 flex-1" numberOfLines={1}>
                  {location || "Pick a location"}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
            {!!errors.location && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.location}
              </Text>
            )}
          </View>

          {/* Images */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">
              Offer Images*
            </Text>
            <View className="flex-row flex-wrap">
              {images.map((image, index) => (
                <View
                  key={`${image.uri}-${index}`}
                  className="w-24 h-24 m-1 relative"
                >
                  <Image
                    source={{ uri: image.uri }}
                    className="w-full h-full rounded-md"
                  />
                  <TouchableOpacity
                    className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x" size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md m-1 flex items-center justify-center"
                onPress={pickImage}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Feather name="plus" size={24} color="gray" />
                )}
              </TouchableOpacity>
            </View>
            {!!errors.images && (
              <Text className="text-red-500 text-xs mt-1">{errors.images}</Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            className="bg-[#AEF353] text-black p-4 rounded-md mt-5 flex items-center justify-center"
            onPress={handleSubmit}
            disabled={loading || uploadingImage}
          >
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text className="text-black font-medium">
                {existingOffer ? "Update Offer" : "Apply for Approval"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category */}
      <BottomSheet
        ref={bottomSheetRefCategory}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
        handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View className="px-3 py-0 pb-10">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                onPress={() => bottomSheetRefCategory.current?.close()}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Select Category</Text>
              <View />
            </View>

            <FlatList
              data={categories?.results ?? []}
              keyExtractor={(item: any) => item.id ?? item._id}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  className={`p-3 border-b border-gray-200 ${
                    category === item.title ? "bg-gray-100" : ""
                  }`}
                  onPress={() => {
                    setCategory(item.title);
                    bottomSheetRefCategory.current?.close();
                  }}
                >
                  <Text>{item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="p-4">
                  <Text className="text-gray-500">No categories found.</Text>
                </View>
              }
            />
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Duration */}
      <BottomSheet
        ref={bottomSheetRefDuration}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
        handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View className="px-3 py-0 pb-10">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                onPress={() => bottomSheetRefDuration.current?.close()}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Select Duration</Text>
              <View />
            </View>

            {durationOptions.map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`p-3 border-b border-gray-200 ${
                  duration === item.value ? "bg-gray-100" : ""
                }`}
                onPress={() => {
                  setDuration(item.value);
                  bottomSheetRefDuration.current?.close();
                }}
                disabled={!!existingOffer?.duration}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Days */}
      <BottomSheet
        ref={bottomSheetRefDays}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
        handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View className="px-3 py-0 pb-10">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                onPress={() => bottomSheetRefDays.current?.close()}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Select Days</Text>
              <View />
            </View>

            {daysOptions.map((item) => (
              <TouchableOpacity
                key={item.value}
                className="p-3 border-b border-gray-200 flex-row justify-between items-center"
                onPress={() => handleDayToggle(item.value)}
              >
                <Text>{item.label}</Text>
                {selectedDays.includes(item.value) && (
                  <MaterialIcons name="check" size={20} color="green" />
                )}
              </TouchableOpacity>
            ))}

            <View className="mt-3">
              <SolidButton
                disabled={false}
                title="Done"
                onPress={() => bottomSheetRefDays.current?.close()}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Start Time */}
      <BottomSheet
        ref={bottomSheetRefStartTime}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
        handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView style={{ flex: 1 }}>
          <View className="px-3 py-0 pb-20">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                onPress={() => bottomSheetRefStartTime.current?.close()}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Select Start Time</Text>
              <View />
            </View>

            <FlatList
              data={timeOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-3 border-b border-gray-200 ${
                    startTime === item.value ? "bg-gray-100" : ""
                  }`}
                  onPress={() => {
                    setStartTime(item.value);
                    bottomSheetRefStartTime.current?.close();
                  }}
                >
                  <Text>{item.display}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* End Time */}
      <BottomSheet
        ref={bottomSheetRefEndTime}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
        handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView style={{ flex: 1 }}>
          <View className="px-3 py-0 pb-20">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                onPress={() => bottomSheetRefEndTime.current?.close()}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Select End Time</Text>
              <View />
            </View>

            <FlatList
              data={timeOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-3 border-b border-gray-200 ${
                    endTime === item.value ? "bg-gray-100" : ""
                  }`}
                  onPress={() => {
                    setEndTime(item.value);
                    bottomSheetRefEndTime.current?.close();
                  }}
                >
                  <Text>{item.display}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Location Picker */}
      <LocationPicker
        bottomSheetRef={bottomSheetRefLocation}
        onLocationSelect={handleLocationSelect}
        initialLocation={location}
        initialCoordinates={coordinates}
      />
    </View>
  );
};

export default OfferForm;
