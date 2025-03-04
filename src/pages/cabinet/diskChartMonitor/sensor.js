import React, {useRef, useState, useEffect, forwardRef, useImperativeHandle} from 'react'
import {DatePicker, Typography,Form, Select, Space} from 'antd'
import { CloseOutlined } from "@ant-design/icons";
import moment from 'moment';
import {CDrawer, Extrea,} from './comstyle'
import Ichart from "@com/useEcharts/Ichart";
import { DiskChart } from "@api/api.js";
const {Text} = Typography
const { RangePicker } = DatePicker;
const post = {
    1: ["NTD30S11930128", "NTD30S11930129","NTD30S11930130","NTD30S11930131", "NTD30S11930132","NTD30S11930133","NTD30S11930134","NTD30S11930135","NTD30S11930136","202411010011"], //  温度传感器，烟感，浪涌，水浸（202411010011） 仅p1有
    2: ["NTD30S11930125", "NTD30S11930126","NTD30S11930127"],
    3: Array.from({length:21},(_, index)=> index > 0 ? `NTD30S119301${index + 1}` : `NTD30S1193010${index + 1}` ),
    4:["NTD30S11930122", "NTD30S11930123","NTD30S11930124"],
   }
const titles = {
    1:"P1传感器信息",
    2:"P2温度传感器信息",
    3:"P3温度传感器信息",
    4:"P4温度传感器信息" 
   }
   const Extra = ({ ist, title, fn }) => {
    return (
      <Extrea ist={ist}> 
        <CloseOutlined onClick={fn} className="close" />
      </Extrea>
    );
  };
  const vdata = [
    Array.from({ length: 24 }, (_, index) =>
      index > 9 ? `${index}:00` : `0${index}:00`
    ),
    Array.from({ length: 24 }, (_, index) => (Math.random() * 100)?.toFixed(2)),
    Array.from({ length: 24 }, (_, index) => (Math.random() * 100)?.toFixed(2)),
  ];
const { QueryDevicesDataAll } =DiskChart
 function Index(props, ref) {
   const [form]=Form.useForm()
   const [title, setTitle] = useState("");
   const [open, setOpen] = useState(false);
   const [temptype, setTemptype] = useState()
   const queryDevicesDataAll = async (type)=> { // 批量获取设备所有属性值
    const body = post[type]
    const mtitle=titles[type]
    setTemptype(type)
    try {
      let datas = await QueryDevicesDataAll(body)
      if(Array.isArray(datas)&& datas.length > 0) {

       setOpen(true)
       setTitle(mtitle)
      }
    } catch (error) {
       
    }
 }

 let moption = {
    
    series: [
      { type: "line", seriesLayoutBy: "row", yAxisIndex: 0, name: "温度" },
      { type: "line", seriesLayoutBy: "row", yAxisIndex: 1, name: "湿度" },
    ],
    grid: {
      right: "32px",
      left: 0,
      top: "32px",
      bottom: 0,
      containLabel: true,
    },
    legend: {
      top: "0px",
      left: "32px",
    },
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}°C",
        },
      },
      {
        name: "环境湿度",
        nameLocation: "center",
        nameGap: 64,
        position: "right",
        axisLabel: {
          formatter: "{value}%HR",
        },
      },
    ],
    dataset: {
      dimensions: [
        { name: "时间", type: "time" },
        { name: "温度" },
        { name: "湿度" },
      ],
      source: vdata,
      sourceHeader: false,
    },
  };
  useImperativeHandle(ref, ()=>({
    onOpen: (type) => queryDevicesDataAll(type)
  }))
  return (
    <CDrawer
    title={title}
    open={open}
    bodyStyle={{
      backgroundColor: "#fff",
    }}
    width={1036}
    headerStyle={{
      backgroundColor: "#f2f2f2",
      padding: "10px 16px",
      borderBottom: "none",
      display: "flex",
    }}
   // closable={false}
    onClose={() => setOpen(false)}
   // maskClosable
//    extra={  <CloseOutlined onClick={() => setOpen(false)} className="close" style={{fontSize: "28px"}} /> }
  >
    <div className='mainbox'>
     {temptype==1 && (<div className="stats">
         <div className='btn'>
            水浸传感器：<Text type="success">正常</Text>
         </div>
         <div className='btn'>
           烟感传感器：<Text type="success">正常</Text>
         </div>
         <div className='btn'>
            浪涌保护器：<Text type="success">正常</Text>
         </div>
       </div>)
 }
       <div className="time">
        <span>温度传感器</span>
        <Form form={form} >
            <Space size={16}>
            <Form.Item label="时间查询" name="dateType" labelCol={{flex: "5em"}}>
                <Select style={{width: "100px"}}>
                <Select.Option value="date">日</Select.Option> 
                <Select.Option value="month">月</Select.Option> 
                <Select.Option value="year">年</Select.Option>
                <Select.Option value="cust">自定义</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item noStyle shouldUpdate>
                {
                    ({getFieldValue})=> {
                        let picker=getFieldValue("dateType") 
                        return <Form.Item name="date" initialValue={moment()}>
                            {picker!="cust" ? <DatePicker picker={picker} style={{width: "288px"}}></DatePicker> : <RangePicker style={{width: "288px"}}></RangePicker>}
                        </Form.Item>
                    }
                }
            </Form.Item>
            </Space>
        </Form>
       </div>
       <div className="charts">
      <div className='temperature'>
        <div className="btntitle">
            <div className="title">
                水平排 A相温度
            </div>
            <div className="btn">
                32.3℃
            </div>
        </div>
        <div className="btntitle">
            <div className="title">
                水平排 B相温度
            </div>
            <div className="btn">
                32.3℃
            </div>
        </div>
        <div className="btntitle">
            <div className="title">
                水平排 C相温度
            </div>
            <div className="btn">
                32.3℃
            </div>
        </div>
      </div>
         <div className="chart">
         <Ichart {...moption} />
         </div>
         </div>
       </div>
  </CDrawer>
  )
}
export default forwardRef(Index)