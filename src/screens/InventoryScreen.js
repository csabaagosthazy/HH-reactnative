import React, { Component } from "react";
import { Container, Content } from "native-base";
import { Text } from "react-native";

export default class InventoryScreen extends Component {
  static navigationOptions = {
    title: "Inventory"
  };
  render() {
    return (
      <Container>
        <Content>
          <Text>Inventory</Text>
        </Content>
      </Container>
    );
  }
}
