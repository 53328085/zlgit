 
import React, { useState, useRef } from 'react';
import {Typography} from 'antd'
import {CaretRightOutlined} from '@ant-design/icons'
import styled from 'styled-components';
 import {renderAsync} from 'docx-preview'
 
 //import 'jszip'
const App = ({num=2}) => {
    const [file, setFile] = useState(null);  
  const ref=useRef()
  const handleFileChange = (e) => {  
    const file = e.target.files[0];  
    if (file) {  
      renderAsync(file, ref.current).then(res => {
        console.log(res)
      })
    }  
  };
   
   return(
    <div style={{margin: "30px"}}>
        <input type="file" accept=".docx" onChange={handleFileChange} />
       <div id="doc" style={{width: "800px", height: '880px'}} ref={ref}></div>

       
    </div>
   )
};
export default App;