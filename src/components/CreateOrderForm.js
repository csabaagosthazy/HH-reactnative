import React, { Component } from "react";
import ProductPicker from "../components/ProductPicker";
import Header from "../components/Header";
import { StyleSheet, View, Modal, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";

export default class CreateOrderForm extends Component {
  state = {
    data: [],
    selectOptions: ["Select..."],
    selectedItem: "",
    selectedAmount: 0,
    order: [],
    tableHead: ["name", "amount", ""],
    tableData: [],
    saveButtonDisabled: true
  };
  componentDidMount() {
    this.createData();
  }

  createData = () => {
    let data = [];
    let selectOptions = [{ name: "Select...", id: "0" }];
    //name, id
    this.props.data.map(item => {
      data = [...data, { name: item.name, id: item.id }];
      selectOptions = [...selectOptions, { name: item.name, id: item.id }];
    });

    this.setState({ data, selectOptions });
  };

  handleSelect = (value, index) => {
    this.setState({ selectedItem: value });
  };
  setAmount = value => {
    this.setState({ selectedAmount: value });
  };

  createTableData = order => {
    tableData = [];
    order.map(item => {
      tableData = [...tableData, [item.name, item.amount, ""]];
    });

    this.setState({ tableData });
  };

  handleAddToList = () => {
    const { selectedItem, selectedAmount, order, data, tableData, selectOptions } = this.state;

    if (selectedAmount <= 0) {
      Alert.alert("Amount must be more than 0!");
      return;
    }
    if (selectedItem === "0" || selectedItem === "") {
      Alert.alert("Select a product");
      return;
    }
    let itemName = "";
    let modifiedSelect = [];
    data.map(item => {
      if (item.id === selectedItem) {
        itemName = item.name;
        modifiedSelect = selectOptions.filter(selectItem => selectItem.id !== item.id);
      }
    });
    let newOrder = [...order];
    newOrder.push({ id: selectedItem, name: itemName, amount: selectedAmount });
    this.setState({
      order: newOrder,
      selectOptions: modifiedSelect,
      saveButtonDisabled: false
    });
    this.createTableData(newOrder);
  };

  handleDeleteItem = index => {
    const { order, data, selectOptions, tableData } = this.state;
    let deletedId = order[index].id;
    let newOrder = order.filter(item => item.id !== deletedId);

    let newOption = data.filter(item => item.id === deletedId);

    let newSelectOptions = [...selectOptions, { name: newOption[0].name, id: newOption[0].id }];

    this.setState({ order: newOrder, selectOptions: newSelectOptions });
    this.createTableData(newOrder);

    if (newOrder.length === 0) this.setState({ saveButtonDisabled: true });
  };

  handleSubmit = () => {
    let orderDate = "";

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    today = `${dd}/${mm}/${yyyy}`;

    orderDate = today;

    //this calls props.saveData and gives data and the order. There the method has to be finalized

    this.props.saveData(orderDate, this.state.order);
    this.handleClose();
  };

  handleClose = () => {
    const { open, handleVisible } = this.props;

    this.setState({
      data: [],
      selectOptions: ["Select..."],
      selectedItem: "",
      selectedAmount: 0,
      order: [],
      tableHead: ["name", "amount", ""],
      tableData: [],
      saveButtonDisabled: true
    });
    this.createData();
    handleVisible(!open);
  };

  render() {
    const { open } = this.props;
    const {
      saveButtonDisabled,
      selectedItem,
      selectOptions,
      selectedAmount,
      data,
      tableHead,
      tableData
    } = this.state;
    const deleteElement = (data, index) => (
      <TouchableOpacity onPress={() => this.handleDeleteItem(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Delete</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={open}
        onRequestClose={this.handleClose}
      >
        <View style={styles.container}>
          <View>
            <Header title={"New order"} />

            <ProductPicker
              selectedItem={selectedItem}
              onSelectChange={this.handleSelect}
              selectOptions={selectOptions}
              selectedAmount={selectedAmount}
              setAmount={this.setAmount}
            />

            <TouchableOpacity style={styles.addButton} onPress={this.handleAddToList}>
              <Text>Add to order</Text>
            </TouchableOpacity>
            <View style={styles.tableContainer}>
              <Table borderStyle={{ borderColor: "black", borderWidth: 1 }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                {tableData.map((rowData, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={cellIndex === 2 ? deleteElement(cellData, index) : cellData}
                        textStyle={styles.text}
                        borderStyle={{ borderColor: "black", borderWidth: 1 }}
                      />
                    ))}
                  </TableWrapper>
                ))}
              </ScrollView>
            </View>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#43A047",
    padding: 12,
    width: 280,
    marginTop: 12
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#43A047",
    alignSelf: "center",
    padding: 12,
    width: 150,
    marginTop: 12,
    marginBottom: 30
  },
  dataWrapper: { marginTop: -1 },
  tableContainer: { marginBottom: 20, height: "35%" },
  head: { height: 40, backgroundColor: "#00bfff" },
  text: { margin: 6, alignSelf: "center" },
  row: { flexDirection: "row", backgroundColor: "#90ee90", width: "auto" },
  btn: { width: 40, height: 18, backgroundColor: "#ffa500", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" },
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
