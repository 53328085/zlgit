import React, {useCallback, useEffect, useMemo, useState, memo, useContext, createContext, useRef} from 'react'
import {Form, Input, Button} from 'antd'
import { drawEcharts } from "@com/useEcharts";
 
export default function Index() {
   const ref = useRef();
   useEffect(() => {
    drawEcharts(ref.current, {
      type: 4,
      
    })
   })
   return (
     <div style={{display: 'flex', flex: 1}}>
         <div style={{width: "400px", height: "400px"}} ref={ref}></div>
     </div>
   )
}