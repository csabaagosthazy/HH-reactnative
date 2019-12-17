import React, { Component } from "react";
import Header from "../components/Header";

import { Container, Content } from "native-base";

import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "Warehouse"
  };
  render() {
    return (
      <Container>
        <Content>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={require("../assets/images/warehouse.jpg")} />
          </View>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Products")}
            >
              <Text style={styles.text}>Products</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Inventory")}
            >
              <Text style={styles.text}>Inventory</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Shipments")}
            >
              <Text style={styles.text}>Shipments</Text>
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
