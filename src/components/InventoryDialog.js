import React, { Component } from "react";
import NumericInput from "react-native-numeric-input";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";
import { StyleSheet, View, Text, TextInput } from "react-native";

export default class InventoryDialog extends Component {
  handleSave = () => {
    this.props.save();
    this.handleClose();
  };
  handleClose = () => {
    const { visible, handleVisible } = this.props;
    handleVisible(!visible, -1);
  };

  render() {
    const { visible, item, amount, setAmount } = this.props;
    return (
      <Dialog
        width={0.9}
        rounded
        actionsBordered
        visible={visible}
        dialogTitle={<DialogTitle title="Change amount" />}
        footer={
          <DialogFooter>
            <DialogButton bordered text="Cancel" onPress={() => this.handleClose()} />
            <DialogButton bordered text="Save" onPress={() => this.handleSave()} />
          </DialogFooter>
        }
      >
        <DialogContent>
          <Text style={styles.title}>Product name: </Text>
          <Text>{item === undefined ? "" : item.name}</Text>
          <Text style={styles.title}>
            {item === undefined ? "" : `Amount in inventory: ${item.amount}`}{" "}
          </Text>
          <View style={styles.numInput}>
            <NumericInput
              rounded
              totalWidth={100}
              totalHeight={50}
              rightButtonBackgroundColor={"green"}
              leftButtonBackgroundColor={"red"}
              initValue={item === undefined ? 0 : amount}
              value={item === undefined ? 0 : amount}
              onChange={value => setAmount(value)}
              minValue={0}
              maxValue={9999}
              step={1}
            />
          </View>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10
  },
  numInput: {
    alignContent: "center",
    alignItems: "center",
    marginTop: 10
  }
});
