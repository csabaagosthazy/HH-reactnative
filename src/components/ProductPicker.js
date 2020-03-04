import React, { Component } from "react";
import { StyleSheet, View, Text, Picker, TextInput } from "react-native";
import NumericInput from "react-native-numeric-input";

export default class ProductPicker extends Component {
  render() {
    const { selectOptions, selectedItem, selectedAmount, onSelectChange, setAmount } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.picker}>
          <Picker
            selectedValue={selectedItem}
            onValueChange={(itemValue, itemIndex) => onSelectChange(itemValue, itemIndex)}
          >
            {selectOptions.map(option => {
              console.log("picker", option.name, option.id);
              return <Picker.Item label={option.name} value={option.id} key={option.id} />;
            })}
          </Picker>
        </View>
        <NumericInput
          label={"amount"}
          rounded
          totalWidth={100}
          totalHeight={50}
          rightButtonBackgroundColor={"green"}
          leftButtonBackgroundColor={"red"}
          initValue={0}
          value={selectedAmount}
          onChange={value => setAmount(value)}
          minValue={0}
          maxValue={9999}
          step={1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between"
  },
  picker: {
    width: "50%",
    color: "black",
    borderWidth: 2,
    borderColor: "#c2c2c1",
    borderRadius: 5
  }
});
