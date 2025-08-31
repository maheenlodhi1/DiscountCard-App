import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import {
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

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
          title: "Home",

          tabBarLabelStyle: {
            fontSize: 12,
            // fontWeight: "bold",
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Offers"
        options={{
          title: "Offer",
          tabBarLabelStyle: {
            fontSize: 13,
            // fontWeight: "bold",
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="brightness-percent"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View className="w-12 h-12 mt-4 bg-lime-400 rounded-full flex items-center justify-center">
              <MaterialCommunityIcons
                name="barcode-scan"
                size={22}
                color="black"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "History",
          tabBarLabelStyle: {
            fontSize: 13,
            // fontWeight: "bold",
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarLabelStyle: {
            fontSize: 13,
            // fontWeight: "bold",
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
