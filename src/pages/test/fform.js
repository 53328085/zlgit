import { Button, Modal } from "antd";
import styled from "styled-components";
import React, { useState, useCallback } from "react";
const Wrapper = styled.div`
height: 100vh;
.wrapper {
  border: 2px solid #f76707;
    border-radius: 5px;
    background-color: #fff4e6;
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  height: 500px;
  width: 500px;
  gap: 10px;
  grid-template-areas:
    "a a b"
    "a a b"
    "c d d";
   >div {
    border: 2px solid #ffa94d;
    border-radius: 5px;
    background-color: #ffd8a8;
    padding: 1em;
    color: #d9480f;
   } 
    .item1 {
  grid-area: a;
}
.item2 {
  grid-area: b;
}
.item3 {
  grid-area: c;
}
.item4 {
  grid-area: d;
}
}
`


export default () => {
  return (
    <Wrapper>
      <div className="wrapper">
      <div className="item1">Item 1</div>
      <div className="item2">Item 2</div>
      <div className="item3">Item 3</div>
      <div className="item4">Item 4</div>
      
      </div>
    </Wrapper>
  );
};
