
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
  const printref = useRef()
  const handlePrint = useReactToPrint({
    content: () => printref.current,
    pageStyle,
    documentTitle: '打印测试',
    bodyClass: 'printContent'
  })
  return (

      <div style={{flex: 1}}>
         <div>
          <Button onClick={handlePrint}>打印</Button>
         </div>
         <div ref={printref}>
              <h2 style={{lineHeight: 2}}>打印的内容</h2>
         </div>
      </div>
  )  
}
