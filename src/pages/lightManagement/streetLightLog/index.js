import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form,   Input, Table, DatePicker } from "antd";
 
import Pagecount from "@com/pagecontent";
import CustContext from '@com/content.js'
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
 
import { cols,tabs } from "./data";
import { Auto,Manual } from "./component/index";

 
export default function Index() {
 
  const projectId = useSelector(selectProjectId);
   const [value, setvalue] = useState('0')
  let dataProps =useMemo( ()=>  ({
    value,
    setvalue,
    tabs,
    
  }), [value])
  console.log(value)
  const Com = {
    "0":Auto,
    "1":Manual
  }[value]
  return (
    <CustContext.Provider value={dataProps} >
    <Pagecount pd="0" bgcolor="none">
     <Com />
    </Pagecount>
    </CustContext.Provider>
  );
}
