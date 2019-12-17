import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function ScanScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text>Scan screen</Text>
    </ScrollView>
  );
}

ScanScreen.navigationOptions = {
  title: "Links"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
