import React, {   useState, useEffect, useRef, useMemo } from 'react'
 
import { useNavigate, useOutletContext} from 'react-router-dom'
import {useSelector} from "react-redux"
import { SiteSummaryRuntime, StorageAlarmRuntime, SiteManagerDesigner } from '@api/api.js'
import { message, Typography,   Badge, Empty, Timeline, Carousel } from 'antd'
import Ichart  from '@com/useEcharts/Ichart'; 
 
import imgurl from './imgs'
import deep from './imgs/deep.svg'
import light from './imgs/light.svg'
 
import {isObject} from "@com/usehandler"
import Pagecount from "@com/pagecontent";
 
import Titlelayout from "@com/titlelayout";
import Cempty from '@com/useEmpty'
import { themeColor } from '@redux/systemconfig.js'
import {Tabsbox} from "@com/comstyled"
import {Mainbox,Station,CTimeline  } from "./style"
import {tabs} from './data'
import {Power, Income, Dischange} from "./comm"
import {useQuerySiteInfo,useQueryStorageWarning} from './api'
import {Paramscontext} from './context'
const {Link, Paragraph, Text} = Typography
 
 

const { querySiteInfo,
  queryStorageIncome,
  queryStorageWarning,
  queryTopologyDiagramInfo,
  queryChargeETrends } = SiteSummaryRuntime
export default function Index() {
   const [tabvalue, setTabvalue] = useState(1)
  let {exparams} = useOutletContext()
  
  let {areaId, stationName,  projectId} = exparams
  const [title,siteId] =useMemo(()=>{
    return [`${stationName?.label}(${stationName?.value})`,stationName?.value]
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
 const getsiteData =async () => { 
    try {
       let {data, success} = await  useQuerySiteInfo({siteId:9,projectId,areaId:5})
       if(success && isObject(data)) {
        setCardData(data)
       }else{
        setCardData({})
       }
    } catch (error) {
      
    }
  }
 const getwarningData = async () => { 
    try {
      let {data, success} = await  useQueryStorageWarning({siteId:1,projectId:1,areaId:1})
       if(success && Array.isArray(data)) {
        setWarningData(data)
       }else{
        setWarningData({})
       }
    } catch (error) {
      
    }

  }

  useEffect(() => {
    if([siteId,areaId, projectId].every(item => Number.isInteger(parseInt(item)))) {
      getsiteData()
      getwarningData()
    }
    
  }, [siteId,areaId, projectId])
  useEffect(() => {
    
    if(!(Number.isFinite(areaId) && Number.isFinite(projectId) && stationName?.value && isFinite(stationName?.value))) return
   
   

 
 

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


    

  }, [exparams])
 
  const Comm ={
    1: Power,
    2: Income,
    3: Dischange,

  }[tabvalue]
 
 
 
  const toPage = (key, label) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key }
    })
  }
 
 
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
          <div className="rightup">
                  <Titlelayout title={title} layout="flex" pv="16px">
                    <Station>
                      <div className='imgbox'>
                         <img src={cardData?.image} alt="" className='img' />
                      </div>
                      <div className="right">
                         <div className="part">
                           <div className='value'>{cardData?.storageCapacity}</div>
                           <div className='label'>安装容量(kWh)</div>
                         </div>
                         <div className="part">
                         <div className='value'>{cardData?.runtimeChargeP}</div>
                         <div className='label'>装机功率(kWh)</div>
                         </div>
                         <div className="info">
                         <div className='text'><Badge status="processing" /><div className='label'><span>地</span>址</div><span className='value'>{cardData?.address}</span></div>
                         <div className='text'><Badge status="processing" /><div className='label'>投运时间</div><span className='value'>{cardData?.useDate}</span></div>
                        
                         </div>
                      </div>
                    </Station>
                  </Titlelayout> 
                  <Titlelayout title='最新告警' extra={<Link underline onClick={() => toPage('alarmMessage', '告警信息')}>查看详情</Link>}  pv="16px 16px 0 16px"     layout="flex" >
 
                     <CTimeline>
                      <Carousel vertical={true} autoplay   style={{height: 168}} dots={false} >
                      {
                        warningData?.map((item, index) =>  <Timeline.Item key={item.sn} dot={<Badge status={{1: 'error', 1: 'warning', 2: 'default'}[item.level]}></Badge>} >
                           <div className="content">
                             <div className="title">
                              <div className='time'>{item?.warningTime?.slice?.(11)}</div>
                              <Typography.Paragraph ellipsis={{tooltip: item?.alarmEvent}} className="name">{item?.alarmEvent}</Typography.Paragraph>
                              <Typography.Text type={{1: 'danger', 1: 'warning', 2: 'secondary'}[item.level]} style={{marginLeft:"auto"}}>
                                {
                                new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec").format(item.level)
                                }级告警</Typography.Text>
                              </div>
                              <div className="des">{item?.name}</div>
                           </div>
                        </Timeline.Item>)
                      }
                      </Carousel>
                    </CTimeline>  
                  </Titlelayout>     
          </div>
          <div className="rightdown">
            <Tabsbox defaultActiveKey={1} items={tabs} onChange={ontabChange} /> 
            <div className="chartbox">
              <Paramscontext.Provider value={{areaId, stationName,  projectId}}>
                 <Comm    /> 
               </Paramscontext.Provider>
              </div>
          </div>
        </div>
      </Mainbox>
    </Pagecount>
   
  )
}
