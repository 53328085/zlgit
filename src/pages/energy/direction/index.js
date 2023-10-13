import React, { useState, useRef, useEffect,useCallback } from "react";
 
import { Form, Space, DatePicker, Select} from "antd";
import moment from 'moment';
 
import Pagecount from '@com/pagecontent'
 
import CustContext from "@com/content.js";
 
import {EnergyFlowRuntime} from "@api/api"
import {useSelector} from 'react-redux'
import {selectProjectId,  selectOneLevelDefaultId} from '@redux/systemconfig.js'
import {getTime} from '@com/usehandler'
import Sankey from "./Sankey";
import Topology from "./Topology";

const {queryElectric, queryWater, queryGas} = EnergyFlowRuntime
 

 
 

 
 
 
 
export default function Index() {   
  const projectId = useSelector(selectProjectId);
  const areaId = useSelector(selectOneLevelDefaultId)
 // let [id] = useState(areaId)
  console.log(areaId)
  const [form] = Form.useForm();
  const {Item} = Form
  const [data, setData] = useState({link: [], name: []}) 
  
  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3
   
  const [op, setOp] = useState(0)  
  const picker= ['', 'date', 'month', 'year'][timetype];

  const [value, setvalue] = useState('Sankey')
  
  const tabs = [
   /*  {label: '项目基础设置', key: 'set'}, */
    {label: '能源流向', key: 'Sankey'},
    {label: '能源拓扑图', key: 'Topology'},
    
  ]

  const getData = async () => {
    console.log(areaId)
     try {
      const {type, date, area} = form.getFieldsValue()
      console.log(area)
      let hander = [queryElectric, queryWater][op]
      let time = getTime(date, type)
      let params = {
        type,
        date: time,
        projectId
      }
      let {success, data} = await hander(params, [area])
      if(success && data.constructor==Object) {
         setData({...data})

      }else {
        setData({link: [], name: []})
      }
     } catch (error) {
       console.log(error)
     }
     
     
  }
 
  useEffect(() => {
    getData()
  }, [value, op])


 
 
 

  const timechange = (e) => {
     setTimetype(e);
     getData()
  }
  const opchange = (e) => {  
     console.dir(e)
     setOp(e)     
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
       <Item  label="能源类型"   initialValue={0} name="energy">
        <Select
        style={{width: '112px'}}
        onChange={opchange}   
        value={op}    
        options={[
          {
            label: '电',
            value: 0,
          },
          {
            label: '水',
            value: 1,
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
      
        {
          value =="Sankey" ? <Sankey data={data} key="sankey"  /> : <Topology key="topology" />
        }
      </Pagecount>
      </CustContext.Provider>
    )
}
