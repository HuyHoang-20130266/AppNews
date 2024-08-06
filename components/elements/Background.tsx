import React from "react";
import { ImageBackground, StyleSheet, KeyboardAvoidingView } from "react-native";
import { theme } from "./theme";
import { ImagesAssets } from "../../assets/img/ImagesAssets";

export default function Background({ children }: any) {
  return (
    <ImageBackground
      source={ImagesAssets.background}
      resizeMode="repeat"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  }
});
