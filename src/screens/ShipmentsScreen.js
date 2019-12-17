import React, { Component } from "react";
import { Container, Content } from "native-base";
import { Text } from "react-native";

export default class ShipmentsScreen extends Component {
  static navigationOptions = {
    title: "Shipments"
  };
  render() {
    return (
      <Container>
        <Content>
          <Text>Shipments</Text>
        </Content>
      </Container>
    );
  }
}
