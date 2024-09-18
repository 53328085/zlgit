import { Button, Modal, Space, Input } from 'antd';
import React, { createContext, useEffect, useRef, useState } from 'react';
import {useSearchParams, useLocation, useNavigate} from 'react-router-dom'
const ReachableContext = createContext(null);
 
const App = () => {
  const ref = useRef()
  const [htm, setHtm] =useState('')
  const preview =() => {
    let blob = new Blob([`随便写的文档`], {type: 'text/plain'});
     let file = new FileReader()
     file.readAsDataURL(blob)
     file.onload = function() {
      console.log(file.result)
       ref.current.href = file.result;
       ref.current.click()
     }
  }
  
 
 
  return (
    <div>
      <Button onClick={preview}>下载</Button>
     <a href='' download="text" ref={ref}>下载</a>
    </div>
  )
};
export default App;