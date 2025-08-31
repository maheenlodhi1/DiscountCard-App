import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const VerificationModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();

  // Handle Android Back Button to Prevent Going Back to SignUp
  useEffect(() => {
    const backAction = () => {
      router.replace("/AuthScreens/LogIn");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleClose = () => {
    setModalVisible(false);
    router.replace("/AuthScreens/LogIn");
  };

  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View className="w-full flex items-center justify-center pt-0">
              <Image
                source={require("../../../assets/images/verified.png")}
                style={styles.checkImage}
              />
            </View>
          </View>

          <Text style={styles.messageText}>
            Your account has been verified.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  checkImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  iconContainer: {
    marginVertical: 0,
  },
  messageText: {
    fontSize: 18,
    paddingTop: 20,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default VerificationModal;
