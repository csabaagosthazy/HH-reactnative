import React, { Component } from "react";
import Header from "../components/Header";
import { db } from "../config/fireBaseConfig";
import { StyleSheet, View, Modal, Text, TouchableOpacity, FlatList, Alert } from "react-native";

export default class ProductDetails extends Component {
  handleClose = () => {
    const { productFormOpen, handleProductDetailsVisible } = this.props;
    handleProductDetailsVisible(!productFormOpen, "");
  };

  handleConfirm = () => {
    Alert.alert(
      "Confirm",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.handleDelete(this.props.product) }
      ],
      { cancelable: false }
    );
  };

  handleDelete = product => {
    let itemToDelete = "";
    product.map(attr => {
      if (attr["key"] === "id") itemToDelete = attr["value"];
    });

    console.log(itemToDelete);

    let updates = {};
    updates["/products/" + itemToDelete] = null;

    this.handleClose();
    return db.ref().update(updates);
  };

  render() {
    const { productFormOpen, product } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={productFormOpen}
        onRequestClose={this.handleClose}
      >
        <View style={styles.container}>
          <View>
            <Header title={"Details"} />
            <FlatList
              data={product}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.title}>{`${item.key}:`}</Text>
                  <Text>{`${item.value}`}</Text>
                </View>
              )}
              keyExtractor={item => item.key}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={this.handleConfirm}>
                <Text>Delete product</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={this.handleClose}>
                <Text>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#43A047",
    width: 180,
    marginTop: 12
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center"
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#ff8c00",
    borderRadius: 2,
    padding: 12,
    width: "50%",
    height: 40,
    margin: 12
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 2,
    padding: 12,
    width: "50%",
    height: 40,
    margin: 12
  }
});
