import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";

import { db } from "../config/fireBaseConfig";
import { getProductDataSet } from "../utils/databaseUtils";
import ProductDetails from "../components/ProductDetails";
import InventoryDialog from "../components/InventoryDialog";
import CreateOrderForm from "../components/CreateOrderForm";

export default class InventoryScreen extends Component {
  static navigationOptions = {
    title: "Inventory"
  };
  state = {
    data: [],
    loading: true,
    tableHead: ["name", "producer", "amount", "", ""],
    tableData: [],
    productFormOpen: false,
    product: "",
    editFormOpen: false,
    productToEdit: "",
    productAmount: 0,
    createOrderVisible: false,
    orderToCreate: [],
    updated: false
  };

  async componentDidMount() {
    await getProductDataSet().then(res => {
      this.setState({data: res.data, loading: res.isLoading});
      this.createTableData(res.data);
    })
  };

  async componentDidUpdate() {
    const {data, updated} = this.state;
    await getProductDataSet().then(res => {
      if(res.data.length !== data.length){
        console.log("if statement: ",res.data, data);
        this.setState({data: res.data, loading: res.isLoading});
        this.createTableData(res.data);
      }
      if(updated){
        this.setState({data: res.data, loading: res.isLoading, updated: false});
        this.createTableData(res.data);
      }

    });

  }
  updateData = () => {
    const { productToEdit: item, productAmount } = this.state;
    let itemToUpdate = {};
    itemToUpdate["/products/" + item.id] = {
      name: item.name,
      color: item.color,
      producer: item.producer,
      price: item.price,
      amount: productAmount
    };

    db.ref().update(itemToUpdate);
    this.setState({updated: true})
  };

  saveData = (date, items) => {
    console.log("save order: ", date, items);

    let newKey = db
      .ref()
      .child("orders")
      .push().key;
    // get an aary, so it needs to be mapped
    let updates = {};
    updates[`/orders/${newKey}`] = {
      date,
      items
    };

    db.ref().update(updates);
  };
  //name, producer, amount
  createTableData = input => {
    console.log("create table data");
    let tableData = [];
    input.map(item => {
      let row = [];
      for (let [key, value] of Object.entries(item)) {
        if (this.state.tableHead.includes(key)) row.push(value);
      }

      row.push("", "");
      tableData.push(row);
    });
    console.log("Tabledata", tableData);

    this.setState({ tableData });
  };

  selectItem = index => {
    let item = this.state.data[index];

    this.handleProductDetailsVisible(true, item);
  };
  handleProductDetailsVisible = (visible, item) => {
    let data = [];

    for (let [key, value] of Object.entries(item)) {
      let obj = { key, value };

      data = [...data, obj];
    }
    this.setState({ productFormOpen: visible, product: data });
  };

  handleChangeAmount = (visible, index) => {
    console.log("index: ", index);
    let amount, item;
    if (index > -1) {
      console.log("if");
      item = this.state.data[index];
      amount = Number(item.amount);
    }

    this.setState({ editFormOpen: visible, productToEdit: item, productAmount: amount });

    console.log(this.state);
  };

  setProductAmount = value => {
    console.log(value);
    let amount = 0;
    if (value === "" || value <= -1 || value > 9999 || value === undefined) amount = 0;
    else amount = value;
    this.setState({ productAmount: amount });
  };

  handleCreateOrderVisible = visible => {
    this.setState({ createOrderVisible: visible });
  };

  render() {
    if (this.state.loading) return <ActivityIndicator animating size="large" />;
    const { tableHead, tableData, createOrderVisible, data } = this.state;
    const editElement = (data, index) => (
      <TouchableOpacity onPress={() => this.handleChangeAmount(true, index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Edit</Text>
        </View>
      </TouchableOpacity>
    );
    const detailsElement = (data, index) => (
      <TouchableOpacity onPress={() => this.selectItem(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Info</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={styles.container}>
        <CreateOrderForm
          open={createOrderVisible}
          data={data}
          handleVisible={this.handleCreateOrderVisible}
          saveData={this.saveData}
        />
        <ProductDetails
          productFormOpen={this.state.productFormOpen}
          product={this.state.product}
          handleProductDetailsVisible={this.handleProductDetailsVisible}
        />
        <InventoryDialog
          visible={this.state.editFormOpen}
          item={this.state.productToEdit}
          amount={this.state.productAmount}
          handleVisible={this.handleChangeAmount}
          setAmount={this.setProductAmount}
          save={this.updateData}
        />

        <TouchableOpacity style={styles.button} onPress={() => this.handleCreateOrderVisible(true)}>
          <Text>Create order</Text>
        </TouchableOpacity>
        <Table borderStyle={{ borderColor: "black", borderWidth: 1 }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.text}
            widthArr={[80, 80, 80, 50, 50]}
          />
          {tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex === 3
                      ? editElement(cellData, index)
                      : cellIndex === 4
                      ? detailsElement(cellData, index)
                      : cellData
                  }
                  textStyle={styles.text}
                  width={cellIndex === 3 ? 50 : cellIndex === 4 ? 50 : 80}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    backgroundColor: "#fff",
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
  head: { height: 40, backgroundColor: "#00bfff" },
  text: { margin: 6, alignSelf: "center" },
  row: { flexDirection: "row", backgroundColor: "#90ee90", width: "auto" },
  btn: { width: 40, height: 18, backgroundColor: "#ffa500", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" }
});
