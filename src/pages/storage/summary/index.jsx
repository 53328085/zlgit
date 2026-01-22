import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react'
import style from './style.module.less'
import { useNavigate, useOutletContext} from 'react-router-dom'
import {useSelector} from "react-redux"
import { SiteSummaryRuntime, StorageAlarmRuntime, SiteManagerDesigner } from '@api/api.js'
import { message, Typography,   Badge, Empty} from 'antd'
import Ichart  from '@com/useEcharts/Ichart'; 
import { range } from 'lodash'
import imgurl from './imgs'
import deep from './imgs/deep.svg'
import light from './imgs/light.svg'
import styled, {css} from 'styled-components'
 
import Pagecount from "@com/pagecontent";
 
import Titlelayout from "@com/titlelayout";
import Cempty from '@com/useEmpty'
import { themeColor } from '@redux/systemconfig.js'
import {Tabsbox} from "@com/comstyled"
import {Mainbox,Station } from "./style"
import {tabs} from './data'
import {Power} from "./comm"
const {Link, Paragraph, Text} = Typography
console.log(Power)
 
const CircleDiv = styled.div`
margin-top: 4px;
margin-right: 16px;
width: 16px;
height: 16px;
border: 1px solid ${props=>props.level===1?'#ff7070':props.level===2?'#ffb726':'#b07ef9'};
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
.warningPoint {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color:${props=>props.level===1?'#ff7070':props.level===2?'#ffb726':'#b07ef9'};
  }
`
const { querySiteInfo,
  queryStorageIncome,
  queryStorageWarning,
  queryTopologyDiagramInfo,
  queryChargeETrends } = SiteSummaryRuntime
