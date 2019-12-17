import React from "react";
import { TextInput, View, Text } from "react-native";

export default ImputField = props => {
  return (
    <View>
      <TextInput
        style={{
          height: 40,
          borderColor: props.error ? "red" : "gray",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10
        }}
        placeholder={props.placeholder}
        onChangeText={input => props.handleChange(props.field, input)}
        value={props.value}
      />
      {props.error ? <Text style={{ color: "red" }}>{props.errorMessage}</Text> : null}
    </View>
  );
};
