import "react-native-get-random-values";
import { Stack, useRouter, Slot } from "expo-router";
import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../Redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { LanguageProvider } from "../contexts/LanguageContext";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser]: any = useState();
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkPersist = async () => {
      await persistor.persist();
      persistor.subscribe(() => {
        if (persistor.getState().bootstrapped) {
          setIsReady(true);
        }
      });
    };

    checkPersist();
  }, []);

  useEffect(() => {
    if (isReady) {
      setTimeout(async () => {
        // const userLoggedIn = false;
        // setIsLoggedIn(userLoggedIn);
        const storedLoginStatus = await AsyncStorage.getItem("isLoggedIn");
        const user: any = await AsyncStorage.getItem("user");
        setIsLoggedIn(storedLoginStatus === "true");
        setUser(JSON.parse(user));
      }, 500);
    }
  }, [isReady]);

  useEffect(() => {
    if (isReady && isLoggedIn !== null && user) {
      if (isLoggedIn) {
        if (user?.userType === "partner") {
          router.replace("/Partner/HomeScreens");
        } else {
          router.replace("/HomeScreens");
        }
      } else {
        router.replace("/");
      }
    }
  }, [isReady, isLoggedIn, router, isFocused]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Slot />
          </Stack>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}
