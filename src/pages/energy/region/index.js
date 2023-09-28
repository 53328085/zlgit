import React, { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Button, Progress, Image, Space, DatePicker, Select, Tabs, Typography} from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";
import { EnergyArea} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
 
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import moment from 'moment';
import imgurl from "./icon";
import UseTable from "@com/useTable"
 const {QueryEnergyAreaDay, QueryEnergyAreaMonth, QueryEnergyAreaYear} = EnergyArea
const {Text, Paragraph} = Typography
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
  justify-content: space-between;

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
const Sdiv = styled.div` 
  && {
    height: 100%;
    padding-top: 16px;
    display: grid;
    grid-template-rows: 1fr 1fr;
    row-gap: 16px;
    .down {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 16px;
    }
    .sort {
      background-color: #f4f8ff;
      padding: 8px 16px;
      display: grid;
      grid-template-columns: 40px 1fr;
      column-gap: 16px;
      align-items: center;
      .data {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }
    }
  }
`
 const headers = ["塔楼区", "交易区", "干杂区", "水产市场", "工业设备机房", "库房", "叉车充电间"]
const mokData = headers.map(n => (
  {
    name: n,
    e: 10000*Math.random().toFixed(2),
    mom:  10*Math.random().toFixed(2)+"%",
    yoy: 10*Math.random().toFixed(2)+"%",
  }
))
const piedata = [
  { value: 1048, name: '塔楼区' },
  { value: 735, name: '交易区' },
  { value: 580, name: '干杂区' },
  { value: 484, name: '水产市场' },
  { value: 300, name: '工业设备机房' },
  { value: 700, name: '库房' },
  { value: 130, name: '叉车充电间' },
]
const nf = new Intl.NumberFormat("en-US", {maximumFractionDigits: 2});
export default function Index() {   
  const projectId = useSelector(selectProjectId);
  const [tableData, setTableData] = useState(mokData)
  const [form] = Form.useForm();
  const {Item} = Form
 
  const [timetype, setTimetype] = useState(0) // 日、月、年 0,1,2
 
  
  const picker= ['date', 'month', 'year'][timetype];
   

  const columns = [
    {
      dataIndex: "name",
      title: "区域名称",
    },
    {
      dataIndex: "e",
      title: "用电量（kwh）",
    },
    {
        dataIndex: "mom",
        title: "环比",
        render: (text) =>  <span><span style={{color: "#3c3"}}>&#9650; &nbsp;</span>{text}</span>,
    },
    {
      dataIndex: "yoy",
      title: "同比",
      render: (text) =>  <span><span style={{color: "#f00"}}>&#9660; &nbsp;</span>{text}</span>
  }

  ]

  const getData = async () => {
    try {
    const {area, date, type, meterType} = form.getFieldsValue() || {}
    if(isNaN(type)) return;
    let hander = [QueryEnergyAreaDay, QueryEnergyAreaMonth, QueryEnergyAreaYear][type]
    let time
    if(type == 0) {
        time=date.format('YYYY-MM-DD')
    }else if(type == 1) {
        time = data.startOf("month").format('YYYY-MM-DD')
    }else if(type == 2) {
        time = data.startOf("year").format('YYYY-MM-DD')
    }
    const querys = {
        areaId: area,
        projectId,
        meterType,
        date: time
     }
    const params = [area]
    let {success, data} = await hander(querys, params)
    if(success && Array.isArray(data)) {
        setTableData(data)
    }else {
        setTableData([])
    }
    } catch (error) {
        console.log(error)    
    }
  }
 

 const [mode, setMode] = useState(1)
 const stack = useRef()
 const  tdataset = {  // 图表数据
 // dimensions: ["日期", "用电量(kwh)"],
  source: [
    ["日期", '0','1','2','3','4','5','6'],
    ["塔楼区", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["交易区", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["干杂区", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["水产市场", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["工业设备机房", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["库房", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],
    ["叉车充电间", 102.32, 907.01, 402.32, 507.01,202.32, 807.01, 502.32],]
}
 
useEffect(() => {
  const barconfig = {
    type: "bar",
    stack: "count",
    seriesLayoutBy: 'row',
   
    barWidth: 30, 
    barCategoryGap: "5%"
  // barGap: "30%", 
  // barCategoryGap: "10%"
  }
  drawEcharts(
     stack.current, {
      dataset: tdataset,
     
      series: [
        barconfig, 
        barconfig,
        barconfig,
        barconfig, 
        barconfig,
        barconfig, 
        barconfig, 
      ]
    }
  )
})

 const onChange = (e) => {
  setMode(e.target.value)
 }



 useEffect(() => {
   getData()
 }, [projectId]) 
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
       <Item  label="能源类型"   initialValue={1} name="meterType">
        <Select
        onChange={getData}   
        style={{width: "112px"}}
        options={[
          {
            label: '电力',
            value: 1,
          },
          {
            label: '用水',
            value: 2,
          }]}
         />
        </Item>
      <Space size={16}>
        <Item  name="type" initialValue={0}>
           <Select style={{width: '80px'}}   options={[
            {value: 0, label: '日'},
            {value: 1, label: '月'},
            {value: 2, label: '年'},
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
  const pieref = useRef()
  useEffect(() => {
    drawEcharts(pieref.current, {
      pieData: { data: piedata, total: 100 },
      type: 3,
      legend: {
        type: "scroll",
      //  orient: 'vertical',
        bottom: 0,
        top: 'auto',
        itemGap: 5
      },
      grid: {
        bottom: 20
      }
    });
  }, [])


  return (
    <CustContext.Provider
      value={{
        form,
        custview: <CustView />,
        handler: getData,
       
      }}
    >

      <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px', flex: 1}}>
      <UserSearch></UserSearch>
      <Laybox  >
        <Titlelayout title={Title} key={nanoid()}>
           <div style={{paddingTop: "16px", height: "100%", display: "flex"}}>
             {
              mode == 1 ? <div style={{flex: 1}} ref={stack} key="echart"></div> : <UseTable dataSource={tableData} columns={columns} key="table" />
             }  
           
           </div>
        </Titlelayout>
        <div className="right">
           <Titlelayout title="今日能耗占比" key={nanoid()}>
              <div ref={pieref} style={{width: "392px", height: "432px"}}></div>
           </Titlelayout>
           <Titlelayout title="区域能耗排名" key={nanoid()}>
              <Sdiv>
                 <div className="sort">
                     <Image style={{width: "40px"}} src={imgurl.a01} preview={false}></Image>
                     <div className="data">
                        <Text  ellipsis >交易区</Text>
                        <div> <Text style={{fontSize: "16px"}} ellipsis>{nf.format(1987.01)}</Text>&nbsp;<span>kwh</span></div>
                     </div>
                 </div>
                 <div className="down">
                    <div className="sort">
                    <Image style={{width: "40px"}} src={imgurl.a02} preview={false}></Image>
                     <div className="data">
                        <Text ellipsis>塔楼</Text>
                        <div><Text style={{fontSize: "16px"}} ellipsis>{nf.format(1987.01)}</Text>&nbsp;<span>kwh</span> </div>
                     </div>
                    </div>
                    <div className="sort">
                      <Image style={{width: "40px"}} src={imgurl.a03} preview={false}></Image>
                     <div className="data">
                        <Text ellipsis>库房</Text>
                       <div> <Text style={{fontSize: "16px"}} ellipsis>{nf.format(1987.01)}</Text>&nbsp;<span>kwh</span> </div>
                     </div>
                    </div>
                 </div>
              </Sdiv>
           </Titlelayout>
        </div>
     
      </Laybox>
      </div>
    </CustContext.Provider>
  );
}
