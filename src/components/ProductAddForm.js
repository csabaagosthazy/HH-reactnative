import React, { Component } from "react";
import InputField from "../components/InputField";
import Header from "../components/Header";
import Joi from "react-native-joi";
import { StyleSheet, View, Modal, Alert, Text, TouchableOpacity } from "react-native";

export default class ProductAddForm extends Component {
  state = {
    data: { name: "", color: "", producer: "", price: "", amount: "" },
    saveButtonDisabled: true,
    errors: {},
    isErrorAtField: {}
  };

  joiSchema = {
    name: Joi.string().required(),
    color: Joi.string().required(),
    producer: Joi.string().required(),
    price: Joi.number()
      .min(0)
      .required(),
    amount: Joi.number()
      .min(0)
      .required()
  };

  componentDidUpdate(prevProps, prevState) {
    const { errors } = this.state;
    const { errors: prevErrors } = prevState;

    if (prevErrors !== errors) {
      this.validate();
    }
  }

  handleChange = (field, input) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(field, input);
    if (errorMessage) errors[field] = errorMessage;
    else delete errors[field];

    let data = { ...this.state.data };
    data[field] = input;
    this.setState({ data, errors });
  };

  doSubmit = () => {
    console.log("Submit");
    this.props.handleSave(this.state.data);
    this.handleClose();
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.joiSchema, options);
    if (!error) {
      this.setState({ saveButtonDisabled: false });
      return null;
    }

    const errors = {};

    for (let item of error.details) {
      errors[item.path] = item.message;
    }
    this.setState({ saveButtonDisabled: true });
    return errors;
  };

  validateProperty = (name, value) => {
    const obj = { [name]: value };
    const joiSchema = { [name]: this.joiSchema[name] };
    const { error } = Joi.validate(obj, joiSchema);
    if (error) {
      this.setState({ isErrorAtField: { [name]: true } });
      return error.details[0].message;
    } else {
      this.setState({ isErrorAtField: { [name]: false } });
      return null;
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };
  handleClose = () => {
    const { addFormOpen, handleAddFormVisible } = this.props;
    this.setState({
      data: { name: "", color: "", producer: "", price: "", amount: "" },
      saveButtonDisabled: false,
      errors: {},
      isErrorAtField: {}
    });
    handleAddFormVisible(!addFormOpen);
  };

  render() {
    const { addFormOpen } = this.props;
    const { name, color, producer, price, amount } = this.state.data;
    const { saveButtonDisabled, isErrorAtField, errors } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={addFormOpen}
        onRequestClose={this.handleClose}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View>
            <Header title={"New product"} />
            <InputField
              placeholder={"Name"}
              field={"name"}
              value={name}
              handleChange={this.handleChange}
              error={isErrorAtField["name"]}
              errorMessage={errors["name"]}
            />
            <InputField
              placeholder={"Color"}
              field={"color"}
              value={color}
              handleChange={this.handleChange}
              error={isErrorAtField["color"]}
              errorMessage={errors["color"]}
            />
            <InputField
              placeholder={"Producer"}
              field={"producer"}
              value={producer}
              handleChange={this.handleChange}
              error={isErrorAtField["producer"]}
              errorMessage={errors["producer"]}
            />
            <InputField
              placeholder={"Price"}
              field={"price"}
              value={price}
              handleChange={this.handleChange}
              error={isErrorAtField["price"]}
              errorMessage={errors["price"]}
            />
            <InputField
              placeholder={"Amount in inventory"}
              field={"amount"}
              value={amount}
              handleChange={this.handleChange}
              error={isErrorAtField["amount"]}
              errorMessage={errors["amount"]}
            />
            <TouchableOpacity
              style={saveButtonDisabled ? styles.disabledSaveButton : styles.saveButton}
              disabled={saveButtonDisabled}
              onPress={this.handleSubmit}
            >
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={this.handleClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  saveButton: {
    alignItems: "center",
    backgroundColor: "#43A047",
    padding: 12,
    width: 280,
    marginTop: 12
  },
  disabledSaveButton: {
    alignItems: "center",
    backgroundColor: "#a9a9a9",
    padding: 12,
    width: 280,
    marginTop: 12
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "#ff8c00",
    padding: 12,
    width: 280,
    marginTop: 12
  }
});
