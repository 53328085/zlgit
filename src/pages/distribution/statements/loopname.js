import React, {useRef,useState, useEffect} from 'react'
import {useOutletContext} from 'react-router-dom'
import Pagecount from '@com/pagecontent' 
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout'
import CustContext from '@com/content.js'
 import {useLocation, useNavigate} from 'react-router-dom'
import {Space, Typography, DatePicker} from 'antd'
import Ichart  from '@com/useEcharts/Ichart';
import UseTable from '@com/useTable'
import {isObject} from '@com/usehandler'
import {DistributionRoomRuntime} from '@api/api.js'
import moment from 'moment'
import {CustButtonT} from '@com/useButton'
const Loopmain = styled.div`
  display: grid;
  flex: 1;
  grid-template-rows: 305px 1fr;
  row-gap: 16px;
`
 
 
export default function Index({projectId}) {
    const [value, setvalue] = useState('1')
 
    const [tabledata,setTableData]=useState([])
    const [columns,setColumns] = useState([])
    const {setCustview, dateval} = useOutletContext() 
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const clocation = useLocation()
     
    const {search, state, pathname} = clocation || {}
    const sn = new URLSearchParams(search)?.get('sn')
    
    const tabs = [
        { key: '1', label: '电压' },
        { key: '2', label: '电流' },
        { key: '7', label: '功率因数' },
        { key: '4', label: '有功功率' },
        { key: '5', label: '无功功率' },
        { key: '6', label: '视在功率' },
        { key: '8', label: '总能耗' },
      ]
    let dataProps = {
        value,
        setvalue,
        tabs,
      }
      
     
      const params = useRef()
      const onRefresh =() => {
        if(!params.current) return
        getData(params.current)
        getTbdata(params.current)
      }
     const onBack=() => {
       navigate(pathname, {state})
     }
  const custview = (
   <div style={{flex:1,display: 'flex', justifyContent: "flex-end",paddingRight: '16px'}}>  
  <Space size={16}><CustButtonT text="refresh" onClick={onRefresh}  ghost />< CustButtonT text="back" onClick={onBack} /></Space>
  </div>
  )
  const [treand, setTreand] = useState({
    lineData: [],
    group: ''
  })
  const {lineData } = treand
  const getTbdata = async(body) => {
    try {
      setLoading(true)
      let {success, data} = await DistributionRoomRuntime.HistoryTableH(body)
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
        
    }finally{
      setLoading(false)
    }
  }
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

  useEffect(() => {
    
    if(!Number.isInteger(parseInt(projectId)) && !sn &&  dateval) return
  
         params.current ={
            projectId,
            sn: encodeURIComponent(sn),
            type: parseInt(value),
            start: dateval.startOf('day').format('yyyy-MM-DD HH:mm:ss'),
            end: dateval.endOf('day').format('yyyy-MM-DD HH:mm:ss')
         }
    getData(params.current)
    getTbdata(params.current)

  },[projectId, sn, value, dateval] )
 
  const points = useRef([])
 
  const lineOption ={   // 耗趋势图表
    series: Array(lineData?.length).fill({ type: "line",  seriesLayoutBy: 'row', stack: 'total' }),  
    grid: { 
      left: "0px",
      right: "0",
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
          points.current.push(point)
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
             return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
         },
         interval: "auto"
      },
    

    }
  }
 
  
  useEffect(() => {
    setCustview(custview)
    return () => {
        setCustview(null)
    }
  }, [])
 
 
  return (
   
    <CustContext.Provider value={dataProps} >
    <Pagecount>
    <Loopmain>
      <Ichart {...lineOption} />
      <UseTable columns={columns} dataSource={tabledata}  loading={loading}
       hbg="#ecf5ff"
       hbc="#515151"
       scroll={{
                    scrollToFirstRowOnChange: true, 
                     y: 550
                   }
                  }></UseTable>
      </Loopmain>
    </Pagecount>
   
   </CustContext.Provider>
     
    
   
  )
}
