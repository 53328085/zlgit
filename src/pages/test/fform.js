import React, {useCallback, useEffect, forwardRef, useImperativeHandle, useMemo, useState, memo, useContext, createContext, useRef, useReducer, useId} from 'react'
import {Form, Input, Button, Space, Typography, Image} from 'antd'
import {useLocation} from 'react-router-dom'
import { drawEcharts } from "@com/useEcharts";
import {nanoid} from '@reduxjs/toolkit'

import imgurl from '@imgs/index'
 import useOnline from './useOnline';
 const {Link, Text, Paragraph} = Typography


 
 
 
export default function Index() {
   const [count, setCount] = useState(0)
    const [increment, setIncrement] = useState(1)  
    const loction = useLocation();
    const online = useOnline();
    console.log(online)
    
    function onTick() {
       setCount(count+increment)
    }

   return (
    
     <div style={{display: 'flex', flex: 1, padding: "20px", alignItems: 'flex-start',}}>
         <div>
          <Paragraph>{online.online.toString()}</Paragraph>
           <Text>每秒递增</Text><Button onClick={() => setIncrement(i => i+1)}>add</Button>{increment}
           <Text>每秒递减</Text><Button onClick={() => setIncrement(i => i-1)}>dec</Button>
         </div>
         
     </div>
     
   )
}