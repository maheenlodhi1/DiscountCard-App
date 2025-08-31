import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface SelectComponentProps {
  data: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  searchPlaceholder?: string;
  placeholder?: string;
}

const SelectComponent = ({
  data,
  selectedValue,
  onSelect,
  searchPlaceholder,
  placeholder = "Select an option",
}: SelectComponentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const filteredData = data.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.trigger}
      >
        <Text
          style={selectedValue ? styles.selectedText : styles.placeholderText}
        >
          {selectedValue || placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Search Input */}
            {searchPlaceholder && (
              <TextInput
                placeholder={searchPlaceholder}
                style={styles.searchInput}
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
            )}

            {/* List */}
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedValue === item && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "white",
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: "70%",
  },
  searchInput: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#e3f2fd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#2196f3",
    fontWeight: "600",
  },
  closeButton: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#2196f3",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SelectComponent;
