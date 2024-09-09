 
import React, { useState, useRef, useEffect } from 'react';
import {Typography} from 'antd'
import {CaretRightOutlined} from '@ant-design/icons'
import styled from 'styled-components';
 import {renderAsync} from 'docx-preview'
 
 //import 'jszip'
const App = ({num=2}) => {
   const href = location.href;
   const search =new URLSearchParams(href)
   for(let [key, val] of search) {
    console.log(key, val)
   }
   return(
    <div style={{margin: "30px"}}>
       
   

       
    </div>
   )
};
export default App;