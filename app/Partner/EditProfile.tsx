import {
  changePassword,
  fetchCurrentUserDetails,
  updatePartner,
  uploadImages,
} from "@/Redux/Auth/authActions";
import Input from "@/components/Common/Input";
import SelectComponent from "@/components/Common/Select";
import { SolidButton } from "@/components/Common/solidButton";
import { UAE_STATES } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "../../components/Common/PhoneInput";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.auth.currentUser);
  const [userData, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [countriesList, setCountriesList] = useState<string[]>([]);

  // Bottom Sheet State
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [400, 450], []);
  const [editField, setEditField] = useState<
    "name" | "password" | "phone" | "pic" | "nationality" | "state" | null
  >(null);

  // Form State
  const [firstName, setFirstName] = useState(user?.locale?.en?.firstName || "");
  const [lastName, setLastName] = useState(user?.locale?.en?.lastName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phone, setPhone] = useState(user?.phoneNo || "");
  const [state, setState] = useState(user?.state || "");
  const [nationality, setNationality] = useState(user?.nationality || "");
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(user?.photoUrl);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const countries = await response.json();
        const countryNames = countries.map((c: any) => c.name.common);
        setCountriesList(countryNames.sort());
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  // Open Bottom Sheet
  const openEditModal = (
    field: "name" | "password" | "phone" | "pic" | "nationality" | "state"
  ) => {
    setEditField(field);
    bottomSheetRef.current?.snapToIndex(0);
  };

  // Close Bottom Sheet
  const closeEditModal = () => {
    setEditField(null);
    setError("");
    bottomSheetRef.current?.close();
  };

  // Validate Password
  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  // Validate Phone Number
  const isValidPhoneNumber = (phone: string) => {
    return /^\+?[1-9]\d{7,14}$/.test(phone);
  };

  // Handle Update
  const handleUpdate = () => {
    let payload: any = {};

    if (editField === "name") {
      if (!firstName || !lastName) return setError("Both fields are required.");
      payload = {
        firstName: firstName,
        lastName: lastName,
      };
    }

    if (editField === "password") {
      if (!currentPassword || !newPassword)
        return setError("Both fields are required.");
      if (!isValidPassword(newPassword)) {
        return setError(
          "Password must contain uppercase, lowercase, number, and special character."
        );
      }
      payload = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };
    }

    if (editField === "phone") {
      if (!isValidPhoneNumber(phone))
        return setError("Enter a valid phone number.");
      payload = { phoneNo: phone };
    }

    if (editField === "state") {
      if (!isValidPhoneNumber(phone)) return setError("Enter a valid state");
      payload = { state };
    }
    if (editField === "nationality") {
      if (!isValidPhoneNumber(phone))
        return setError("Enter a valid nationality");
      payload = { nationality };
    }
    try {
      if (editField === "password") {
        dispatch(
          changePassword(payload, (status: string, response: string) => {
            if (status === "Success") {
              Alert.alert("Success", "Password updated successfully!");
              setLoading(false);
              closeEditModal();
            } else {
              setLoading(false);
              closeEditModal();
              setError(response);
            }
          })
        );
      } else {
        dispatch(
          updatePartner(
            payload,
            userData?.id,
            (status: string, response: string) => {
              if (status === "Success") {
                Alert.alert("Success", "Profile updated successfully!");
                dispatch(fetchCurrentUserDetails());
                setLoading(false);
                closeEditModal();
              } else {
                setLoading(false);
                closeEditModal();
                setError(response);
              }
            }
          )
        );
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  // Function to pick an image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Crop to square
      quality: 1, // High quality
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      let formData = new FormData();
      formData.append("files", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      setEditField("pic");
      dispatch(
        uploadImages(formData, (status: string, response: any) => {
          if (status === "Success") {
            // setImage(response[0]?.location);
            let url = response[0]?.location;
            handleUpdateImage(url);
            // Alert.alert("Success", "Profile updated successfully!");
          } else {
            Alert.alert("Error", "Failed to upload image.");
            setEditField(null);
          }
        })
      );

      // Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      // console.error("Upload failed", error);
      setEditField(null);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const handleUpdateImage = (url: string) => {
    let payload: any = {
      photoUrl: url,
    };

    try {
      dispatch(
        updatePartner(
          payload,
          userData?.id,
          (status: string, response: string) => {
            if (status === "Success") {
              dispatch(fetchCurrentUserDetails());
              Alert.alert("Success", "Profile picture updated successfully!");
              setLoading(false);
            } else {
              setLoading(false);
            }
          }
        )
      );
    } catch (error: any) {
      Alert.alert("Error", error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        {" "}
        <View className="flex-1 bg-white px-4 pt-5">
          {/* Header */}
          <View className="flex-row items-center pb-3">
            <TouchableOpacity onPress={() => router.back()} className="p-0">
              <Feather name="arrow-left" size={22} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold flex-1 text-center">
              Profile Details
            </Text>
          </View>

          {/* Profile Avatar */}
          <View className="items-center mt-4">
            <View className="w-24 h-24 relative bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full" />
              ) : (
                <Feather name="user" size={50} color="gray" />
              )}
              <TouchableOpacity
                className="absolute bottom-2 right-3 bg-white p-1 rounded-full shadow-md"
                onPress={pickImage}
              >
                <Feather name="edit-3" size={18} color="limegreen" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 pb-24">
            {/* Profile Fields */}
            <View className="mt-6 space-y-4">
              <TouchableOpacity
                // onPress={() => openEditModal("name")}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Business Name</Text>
                  <Text className="text-gray-700 font-medium">
                    {userData?.locale?.en?.businessName}
                  </Text>
                </View>
                {/* <Feather name="edit-3" size={18} color="limegreen" /> */}
              </TouchableOpacity>

              <TouchableOpacity
                disabled
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Business Email</Text>
                  <Text className="text-gray-700 font-medium">
                    {userData?.email}
                  </Text>
                </View>
                {/* <Feather name="edit-3" size={18} color="limegreen" /> */}
              </TouchableOpacity>
              {/* Name */}
              <TouchableOpacity
                onPress={() => openEditModal("name")}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Name</Text>
                  <Text className="text-gray-700 font-medium">
                    {userData?.locale?.en?.firstName}{" "}
                    {userData?.locale?.en?.lastName}
                  </Text>
                </View>
                <Feather name="edit-3" size={18} color="limegreen" />
              </TouchableOpacity>

              {/* Password */}
              <TouchableOpacity
                onPress={() => openEditModal("password")}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Password</Text>
                  <Text className="text-gray-700 font-medium">
                    ************
                  </Text>
                </View>
                <Feather name="edit-3" size={18} color="limegreen" />
              </TouchableOpacity>

              {/* Phone Number */}
              <TouchableOpacity
                onPress={() => openEditModal("phone")}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Phone No.</Text>
                  <Text className="text-gray-700 font-medium">
                    {userData?.phoneNo}
                  </Text>
                </View>
                <Feather name="edit-3" size={18} color="limegreen" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openEditModal("state")}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">State</Text>
                  <Text className="text-gray-700 font-medium">
                    {userData?.state || "Not specified"}
                  </Text>
                </View>
                <Feather name="edit-3" size={18} color="limegreen" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => openEditModal("nationality")}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-row items-center"
              >
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">Nationality</Text>
                  <Text className="text-gray-700 font-medium">
                    {userData?.nationality || "Not specified"}
                  </Text>
                </View>
                <Feather name="edit-3" size={18} color="limegreen" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
          handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
          //   enableHandlePanningGesture={false}
          //   enableContentPanningGesture={false}
          enablePanDownToClose={false}
          //   enableDynamicSizing={true}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <View className="px-3 py-0 pb-10">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={closeEditModal}>
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold">
                  {editField === "name"
                    ? "Edit Name"
                    : editField === "password"
                    ? "Edit Password"
                    : editField === "state"
                    ? "Edit State"
                    : editField === "nationality"
                    ? "Edit Nationality"
                    : "Edit Phone"}
                </Text>
                <View></View>
              </View>

              {/* Input Fields */}
              {editField === "name" && (
                <>
                  <Input
                    onChange={(value) => setFirstName(value)}
                    placeholder="First Name"
                    value={firstName}
                    label="First Name"
                    type="text"
                    editable={true}
                  />
                  <Input
                    onChange={(value) => setLastName(value)}
                    placeholder="Last Name"
                    value={lastName}
                    label="Last Name"
                    type="text"
                    editable={true}
                  />
                </>
              )}

              {editField === "password" && (
                <>
                  <Text className="mb-5">
                    New Password should be at least 8 characters long.
                  </Text>
                  <Input
                    onChange={(value) => setCurrentPassword(value)}
                    placeholder="Enter Password"
                    value={currentPassword}
                    label="Current Password"
                    type="password"
                    editable={true}
                  />
                  <Input
                    onChange={(value) => setNewPassword(value)}
                    placeholder="New Password"
                    value={newPassword}
                    label="New Password"
                    type="password"
                    editable={true}
                  />
                </>
              )}

              {editField === "phone" && (
                <PhoneInput
                  value={phone}
                  onChange={(value) => setPhone(value)}
                />
              )}
              {editField === "state" && (
                <SelectComponent
                  data={UAE_STATES}
                  selectedValue={state}
                  onSelect={(value) => {
                    setState(value);
                    setError("");
                  }}
                />
              )}

              {editField === "nationality" && (
                <SelectComponent
                  data={countriesList}
                  selectedValue={nationality}
                  onSelect={(value) => {
                    setNationality(value);
                    setError("");
                  }}
                  searchPlaceholder="Search nationality..."
                />
              )}
              {error && (
                <Text className="text-red-500 text-sm mb-3">{error}</Text>
              )}

              <View className="mt-3">
                <SolidButton
                  title={
                    loading ? (
                      <ActivityIndicator size={20} color="black" />
                    ) : (
                      "Save"
                    )
                  }
                  onPress={handleUpdate}
                  disabled={loading}
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
