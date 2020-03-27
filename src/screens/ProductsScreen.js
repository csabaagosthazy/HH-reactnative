import React, { Component } from "react";
import { db } from "../config/fireBaseConfig";
import { getData } from "../utils/databaseUtils";
import ProductAddForm from "../components/ProductAddForm";
import ProductDetails from "../components/ProductDetails";

import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

export default class ProductsScreen extends Component {
  static navigationOptions = {
    title: "Products"
  };

  state = {
    addFormOpen: false,
    productFormOpen: false,
    product: "",
    loading: true,
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
      let productsRef = db.ref("/products");
      console.log(productsRef);
      productsRef.on("value", snapshot => {
        console.log(snapshot);
        let data = [];
        snapshot.forEach(child => {
          data.push({
            name: child.val().name,
            color: child.val().color,
            producer: child.val().producer,
            price: Number(child.val().price),
            amount: Number(child.val().amount),
            id: child.key
          });
        });
        console.log(data);
        this.setState({ data, loading: false });
      });
    } catch (e) {
      this.setState({ error: e });
      console.log(e);
    }
  };

  saveData = ({ name, color, producer, price, amount }) => {
    console.log("savedata");
    let newKey = db
      .ref()
      .child("products")
      .push().key;

    let updates = {};
    updates["/products/" + newKey] = {
      name,
      color,
      producer,
      price,
      amount
    };

    db.ref().update(updates);
  };
  handleAddFormVisible = visible => {
    this.setState({ addFormOpen: visible });
  };
  handleProductDetailsVisible = (visible, item) => {
    let data = [];

    for (let [key, value] of Object.entries(item)) {
      let obj = { key, value };

      data = [...data, obj];
    }
    console.log(item);
    this.setState({ productFormOpen: visible, product: data });
  };

  render() {
    if (this.state.loading) return <ActivityIndicator animating size="large" />;
    return (
      <SafeAreaView style={styles.container}>
        <ProductAddForm
          addFormOpen={this.state.addFormOpen}
          handleAddFormVisible={this.handleAddFormVisible}
          handleSave={this.saveData}
        />
        <ProductDetails
          productFormOpen={this.state.productFormOpen}
          product={this.state.product}
          handleProductDetailsVisible={this.handleProductDetailsVisible}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.handleAddFormVisible(true)}>
          <Text>Add new</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => this.handleProductDetailsVisible(true, item)}
            >
              <Text style={styles.name}>{item.name}</Text>
              {item.amount > 0 ? <Text>Available</Text> : <Text>Not available</Text>}
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#43A047",
    padding: 12,
    width: 280,
    marginTop: 12,
    marginBottom: 30
  },
  item: {
    alignItems: "center",
    backgroundColor: "#ff8c00",
    padding: 12,
    width: 180,
    marginTop: 12
  },
  name: {
    fontSize: 14,
    fontWeight: "bold"
  }
});
