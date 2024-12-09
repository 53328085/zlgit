import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import {useSelector} from "react-redux"
import styled from 'styled-components'
import printContext from './context' 
 import './index.less'
 import Leftlayout from './left'
 import Rightlayout from './right'
 import {adaptation} from '@redux/systemconfig.js'
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-columns: ${props => props.laptop ? "352px 678px" : "384px 678px"};
       column-gap: ${props => props.laptop ? "16px" : "32px"}; 
       flex: 1;
       color:#515151;
       }
`

 export default function Index(props) {
  let {reportName, params} = props; 
  const printRef =useRef()
  const {laptop} = useSelector(adaptation)
  return (
    <printContext.Provider value={props}>
    <Mainbox laptop={laptop}>
          <Leftlayout  printRef={printRef.current} title={reportName} />
          <Rightlayout reportName={reportName} params={params} ref={r => printRef.current = r}>{props.children}</Rightlayout>
    </Mainbox>
    </printContext.Provider>
  )  
}

 