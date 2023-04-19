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
 
 function Maincom({projectId,  Statistical, stationName, Formlayout}) {
  
 
  const [income, setIncome] = useState({})
  const [dataset, setDataset] = useState({
   dimensions: ['name', '收益(元)'],
   source: [],
     

  })
  const [tdataset, setTdataset] = useState({
    dimensions: ["date", "充电量(kWh)", "放电量(kWh)"],
    source: [],
  })
  const ref = useRef()
  const fref = useRef()
  const [form] = Form.useForm()
  const [sform] = Form.useForm()
  
  const getIncome = async () => {
     let  {success, data} =  await  ConsumeStatisticsRuntime.QueryIncome(projectId, stationName)
     if (success && data) {
       
       setIncome({...income, ...data})
     }else {
      setIncome({})
     }

  }
 
  useEffect(() => {
    if (projectId && stationName) {
      getIncome()
    }
    
  }, [projectId, stationName])

  const getchartData = async () => {
    try {
      const { date, type} = form.getFieldsValue() || {}   
      let time;
      if (type == 1)  {
        time = date.format('YYYY-MM-DD')
      } else if(type == 2) {
        time = date.format('YYYY-MM') + '-01'
  
      } else if(type == 3) {
         time = date.format('YYYY')+ '-01-01'
      }
      
      let {success, data} = await  ConsumeStatisticsRuntime.QueryIncomeTrends(projectId,type, time, stationName)
      let {x, y} = data || {}
      if(success && Array.isArray(x) && Array.isArray(y)) {
          x.unshift('日期')
          y.unshift('收益（元）')
         let source = [x, y]
         setDataset({source})
      }else {
        setDataset({
          dimensions: ['name', '收益(元)'],
          source: [],
         })
      }
    } catch (error) {
      console.log(error)
    }
  
  }
  const queryDisChargeETrends = async () => {
    try {
      
   
    const { date, type} = form.getFieldsValue() || {}
   
    let time;
    if (type == 1)  {
      time = date.format('YYYY-MM-DD')
    } else if(type == 2) {
      time = date.format('YYYY-MM') + '-01'

    } else if(type == 3) {
       time = date.format('YYYY')+ '-01-01'
    }
    
    let {success, data} = await  ConsumeStatisticsRuntime.QueryDisChargeETrends(projectId,type, time, stationName)
     let {x, y, y1} = data || {}
    if(success && Array.isArray(x) && Array.isArray(y) && Array.isArray(y1)) {
       x.unshift('日期')
       y.unshift('充电量(kwh)')
       y1.unshift('放电量(kwh)')
       setTdataset({
        source: [x, y, y1]
       })
    }else {
      setTdataset({
        dimensions: ["date", "充电量(kWh)", "放电量(kWh)"],
        source: [],
      })
    }
   
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(projectId && stationName) {
      getchartData()
      queryDisChargeETrends()
    }
    
  }, [projectId, stationName])



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
       ref.current, {
        dataset,
        series: [{ type: "line", areaStyle: {color: '#bdd2fd', },  ...eparams }]
      }
    )
  }, [dataset])
  useEffect(() => {
    drawEcharts(
      fref.current, {
        dataset: tdataset,
       // series: [{ type: "line", areaStyle: {color: '#bdd2fd', },  ...eparams }]
        series: [{ type: "line", areaStyle: {color: '#d6e0be'}, ...eparams, stack: 'x'}, { type: "line", areaStyle: {color: '#ffe7d6'}, ...eparams, stack: 'x'}]
      }
    )
  }, [tdataset])
  return (
    <Mainbox>
        <div className='top'>
          <Statistical data={income} />
        </div>
        <div className='down'>
          <Titlelayout title={ <Space size={32}><span>收益趋势</span>  <Formlayout form={form} handler={getchartData} /> </Space>  } bordered={'n'} style={{flex: 1}}>
               

            <div ref={ref} style={{height: '264px'}}></div>
          </Titlelayout>
          <Titlelayout title={ <Space size={32}><span>充放电趋势</span>  <Formlayout form={sform} handler={queryDisChargeETrends} /> </Space>  } bordered={'n'} style={{flex: 1}}>
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

const Formlayout = ({form, handler}) => {
   
  return (
    <Form layout='inline' form={form} initialValues={{
      type: 2,
      date: moment()
    }}>
      <Space size={16}>
        <Item noStyle name="type">
         <Select style={{width: '80px'}}   options={[
          {value: 1, label: '日'},
          {value: 2, label: '月'},
          {value: 3, label: '年'},
         ]}
         onChange={handler}
         ></Select>
      </Item>

      <Item noStyle  shouldUpdate >
       { ({getFieldValue}) => {  
           let type = getFieldValue('type')  
          let picker = ['', 'day', 'month', 'year'][type]
           return <Item name="date"><DatePicker placeholder="请选择日期" picker={picker}   onChange={handler} style={{width: '160px'}} /></Item> 
  
        }
      }
       
      </Item>
      </Space>
    </Form>
  )
}
export default function Index(props) {
    return (
        <Maincom {...props}   Statistical={Statistical} Formlayout={Formlayout}  />
    )
}