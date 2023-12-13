import React, { useEffect, useState, useRef ,useMemo} from 'react'
import style from './style.module.less'
import { Select,message } from 'antd'
import Icard from './card'
import { drawEcharts } from '@com/useEcharts'

import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import UseHeader from '@com/useHeader'
import imgurl from './images/index.js'
import breaker from './images/breaker.png'
import { Monitoring } from '@api/api.js'
export default function Index() {
  const { Option } = Select
  const projectId = useSelector(selectProjectId)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName+'(全部)', id: 0 }, ...oneLevel]), [oneLevel]):[]
  const elref = useRef(null)
  const wlref = useRef(null)
  const glref = useRef(null)
  let [areaId, setAreaId] = useState(0)
  let [statistics, setStatistics] = useState({})
  let [status, setStatus] = useState({})
  let [eleConsumes,seteleConsumes]=useState([])
  let [waterConsumes,setwaterConsumes]=useState([])
  let [gasConsumes,setgasConsumes]=useState([])
  const { Runtime: { RuntimeStatistics, RuntimeStatus, RuntimeQueryMonthUsage } } = Monitoring
  const getData = () => {//设备统计
    return RuntimeStatistics({ projectId, areaId }).then(res => {
      let { success, data } = res
      if (success) {
        setStatistics(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const getStatusData = () => {//在线情况
    return RuntimeStatus({ projectId, areaId }).then(res => {
      let { success, data } = res
      if (success ) {
        setStatus(data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const getMonthUsage = (type) => {//月用量
    return RuntimeQueryMonthUsage({ projectId, areaId, type }).then(res => {
      let { success, data } = res
      if (success) {
        seteleConsumes(data?data.eleConsumes:[])
        setwaterConsumes(data?data.waterConsumes:[])
        setgasConsumes(data?data.gasConsumes:[])
        
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const datasetMonth = {
    dimensions: ["name", "value"],
    source:eleConsumes?eleConsumes:[] ,
  };
  const datasetMonthW = {
    dimensions: ["name", "value"],
    source:waterConsumes?waterConsumes:[] ,
  };
  const datasetMonthG = {
    dimensions: ["name", "value"],
    source:gasConsumes?gasConsumes:[] ,
  };
  const grid = {
    // 图表 grid
    left: "0px",
    right: "10px",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  }
  useEffect(() => {
    console.log(areaId)
    if(Number.isFinite(areaId)){
      getData()
    getStatusData()
    }
  }, [areaId,projectId])
  useEffect(() => {
    if(Number.isFinite(areaId)){
      getMonthUsage(1)
    }
  }, [areaId,eleConsumes.length,projectId])
  let date=new Date()
  let days=date.getDate()
const charts=()=>{
  drawEcharts(elref.current, {
    dataset: datasetMonth,
    series: [{ type: "line" ,name:'用电量(kWh)'}],
    grid,
    legend: {
      icon: 'rect',
      itemHeight: 8,
      itemWidth: 8,
      itemGap: 20
    },
    xAxis:
      {
        axisLabel:{
         
        },
      }
    ,
   
    dataZoom:{
      type: 'inside',
      // start: days>15?'50':'0',
      // end: days>15?'100':'50',
    }
  })
  drawEcharts(wlref.current, {
    dataset: datasetMonthW,
    series: [{ type: "line" ,name:'用水量(m³)'}],
    grid,
    legend: {
      icon: 'rect',
      itemHeight: 8,
      itemWidth: 8,
      itemGap: 20
    },
    xAxis:
      {
        axisLabel:{
         
        },
      }
    ,
    dataZoom:{
      type: 'inside',
      // start: days>15?'50':'0',
      // end: days>15?'100':'50',
    }
  })
  drawEcharts(glref.current, {
    dataset: datasetMonthG,
    series: [{ type: "line" ,name:'用气量(m³)'}],
    grid,
    xAxis:
      {
        axisLabel:{
         
        },
      }
    ,
    legend: {
      icon: 'rect',
      itemHeight: 8,
      itemWidth: 8,
      itemGap: 20
    },
    dataZoom:{
      type: 'inside',
      // start: days>15?'50':'0',
      // end: days>15?'100':'50',
    }
  })
}
useEffect(() => {
  charts()
}, [eleConsumes, waterConsumes, gasConsumes])
  const headerProps = {
    isEnergy: false,//能耗类型
    isDate: false,//日期
    isShift: false,//班次
    isTab: false,//能耗、费用radioButton
    isSearch: false,//查询按钮
    isExport: false,//导出按钮
    allarea:areaOptions
    //export: exportData //导出调用方法
  }
  const getFromChild = data => {
    console.log(data.areaId)//园区id
    if(data.areaId==undefined){
      return
    }else{
      setAreaId(data.areaId)
    }
  }
  return (
    <div>
      <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
      <div className={style.cardList}>
        <Icard img={imgurl.device} title={'设备总数'} value={statistics.deviceCount} />
        <Icard img={imgurl.chuan} title={'传感器数量'} value={statistics.sensorCount} />
        <Icard img={imgurl.bian} title={'变压器数量'} value={statistics.transformerCount} />
        <Icard img={imgurl.monitor} title={'监控数量'} value={statistics.monitorCount}
          isShow={true} on={'云监控'} off={'本地监控'} per={''} onValue={statistics.onlineMonitorCount}
          offValue={statistics.localMonitorCount} />
        <Icard img={imgurl.gateway} title={'网关'} value={status.gatewayCount}
          isShow={true} on={'网关在线'} off={'网关离线'} per={'在线率'} onValue={status.gatewayOnlineCount}
          offValue={status.gatewayOfflineCount} perValue={status.gatewayOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" />
        <Icard img={imgurl.ele} title={'电表'} value={status.electricMeterCount}
          isShow={true} on={'电表在线'} off={'电表离线'} per={'电表告警'} onValue={status.electricMeterOnlineCount}
          offValue={status.electricMeterOfflineCount} perValue={status.electricMeterAlarmCount} isRed={true} isGreen={true} isredE={true}  />
        <Icard img={imgurl.water} title={'水表'} value={status.waterMeterCount}
          isShow={true} on={'水表在线'} off={'水表离线'} per={'在线率'} onValue={status.waterMeterOnlineCount}
          offValue={status.waterMeterOfflineCount} perValue={status.waterMeterOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" />
          <Icard img={breaker} title={'断路器'} value={status.breakerCount}
          isShow={true} on={'断路器在线'} off={'断路器离线'} per={'在线率'} onValue={status.breakerOnlineCount}
          offValue={status.breakerOfflineCount} perValue={status.breakerOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" />
      {/*   <Icard img={imgurl.gas} title={'燃气表'} value={status.gasCount}
          isShow={true} on={'燃气表在线'} off={'燃气表离线'} per={'在线率'} onValue={status.gasOnlineCount}
          offValue={status.gasOfflineCount} perValue={status.gasOnlineRate} isRed={true} isGreen={true} isredE={false} after="%" /> */}
      </div>
      <div className={style.content}>
        <div className={style.contentLeft}>
          <h4 className={style.pieTitle}>月度用电量（kWh）</h4>
          <div ref={elref} style={{flex: 1, padding: 16 }}></div>
        </div>
        <div className={style.contentLeft}>
          <h4 className={style.pieTitle}>月度用水量（m³）</h4>
          <div ref={wlref} style={{ flex: 1, padding: 16 }}></div>
        </div>
      {/*   <div className={style.contentLeft}>
          <h4 className={style.pieTitle}>月度用气量（m³）</h4>
          <div ref={glref} style={{ width: 548, height: 446, padding: 16 }}></div>
        </div> */}
      </div>
    </div>
  )
}
