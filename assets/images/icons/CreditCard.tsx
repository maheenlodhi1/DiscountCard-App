import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

const CreditCardIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Rect
      x="2"
      y="3.33334"
      width="12"
      height="9.33333"
      rx="3"
      stroke="#62AD00"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 6.66668H14"
      stroke="#62AD00"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.66643 9.99999H4.67309"
      stroke="#62AD00"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.3335 9.99999H8.66683"
      stroke="#62AD00"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CreditCardIcon;
