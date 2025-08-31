import { Feather } from "@expo/vector-icons";
import type React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PopupAdProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageUrl: string;
  onButtonPress: () => void;
}

const PopupAdModal: React.FC<PopupAdProps> = ({
  isVisible,
  onClose,
  title,
  description,
  imageUrl,
  onButtonPress,
}) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage} />
              )}
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {title || "Enjoy Exclusive discount on movie shows"}
              </Text>
              <Text style={styles.description}>
                {description ||
                  "Get special offers and discounts on your favorite movies and shows."}
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onButtonPress}>
              <Text style={styles.buttonText}>Check it out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 275,
    height: 353,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  contentContainer: {
    width: 243,
    height: 321,
    gap: 16,
  },
  topBar: {
    width: "100%",
    height: 24,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
  },
  closeButton: {
    width: 24,
    height: 24,
  },
  imageContainer: {
    width: "100%",
    height: 169,
    backgroundColor: "#D8E0EA",
    borderRadius: 12,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#D8E0EA",
    borderRadius: 12,
  },
  textContainer: {
    width: "100%",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold", // You may need to ensure this font is loaded
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    letterSpacing: -0.27,
    color: "#121712",
  },
  description: {
    fontFamily: "Poppins-Light", // You may need to ensure this font is loaded
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: 0.005 * 12, // 0.005em converted to points
    color: "#78828A",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#AEF353",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  buttonText: {
    fontFamily: "PlusJakartaSans-SemiBold", // You may need to ensure this font is loaded
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 16,
    color: "#000000",
  },
});

export default PopupAdModal;
