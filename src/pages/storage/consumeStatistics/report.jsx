import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
 import moment from 'moment'
 import {ConsumeStatisticsRuntime} from '@api/api'
import Titlelayout from '@com/titlelayout'
import { drawEcharts } from "@com/useEcharts";
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-rows: 110px 673px;
       row-gap: 16px; 
       flex: 1;
       color:#515151;
       .top {
        display: flex;
        padding: 16px;
        background-color: #fff;
        .list {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(3, 528px);
            grid-template-rows: 78px;
            column-gap: 32px;
            .listbox {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              border: 2px solid #d7d7d7;
            }
            .listitem {
              display: flex;
              flex-direction: column;
              color:#fff;
              width: 172px;
              border-right: 2px solid #fff;
              &:last-of-type {
                border-right: none;
              }
              &:first-of-type {
                .up {
                  background-color: #56b653;
                }
              }
              &:nth-of-type(2) {
                .up {
                  background-color: #4370ff;
                }
              }
              &:last-of-type {
                .up {
                  background-color: #9951fe;
                }
              }
              .up {
                 
                 font-size: 12px;
                 height: 32px;
                 display: flex;
                 align-items: center;
                 justify-content: center;
              }
              .downinfo {
                 background-color: #f2f2f2;
                 font-size: 14px;
                 height: 40px;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 color: #333;
                 .ant-typography.ant-typography-ellipsis.ant-typography-single-line {
                  margin-bottom: 0;
                 }
              }
            }
        }
        
          
        }
        .down {
            display: grid;
            grid-template-rows: 1fr 1fr;
            
        } 
       }
