import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form,  DatePicker,   Descriptions, Divider,   Radio, message } from 'antd'

 import Leftlayout from './left'
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
      padding-top: 16px;
       display: grid;
       grid-template-columns: 384px 678px;
       column-gap: 32px; 
       flex: 1;
       color:#515151;
      
       
       }
`

 function Maincom({projectId}) {
  return (
    <Mainbox>
          <Leftlayout />
           
    </Mainbox>
    
  )
}

export default function Index(props) {
    return (
        <Maincom {...props}     />
    )
}