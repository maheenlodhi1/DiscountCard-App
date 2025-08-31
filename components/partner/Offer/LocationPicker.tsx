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
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Feather } from "@expo/vector-icons";
import { SolidButton } from "@/components/Common/solidButton";

const GOOGLE_MAPS_API_KEY = "AIzaSyAGtTzCFC5I7fdjV2E3QJTUMggoKSTYOv0";
const DEFAULT_COORDINATES = { latitude: 53.4808, longitude: -2.2426 };

type LatLng = { latitude: number; longitude: number };

type LocationPickerProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onLocationSelect: (location: string, coordinates: LatLng) => void;
  initialLocation?: string;
  initialCoordinates?: LatLng;
};

const LocationPicker = ({
  bottomSheetRef,
  onLocationSelect,
  initialLocation = "",
  initialCoordinates,
}: LocationPickerProps) => {
  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ["90%"], []);

  const [address, setAddress] = useState(initialLocation);
  const [coordinates, setCoordinates] = useState<LatLng>(
    initialCoordinates || DEFAULT_COORDINATES
  );
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const initialRegion = useMemo<Region>(
    () => ({
      latitude: initialCoordinates?.latitude ?? DEFAULT_COORDINATES.latitude,
      longitude: initialCoordinates?.longitude ?? DEFAULT_COORDINATES.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }),
    []
  ); // keep stable

  const focusTo = useCallback((c: LatLng) => {
    mapRef.current?.animateToRegion(
      { ...c, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      250
    );
  }, []);

  const getAddressFromCoords = useCallback(async (c: LatLng) => {
    try {
      setFetchingLocation(true);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${c.latitude},${c.longitude}&key=${GOOGLE_MAPS_API_KEY}&region=gb`
      );
      const data = await res.json();
      return data?.results?.[0]?.formatted_address || "Unknown location";
    } finally {
      setFetchingLocation(false);
    }
  }, []);

  const handlePlacesPick = useCallback(
    (data: any, details: any) => {
      const lat = details?.geometry?.location?.lat;
      const lng = details?.geometry?.location?.lng;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      const newCoords = { latitude: lat, longitude: lng };
      const formatted = details?.formatted_address || data?.description || "";
      setCoordinates(newCoords);
      setAddress(formatted);
      focusTo(newCoords);
    },
    [focusTo]
  );

  const handleMapPress = useCallback(
    async (e: any) => {
      const c: LatLng = e.nativeEvent.coordinate;
      setCoordinates(c);
      focusTo(c);
      const addr = await getAddressFromCoords(c);
      setAddress(addr);
    },
    [focusTo, getAddressFromCoords]
  );

  const handleConfirm = useCallback(() => {
    onLocationSelect(address, coordinates);
    bottomSheetRef.current?.close();
  }, [address, coordinates, onLocationSelect, bottomSheetRef]);

  useEffect(() => {
    if (!initialCoordinates) return;
    setCoordinates(initialCoordinates);
    focusTo(initialCoordinates);
  }, [initialCoordinates, focusTo]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
      handleIndicatorStyle={{ backgroundColor: "black", width: 100 }}
      enablePanDownToClose
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="px-3 py-0 pb-24" style={{ flex: 1 }}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Select Location</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Google Places Autocomplete */}
          <GooglePlacesAutocomplete
            placeholder="Search UK addresses"
            fetchDetails
            onPress={handlePlacesPick}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en-GB",
              components: "country:gb",
            }}
            predefinedPlaces={[]}
            minLength={2}
            debounce={200}
            enablePoweredByContainer={false}
            styles={{
              container: { marginBottom: 8, flex: 0 },
              textInput: {
                height: 48,
                borderRadius: 6,
                paddingHorizontal: 10,
                backgroundColor: "#EDF3F5",
              },
              listView: { backgroundColor: "white" },
            }}
            onFail={(err) => console.warn("Places error:", err)}
            textInputProps={{
              defaultValue: address,
              onChangeText: setAddress,
            }}
          />

          {/* Map */}
          <View
            style={styles.mapContainer}
            className="rounded-lg overflow-hidden"
          >
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={initialRegion}
              provider="google"
              onPress={handleMapPress}
              {...(Platform.OS === "web"
                ? { googleMapsApiKey: GOOGLE_MAPS_API_KEY }
                : {})}
            >
              <Marker coordinate={coordinates} />
            </MapView>
          </View>

          {/* Confirm */}
          <View className="mt-3">
            <SolidButton
              title={
                fetchingLocation ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  "Confirm Location"
                )
              }
              onPress={handleConfirm}
              disabled={fetchingLocation || !address}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  mapContainer: { height: 380 },
});

export default LocationPicker;
