import React, { Component } from "react";
import firebase from "firebase";
import { db } from "../config/fireBaseConfig";
import ProductAddForm from "../components/ProductAddForm";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";

export default class ProductsScreen extends Component {
  static navigationOptions = {
    title: "Products"
  };

  state = {
    addFormOpen: false,
    loading: false,
    data: [],
    error: null,
    text: "text"
  };

  componentDidMount() {
    this.getData();
    console.log(this.state);
  }

  getData = () => {
    console.log("get data");
    try {
      let productsRef = db.ref("products/");
      console.log(productsRef);
      productsRef.on("value", snapshot => {
        console.log(snapshot);
        this.setState({ loading: true });
        let data = snapshot.val();
        console.log(data);
        let products = Object.values(data);
        this.setState({ data: products, loading: false });
      });
    } catch (e) {
      this.setState({ error: e });
      console.log(e);
    }
  };

  saveData = ({ name, color, producer, price, amount }) => {
    console.log("savedata");
    db.ref("products/")
      .push({ name, color, producer, price, amount })
      .then(res => {
        console.log("data", res);
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  handleAddFormVisible = visible => {
    console.log("visible: ", visible);
    this.setState({ addFormOpen: visible });
  };

  render() {
    if (this.state.loading) return <ActivityIndicator animating size="large" />;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ProductAddForm
          addFormOpen={this.state.addFormOpen}
          handleAddFormVisible={this.handleAddFormVisible}
          handleSave={this.saveData}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.handleAddFormVisible(true)}>
          <Text>Add new</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={item.pieces > 0 ? "available" : "not available"}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#43A047",
    padding: 12,
    width: 280,
    marginTop: 12
  }
});
