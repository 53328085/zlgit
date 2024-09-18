import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {nanoid} from '@reduxjs/toolkit'
import moment from 'moment'
import {Form, Select} from 'antd'
import Ichart  from '@com/useEcharts/Ichart';
import UserTable from "@com/useTable";
import {PowerQuality} from "@api/api"
import { isObject } from '@com/usehandler';
import {RadiogroupB} from '@com/comstyled'
import {patterns, xbqxoption} from './options'
import {wtqxcolumns} from './columns'
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 32px minmax(680px, 1fr);
  row-gap: 16px;
  padding-left: 16px;
  .op {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      padding-left: 16px;
      height: 25px;
      border-left: 5px solid ${props => props.theme.primaryColor};
      line-height: 25px;
      color: #515151;
    }
  } 
 
`
 

const getsoucre  = (datas, condition) => { 
    let source=[]
    if(condition) {
      datas.forEach((d,index) => {
         let {data} = d
         if(Array.isArray(data)) {
           if(index == 0) {
             let time = data.map(t => t.time)
             let datay = data.map(t => t.value)
             source.push(time, datay)
           }else { 
            source.push(data.map(t => t.value))
           }
         }
      })
    } 
    return source
    
  
}
const arrlen =(arr) => {
  return Array.isArray(arr) && arr?.length >0
}
  const  markPoint ={
    data: [
      { type: 'max', name: 'Max' },
      { type: 'min', name: 'Min' }
    ]
  }
  const cption ={   
    series: Array(3).fill({ type: "line",  seriesLayoutBy: 'row', markPoint}),  
    grid: { 
      left: "0px",
      right: 60,
      top: "60px",
      bottom: "60px",
      containLabel: true,
    },
    legend: {
       show: false
    },
    dataZoom:  [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'none'
      }
    ],
    xAxis: {
      axisLabel: {
        formatter: (value) => {
            return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
        },
        interval: "auto"
     },
    

    },
    
  }
export default function Index({projectId, day, sn}) {
  const [form] = Form.useForm()
  const [datas, setDatas] = useState({})
  const [pattern, setPattern] = useState(1)
 
 
  const [wtcolumn, setWtcolumns] = useState([])
  const [wtData, setWtdata] = useState([])
  const islen = arrlen(datas)
  const [loading, setLoading] =useState(false)
  const [mloading, setMloading] = useState(false)
  const [mxData, setMxData] = useState([])
 const onChange =({target: {value}}) =>{
  setPattern(value)
 }
  const getData = async() => {
      try {
        if(pattern == 2) {
          setLoading(true)
        }else if(pattern == 3){
          setMloading(true)
        }

       let {group} =await form.validateFields()
       console.log(group)
       const body ={
        1: {
        projectId,
        sn,
        day: day.format("yyyy-MM-DD"),
        group
       },
       2: {
        projectId,
        sn,
        day: day.format("yyyy-MM-DD")
       },
      3: {
        projectId,
        sn,
        day: day.format("yyyy-MM-DD")
       }
      }[pattern]
      const method ={
        1: 'XBQXTrend',
        2: 'XBQXTable',
        3: 'XBQXExtremum'
      }[pattern]
      let {success, data} = await  PowerQuality[method](body)
      if(pattern == 1) {
        if(success && arrlen(data)) {
          setDatas(data)
        }else {
          setDatas({})
        }
      }else if(pattern == 2) {

        if(success && isObject(data)) {
          let {data:tbData, header} = data
          if(arrlen(tbData) && arrlen(header)) {
            let cols = header.map(h => {
           let name = h.name;
           name = name?.replace(name[0], name[0]?.toLowerCase())
           return  {
              title: h.display,
              dataIndex: name, 
              key:name
            }})
            setWtcolumns(cols)
            setWtdata(tbData)
          }else {
            setWtcolumns([])
            setWtdata([])
          }

        }else {
          setWtcolumns([])
          setWtdata([])
        }

      } else if(pattern == 3) {
        if(success && arrlen(data)){
          setMxData(data)
        }else {
          setDatas([])
        }
      }  
      } catch (error) {
        console.log(error)
      }finally{
        if(pattern==2) {
          setLoading(false)
        }else if(pattern==3) {
          setMloading(false)
        }
      }
      
  }

  const lineOptionU= { // 电压
    ...cption,
    dataset: {
      dimensions: islen ? ["time",...datas?.map(u => u.point)] : [],
      source: getsoucre(datas, islen),
      sourceHeader: false
    },
  }
  const onValuesChange =() => {
     getData()
  }
  const Com ={
    1: <Ichart {...lineOptionU} />,
    2:  <UserTable columns={wtcolumn} dataSource={wtData} istheme="theme" rowKey={nanoid()} loading={loading} scroll={{
      scrollToFirstRowOnChange: true, 
       y: 672
     }
    }></UserTable>,
   3: <UserTable columns={wtqxcolumns} dataSource={mxData} istheme="theme" rowKey={nanoid()} loading={mloading} scroll={{
      scrollToFirstRowOnChange: true, 
       y: 672
     }
    }></UserTable>
  }[pattern]
  useEffect(() => {
     if(Number.isInteger(parseInt(projectId))&& sn && day) {
        getData()
     }
  }, [projectId, day, sn, pattern ])

  return (
    <Mainbox>
       <div className='op' key={nanoid()}>
        <Form form={form} layout="inline" onValuesChange={onValuesChange}>
             <Form.Item name="group" initialValue={1}>
              <Select style={{width:200}} options={xbqxoption}></Select>
              </Form.Item>
          </Form>
          <RadiogroupB      optionType="button" options={patterns}
           buttonStyle="solid" value={pattern} onChange={onChange} />
       </div>
       <div className='chartbox' key={nanoid()}>
           {Com}
       </div>
      
     </Mainbox>
  )
}
