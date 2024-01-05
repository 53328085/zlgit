import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import styled from 'styled-components'
import printContext from './context' 
 import './index.less'
 import Leftlayout from './left'
 import Rightlayout from './right'
 
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-columns: 384px 678px;
       column-gap: 32px; 
       flex: 1;
       color:#515151;
       }
`

 export default function Index(props) {
  let {reportName, params} = props; 
  const printRef =useRef()
 
  return (
    <printContext.Provider value={props}>
    <Mainbox>
          <Leftlayout  printRef={printRef.current} title={reportName} />
          <Rightlayout reportName={reportName} params={params} ref={r => printRef.current = r}>{props.children}</Rightlayout>
    </Mainbox>
    </printContext.Provider>
  )  
}

 