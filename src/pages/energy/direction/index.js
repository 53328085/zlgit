import React, { useState, useRef, useEffect, } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Space, DatePicker, Select} from "antd";
 
import Pagecount from '@com/pagecontent'
 
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";
 
import Titlelayout from "@com/titlelayout";
 
import {useSelector} from 'react-redux'
import {selectProjectId, selectshifts} from '@redux/systemconfig.js'
import moment from 'moment';
import Sankey from "./Sankey";
import Topology from "./Topology";
 
 
 
 
 
 
 
 
 
export default function Index() {   
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  const {Item} = Form
  
  
  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3
   
  const [op, setOp] = useState(1)  
  const picker= ['', 'date', 'month', 'year'][timetype];
  
  
  let type = ['', '日', '月', '年'][timetype]
 
 
 
  const [value, setvalue] = useState('Sankey')
  
  const tabs = [
   /*  {label: '项目基础设置', key: 'set'}, */
    {label: '能源流向', key: 'Sankey'},
    {label: '能源拓扑图', key: 'Topology'},
    
  ]
 
  const getData = async () => {
   
  }
 
  useEffect(() => {
   
    getData()
  }, [value])
 
 
 
 
 
 
  const timechange = (e) => {
     setTimetype(e);
     getData()
  }
  const opchange = (e) => {   
     console.log(typeof e.target.value) 
     setOp(e.target.value)
   
     getData()
  }
  const CustView = () => {
   const viewstyle = {
      display: 'flex',
       justifyContent: "space-between",
       flex: 1,
       'marginLeft': '32px',
      'paddingLeft': '32px',
      'borderLeft': '1px dotted #d7d7d7',
    }
    return (
      <div style={viewstyle}>
       <Item  label="综合能耗"   initialValue={1} name="view">
        <Select
        onChange={opchange}   
        value={op}    
        options={[
          {
            label: '综合能耗',
            value: 1,
          },
          {
            label: '电',
            value: 2,
          },
          {
            label: '水',
            value: 3,
          }
        ]}
       
         />
        </Item>
      <Space size={16}>
        <Item label="日期选择" name="type" initialValue={1}>
           <Select style={{width: '80px'}}   options={[
            {value: 1, label: '日'},
            {value: 2, label: '月'},
            {value: 3, label: '年'},
           ]}
           onChange={timechange}
           ></Select>
        </Item>
 
        <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
          <DatePicker placeholder="请选择日期" picker={picker} onChange={getData} style={{width: '160px'}} />
        </Item>
      </Space>
      </div>
    )
  }
 
  const propsData = {
    form,
    custview: <CustView />,
    tabs,
    handler: getData,
    value,
    setvalue,
  }
  const ProjectCom = {
    Sankey,
    Topology,
   }
   let Com = ProjectCom[value]
    return (
      <CustContext.Provider value={propsData}>
      <Pagecount showserach={true} pd="32px">   
          
       { <Com   projectId={projectId} />}
        
      </Pagecount>
      </CustContext.Provider>
    )
}