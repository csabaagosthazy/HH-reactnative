import React, { useState, useEffect } from "react";
import firebase from "firebase";

import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Platform, StatusBar, StyleSheet, YellowBox } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Container } from "native-base";

import AppNavigator from "./src/navigation/AppNavigator";

YellowBox.ignoreWarnings(["Setting a timer"]);

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Container>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </Container>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([require("./src/assets/images/warehouse.jpg")]),
    Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}
