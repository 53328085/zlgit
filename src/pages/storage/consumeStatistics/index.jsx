import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography,  Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions } from 'antd'
 
 
import {  useOutletContext} from 'react-router-dom'
 import moment from 'moment'
 import {ConsumeStatisticsRuntime} from '@api/api'
 import Pagecount from "@com/pagecontent";
import Titlelayout from '@com/titlelayout'

import Ichart  from '@com/useEcharts/Ichart'; 
import {getTime} from "@com/usehandler"
 
const { Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const disabledDate = (current) => {   
  return current && current > moment().endOf('day');
};
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
 
 function Maincom({Statistical,  Formlayout}) {
  let {exparams} = useOutletContext()
 
  let {stationName,  projectId} = exparams
 
  const [income, setIncome] = useState({})

  const eparams = {
    smooth: true, 
     lineStyle: {
      width: 0
     },
    showSymbol: false,
    seriesLayoutBy: 'row'
  }
  const [dataset, setDataset] = useState({
    series: [{ type: "line", areaStyle: {color: '#bdd2fd', },  ...eparams }],
    dataset: {
      dimensions: [],
      source: [],
    } 
  })
  const [err, setErr] = useState('')
  const [tdataset, setTdataset] = useState({
    series: [
      { type: "line", areaStyle: {color: '#d6e0be'}, ...eparams, stack: 'x'},
     { type: "line", areaStyle: {color: '#ffe7d6'}, ...eparams, stack: 'x'}],
     dataset: {
      dimensions: [],
      source: [],
    } 
  })
  const [terr, setTerr] = useState('')

  const [form] = Form.useForm()
  const [sform] = Form.useForm()
 
  const getIncome = async () => {
     let  {success, data} =  await  ConsumeStatisticsRuntime.QueryIncome(projectId, stationName.value)
     if (success && data) {
       
       setIncome({...income, ...data})
     }else {
      setIncome({})
     }

  }
 
  useEffect(() => {
    if (projectId && stationName?.name) {
      getIncome()
    }
    
  }, [projectId, stationName])

  const getchartData = async () => {
    try {
      const { date, type} = form.getFieldsValue() || {}   
     
      let time = getTime(date, type);
     
      
      let {success, data, errMsg} = await  ConsumeStatisticsRuntime.QueryIncomeTrends(projectId,type, time, stationName.name)
      let {x=[], y=[]} = data || {}
      if(success) {
         let dimensions = [
           {name: "x", displayName: "时间", type: "time"},
           {name: 'y', displayName: "收益(元)"}
         ]
         let source = [x, y]
         setDataset({...dataset, dataset: {
          dimensions,
          source
         }})
      }else {
        setErr(errMsg)
        setDataset({
          ...dataset,
          dataset: {
          dimensions: ['name', '收益(元)'],
          source: [],
          }
         })
      }
    } catch (error) {
      console.log(error)
    }
  
  }
  const queryDisChargeETrends = async () => {
    try {
      
   
    const { date, type} = sform.getFieldsValue() || {}
   
    let time = getTime(date, type);
    let {success, data, errMsg} = await  ConsumeStatisticsRuntime.QueryDisChargeETrends(projectId,type, time, stationName.name)
     let {x, y, y1} = data || {}
    if(success && Array.isArray(x) && Array.isArray(y) && Array.isArray(y1)) {

      let dimensions = [
        {name: "x", displayName: "日期", type: "time"},
        {name: 'y', displayName: "充电量(kwh)"},
        {name: 'y1', displayName: "放电量(kwh)"}
      ]
      let source = [x, y, y1];
      
       setTdataset({
        ...tdataset,
        dataset: {
          dimensions,
          source
        }
       })
    }else {
      setTerr(errMsg)
      setTdataset({
        ...tdataset,
        dataset: {
          dimensions:[],
          source:[]
        }
       })
    }
   
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(projectId && stationName?.name) {
      getchartData()
      queryDisChargeETrends()
    }
    
  }, [projectId, stationName])

  return (
    <Pagecount pd={0} bgcolor='transparent'>
    <Mainbox>
        <div className='top'>
          <Statistical data={income} />
        </div>
        <div className='down'>
          <Titlelayout title={ <Space size={32}><span>收益趋势</span>  <Formlayout form={form} handler={getchartData} /> </Space>  } bordered={'n'} style={{flex: 1}} layout="flex">
               

            <div   style={{display: 'flex', flex: 1}}>
              <Ichart {...dataset} tip={err} /> 
            </div>
          </Titlelayout>
          <Titlelayout title={ <Space size={32}><span>充放电趋势</span>  <Formlayout form={sform} handler={queryDisChargeETrends} /> </Space>  } bordered={'n'} style={{flex: 1}} layout="flex" >
            <div   style={{display: 'flex', flex: 1}}>
              <Ichart {...tdataset} tip={terr} />
            </div>
          </Titlelayout>
        </div>
      
    </Mainbox>
    </Pagecount>
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
           return <Item name="date"><DatePicker placeholder="请选择日期" picker={picker}   onChange={handler} style={{width: '160px'}} disabledDate={disabledDate} /></Item> 
  
        }
      }
       
      </Item>
      </Space>
    </Form>
  )
}
export default function Index() {
  
    return (
        <Maincom  Statistical={Statistical} Formlayout={Formlayout}  />
    )
}