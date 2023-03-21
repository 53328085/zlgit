import React,{Fragment, useState}from 'react'
import style from './style.module.less'
import { useNavigate } from 'react-router-dom'
import UseHeader from '@com/useHeader'
import { StorageSummaryRuntime, StorageAlarmRuntime } from '@api/api.js'
import { message } from 'antd'

import BarChart from './barChart'
import LineChart from './lineChart'
import zhanwei from './imgs/zhanwei.png'
import warningPoint from '@imgs/warningPoint.png'

export default function Index() {
  const { statistic, 
    queryEchartsInfo, 
    queryPowerTrends, 
    queryTopologyDiagramInfo, 
    queryRealtimeData } = StorageSummaryRuntime
  const { alarmStatistic } = StorageAlarmRuntime
  const navigate = useNavigate()
  const [cardData, setCardData] = useState({})//卡片数据
  const [barData, setBarData] = useState({}) //收益统计
  const [powerData, setPowerData] = useState({}) //实时功率
  const [realData, setRealData] = useState({})//实时状态
  const getFromHeader = values => {
    let { projectId, areaId } = values
    statistic(projectId, areaId).then(res => {
      if(res.success){
        setCardData(res.data)
      }else{
        message.error(res.errMsg)
      }
    })

    queryEchartsInfo(projectId, areaId).then(res => {
      let {success, data} = res
      if(success) {
        if(data){
          let x= [];
          let y = [];
          data.map((item, index) => {
            x.push(item.name)
            y.push(item.value)
          })
          setBarData({
            x,
            y
          })
        }else{
          setBarData({
            x:[],
            y:[]
          })
        }
      }else{
        message.error(res.errMsg)
      }
    })

    queryPowerTrends(projectId, areaId).then(res => {
      let {success, data} = res
      if(success) {
        if(data){
          let x= [];
          let y = [];
          data.map((item, index) => {
            x.push(item.name)
            y.push(item.value)
          })
          setPowerData({
            x,
            y
          })
        }else{
          setPowerData({
            x:[],
            y:[]
          })
        }
      }else{
        message.error(res.errMsg)
      }
    })

    queryTopologyDiagramInfo(projectId, areaId).then(res => {
      if(res.success){}
    })

    queryRealtimeData(projectId, areaId).then(res => {
      let {success, data} = res
      if(success) {
        if(data){
          setRealData(data)
        }else{
          setRealData({})
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const CardItem = props => {
    return <div className={style.leftCard}>
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const Tips = props => {
    return <div className={style.tips}>
      <div className={style.tipTitle}>
        <span>{props.name}</span>
        <span style={{fontSize: 12}}>({props.unit})</span>
      </div>
      <div className={style.tipValues}>{props.value}</div>
    </div>
  }
  const RightItem = props => {
    return <div className={style.rightCard}>
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const CustomProgress = props => {
    let { chargeData, dischargeData, totalData } = props
    chargeData = (parseFloat(chargeData) / totalData ) * 100 + '%' 
    dischargeData = (parseFloat(dischargeData) / totalData ) * 100 + '%' 
    return <div className={style.bgStrip}>
      <div className={style.chargeProgress} style={{width:chargeData}}></div>
      <div className={style.dischargeProgress} style={{width:dischargeData}}></div>
    </div>
  } 
  const StateCard = props => {
    return <div className={style.stateCard} style={{width:props.width}}>
      <div className={style.stateTitle}>{props.title}</div>
      <div className={style.stateValue}>{props.value}</div>
    </div>
  }
  const WarningCard = props => {
    return <div className={style.warningItem}>
      <div className={style.leftImg}>
        <img src={warningPoint} className={style.warningPoint}></img>
      </div>
      <div className={style.warningData}>
        <div className={style.warningtop}>
          <span className={style.time}>{props.data.time}</span>
          <span className={style.description}>{props.data.description}</span>
        </div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.sn}</span>
          <span className={style.level} style={{marginRight: 8}}>{props.data.level == 1? '一级告警' : props.data.level == 2? '二级告警' :'三级告警'}</span>
        </div>
      </div>
    </div>
  }
  const warningData = [
    {
      time:'13:48:23',
      description:'BMS 电池告警',
      sn:'PCS_TGA_4FA3',
      level:1
    },{
      time:'13:20:23',
      description:'SOC 低告警',
      sn:'TGA_9GG3S',
      level:2
    }
  ]
  const toWarning = () => {
    navigate('/index/runtimeStorage/alarmMessage')
  }

  return (
    <div>
      <UseHeader getValues={getFromHeader} ></UseHeader>
      <div className={style.content}>
        <div className={style.left}>
          <CardItem title={'充放电统计'}>
            <div className={style.dataItem}>
              <div className={style.itemValues}>
                <div className={style.title}>累计充电量(kWh)</div>
                <div className={style.values}>{cardData?.chargingCapacity || '0.00'}</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>充电均价(元/kWh)</div>
                <div className={style.values}>{cardData?.chargePrice || '0.00'}</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>累计充电费用(元)</div>
                <div className={style.values}>{cardData?.chargingCost || '0.00'}</div>
              </div>
            </div>
            <div className={style.line}></div>
            <div className={style.dataItem}>
              <div className={style.itemValues}>
                <div className={style.title}>累计放电量(kWh)</div>
                <div className={style.values}>{cardData?.disChargingCapacity || '0.00'}</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>放电均价(元/kWh)</div>
                <div className={style.values}>{cardData?.disChargePrice || '0.00'}</div>
              </div>
              <div className={style.itemValues}>
                <div className={style.title}>累计放电费用(元)</div>
                <div className={style.values}>{cardData?.disChargingCost || '0.00'}</div>
              </div>
            </div>
            <div className={style.line}></div>
            <div className={style.totalGet}>
              <span>累计收益</span>
              <span style={{fontSize: 18, color:'#000',fontWeight: 700}}>{cardData?.accumulatedIncome || '0.00'}</span>
            </div>
          </CardItem>
          <CardItem title={'收益统计'}>
            <BarChart data={barData}></BarChart>
          </CardItem>
          <CardItem title={'实时功率'}>
            <LineChart data={powerData}></LineChart>
          </CardItem>
        </div>
        <div className={style.middle}>
          <div className={style.headerTips}>
            <Tips name='当日总放电量' unit='kWh' value={cardData?.todayDisChargingCapacity || '0.00'}></Tips>
            <Tips name='当日总充电量' unit='kWh' value={cardData?.todayChargingCapacity || '0.00'}></Tips>
            <Tips name='当日总上网电量' unit='kWh' value={cardData?.todaySurfingCapacity || '0.00'}></Tips>
            <Tips name='今日收益' unit='元' value={cardData?.todayCost || '0.00'}></Tips>
          </div>
          <div className={style.topology}>
            <img src={zhanwei} className={style.topologyPic}></img>
          </div>
        </div>
        <div className={style.right}>
          <RightItem title='储能系统'>
            <div className={style.tips}>
              <div className={style.tipItem}>
                <span className={style.titles}>充放状态</span>
                <div className={style.tipValues}>
                  <span>{ realData?.status }</span>
                </div>
              </div>
              <div className={style.tipItem}>
                <span className={style.titles}>设计容量</span>
                <div className={style.tipValues}>
                  <span>{ realData?.solarCapacity || '0.00' }</span><span className={style.unit}>&nbsp;kWh</span>
                </div>
              </div>
              <div className={style.tipItem}>
                <span className={style.titles}>SOC</span>
                <div className={style.tipValues}>
                  <span>{ realData?.soc || '0.00' }</span><span className={style.unit}>&nbsp;%</span>
                </div>
              </div>
            </div>
            <div className={style.dashed}></div>
            <CustomProgress chargeData={realData?.canChargingCapacity || '0.00'} dischargeData={realData?.canDisChargingCapacity || '0.00' } totalData={realData?.solarCapacity}></CustomProgress>
            <div className={style.progressdata}>
              <div style={{display:'flex',alignItems:'center'}}>
                <span className={style.progresstitle} style={{backgroundColor:'#44de94',color:"#333"}}>可充电量</span>
                <span className={style.progressvalue}>{ realData?.canChargingCapacity || '0.00' }&nbsp;kwh</span>
              </div>
              <div style={{display:'flex',alignItems:'center'}}>
                <span className={style.progresstitle} style={{backgroundColor:'#f93',color:"#fff"}}>可放电量</span>
                <span className={style.progressvalue}>{ realData?.canDisChargingCapacity || '0.00' }&nbsp;kwh</span>
              </div>
            </div>
          </RightItem>
          <RightItem title='实时状态'>
            <div className={style.stateItems}>
              <StateCard title='总功率(kWh)' value={ realData?.totalPower || '0.00' } width='336px'></StateCard>
              <StateCard title='总电压(V)' value={ realData?.totalV || '0.00' } width='160px'></StateCard>
              <StateCard title='总电流(A)' value={ realData?.totalI || '0.00' } width='160px'></StateCard>
              <StateCard title='可充电量(kWh)' value={ realData?.canChargingCapacity || '0.00' } width='160px'></StateCard>
              <StateCard title='可放电(kWh)' value={ realData?.canDisChargingCapacity || '0.00' } width='160px'></StateCard>
            </div>
          </RightItem>
          <RightItem title='最新告警'>
            {/* <Link className={style.toWarning} to='/index/runtimeStorage/alarmMessage'>查看详情</Link> */}
            <span className={style.toWarning} onClick={()=>toWarning()}>查看详情</span>
            <div className={style.warningDetails}>
              {warningData.map((item, index) => {
                return <Fragment key={index}>
                  <WarningCard data={item} ></WarningCard>
                  {warningData.length > (index + 1) ? <div className={style.dashed} style={{marginTop: 21, marginBottom: 21}}></div> : null }
                </Fragment>
              } )}
            </div>
          </RightItem>
        </div>
      </div>
    </div>
  )
}
