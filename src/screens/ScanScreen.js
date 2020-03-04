import React, { Component } from "react";
import Header from "../components/Header";

import { Container, Content } from "native-base";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default class ScanScreen extends Component {
  static navigationOptions = {
    title: "Scan"
  };

  state = {};
  render() {
    return (
      <Container>
        <Content>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Products")}
            >
              <Text style={styles.text}>Scan product</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Inventory")}
            >
              <Text style={styles.text}>Scan order</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: { justifyContent: "center", alignItems: "center", paddingVertical: 20 },
  button: {
    alignItems: "center",
    backgroundColor: "#43A047",
    padding: 12,
    width: 280,
    marginTop: 12
  },
  image: { width: 200, height: 160 }
});
