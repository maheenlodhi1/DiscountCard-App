import CalendarIcon from "@/assets/images/icons/Calendar";
import CreditCardIcon from "@/assets/images/icons/CreditCard";
import { OfferRedeem, addEvent } from "@/Redux/Auth/authActions";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const CardVerificationScreen = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const CardData = useLocalSearchParams<any>();
  const { currentUser, partnerOffer } = useSelector((state: any) => state.auth);
  console.log(
    "Partner Offer ++++++++++++++++++=================",
    partnerOffer
  );

  const [amount, setAmount] = useState<any>("");
  const [error, setError] = useState("");

  const MANCHESTER = { latitude: 53.4808, longitude: -2.2426 };

  const getOfferLatLng = () => {
    const coords = partnerOffer?.locations?.[0]?.coordinates?.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      return { latitude: coords[0], longitude: coords[1] };
    }
    return MANCHESTER;
  };

  // Build event payload
  const buildRedeemEvent = () => {
    const { latitude, longitude } = getOfferLatLng();
    return {
      promotionId: partnerOffer?.id,
      userId: CardData?.userId,
      categoryName: partnerOffer?.categoryName || "",
      eventType: "redeem",
      source: "app",
      location: {
        type: "Point",
        coordinates: [latitude, longitude],
      },
    };
  };

  const handleRedeem = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");

    const discount = partnerOffer?.discount || 0;
    const discountedAmount = Number(amount) - (Number(amount) * discount) / 100;

    const payload = {
      totalBill: Number(amount),
      partner: currentUser?.id,
      customer: CardData?.userId,
    };

    dispatch(
      OfferRedeem(
        partnerOffer?.id,
        payload,
        async (status: any, message: any) => {
          if (status === "Success") {
            const eventPayload = buildRedeemEvent();
            dispatch(
              addEvent(eventPayload, async (status: any, message: any) => {})
            );
            router.push({
              pathname: "/Screens/partner/OfferRedeemed",
              params: { discountedAmount },
            });
          } else {
            setError(message);
          }
        }
      )
    );
  };

  const formatDate = (mongoDate: any) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(mongoDate));
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPressIn={() => router.replace("/Partner/HomeScreens/scanner")}
        >
          <Feather name="x" size={24} />
        </TouchableOpacity>
      </View>

      {/* Success Section */}
      <View className="bg-white rounded-b-3xl pb-4">
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              {/* This is a simplified checkmark icon */}
              <View style={styles.checkmarkCircle}>
                <View style={styles.checkmark} />
              </View>
            </View>
          </View>
          <Text style={styles.successText}>Card Verified Successfully</Text>
        </View>

        {/* Card Details */}
        <View
          className="border border-1 border-gray-200"
          style={styles.cardDetailsContainer}
        >
          <View style={styles.cardDetailsContent}>
            {/* Customer Name */}
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Feather name="user" size={16} color="#62AD00" />
              </View>
              <Text style={styles.detailLabel}>Customer Name</Text>
              <Text style={styles.detailValue}>{CardData?.cardName}</Text>
            </View>

            {/* Card Number */}
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <CreditCardIcon />
              </View>
              <Text style={styles.detailLabel}>Card Number</Text>
              <Text style={styles.detailValue}>{CardData?.id}</Text>
            </View>

            {/* Expiry Date */}
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <CalendarIcon />
              </View>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>
                {formatDate(CardData?.expiryDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Invoice Section */}
      <View style={styles.invoiceSection}>
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>Enter Invoice Amount</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter Amount"
              keyboardType="numeric"
            />
            {error ? (
              <Text className="text-red-500 text-sm mt-2">{error}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF3F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  successContainer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  successIcon: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#62AD00",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 24,
    height: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }],
  },
  successText: {
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 16,
    color: "#121712",
  },
  cardDetailsContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  cardDetailsContent: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 24,
  },
  iconContainer: {
    width: 24,
    height: 24,
    backgroundColor: "#EDF3F5",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontFamily: "System",
    fontSize: 12,
    color: "#768A91",
    fontWeight: "500",
    flex: 1,
    marginLeft: 8,
  },
  detailValue: {
    fontFamily: "System",
    fontSize: 14,
    color: "#768A91",
    fontWeight: "500",
  },
  invoiceSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    padding: 20,
    borderRadius: 25,
    flex: 1,
  },
  invoiceHeader: {
    marginBottom: 16,
  },
  invoiceTitle: {
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 16,
    color: "#3A3D42",
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountLabel: {
    fontFamily: "System",
    fontSize: 12,
    color: "#768A91",
    fontWeight: "500",
    marginBottom: 6,
  },
  amountInputContainer: {
    backgroundColor: "#EDF3F5",
    borderRadius: 8,
    padding: 10,
  },
  amountInput: {
    fontFamily: "System",
    fontSize: 14,
    color: "#768A91",
    fontWeight: "500",
  },
  redeemButton: {
    backgroundColor: "#AEF353",
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  redeemButtonText: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
});

export default CardVerificationScreen;
