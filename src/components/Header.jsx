import React from "react";

import { Header, Left, Body, Right, Title } from "native-base";
const header = props => {
  return (
    <Header style={{ marginBottom: 30 }}>
      <Left />
      <Body>
        <Title>{props.title}</Title>
      </Body>
      <Right />
    </Header>
  );
};

export default header;
