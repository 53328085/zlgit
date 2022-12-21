
import React, {useState, useCallback, useEffect, useRef} from 'react'
import styled from 'styled-components'
import ReactToPrint, {PrintContextConsumer, useReactToPrint} from 'react-to-print'
import {Button} from 'antd'
const pageStyle = `
  @page {
    margin: 1cm;
  }
 @page :left {
  margin: 0.5cm
 }
 @page :right {
  margin: 0.5cm
 }
  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;
export default function Fform() {

  const arr = [1, 2, 3, 4, 5, 6];
  const { 0: first, length, [length - 1]: last } = arr;
  console.log(first) // 1
  console.log(last) // 6
}
