import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";

import { db } from "../config/fireBaseConfig";

export default class ShipmentsScreen extends Component {
  static navigationOptions = {
    title: "Shipments"
  };

  state = {
    orders: [],
    products: [],
    ordersLoading: true,
    productsLoading: true,
    productCount: 0,
    tableHead: ["name", "producer", "amount", "", ""],
    tableData: [],
    cellWidth: []
  };

  componentDidMount() {
    this.getProductsData();
    this.getOrdersData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { ordersLoading, productsLoading, products, orders, tableHead, tableData } = this.state;
    const { ordersLoading: prevOrdersLoading, productsLoading: prevProductsLoading } = prevState;
    if (ordersLoading !== prevOrdersLoading || productsLoading !== prevProductsLoading) {
      this.createTableData(orders, products);
    }
  }

  getProductsData = () => {
    console.log("Shipment get product data");
    try {
      let productsRef = db.ref("/products");
      productsRef.on("value", snapshot => {
        let products = [];
        let count = 0;
        snapshot.forEach(child => {
          count++;
          products.push({
            name: child.val().name,
            color: child.val().color,
            producer: child.val().producer,
            price: Number(child.val().price),
            amount: Number(child.val().amount),
            id: child.key
          });
        });
        this.setState({ products, productsLoading: false, productCount: count });
        /* if (products.length > 0 && this.state.productsLoading === false) this.createTableData(data); */
      });
    } catch (e) {
      console.log(e);
    }
  };

  getOrdersData = () => {
    console.log("Shipment get orders data");
    try {
      let productsRef = db.ref("/orders");
      productsRef.on("value", snapshot => {
        let orders = [];
        snapshot.forEach(child => {
          orders.push({
            date: child.val().date,
            items: child.val().items,
            id: child.key
          });
        });
        this.setState({ orders, ordersLoading: false });
        /* if (data.length > 0 && this.state.productsLoading === false) this.createTableData(data); */
      });
    } catch (e) {
      console.log(e);
    }
  };

  createTableData = (orders, products) => {
    console.log("create table")
    let tableHead = ["Date"];
    let witdhArr = [100];
    let productNames = [];
    products.map(product => {
      for (let [key, value] of Object.entries(product)) {
        if (key === "name") {
          tableHead.push(value);
          productNames.push(value);
          witdhArr.push(50);
        }
      }
    });
    tableHead.push("");
    witdhArr.push(60);

    let tableData = [];

    orders.map(order => {
      let row = [];

      for (let [key, value] of Object.entries(order)) {
        if (key === "date") row.push(value);

        if (key === "items") {

          productNames.map(pName => {
            let amount = 0;
            value.map(item => {
              if(item.name === pName){
                amount = item.amount;
              }
            })
            row.push(amount);
          })
          
        }
      }
      row.push("");
      tableData.push(row);
    });
    this.setState({ tableHead, tableData, cellWidth: witdhArr });
  };

  handleConfirm = index => {
    Alert.alert(
      "Confirm",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.handleDelete(index) }
      ],
      { cancelable: false }
    );
  };
  handleDelete = index => {
    let itemToDelete = this.state.orders[index]["id"];

    let updates = {};
    updates["/orders/" + itemToDelete] = null;
    return db.ref().update(updates);
  };

  render() {
    const {
      tableHead,
      tableData,
      productCount,
      cellWidth,
      ordersLoading,
      productsLoading
    } = this.state;
    if (ordersLoading || productsLoading) return <ActivityIndicator animating size="large" />;

    if (tableData.length === 0) return <Text>There are no orders</Text>;
    const deleteElement = (data, index) => (
      <TouchableOpacity onPress={() => this.handleConfirm(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderColor: "black", borderWidth: 1 }}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
                widthArr={cellWidth}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              {tableData.map((rowData, index) => (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={
                        cellIndex === productCount + 1 ? deleteElement(cellData, index) : cellData
                      }
                      textStyle={styles.text}
                      borderStyle={{ borderColor: "black", borderWidth: 1 }}
                      width={
                        cellIndex === productCount + 1
                          ? cellWidth[productCount + 1]
                          : cellWidth[cellIndex]
                      }
                    />
                  ))}
                </TableWrapper>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
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
  dataWrapper: { marginTop: -1 },
  tableContainer: { marginBottom: 20 },
  head: { height: 40, backgroundColor: "#00bfff" },
  text: { margin: 6, alignSelf: "center" },
  row: { flexDirection: "row", backgroundColor: "#90ee90" },
  btn: { width: 50, height: 18, backgroundColor: "#ffa500", borderRadius: 2, alignSelf: "center" },
  btnText: { textAlign: "center", color: "#fff" }
});
