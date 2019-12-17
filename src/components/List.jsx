import React from "react";
import { List, ListItem, Text, Button } from "native-base";

const list = props => {
  return (
    <List style={{ alignItems: "center" }}>
      <ListItem>
        <Button block success>
          <Text>Products</Text>
        </Button>
      </ListItem>
      <ListItem>
        <Button block success>
          <Text>Inventory</Text>
        </Button>
      </ListItem>
      <ListItem>
        <Button block success>
          <Text>Shipments</Text>
        </Button>
      </ListItem>
    </List>
  );
};

export default list;