export default function Index() {
   const [tabvalue, setTabvalue] = useState(1)
  let {exparams} = useOutletContext()
  
  let {areaId, stationName,  projectId} = exparams
  const title =useMemo(()=>{
    return `${stationName?.label}(${stationName?.value})`
  },[stationName])  
  
  let {islight} = useSelector(themeColor)
  
  const navigate = useNavigate()
  const [cardData, setCardData] = useState(null)//卡片数据
  const [warningData, setWarningData] = useState([])//最新告警
  const [topologyData, setTopologyData] = useState({
    loadDevice: {},
    onGridDevice: {},
    storageDevice: {}
  }) //接线图数据

  useEffect(() => {
    
    if(!(Number.isFinite(areaId) && Number.isFinite(projectId) && stationName?.value && isFinite(stationName?.value))) return
   
    querySiteInfo(projectId, areaId, stationName.value).then(res => {
      const {success, data} = res
      if (success && Object.prototype.toString.call(data).slice(8,-1)=="Object") {
        setCardData(res.data)
      } else {
        setCardData(null)
       //message.error(res.errMsg)
      }
    }).catch()

    queryStorageIncome(projectId,  areaId, stationName.value).then(res => {
      let { success, data } = res
      if (success) {
        if (Object.prototype.toString.call(data).slice(8, -1) === 'Object') {
          let {x, y, y1, y2} = data
        setOptions({...options,  dataset: {
            dimensions: [
              {
                name: 'x',
                type: 'time'
              },
              {
                name: 'y',
                displayName: '充电金额(元)'
              },
              {
                name: 'y1',
                displayName: '放电金额(元)'
              },
              {
               name: 'y2',
               displayName: '收益(元)'
             }
            ],
            source: [x, y, y1, y2],
            sourceHeader: false,
           },
          }
        )
        } else {
          setOptions({...options,  dataset: {
            dimensions: [],
             source: [],
            sourceHeader: false,
           },
          }
        )
        }
      } else {
        setOptions({...options,  dataset: {
          dimensions: [],
           source: [],
          sourceHeader: false,
         },
        }
      )
        message.error(res.errMsg)
      }
    }).catch

    queryStorageWarning(projectId,  areaId, stationName.value).then(res => {
      let { success, data } = res
      if (success) {
        if (data) {
          setWarningData(data)
        } else {
          setWarningData([])
        }
      } else {
        message.error(res.errMsg)
      }
    }).catch()

    queryTopologyDiagramInfo(projectId,  areaId, stationName.value).then(res => {
      if (res.success) {
        if (res.data) {
          setTopologyData(res.data)
        } else {
          setTopologyData({
            loadDevice: {},
            onGridDevice: {},
            storageDevice: {}
          })
        }
      } else {
        setTopologyData({
          loadDevice: {},
          onGridDevice: {},
          storageDevice: {}
        })
        //message.error(res.errMsg)
      }
    }).catch()


    queryChargeETrends(projectId,  areaId, stationName.value).then(res => {
      let {success, data} = res
      if (success) {
        if (Object.prototype.toString.call(data).slice(8,-1)=="Object") {
           let {x, y, y1} = data

           setLoptions({...loptions, dataset: {
            dimensions: [
              {
                name: 'x',
                type: 'time'
              },
              {
                name: 'y',
                displayName: '充电电量(kWh)'
              },
              {
                name: 'y1',
                displayName: '放电电量(kwh)'
              }
            ],
            source: [x, y, y1],
            sourceHeader: false,
           
           }})
        } else {
          setLoptions({...loptions, dataset: {
            dimensions: [],
            source: [],
            sourceHeader: false,
           
           }})
        }
      } else {
        setLoptions({...loptions, dataset: {
          dimensions: [],
          source: [],
          sourceHeader: false,
         
         }})
       // message.error(res.errMsg)
      }
    }).catch()


  }, [exparams])
 
  const Comm ={
    1: Power
  }[tabvalue]
 
 
  const WarningCard = props => {
    const mapobj = new Map([[1,{color:'#ff7070',text:'一级告警'}],[2,{color:'#ffb726',text:'二级告警'}],[3,{color:'#b07ef9',text:'三级告警'}]])
    return <div className={style.warningItem}>
      {/* <div className={style.leftImg}>
        <img src={warningPoint} className={style.warningPoint}></img>
      </div> */}
      <CircleDiv level={props.data?.level}>
        <div className='warningPoint'></div>
      </CircleDiv>
      <div className={style.warningData}>
        <div className={style.warningtop}>
     
            <span className={style.time}>{props.data.warningTime}</span>
            <span className={style.level} style={{ color:mapobj.get(props.data.level).color,fontSize:12 }}>{
                     mapobj.get(props.data.level).text
                    } </span>
        
        </div>
        <div style={{ fontSize: 12, color: '#6b6b6b', marginTop: 6,wordBreak: 'break-all' }} >{props.data.alarmEvent}</div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.name}</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b6b6b', marginTop: 6 }}>{props.data.address}</div>
      </div>
    </div>
  }
  const toPage = (key, label) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    })
  }
  const [domheight,setDomHeight] =useState(0)
  const [speed,setSpeed]=useState(0)
  useEffect(()=>{
    if(document.getElementById('warn')&&warningData.length>0){
      const warndom = document.getElementById('warn')
      setDomHeight(warndom.getBoundingClientRect().height)
      setSpeed(warndom.getBoundingClientRect().height/60)
    }
  },[warningData.length])
 
  const [options, setOptions] = useState({
    series: [{ type: "bar",  seriesLayoutBy: 'row' }, { type: "bar",  seriesLayoutBy: 'row' },  { type: "line", seriesLayoutBy: 'row' },],  
    grid: { 
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: 0,  
    },
    dataset: {}
  })
  const [loptions, setLoptions] = useState({
    series: [{ type: "line",  seriesLayoutBy: 'row' }, { type: "line",  seriesLayoutBy: 'row' }],  
    grid: { 
      left: "0px",
      right: "0",
      top: "30px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      icon: 'circle'
     },
    dataset: {}
  })
  const ontabChange = (e) => {
    setTabvalue(e)
    
  }
  return (
    <Pagecount  pd={0} bgcolor='transparent'  >
      <Mainbox>
        <div className="left">
        <Titlelayout title='站点接线图' pv="0" bgcolor="transparent" bg="transparent">
        <div className="topology">
          
         {
                       islight ? <img src={light} className="zhanwei"></img> :<img src={deep} className="zhanwei" ></img> 
                      } 
                       {/* 储能总表 */}
                       <div className='storageMeter'>
                         <div className='meterData'>
                           <span>电压:</span>
                           <span>{topologyData?.storageDevice.v}</span>
                           <span>(V)</span>
                         </div>
                         <div className='meterData'>
                           <span>电流:</span>
                           <span>{topologyData?.storageDevice.i}</span>
                           <span>(A)</span>
                         </div>
                         <div className='meterData'>
                           <span>功率:</span>
                           <span >{topologyData?.storageDevice.p}</span>
                           <span>(kW)</span>
                         </div>
                       </div>
                       {/*并网总表器*/}
                       <div className='transformer'>
                         <div className='meterData'>
                           <span >电压:</span>
                           <span>{topologyData?.onGridDevice.v}</span>
                           <span>(V)</span>
                         </div>
                         <div className='meterData'>
                           <span>电流:</span>
                           <span>{topologyData?.onGridDevice.i}</span>
                           <span>(A)</span>
                         </div>
                         <div className='meterData'>
                           <span>功率:</span>
                           <span>{topologyData?.onGridDevice.p}</span>
                           <span>(kW)</span>
                         </div>
                       </div>
                       {/*负载总表*/}
                       <div className='batterys'>
                         <div  className='meterData'>
                           <span>电压:</span>
                           <span>{topologyData?.loadDevice.v}</span>
                           <span>(V)</span>
                         </div>
                         <div  className='meterData'>
                           <span >电流:</span>
                           <span  >{topologyData?.loadDevice.i}</span>
                           <span >(A)</span>
                         </div>
                         <div  className='meterData'>
                           <span>功率:</span>
                           <span>{topologyData?.loadDevice.p}</span>
                           <span>(kW)</span>
                         </div>
                       </div>
                       <div className='batteryPlaceholder' onClick={() => toPage('BMSMonitor', 'BMS监控')}></div>
          
          
         
        </div>
        </Titlelayout>
        </div>
        <div className="right">
          <img src={imgurl["error"]}></img>
          <div className="rightup">
                  <Titlelayout title={title} layout="flex">
                    <Station>
                      <div className='imgbox'></div>
                    </Station>
                  </Titlelayout> 
                  <Titlelayout title='最新告警' extra={<Link underline onClick={() => toPage('alarmMessage', '告警信息')}>查看详情</Link>}></Titlelayout>     
          </div>
          <div className="rightdown">
            <Tabsbox defaultActiveKey={1} items={tabs} onChange={ontabChange} /> 
            <div className="chartbox">
                 <Comm /> 
              </div>
          </div>
        </div>
      </Mainbox>
    </Pagecount>
   
  )
}