`
 
 
 
 function Maincom({projectId,  Statistical, areaId}) {
  const [picker, setPicker] = useState(1)
  const [income, setIncome] = useState({})
  const ref = useRef()
  const fref = useRef()
  const {from} = Form.useForm()
  const getIncome = async () => {
     let  {success, data} =  await  ConsumeStatisticsRuntime.QueryIncome(projectId, areaId)
     if (success && data) {
       
       setIncome({...income, ...data})
     }else {
      setIncome({})
     }

  }

  useEffect(() => {
    getIncome()
  }, [areaId])
  const dataset = {
    dimensions: ["time", "收益元"],
    source: [
      { time: "1月", "收益元": 5600,},
      { time: "2月", "收益元": 4600 },
      { time: "3月", "收益元": 3600,},
      { time: "4月", "收益元": 5600 },
      { time: "5月", "收益元": 5600 },
      { time: "6月", "收益元": 4600 },
      { time: "7月", "收益元": -3600},
      { time: "8月", "收益元": 5000 },
      { time: "9月", "收益元": 6600 },
      { time: "10月", "收益元": 5800 },
      { time: "11月", "收益元": 4600 },
      { time: "12月", "收益元": 1800 },
    ],
  }
  const tdataset = {
    dimensions: ["time", "充电量", "放电量"],
    source: [
      { time: "1月", "充电量": 5600, "放电量": 5120,},
      { time: "2月", "充电量": 4600, "放电量": 5400, },
      { time: "3月", "充电量": 3600, "放电量": 7600, },
      { time: "4月", "充电量": 5600, "放电量": 9600,  },
      { time: "5月", "充电量": 5600, "放电量": 8600,  },
      { time: "6月", "充电量": 4600, "放电量": 7600,  },
      { time: "7月", "充电量": -3600, "放电量": 6600, },
      { time: "8月", "充电量": 5000, "放电量": 5600,  },
      { time: "9月", "充电量": 6600, "放电量": 4600,  },
      { time: "10月", "充电量": 5800, "放电量": 3600,  },
      { time: "11月", "充电量": 4600, "放电量": 2600,  },
      { time: "12月", "充电量": 1800, "放电量": 1600,  },
    ],
  };
  const datechange = () => {}
  const timechange = () => {}
  const Formlayout = () => {
   
    return (
      <Form layout='inline' form={from}>
        <Space size={16}>
          <Item noStyle name="type" initialValue={1}>
           <Select style={{width: '80px'}}   options={[
            {value: 1, label: '日'},
            {value: 2, label: '月'},
            {value: 3, label: '年'},
           ]}
           onChange={timechange}
           ></Select>
        </Item>

        <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
          <DatePicker placeholder="请选择日期" picker={picker} onChange={datechange} style={{width: '160px'}} />
        </Item>
        </Space>
      </Form>
    )
  }
  useEffect(() => {
    drawEcharts(
      ref.current, {
        dataset,
        series: [{ type: "line", areaStyle: {color: '#bdd2fd'} }]
      }
    )
  }, [picker])
  useEffect(() => {
    drawEcharts(
      fref.current, {
        tdataset,
        series: [{ type: "line", areaStyle: {color: '#bdd2fd'},  stack: 'Total',  }]
      }
    )
  }, [picker])
  return (
    <Mainbox>
        <div className='top'>
          <Statistical data={income} />
        </div>
        <div className='down'>
          <Titlelayout title={ <Space size={32}><span>收益趋势</span>  <Formlayout/> </Space>  } bordered={'n'} style={{flex: 1}}>
            <div ref={ref} style={{height: '264px'}}></div>
          </Titlelayout>
          <Titlelayout title={ <Space size={32}><span>充放电趋势</span>  <Formlayout/> </Space>  } bordered={'n'} style={{flex: 1}}>
            <div ref={fref} style={{height: '264px'}}></div>
          </Titlelayout>
        </div>
      
    </Mainbox>
  )
}

const Statistical = ({data}) => {

  const contentStyle = {
    width: '172px',
    height: '40px',
    backgroundColor: 'rgba(0, 51, 204, 1)',
    fontsize: '14px',
    color: '#FFFFFF',
    alignItems: 'center',
    justifyCcontent: 'center',
    paddingBottom: '0px'
  }
  const labelStyle = {
    width: '172px',
    height: '40px',
    backgroundColor: 'rgba(0, 51, 102, 1)',
    fontsize: '12px',
    color: '#FFFFFF',
    alignItems: 'center',
    justifyCcontent: 'center',
    paddingBottom: '0px'
  }
  return (
     <div className='list'>
      <div className='listbox'>
        <div   className='listitem'>
            <div className='up' >
                  当日充电量(kwh)
              </div>
              <div className='downinfo'>
                  <Paragraph ellipsis={{tooltip: data.todayChargeE}}>{data.todayChargeE}</Paragraph>
               </div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>
              <Paragraph ellipsis={{tooltip: data.todayDisChargeE}}>{data.todayDisChargeE}</Paragraph>
              </div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>
              <Paragraph ellipsis={{tooltip: data.todayIncome}}>{data.todayIncome}</Paragraph>
                </div> 
        </div>
        </div>
        <div className='listbox'>
        <div   className='listitem'>
            <div className='up' >
                  当月充电量(kwh)
              </div>
              <div className='downinfo'>
              <Paragraph ellipsis={{tooltip: data.monthIncome}}>{data.monthIncome}</Paragraph>
                </div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当月放电量(kwh)
              </div>
              <div className='downinfo'>
              <Paragraph ellipsis={{tooltip: data.monthDisChargeE}}>{data.monthDisChargeE}</Paragraph>
                </div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日收益(元)
              </div>
              <div className='downinfo'> <Paragraph ellipsis={{tooltip: data.monthIncome}}>{data.monthIncome}</Paragraph></div> 
        </div>
        </div>
        <div className='listbox'>
        <div   className='listitem'>
            <div className='up' >
                  当年充电量(kwh)
              </div>
              <div className='downinfo'>
              <Paragraph ellipsis={{tooltip: data.yearChargeE}}>{data.yearChargeE}</Paragraph>
                </div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当年放电量(kwh)
              </div>
              <div className='downinfo'>
              <Paragraph ellipsis={{tooltip: data.yearDisChargeE}}>{data.yearDisChargeE}</Paragraph>
                </div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当年收益(元)
              </div>
              <div className='downinfo'>
              <Paragraph ellipsis={{tooltip: data.yearIncome}}>{data.yearIncome}</Paragraph>
                </div> 
        </div>
        </div>
     </div>
  )
}


export default function Index(props) {
    return (
        <Maincom {...props}   Statistical={Statistical}   />
    )
}