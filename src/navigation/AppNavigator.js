import React from "react";
import { Image } from "react-native";

import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import ScanScreen from "../screens/ScanScreen";
import ProductsScreen from "../screens/ProductsScreen";
import InventoryScreen from "../screens/InventoryScreen";
import ShipmentsScreen from "../screens/ShipmentsScreen";

const HomeTab = createStackNavigator(
  {
    Home: HomeScreen,
    Products: ProductsScreen,
    Inventory: InventoryScreen,
    Shipments: ShipmentsScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#0091EA"
      },
      headerTintColor: "#fff",
      title: "Home Tab"
    }
  }
);

const ScanTab = createStackNavigator(
  {
    Scan: ScanScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#0091EA"
      },
      headerTintColor: "#FFFFFF",
      title: "Settings Tab"
    }
  }
);

const MainApp = createBottomTabNavigator(
  {
    Home: HomeTab,
    Scan: ScanTab
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "Home") {
          return (
            <Image
              source={require("../assets/images/home.png")}
              style={{ width: 20, height: 20 }}
            />
          );
        } else {
          return (
            <Image
              source={require("../assets/images/scan.png")}
              style={{ width: 20, height: 20 }}
            />
          );
        }
      }
    }),
    tabBarOptions: {
      activeTintColor: "#FF6F00",
      inactiveTintColor: "#263238"
    }
  }
);

export default createAppContainer(MainApp);
