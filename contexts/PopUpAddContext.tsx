"use client";

import { showPopAd } from "@/Redux/Auth/authActions";
import { router } from "expo-router";
import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useDispatch } from "react-redux";

interface PopupAdContextData {
  title: string;
  description: string;
  imageUrl: string;
  isVisible: boolean;
  hidePopup: () => void;
  handleButtonPress: () => void;
}

const PopupAdContext = createContext<PopupAdContextData>({
  title: "",
  description: "",
  imageUrl: "",
  isVisible: false,
  hidePopup: () => {},
  handleButtonPress: () => {},
});

export const usePopupAd = () => useContext(PopupAdContext);

interface PopupAdProviderProps {
  children: ReactNode;
}

export const PopupAdProvider: React.FC<PopupAdProviderProps> = ({
  children,
}) => {
  const [adData, setAdData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const dispatch = useDispatch<any>();

  // Handle app state changes to detect when app is opened
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // When app comes to the foreground from background
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // Reset the session flag when app is reopened
        setHasShownThisSession(false);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  // Show popup with delay when app starts or comes to foreground
  useEffect(() => {
    if (appState === "active" && !hasShownThisSession) {
      const timer = setTimeout(() => {
        loadAndShowPopup();
      }, 5000); // 3 second delay, adjust as needed

      return () => clearTimeout(timer);
    }
  }, [appState, hasShownThisSession]);

  const loadAndShowPopup = () => {
    // Only proceed if we haven't shown the popup this session
    if (!hasShownThisSession) {
      dispatch(
        showPopAd((status: string, data: any) => {
          if (status === "Success" && data) {
            setAdData({
              title: data.title || "",
              description: data.description || "",
              imageUrl: data.imageUrlAttachment || "",
            });
            setIsVisible(true);
            setHasShownThisSession(true);
          }
        })
      );
    }
  };

  const hidePopup = () => {
    setIsVisible(false);
  };

  const handleButtonPress = () => {
    router.push("/Offers/All");
    hidePopup();
  };

  return (
    <PopupAdContext.Provider
      value={{
        title: adData.title,
        description: adData.description,
        imageUrl: adData.imageUrl,
        isVisible,
        hidePopup,
        handleButtonPress,
      }}
    >
      {children}
    </PopupAdContext.Provider>
  );
};
