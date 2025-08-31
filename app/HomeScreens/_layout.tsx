import { Tabs } from "expo-router";
import { View } from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { t } from "@/lib/i18n";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          height: 80,
          position: "absolute",
          borderColor: "white",
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#A3E635",
        tabBarInactiveTintColor: "#374151",
        headerShown: false,
        tabBarItemStyle: {
          marginTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarLabelStyle: { fontSize: 13 },
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: t("tabs.search"),
          tabBarLabelStyle: { fontSize: 13 },
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Card"
        options={{
          title: "",
          tabBarIcon: () => (
            <View className="w-12 h-12 mt-4 bg-lime-400 rounded-full flex items-center justify-center">
              <FontAwesome name="credit-card" size={22} color="black" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: t("tabs.history"),
          tabBarLabelStyle: { fontSize: 13 },
          tabBarIcon: ({ color }) => (
            <Feather name="clock" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: t("tabs.profile"),
          tabBarLabelStyle: { fontSize: 13 },
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
