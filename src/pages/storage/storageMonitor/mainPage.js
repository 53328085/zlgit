import React, { useEffect, useState, Fragment, useRef } from 'react'
import style from './style.module.less'
import styled from 'styled-components'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { message } from 'antd'
import * as echarts from 'echarts'
import { useNavigate } from 'react-router-dom'
import { StorageMonitorRuntime } from '@api/api.js'
import { useSelector } from 'react-redux'
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
  const TransDiv = styled.div`
  animation: movetop ${props => {return props.speed}}s infinite linear;
 
  &:hover{
    animation-play-state: paused;
  }

  @keyframes movetop{
    from{
        transform: translateY(0);
    }
    to{
        transform: translateY(-${props =>{
          console.log(props.dmheight)
          if(!props.dmheight || props.dmheight<210)return 0
          if(props.dmheight){
            return props.dmheight+16
          }
         } }px );
    }
}
`
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
flex-shrink: 0;
.warningPoint {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color:${props=>props.level===1?'#ff7070':props.level===2?'#ffb726':'#b07ef9'};
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

  const config = (lineId, color, Unit, lineData) => {
    let chart = echarts.init(lineId);
    chart.setOption({
      color: [color],
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
        axisTick: {
          alignWithLabel: true
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
          symbol: 'none',
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
        <div className={style.progress} style={{ height: (props.value / 10) + '%', backgroundColor: props.color }}></div>
        <span>{props.name}</span>
        <span>{props.value + '‰'}</span>
      </div>
    </div>
  }

  const Progress = props => {
    let value = props.value
    let length = 0
    if (value == '' || value == '/') {
      length = 0
    } else {
      length = value 
    }
    return (
      <div style={{ position: 'relative', marginBottom: 8, width: 138, height: 24, background: '#2b2b2b', border: "1px solid rgb(153, 153, 153)", borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', zIndex: 0, left: -1, top: -1, width: length + '%', height: 24, background: props.color, border: "1px solid rgb(228, 228, 228)", borderRadius: 2, borderRight: 'none' }}></div>
        <span style={{ zIndex: 1, color: '#fff' }}>{props.title + '    ' + props.value + '%'}</span>
      </div>
    )
  }

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
          // props.data.level===1?'一级告警':props.data.level===2?'二级告警':props.data.level===3?'三级告警':null
          }
          </span>
       
        </div>
        <div>
            <div style={{fontSize:12,color:'#6b6b6b'}} >
              {props.data.address}
            </div>
            <div className={style.warningbottom}>
                <span className={style.description} style={{wordBreak: 'break-all'}}>{props.data.alarmEvent}</span>
            </div>
        </div>
       
        
      </div>
    </div>
  }
  const toWarning = () => {
    navigate('/index/runtimeStorage/alarmMessage', {
      state: { type: 'index', primary: 'runtimeStorage', title: '告警信息', nested: 'alarmMessage' }
    })
  }
  const toBattery = (item) => {
    props.getshowTab({
      pageName: 'batteryPage',
      batteryCluster: item,
    })
  }

  const [stateData, setStateData] = useState({})
  const [warningData, setWarningData] = useState([])//告警信息
  const [bmsInfo, setBmsInfo] = useState({
    batteryClusterInfos: []
  })
  const getTopology = () => {
    console.log(props)
    let { areaId, stackId } = props.headerValues
    //电池堆信息
    queryBatteryStackInfo(projectId, stackId).then(res => {
      let { success, data } = res
      if (success) {
        if (data) {
          setStateData({
            ...data
          })
        } else {
          setStateData({})
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const getContent = () => {
    let { areaId, stackId } = props.headerValues
    //soc
    querySOCTrends(projectId, stackId).then(res => {
      if (res.success) {
        if (res.data) {
          config(socRef.current, '#1ba41b', 'SOC (%)', res.data)
        } else {
          config(socRef.current, '#1ba41b', 'SOC (%)', { x: [], y: [] })
        }
      } else {
        message.error(res.errMsg)
      }
    })
    //电压趋势
    queryVTrends(projectId, stackId).then(res => {
      if (res.success) {
        if (res.data) {
          config(volRef.current, '#237ae4', '总电压 (V)', res.data)
        } else {
          config(volRef.current, '#237ae4', '总电压 (V)', { x: [], y: [] })
        }
      } else {
        message.error(res.errMsg)
      }
    })
    //电流趋势
    queryITrends(projectId, stackId).then(res => {
      if (res.success) {
        if (res.data) {
          config(currRef.current, '#ff6701', '总电流 (A)', res.data)
        } else {
          config(currRef.current, '#ff6701', '总电流 (A)', { x: [], y: [] })
        }
      } else {
        message.error(res.errMsg)
      }
    })
    //电池堆
    queryBatteryStackStatus(projectId, stackId).then(res => {
      let { success, data } = res
      if (success) {
        if (data) {
          setBmsInfo({
            name: props.headerValues.bmsName,
            ...data
          })
        } else {
          setBmsInfo({
            batteryPackInfos: []
          })
        }
      } else {
        message.error(res.errMsg)
      }
    })
    //告警信息
    queryBatteryStackAlarms(projectId, stackId).then(res => {
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
    })
  }

  const [count, setCount] = useState(0)
  const translateRight = () => {
    if ((count) <= 0) return;
    setCount(count - 1)
  }
  const translateLeft = () => {
    if ((count + 3) >= bmsInfo.batteryPackInfos.length) return;
    setCount(count + 1)
  }

  useEffect(() => {
    if (props.headerValues) {
      getContent()
      getTopology()
    }
  }, [props.headerValues])
  const [domheight,setDomHeight] =useState(0)
  const [speed,setSpeed]=useState(0)
  useEffect(()=>{
    if(document.getElementById('warn')&&warningData.length>0){
      const warndom = document.getElementById('warn')
      console.log(warndom.getBoundingClientRect())
      setDomHeight(warndom.getBoundingClientRect().height)
      setSpeed(warndom.getBoundingClientRect().height/60)
    }
  },[warningData.length])
  return (
    <div>
      <div className={style.bmsContent}>
        <div className={style.left}>
          <div className={style.leftCard}>
            <div className={style.cardTitle}>SOC (%)</div>
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
          <div className={style.deviceImg}>
            <div className={style.deviceName}>{bmsInfo.batteryStackName}</div>
            <div className={style.deviceData}>
              <div className={style.leftUp}></div>
              <div className={style.rightUp}></div>
              <div className={style.bottomItem}>
                <div className={style.stackStatus}>{bmsInfo.status}</div>
                <div className={style.stackStatus}>{bmsInfo.chargeStatus}</div>
                <Progress title={'SOC'} value={bmsInfo.soc} color={'#060'}></Progress>
                <Progress title={'SOH'} value={bmsInfo.soh} color={'#06f'}></Progress>
              </div>
            </div>
          </div>
          <div className={style.rightButton} onClick={() => translateLeft()}>
            <CaretRightOutlined />
          </div>
          <div className={style.leftButton} onClick={() => translateRight()}>
            <CaretLeftOutlined />
          </div>
          <div className={style.batteryPack}>

            <div className={style.transLate} style={{ width: (parseInt(bmsInfo.batteryClusterInfos.length / 3) + 1) * 100 + '%', left: (-(count * 277) + 55) }}>
              {bmsInfo.batteryClusterInfos.map((item, index) => {
                return <BatteryPack data={item} key={index} toBattery={() => toBattery(item)}></BatteryPack>
              })}
            </div>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.environment} style={{ height: 512 }}>
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
            <span className={style.toWarning} onClick={() => toWarning()}>查看详情</span>
            <div className={style.warningDetails} style={{ overflow: domheight<210?'auto':'hidden'}}>
              <TransDiv dmheight={domheight} speed={speed} >
                <div id='warn'>
                  {warningData.map((item, index) => {
                    return <Fragment key={index}>
                      <WarningCard data={item} ></WarningCard>
                    </Fragment>
                  })}     
                </div>
                {
                  domheight > 210 ? (<div style={{ height: 207, overflow: 'hidden', }}>
                    {warningData.map((item, index) => {
                      return <Fragment key={index}>
                        <WarningCard data={item} ></WarningCard>
                      </Fragment>
                    })}
                  </div>) : null

                }
               
              </TransDiv>   
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
