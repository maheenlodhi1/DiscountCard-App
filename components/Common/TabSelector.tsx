import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { t } from "../../lib/i18n";

interface TabSelectorProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const TabSelector = ({ selectedTab, onTabChange }: TabSelectorProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabChange("Customer")}
        >
          <View
            style={[
              styles.highlight,
              selectedTab === "Customer" && styles.highlightActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Customer" && styles.selectedTabText,
              ]}
            >
              {t("tabSelector.customer")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => onTabChange("Partner")}
        >
          <View
            style={[
              styles.highlight,
              selectedTab === "Partner" && styles.highlightActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "Partner" && styles.selectedTabText,
              ]}
            >
              {t("tabSelector.partner")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    height: 55,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: "relative",
  },
  highlight: {
    width: "90%",
    height: "80%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightActive: {
    backgroundColor: "#D5FF9F",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  selectedTabText: {
    color: "#000",
    fontWeight: "600",
  },
});

export default TabSelector;
