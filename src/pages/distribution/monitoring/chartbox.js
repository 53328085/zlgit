import React, {useState, useRef, useEffect, Fragment} from 'react'
import dayjs from 'dayjs'

import  Ichart from '@com/useEcharts/Ichart' 
import Titlelayout from '@com/titlelayout' 
import styled from 'styled-components'
import {Space, Radio, DatePicker, Select} from 'antd'
import {CustButtonT, ExportExcel} from "@com/useButton"
import {DistributionRoomRuntime } from '@api/api.js'
import UseTable from '@com/useTable'
import {isObject} from "@com/usehandler"
const Ctitle = styled.div`
 display: flex;
 align-items: center;
 justify-content: space-between;
`

const opts = [
    {
      value:1,
      label:'电压(V)'},
    {
      value:2,
      label:'电流(A)'},
    {
      value:3,
      label:'总负荷(kW)'},
    {
      value:4,
      label:'总有功功率(kW)'},
    {
      value:5,
      label:'总无功功率(kVar)'},
    {
      value:6,
      label:'总视在功率(kVA)'},
    {
      value:7,
      label:'总功率因数'},
  ]
 
export default function Index({device, projectId}) {
    const [type,setType]=useState(1)
    const [parten, setParten] = useState(1)
    const [tabledata,setTableData]=useState([])
    const [columns,setColumns] = useState([])
    const [disableDate,setDisableDate] = useState([])
    const [timeRanger,setTimeRanger] = useState([dayjs().subtract(6,'day'), dayjs()])
    const tableRef = useRef()
    const [treand, setTreand] = useState({
      lineData: [],
      group: ''
    })
    const {lineData } = treand
    const getData =async(body) => {
      try {
         
        let {success, data} =await DistributionRoomRuntime.HistoryTrend(body)
        if(success && Array.isArray(data) && data.length >0) {
          let {data:lineData, group} =data[0]
          setTreand({
            lineData: Array.isArray(lineData) ? lineData : [],
            group
          })
          
        }else {
          setTreand({
            lineData: [],
            group: ''
          })
        }
      } catch (error) {
        return Promise.reject(error)
      }
  } 
    const getTableData =async (body) => {
        try {
          let {success, data} =  await DistributionRoomRuntime.HistoryTableH(body)
          if(success && isObject(data)) {
             let {data:tbdata, header} = data
             if(Array.isArray(header)) {
                let cols = header.map(h =>({
                    title: h.display,
                    dataIndex: h.name,
                    key: h.name
                }))
                setColumns(cols)
             }else {
                setColumns([])
             }
             if(Array.isArray(tbdata)) {
              setTableData(tbdata)
            }else {
              setTableData([])
            }
          }else {
            setColumns([])
            setTableData([])
          }
        } catch (error) {
            
        }
    }
 //   const points = useRef([])   
  const lineOption ={   // 耗趋势图表
    series: Array(lineData?.length).fill({ type: "line",  seriesLayoutBy: 'row', stack: 'total' }),  
    grid: { 
      left: "0px",
      right: 32,
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
        top: 0,
        icon: 'rect',
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
    },
    dataset: {
      dimensions: ['time',...lineData.map(d => d.point)],
      source:  (() => {
        let source=[]
        lineData?.forEach((d, index) => {
          let {point, data} = d;
        //  points.current.push(point)
          if(index == 0) {
            source.push(data.map(t => t.time));
            source.push(data.map(t => t.value))
          }else {
           source.push(data.map(t => t.value))
          }
        })
        return source
      })()
    },
    xAxis: {
      axisLabel: {
         formatter: (value, index) => {
             return dayjs(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
         },
         interval: "auto"
      },
    

    }
  }

    useEffect(() => {
        
        if(device&& Number.isInteger(parseInt(projectId)) &&  timeRanger?.every(t => t)) {
            console.log(timeRanger)
            const body ={
                type,
                projectId,
                sn: device.sn,
                start:  timeRanger?.[0]?.format("YYYY-MM-DD") + " 00:00:00",
                end: timeRanger?.[1]?.format("YYYY-MM-DD HH:mm:ss")
    
              }
              getData(body)
        }
      }, [device, projectId,timeRanger, type])
    const changeRadio=(e)=>{       
        setParten(e.target.value)
      }
      const changeTime=(time)=>{ 
        setTimeRanger(time)
      }
      let copytime =useRef()
      const onOpenChange=(open)=>{
        
       
        if(open){
          setTimeRanger([null,null])
          setDisableDate([null,null])
          copytime.current =[...timeRanger]
          console.log(copytime)
        }else{
          if(!timeRanger[0] || !timeRanger[1]){
            console.log(copytime=== timeRanger)
            setTimeRanger(copytime.current)
          }
         
          setDisableDate(null)
        }
      }
      const disabledDate = (current)=>{
        if(!disableDate){
          return false
        }
        const tooLate = disableDate[0]&& current.diff(disableDate[0],'days')>6
        const tooEarly = disableDate[1] && disableDate[1].diff(current,'days')>6
        return tooLate || tooEarly ||(current && current > dayjs().endOf('day'))
        
      }
 
  const CSelect =(
    <Ctitle>
      <Space size={16}>
        <span>{parent == 1 ? '数据趋势' : '数据列表' }</span>
        {parten == 1 &&  <Select options={opts} style={{width: 180}} value={type} onChange={(e) => setType(e)}></Select>}
      </Space>
      <Space size={16}>
      <DatePicker.RangePicker
              value={timeRanger} 
              format="YYYY-MM-DD" 
              onChange={changeTime}
              onCalendarChange={(time)=>{setDisableDate(time)}}
              onOpenChange={onOpenChange}
              disabledDate={disabledDate}
              ></DatePicker.RangePicker>
              {
              parten == 2 && <ExportExcel single={true} tb={tableRef} />
        }
              <Radio.Group defaultValue={parten}   buttonStyle="solid" onChange={changeRadio}>
                    <Radio.Button value={1}>趋势模式</Radio.Button>
                    <Radio.Button value={2}>列表模式</Radio.Button>
                  </Radio.Group>
      </Space>
    </Ctitle>
  )
  useEffect(() => { // 王建 时间选择框不按设计搞。跟趋势保持一致
        
    if(device&& Number.isInteger(parseInt(projectId)) && timeRanger?.every(t => t)) {
        console.log(timeRanger)
        const body ={
          
            projectId,
            sn: device.sn,
            start:  timeRanger?.[0]?.format("YYYY-MM-DD") + " 00:00:00",
            end: timeRanger?.[1]?.format("YYYY-MM-DD HH:mm:ss")

          }
      
        getTableData(body)
    }
  }, [device, projectId,timeRanger])
  return (
    <Titlelayout title={CSelect} layout="flex" pv="0" bordered="n" >
         { parten==1 ?  <Ichart {...lineOption} />
         :   ( <UseTable 
            style={{paddingTop: 16}}
              hbg="#ecf5ff"
             hbc="#515151"
            columns={columns} 
            sheetName={device?.name}
            bordered  
            dataSource={tabledata}
            scroll={{
              y: 500,
            }}
            ref={tableRef}
            ></UseTable>)
         }
    </Titlelayout>
  )
}
