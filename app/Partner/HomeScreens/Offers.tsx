// app/partner/PricingScreen.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";

import PackagesList from "@/components/partner/Packages/PackagesList";
import ContactForm from "@/components/partner/CustomSubscription/ContactUs";
import OfferForm from "@/components/partner/Offer/OfferForm";
import { packages } from "@/data/Pacakges";

// ⬇️ import your real actions; add a getOfferById if you don’t have one yet
import {
  getSubscription,
  buySubscription,
  checkMembership,
  // You may already have something like getPromotionById / getOfferDetails
  // If not, create one in your Redux actions and import here:
  getPromotionByID,
} from "@/Redux/Auth/authActions";
import { SafeAreaView } from "react-native-safe-area-context";

const PricingScreen = () => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const isFocused = useIsFocused();

  const { currentUser } = useSelector((state: any) => state.auth);

  const bottomSheetRefContact = useRef<BottomSheet>(null);
  const snapPointsContact = useMemo(() => [400, 450], []);

  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions]: any[] = useState([]);
  const [membershipData, setMembershipdata]: any = useState(null);
  const [error, setError] = useState<string>("");

  // Offer state (object, not ID)
  const [existingOffer, setExistingOffer]: any = useState(null);
  const [offerLoading, setOfferLoading] = useState(false);

  const openContactModal = useCallback(() => {
    bottomSheetRefContact.current?.snapToIndex(0);
  }, []);

  const closeContactModal = useCallback(() => {
    bottomSheetRefContact.current?.close();
  }, []);

  const getSubscriptions = useCallback(() => {
    setLoading(true);
    setError("");
    dispatch(
      getSubscription("package", (status: string, response: any) => {
        setLoading(false);
        if (status === "Success") {
          setSubscriptions(response);
        } else {
          setError("Failed to load subscriptions.");
        }
      })
    );
  }, [dispatch]);

  const checkMembershipStatus = useCallback(() => {
    setError("");
    dispatch(
      checkMembership((status: string, response: any) => {
        if (status === "Success") {
          setMembershipdata(response);
        } else {
          setMembershipdata(null);
        }
      })
    );
  }, [dispatch]);

  // Fetch existing offer object if user has one ID
  const existingOfferId: string | undefined = currentUser?.offers?.[0]?.id;

  const fetchExistingOffer = useCallback(() => {
    if (!existingOfferId) {
      setExistingOffer(null);
      return;
    }
    setOfferLoading(true);
    setError("");
    dispatch(
      getPromotionByID(existingOfferId, (status: string, response: any) => {
        setOfferLoading(false);
        if (status === "Success") {
          setExistingOffer(response); // full offer object
        } else {
          setExistingOffer(null);
          setError("Failed to load your offer details.");
        }
      })
    );
  }, [dispatch, existingOfferId]);

  useEffect(() => {
    if (!isFocused) return;
    getSubscriptions();
    checkMembershipStatus();
    fetchExistingOffer();
  }, [isFocused, getSubscriptions, checkMembershipStatus, fetchExistingOffer]);

  const handlePaymentComplete = useCallback(
    (status: string) => {
      if (status === "Success") {
        Alert.alert(
          "Payment Success",
          "You have successfully subscribed to the membership"
        );
        checkMembershipStatus();
      } else {
        Alert.alert(
          "Payment Not Successful",
          "Payment could not be completed, please try again"
        );
      }
    },
    [checkMembershipStatus]
  );

  const handleOfferSubmit = useCallback((offerData: any) => {
    // TODO: wire to API/Redux action for create/update
    console.log("Offer form submitted:", offerData);
  }, []);

  // Basic loading / error handling UI
  if (loading && !membershipData) {
    return (
      <GestureHandlerRootView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator />
      </GestureHandlerRootView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView style={{ flex: 1 }}>
        {!membershipData ? (
          <View>
            <PackagesList
              packages={packages}
              subscriptions={subscriptions}
              onContactPress={openContactModal}
              buySubscription={(payload, callback) =>
                dispatch(buySubscription(payload, callback))
              }
              onPaymentComplete={handlePaymentComplete}
            />
            <ContactForm
              bottomSheetRef={bottomSheetRefContact}
              snapPoints={snapPointsContact}
              onClose={closeContactModal}
            />
          </View>
        ) : (
          <>
            {offerLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator />
              </View>
            ) : (
              <OfferForm
                onSubmit={handleOfferSubmit}
                // Pass a *full offer object* or `null` to start a fresh form
                existingOffer={
                  existingOffer /* null if none or failed to load */
                }
              />
            )}
          </>
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default PricingScreen;
