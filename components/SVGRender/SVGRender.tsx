import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const SvgRenderer = ({ svgString }: any) => {
  const htmlContent = `
    <html>
      <body style="margin:0; padding:0;">
        <div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">
          ${svgString}
        </div>
      </body>
    </html>
  `;

  return (
    <View style={styles.svgContainer}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webViewStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    height: "100%",
    width: "100%",
  },
  webViewStyle: {
    backgroundColor: "transparent",
    width: 600,
    display: "flex",
    alignSelf: "center",
    textAlign: "center",

    // height: 100,
  },
});

export default SvgRenderer;
