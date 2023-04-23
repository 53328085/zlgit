import React, {useEffect, useState, Fragment, useRef} from 'react'
import style from './style.module.less'
import styled from 'styled-components'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { message } from 'antd'
import * as echarts from 'echarts'
import { useNavigate } from 'react-router-dom'
import {StorageMonitorRuntime} from '@api/api.js'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import BatteryPack from './batteryPack'
import topology from './imgs/topology_zhanwei.png'
import warningPoint from './imgs/warningPoint.png'
import device from './imgs/device.png'
import envirTitle from './imgs/envirTitle.png'
import envirValue from './imgs/envirValue.png'

export default function Index(props) {
  const EnvirBox = styled.div`
    margin-top: 16px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 260px;
    font-size: 14px;
    color: #fff;
    .titleBox{
      width: 142px;
      height: 36px;
      background-image: url(${envirTitle});
      background-size: 100% 100%;
      background-repeat: no-repeat;
      line-height: 36px;
      padding-left: 12px;
    }
    .valueBox{
      width: 114px;
      height: 36px;
      background-image: url(${envirValue});
      background-size: 100% 100%;
      background-repeat: no-repeat;
      line-height: 36px;
      padding-left: 12px;
    }
  `
  const socRef = useRef()
  const volRef = useRef()
  const currRef = useRef()
  const { querySOCTrends, 
    queryVTrends, 
    queryITrends, 
    queryBatteryStackInfo, 
    queryBatteryStackAlarms,
    queryBatteryStackStatus } = StorageMonitorRuntime
  const projectId = useSelector(selectProjectId)
  const navigate = useNavigate()

  const config = (lineId, color, Unit, lineData)=> {
    let chart = echarts.init(lineId);
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
        <div className={style.progress} style={{ height: (props.value / 10) + '%', backgroundColor: props.color}}></div>
        <span>{props.name}</span>
        <span>{props.value + '‰'}</span>
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
          {/* <span className={style.sn}>{props.data.sn}</span> */}
        </div>
        <div className={style.warningbottom}>
          <span className={style.description}>{props.data.content}</span>
          <span className={style.level} style={{color:'#c00'}}>{props.data.level }</span>
        </div>
      </div>
    </div>
  }
  const toWarning = () => {
    navigate('/index/runtimeStorage/alarmMessage',{
      state: { type: 'index', primary: 'runtimeStorage', title: '告警信息',  nested: 'alarmMessage' } 
    })
  }
  const toBattery =(item) => {
    props.getshowTab({
      pageName:'batteryPage',
      batteryCluster:item,
    })
  }

  const [stateData, setStateData] = useState({})
  const [warningData, setWarningData] = useState([])//告警信息
  const [bmsInfo, setBmsInfo] = useState({
    batteryPackInfos:[]
  })
  const getTopology = () => {
    console.log(props)
    let { areaId, stackId } = props.headerValues
    //电池堆信息
    queryBatteryStackInfo(projectId, stackId).then(res => {
      let {success, data} = res
      if(success){
        if(data){
          setStateData({
            ...data
          })
        }else{
          setStateData({})
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const getContent = () => {
    let { areaId, stackId } = props.headerValues
    //soc
    querySOCTrends(projectId, stackId).then(res => {
      if(res.success){
        if(res.data){
          config( socRef.current, '#1ba41b','SOC (‰)', res.data)
        }else{
          config( socRef.current, '#1ba41b','SOC (‰)', {x:[],y:[]})
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //电压趋势
    queryVTrends(projectId, stackId).then(res => {
      if(res.success){
        if(res.data){
          config(volRef.current, '#237ae4','总电压 (V)', res.data)
        }else{
          config(volRef.current, '#237ae4','总电压 (V)', {x:[],y:[]})
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //电流趋势
    queryITrends(projectId, stackId).then(res => {
      if(res.success){
        if(res.data){
          config(currRef.current, '#ff6701','总电流 (A)', res.data)
        }else{
          config(currRef.current, '#ff6701','总电流 (A)', {x:[],y:[]})
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //电池堆
    queryBatteryStackStatus(projectId, stackId).then(res => {
      let {success, data} = res 
      if(success){
        if(data){
          setBmsInfo({
            name: props.headerValues.bmsName,
            ...data
          })
        }else{
          setBmsInfo({
            batteryPackInfos:[]
          })
        }
      }else{
        message.error(res.errMsg)
      }
    })
    //告警信息
    queryBatteryStackAlarms(projectId, stackId).then(res => {
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
  }

  const [count, setCount] = useState(0)
  const translateRight = () => {
    if((count)<= 0) return;
    setCount(count - 1)
  }
  const translateLeft = () => {
    if((count + 3)>= bmsInfo.batteryPackInfos.length) return;
    setCount(count + 1)
  }

  useEffect(()=>{
    if(props.headerValues){
      getContent()
      getTopology()
      // const timer = setInterval(()=> {
      //   getTopology()
      // }, 60000);
      // return ()=> clearInterval(timer)
    }
  },[props.headerValues])
  return (
    <div>
      <div className={style.bmsContent}>
        <div className={style.left}>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>SOC (‰)</div>
            <div className={style.cardChart} id='totalSOC' ref={socRef}></div>
          </div>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>总电压 (V)</div>
            <div className={style.cardChart} id='totalVoltage' ref={volRef}></div>
          </div>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>总电流 (A)</div>
            <div className={style.currTip}>充电电流为负值； 放电为正</div>
            <div className={style.cardChart} id='totalCurrent' ref={currRef}></div>
          </div>
        </div>
        <div className={style.middle}>
          <img src={topology} className={style.zhanwei}></img>
          <div className={style.middletitle}>电池堆状态</div>
          <div style={{position:'absolute', left: 255, top: 91}}>
            <CustomBattery name={'SOC'} value={ bmsInfo.soc ? bmsInfo.soc  + '' :'0.00' } color="#0c6"></CustomBattery>
          </div> 
          <div style={{position:'absolute', left: 311, top: 91}}>
            <CustomBattery name={'SOH'} value={bmsInfo.soh ? bmsInfo.soh  + '' :'0.00'} color="#06c"></CustomBattery>
          </div>
          <div className={style.deviceImg}>
            <div className={style.deviceName}>{bmsInfo.batteryStackName}</div>
            <img src={device} style={{width: 148, height: 148}}></img>
          </div>
          <div className={style.bmsData}>
            <div className={style.bmsStatus}>{bmsInfo.status}</div>
            <div className={style.bmsStatus}>{bmsInfo.chargeStatus }</div>
          </div>
          <div className={style.rightButton} onClick={()=>translateLeft()}>
              <CaretRightOutlined />
            </div>
            <div className={style.leftButton} onClick={()=>translateRight()}>
              <CaretLeftOutlined />
            </div>
          <div className={style.batteryPack}>
            
            <div className={style.transLate} style={{ width: (parseInt(bmsInfo.batteryPackInfos.length / 3) + 1) * 100 + '%', left: (-(count * 277) + 55)}}>
              {bmsInfo.batteryPackInfos.map((item, index) => {
                return <BatteryPack data={item} key={index} toBattery={()=>toBattery(item)}></BatteryPack>
              })}
            </div>
          </div>   
        </div>
        <div className={style.right}>
          <div className={style.environment} style={{height: 512}}>
                <div className={style.cardTitle}>电池堆</div>
                <EnvirBox>
                  <div className='titleBox'>总电压 (V)</div><div className='valueBox'>{stateData.v}</div>
                  <div className='titleBox'>总电流 (A)</div><div className='valueBox'>{stateData.i}</div>
                  <div className='titleBox'>绝缘值 (KΩ)</div><div className='valueBox'>{stateData.insulationValue}</div>
                  <div className='titleBox'>可充电量 (kWh)</div><div className='valueBox'>{stateData.canChargingE}</div>
                  <div className='titleBox'>可放电量 (kWh)</div><div className='valueBox'>{stateData.canDisChargingE}</div>
                  <div className='titleBox'>剩余电量 (kWh)</div><div className='valueBox'>{stateData.surplusE}</div>
                  <div className='titleBox'>最高电池电压 (V)</div><div className='valueBox'>{stateData.maxBatteryV}</div>
                  <div className='titleBox'>最低电池电压 (V)</div><div className='valueBox'>{stateData.minBatteryV}</div>
                  <div className='titleBox'>平均电压 (V)</div><div className='valueBox'>{stateData.avgV}</div>
                  <div className='titleBox'>最高电池温度 (℃)</div><div className='valueBox'>{stateData.maxBatteryTemp}</div>
                  <div className='titleBox'>最低电池温度 (℃)</div><div className='valueBox'>{stateData.minBatteryTemp}</div>
                  <div className='titleBox'>平均温度 (℃)</div><div className='valueBox'>{stateData.avgBatteryTemp}</div>
                </EnvirBox>
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
