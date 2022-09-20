import { Button, Modal } from 'antd';
 import styled from 'styled-components';
import React, { useState, useCallback } from 'react';
const Wrapper =styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 100px;
  gap: 10px;
  &>div {
    padding: 16px;
    background-color:#dedede;
    border: 1px solid #ff7312;
  }
  &> div:nth-child(2) {
   grid-column: 3;
   grid-row: 2 / 4;
 }
 &> div:nth-child(5) {
   grid-column: 1 / 3;
   grid-row: 1 / 3;
}
`
 
const set  = new Set()
export default () => {
  
  return (
      <Wrapper>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div>7</div>
          <div>8</div>
          <div>9</div>
          <div>10</div>
          <div>11</div>
          <div>12</div>
      </Wrapper>   
  )
}



