import React, { Component } from "react";
import Header from "../components/Header";
import { db } from "../config/fireBaseConfig";
import { StyleSheet, View, Modal, Text, TouchableOpacity, FlatList, Alert } from "react-native";

export default class OrderDetails extends Component {
  handleClose = () => {
    const { orderFormOpen, handleOrderDetailsVisible } = this.props;
    handleOrderDetailsVisible(!orderFormOpen, "");
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
        { text: "OK", onPress: () => this.handleDelete(this.props.order) }
      ],
      { cancelable: false }
    );
  };

  handleDelete = order => {
    let itemToDelete = order.id;

    console.log(itemToDelete);

    let updates = {};
    updates["/orders/" + itemToDelete] = null;

    this.handleClose();
    return db.ref().update(updates);
  };

  render() {
    const { orderFormOpen, order } = this.props;
    //{date: "17/03/2020", items: Array(3), id: "-M2dH27XMtYIU1S3NhEV"}
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={orderFormOpen}
        onRequestClose={this.handleClose}
      >
        <View style={styles.container}>
          <View>
            <Header title={"Details"} />
            <View style={styles.item}>
              <Text style={styles.title}>Order date:</Text>
              <Text>{`${order.date}`}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>Id:</Text>
              <Text>{`${order.id}`}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>Items:</Text>

              <FlatList
                data={order.items}
                renderItem={({ item }) => (
                  <Text>{`Name: ${item.name} , amount: ${item.amount}`}</Text>
                )}
                keyExtractor={item => item.name}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={this.handleConfirm}>
                <Text>Delete order</Text>
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
