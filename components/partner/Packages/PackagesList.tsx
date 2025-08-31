import React, { useState } from "react";
import { View, ScrollView, Alert, ToastAndroid } from "react-native";
import PackageCard from "./PackageCard";
import MyWebView from "@/components/Payments/webView";

export type PackageData = {
  title: string;
  price: string;
  description: string;
  features: (
    | string
    | {
        title: string;
        items: string[];
      }
  )[];
  color: string;
};

type PackagesListProps = {
  packages: PackageData[];
  subscriptions?: any[];
  onContactPress: () => void;
  buySubscription: (
    payload: string,
    callback: (type: string, response: any) => void
  ) => void;
  onPaymentComplete: (status: string) => void;
};

const PackagesList = ({
  packages,
  subscriptions = [],
  onContactPress,
  buySubscription,
  onPaymentComplete,
}: PackagesListProps) => {
  const [payLoading, setPayLoading] = useState(false);
  const [paymentURL, setPaymentURL] = useState("");
  const [visibleWebView, setVisibleWebView] = useState(false);
  const [subID, setSubID] = useState<string | undefined>();

  const handlePackageAction = (feature: string, index: number) => {
    if (feature === "Contact Us") {
      onContactPress();
    } else {
      setSubID(subscriptions[index]?.id);
      makePaymentRequest(subscriptions[index]?.id);
    }
  };

  const makePaymentRequest = async (subscriptionId: string) => {
    let payload = `subscriptionType=${subscriptionId}`;

    ToastAndroid.show(
      "Please wait while payment is processing",
      ToastAndroid.LONG
    );
    setPayLoading(true);
    buySubscription(payload, handleCallBack);
  };

  const handleCallBack = (type: string, response: any) => {
    setPayLoading(false);
    if (type === "Success") {
      setPaymentURL(response.url);
      setVisibleWebView(true);
    } else {
      Alert.alert("Payment Error", response);
    }
  };

  const handlePaymentResponse = async (e: string) => {
    setVisibleWebView(false);
    onPaymentComplete(e);
  };

  return (
    <View>
      <ScrollView className="bg-white p-4 mb-20">
        {(subscriptions.length > 0 ? subscriptions : packages).map(
          (pkg: any, index: number) => (
            <PackageCard
              key={index}
              title={subscriptions.length > 0 ? pkg?.name : pkg.title}
              price={
                subscriptions.length > 0
                  ? index === 3
                    ? "Get Quote"
                    : pkg.amount
                  : pkg.price
              }
              description={packages[index]?.description}
              features={packages[index]?.features}
              color={packages[index]?.color}
              index={index}
              onActionPress={handlePackageAction}
            />
          )
        )}
      </ScrollView>

      <MyWebView
        visible={visibleWebView}
        url={paymentURL}
        hideVisible={(e: any) => handlePaymentResponse(e)}
      />
    </View>
  );
};

export default PackagesList;
