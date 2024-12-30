import { Radio, Tabs } from 'antd';
import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
const Ctabs = styled(Tabs)``
const App = () => {

  let a=14;
  console.log(a.toString(16))
const  getprimarycolors=()=>{
     let primarycolor = window.getComputedStyle(document.documentElement);
      let colors =[]
      for(let i=1; i<11; i++) {
        let key =`--ant-primary-${i}`
        let value = primarycolor.getPropertyValue(key);
        colors.push({lable: key, value})
      }
  }
  useEffect(()=>{
    getprimarycolors()
  })
  return (
    <div>
     
    </div>
  );
};
export default App;