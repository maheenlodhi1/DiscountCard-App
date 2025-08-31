/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import { PermissionsAndroid } from "react-native";

export const CameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
      // {
      //   title: 'Allow Camera Permission',
      //   message:
      //     'DiscountCard App needs access to your camera',
      //   buttonNeutral: 'Ask Me Later',
      //   buttonNegative: 'Cancel',
      //   buttonPositive: 'OK',
      // },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
