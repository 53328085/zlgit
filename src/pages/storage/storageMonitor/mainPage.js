import React, {useEffect, useState, Fragment} from 'react'
import style from './style.module.less'
import { message } from 'antd'
import * as echarts from 'echarts'
import topology from './imgs/topology_zhanwei.png'
import warningPoint from './imgs/warningPoint.png'
import { useNavigate } from 'react-router-dom'
import {BMSRuntime} from '@api/api.js'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'

export default function Index(props) {
  const { querySOCTrends, 
    queryVTrends, 
    queryITrends, 
    queryBMSInfo, 
    queryEnvironmentInfo, 
    queryBMSAlarms } = BMSRuntime
  const projectId = useSelector(selectProjectId)
  const navigate = useNavigate()
  const voltageData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[732.25, 758.32, 721.39, 701.54, 723.45, 720.15, 718.96, 728.36, 714.32, 701.36, 704.96, 724.36, 718.32 ]
  }
  const currentData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[9.84, 9.15, 9.98, 10.25, 10.01, 10, 9.87, 9.98, 9.99, 9.84, 9.15, 9.98, 10.25]
  }
  const SOCData = {
    x:["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", ],
    y:[25, 32, 39, 54, 45, 15, 66, 36, 32, 36, 43, 36, 32 ]
  }
  const config = (lineId, color, Unit, lineData)=> {
    let chart = echarts.init(document.getElementById(lineId));
    chart.setOption({
      color:[color],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '0',
        left: 'center'
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick:{
          alignWithLabel:true
        },
        data: lineData.x
      },
      yAxis: {
        type: 'value',
        // min: 24
        scale: true, //自适应
      },
      series: [
        {
          name: Unit,
          data: lineData.y,
          type: 'line',
          symbol:'none', 
          smooth: true,
          areaStyle: {}
        }
      ]
    })
  }

  //自定义电池样式
  const CustomBattery = props => {
    return <div className={style.customBattery}>
      <div className={style.batteryTop}></div>
      <div className={style.batteryBody}>
        <div className={style.progress} style={{ height: props.value, backgroundColor: props.color}}></div>
        <span>{props.name}</span>
        <span>{props.value}</span>
      </div>
    </div>
  }

  const WarningCard = props => {
    return <div className={style.warningItem}>
      <div className={style.leftImg}>
        <img src={warningPoint} className={style.warningPoint}></img>
      </div>
      <div className={style.warningData}>
        <div className={style.warningtop}>
          <span className={style.time}>{props.data.warningTime}</span>
          <span className={style.sn}>{props.data.sn}</span>
        </div>
        <div className={style.warningbottom}>
          <span className={style.description}>{props.data.content}</span>
          <span className={style.level}>{props.data.level }</span>
        </div>
      </div>
    </div>
  }
  const toWarning = () => {
    navigate('/index/runtimeStorage/alarmMessage',{
      state: { type: 'index', primary: 'runtimeStorage', title: '告警信息',  nested: 'alarmMessage' } 
    })
  }
  const toBattery =() => {
    props.getshowTab({
      pageName:'batteryPage',
      batteryPackId:1,
      batteryPackName: '电池包1_1'
    })
  }

  const [warningData, setWarningData] = useState([])//告警信息
  const [environmentData, setEnvironmentData] = useState({})
  const [bmsInfo, setBmsInfo] = useState({})
  const getContent = () => {
    let { areaId, bcId } = props.headerValues
    //soc
    querySOCTrends(projectId, areaId, bcId).then(res => {
      if(res.success){
        if(res.data){
          config('totalSOC', '#1ba41b','SOC (%)', res.data)
        }else{
          config('totalSOC', '#1ba41b','SOC (%)', SOCData)
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //电压趋势
    queryVTrends(projectId, areaId, bcId).then(res => {
      if(res.success){
        if(res.data){
          config('totalVoltage', '#237ae4','总电压 (V)', res.data)
        }else{
          config('totalVoltage', '#237ae4','总电压 (V)', voltageData)
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //电流趋势
    queryITrends(projectId, areaId, bcId).then(res => {
      if(res.success){
        if(res.data){
          config('totalCurrent', '#ff6701','总电流 (A)', res.data)
        }else{
          config('totalCurrent', '#ff6701','总电流 (A)', currentData)
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //储能系统
    queryBMSInfo(projectId, areaId, bcId).then(res => {
      let {success, data} = res
      if(success){
        if(data){
          setBmsInfo({
            name: props.bmsName,
            ...data
          })
        }else{
          setBmsInfo({})
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //告警信息
    queryBMSAlarms(projectId, areaId, bcId).then(res => {
      let {success, data} = res 
      if(success){
        if(data){
          setWarningData(data)
        }else{
          setWarningData([])
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //环境监控
    queryEnvironmentInfo(projectId, areaId, bcId).then(res => {
      let {success, data} = res
      if(success){
        if(data){
          setEnvironmentData(data)
        }else{
          setEnvironmentData({})
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }

  useEffect(()=>{
    if(props.headerValues){
      getContent()
    }
  },[props.headerValues])
  return (
    <div>
      <div className={style.bmsContent}>
        <div className={style.left}>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>SOC ($)</div>
            <div className={style.cardChart} id='totalSOC'></div>
          </div>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>总电压 (V)</div>
            <div className={style.cardChart} id='totalVoltage'></div>
          </div>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>总电流 (A)</div>
            <div className={style.cardChart} id='totalCurrent'></div>
          </div>
        </div>
        <div className={style.middle}>
          <img src={topology} className={style.zhanwei}></img>
          <div style={{position:'absolute', left: 140, top: 102}}>
            <CustomBattery name={'SOC'} value={ bmsInfo.soc + '%'} color="#0c6"></CustomBattery>
          </div> 
          <div style={{position:'absolute', left: 196, top: 102}}>
            <CustomBattery name={'SOH'} value={bmsInfo.soh + '%'} color="#06c"></CustomBattery>
          </div>
          <div className={style.bmsData}>
            <div className={style.bmsName}>{bmsInfo.bmsName}</div>
            <div className={style.bmsStatus}>{bmsInfo.status}</div>
            <div className={style.bmsTitle}>
              <span>日充电量(kWh)</span>
              <span>日放电量(kWh)</span>
            </div>
            <div className={style.bmsTitle}>
              <span style={{backgroundColor:'#039'}}>{bmsInfo.chargingE}</span>
              <span style={{backgroundColor:'#039'}}>{ bmsInfo.disChargingE }</span>
            </div>
            <div className={style.bmsTitle}>
              <span>累计充电量(kWh)</span>
              <span>累计放电量(kWh)</span>
            </div>
            <div className={style.bmsTitle}>
              <span style={{backgroundColor:'#039'}}>{bmsInfo.accumulateChargingE}</span>
              <span style={{backgroundColor:'#039'}}>{ bmsInfo.accumulateDisChargingE }</span>
            </div>
          </div>   
          <div className={style.clickDiv} onClick={toBattery}></div>
        </div>
        <div className={style.right}>
          <div className={style.environment} style={{height: 503}}>
                <div className={style.cardTitle}>环境监控</div>
                <div className={style.item} style={{borderColor:'#237ae4'}}>
                    <div className={style.itemName} style={{backgroundColor:'#237ae4'}}>空调监控</div>
                    <div className={style.temData}>
                        <div className={style.tem} style={{color:'#237ae4'}}>
                            <span>温度</span>
                            <div>
                                <span style={{fontSize:24}}>{ environmentData.temp }</span>
                                <span style={{fontSize:14, marginLeft: 8}}>℃</span>
                            </div>
                        </div>
                        <div className={style.separate}></div>
                        <div className={style.tem} style={{color:'#237ae4'}}>
                            <span>湿度</span>
                            <div>
                                <span style={{fontSize:24}}>{ environmentData.humidity }</span>
                                <span style={{fontSize:14, marginLeft: 8}}>%</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.itemData} style={{height:'28px', lineHeight:'28px'}}>
                        <span style={{color:'#999'}}>{environmentData?.airInformTime}</span>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.itemName} style={{backgroundColor:'#093'}}>烟感监控</div>
                    <div className={style.itemData} style={{color:'#237ae4'}}>
                        <span>{ environmentData.somkeInformTime }</span>
                        <span style={{marginLeft:16}}>{ environmentData.smokeDetectorWarning }</span>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.itemName} style={{backgroundColor:'#093'}}>水浸监控</div>
                    <div className={style.itemData} style={{color:'#237ae4'}}>
                        <span>{ environmentData.waterOutInformTime }</span>
                        <span style={{marginLeft:16}}>{ environmentData.waterOutWarning }</span>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.itemName} style={{backgroundColor:'#093'}}>灭火器监控</div>
                    <div className={style.itemData} style={{color:'#237ae4'}}>
                        <span>{ environmentData.fireInformTime }</span>
                        <span style={{marginLeft:16}}>{ environmentData.fireWarning }</span>
                    </div>
                </div>
                <div className={style.item}>
                    <div className={style.itemName} style={{backgroundColor:'#f33'}}>门禁监控</div>
                    <div className={style.itemData} style={{color:'#f33'}}>
                        <span>{ environmentData.doorInformTime }</span>
                        <span style={{marginLeft:16}}>{ environmentData.doorStatus }</span>
                    </div>
                </div>
            </div>
          <div className={style.newWarning}>
          <div className={style.cardTitle}>告警信息</div>
            <span className={style.toWarning} onClick={()=>toWarning()}>查看详情</span>
            <div className={style.warningDetails}>
              {warningData.map((item, index) => {
                return <Fragment key={index}>
                  <WarningCard data={item} ></WarningCard>
                </Fragment>
              } )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
