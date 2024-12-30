import { Radio, Tabs } from 'antd';
import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
const Ctabs = styled(Tabs)``
const Test=({cout})=>{
  const [num, setNum] = useState(1)
  const ref=useRef()
  ref.current = num;
  
  useEffect(()=>{
    console.log("没有依赖")
    return ()=> {
      console.log("退出时的num值", num)
      console.log("退出时的cout值", cout)
      console.log("ref", ref.current)
    }
  },[])
  return (
    <div>
    <button onClick={() => setNum(num+1)}>{num}</button> 
    </div>
  );
}
const App = () => {
  const [show, setShow] = useState(true)
  
  const [cout, setCout] = useState(10)
  return (
    <div>
      <div>
        <button onClick={()=> setShow(!show)}>show</button>
      </div>
      <div>
        <button onClick={()=> setCout(cout+1)}>{cout}</button>
      </div>
     {show && <Test cout={cout}></Test>}
    </div>
  );
};
export default App;