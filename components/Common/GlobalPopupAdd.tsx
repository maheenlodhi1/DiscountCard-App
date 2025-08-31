import { usePopupAd } from "@/contexts/PopUpAddContext";
import PopupAdModal from "./PopUpAdd";

const GlobalPopupAd = () => {
  const {
    title,
    description,
    imageUrl,
    isVisible,
    hidePopup,
    handleButtonPress,
  } = usePopupAd();

  return (
    <PopupAdModal
      isVisible={isVisible}
      onClose={hidePopup}
      title={title}
      description={description}
      imageUrl={imageUrl}
      onButtonPress={handleButtonPress}
    />
  );
};

export default GlobalPopupAd;
