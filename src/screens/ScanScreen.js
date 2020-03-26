import React, { Component } from "react";
import { db } from "../config/fireBaseConfig";
import ProductDetails from "../components/ProductDetails";
import OrderDetails from "../components/OrderDetails";
import {
  Alert,
  Linking,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

export default class App extends Component {
  static navigationOptions = {
    title: "Scanner"
  };
  state = {
    orders: [],
    products: [],
    ordersLoading: true,
    productsLoading: true,
    productFormOpen: false,
    product: "",
    orderFormOpen: false,
    order: "",
    hasCameraPermission: null,
    lastScanned: null
  };

  componentDidMount() {
    this._getProductsData();
    this._getOrdersData();
    this._requestCameraPermission();
    console.log(this.state);
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _getProductsData = () => {
    console.log("Scan, get product data");
    try {
      let productsRef = db.ref("/products");
      productsRef.on("value", snapshot => {
        let products = [];
        snapshot.forEach(child => {
          products.push({
            name: child.val().name,
            color: child.val().color,
            producer: child.val().producer,
            price: Number(child.val().price),
            amount: Number(child.val().amount),
            id: child.key
          });
        });
        console.log("Scan", products);
        this.setState({ products, productsLoading: false });
        console.log("data length: ", products.length, this.state.productsLoading);
      });
    } catch (e) {
      console.log(e);
    }
  };

  _getOrdersData = () => {
    console.log("Scan, get orders data");
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
        console.log("Scan", orders);
        this.setState({ orders, ordersLoading: false });
        console.log("data length: ", orders.length, this.state.ordersLoading);
      });
    } catch (e) {
      console.log(e);
    }
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScanned) {
      LayoutAnimation.spring();
      this.setState({ lastScanned: result.data });
    }
  };

  handleProductCheck = productId => {
    let found = false;
    let item = "";
    this.state.products.map(product => {
      if (product.id === productId) {
        found = true;
        item = product;
      }
    });
    if (!found) {
      alert("Product not found or not exist");
      return;
    } else {
      this.handleProductDetailsVisible(true, item);
    }
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

  handleOrderCheck = orderId => {
    let found = false;
    let item = "";

    this.state.orders.map(order => {
      if (order.id === orderId) {
        found = true;
        item = order;
      }
    });
    if (!found) {
      alert("Product not found or not exist");
      return;
    } else {
      this.handleOrderDetailsVisible(true, item);
    }
  };

  handleOrderDetailsVisible = (visible, item) => {
    this.setState({ orderFormOpen: visible, order: item });
  };

  render() {
    const { ordersLoading, productsLoading } = this.state;
    if (ordersLoading || productsLoading) return <ActivityIndicator animating size="large" />;
    return (
      <View style={styles.container}>
        <ProductDetails
          productFormOpen={this.state.productFormOpen}
          product={this.state.product}
          handleProductDetailsVisible={this.handleProductDetailsVisible}
        />
        <OrderDetails
          orderFormOpen={this.state.orderFormOpen}
          order={this.state.order}
          handleOrderDetailsVisible={this.handleOrderDetailsVisible}
        />
        {this.state.hasCameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : this.state.hasCameraPermission === false ? (
          <Text style={{ color: "#fff" }}>Camera permission is not granted</Text>
        ) : (
          <Camera
            onBarCodeScanned={this._handleBarCodeRead}
            style={{
              height: 400,
              width: 400
            }}
          />
        )}

        {this._maybeRenderUrl()}

        <StatusBar hidden />
      </View>
    );
  }

  _handlePress = () => {
    const { lastScanned } = this.state;
    Alert.alert(
      "Open this URL?",
      lastScanned,
      [
        {
          text: "Product",
          onPress: () => this.handleProductCheck(lastScanned)
        },
        {
          text: "Order",
          onPress: () => this.handleOrderCheck(lastScanned)
        },
        { text: "Cancel", onPress: () => {} }
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScanned: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScanned) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePress}>
          <Text numberOfLines={1} style={styles.urlText}>
            {this.state.lastScanned}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={this._handlePressCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000"
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    flexDirection: "row"
  },
  url: {
    flex: 1
  },
  urlText: {
    color: "#fff",
    fontSize: 20
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18
  }
});
