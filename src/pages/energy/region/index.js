import React, { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Button, Progress, Image, Space, DatePicker, Select, Tabs} from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";
import {EnergyComprehensive} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {useSelector} from 'react-redux'
import {selectProjectId, selectshifts} from '@redux/systemconfig.js'
import moment from 'moment';
import imgurl from "./icon";

 

const Laybox = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: 1240px 424px;
  column-gap: 16px;
  .right {
    display: grid;
    grid-template-rows: 512px 272px;
    row-gap: 16px;
  }
 
 
 
`;
const CustTitle = styled.div`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: ${(props) => (props.jc ? "flex-start" : "space-between")};

`;

const Divbox = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 16px;
  margin: 8px 0 8px 0;
  align-items: center;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;
const Engbox = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  column-gap: 32px;
  height: 100%;
  align-items: ${props => props.type == 2 ? 'center' : 'start'};
  padding-top:${props => props.type == 2 ? '0px' : '35px'}; ;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;
const Tabsbox = styled(Tabs)`
 && {
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 41px;
        width: 114px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;  
        transition: none;
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
            transition: all 0.3s;
        }
        .ant-tabs-tab-btn{
            transition: none;
        }
        .ant-tabs-tab-btn:active {
            color:#fff
        }
    }
    .ant-tabs-tab + .ant-tabs-tab {
      margin: 0 0 0 16px;
    }
    .ant-tabs-tab.ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: none;
        }
    }
   }  
   .ant-tabs-content-holder {
    display: none;
   }
  }
}
`
const UDbox = styled.div`
  display: grid;
  grid-template-rows: 64px 1fr;
  row-gap: 8px;
  margin-top: 8px;
  justify-items: center;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    justify-self: stretch;
    align-content: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;


  

const Radiogroup = styled(Radio.Group)`
  && {
    .ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
      width: 96px;
      text-align: center;
      &:first-child {
        border-radius: 16px 0 0 16px;
      }
     &:last-child {
      border-radius: 0 16px 16px 0;
     }
    }
  }


`
 
export default function Index() {   
  const projectId = useSelector(selectProjectId);
 
  const [form] = Form.useForm();
  const {Item} = Form
  const [value, setvalue] = useState("1");
  const [qverview, setOverview] = useState({})
  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3
  const [tabvalue, setTabvalue] = useState(1)
  const [op, setOp] = useState(1) // 能耗 1， 费用 2
  const picker= ['', 'date', 'month', 'year'][timetype];
  const {detail, total='', proportion, coalStandard, consume={}, analysisDes='', ...energyitem} = qverview;
  
  let type = ['', '日', '月', '年'][timetype]


  const getData = async () => {
    const {area, date, type, shiftNo, view=1} = form.getFieldsValue() || {}
    let time;
    if (type == 1)  {
      time = date.format('YYYY-MM-DD')
    } else if(type == 2) {
      time = date.format('YYYY-MM') + '-01'

    } else if(type == 3) {
       time = date.format('YYYY')+ '-01-01'
    }
    const querys = {
      type,
      shiftNo,
      projectId,
      date: time
   }
    const param = [area]
    let energy = ['', 'QueryOverview', 'QueryElectric', 'QueryWaterCold', 'QueryWaterHot', 'QuerySteam', 'QueryGas', 'QueryCoal', 'QueryOil']
    let cost = ['', 'QueryOverviewCost', 'QueryElectricCost', 'QueryWaterColdCost', 'QueryWaterHotCost', 'QuerySteamCost', 'QueryGasCost', 'QueryCoalCost', 'QueryOilCost']
    let handler = ['', energy, cost][view][tabvalue]
    try {
     let {success, data} =  await EnergyComprehensive[handler](querys, param)
   
     if(success) {
      setOverview({...qverview, ...data})
     }else {
       return {}
     }
    } catch (e) {
      console.log(e)
    }
  }
  const ontabChange = (e) => {
    console.log(e)
    setTabvalue(e)
  }
  useEffect(() => {
   
    //getData()
  }, [tabvalue])
 const [mode, setMode] = useState(1)
 const chart = useRef()
 const [tdataset, setTdataset] = useState({  // 图表数据
 // dimensions: ["日期", "用电量(kwh)"],
  source: [
    ["日期", 1,2,3,4,5,6,7,8,9,10]
   // ["区域名称", "塔楼区", "交易区", "干杂区", "水产市场", "工业设备机房", "库房", "叉车充电间"],
    ["塔楼区", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["交易区", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["干杂区", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["水产市场", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["工业设备机房", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["库房", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["叉车充电间", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
  ],
})
const eparams = {
  smooth: true, 
   lineStyle: {
    width: 0
   },
  showSymbol: false,
  seriesLayoutBy: 'row'
}
useEffect(() => {
  drawEcharts(
     chart.current, {
      dataset: tdataset,
      series: [{ type: "type", stack: "hao",    ...eparams }]
    }
  )
}, [tdataset])

 const onChange = (e) => {
  setMode(e.target.value)
 }



 useEffect(() => {

 }, []) 
 const Title =  (
      <CustTitle className="t">
        区域能耗趋势
        <Radiogroup options={[
          {
          label: "图表模式",
          value: 1
          },
          {
            label: "列表模式",
            value: 2
            }
        ]}
        optionType="button"
        buttonStyle="solid"
        onChange={onChange}
        value={mode}
        ></Radiogroup>
      </CustTitle>
    );
 
 


  const timechange = (e) => {
     setTimetype(e);
     getData()
  }
  const opchange = (e) => {   
     console.log(typeof e.target.value) 
     setOp(e.target.value)
    // form.resetFields()
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
       <Item  label="能源类型"   initialValue={1} name="view">
        <Select
        onChange={opchange}   
        value={op}    
        style={{width: "112px"}}
        options={[
          {
            label: '电',
            value: 1,
          },
          {
            label: '水',
            value: 2,
          }]}
         />
        </Item>
      <Space size={16}>
        <Item  name="type" initialValue={1}>
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


  return (
    <CustContext.Provider
      value={{
        form,
        custview: <CustView />,
       // tabs,
        handler: getData,
        value,
        setvalue,
      }}
    >

      <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px', flex: 1}}>
      <UserSearch></UserSearch>
      <Laybox  >
        <Titlelayout title={Title}>
           <div style={{paddingTop: "32px", height: "100%", display: "flex"}}>
             {
              mode == 1 && <div style={{flex: 1}} ref={chart}></div>
             }  

           </div>
        </Titlelayout>
        <div className="right">
           <Titlelayout title="今日能耗占比"></Titlelayout>
           <Titlelayout title="区域能耗排名"></Titlelayout>
        </div>
     
      </Laybox>
      </div>
    </CustContext.Provider>
  );
}
