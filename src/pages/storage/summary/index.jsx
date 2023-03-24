import React,{Fragment, useState}from 'react'
import style from './style.module.less'
import { useNavigate } from 'react-router-dom'
import UseHeader from '@com/useHeader'
import { SiteSummaryRuntime, StorageAlarmRuntime } from '@api/api.js'
import { message } from 'antd'
import { range } from 'lodash'
import BarChart from './barChart'
import imgurl from './imgs'
import warningPoint from '@imgs/warningPoint.png'

export default function Index() {
  const { querySiteInfo, 
    queryStorageIncome, 
    queryStorageWarning, 
    queryTopologyDiagramInfo, 
    queryRealtimeData } = SiteSummaryRuntime
  const { alarmStatistic } = StorageAlarmRuntime
  const navigate = useNavigate()
  const [cardData, setCardData] = useState({})//卡片数据
  const [barData, setBarData] = useState({}) //收益统计
  const [realData, setRealData] = useState({})//实时状态
  const [warningData, setWarningData] = useState([])//最新告警
  const [topologyData, setTopologyData] = useState({
    lineInfo:{},
    solarPointBaseInfo:{},
  }) //接线图数据
  const getFromHeader = values => {
    if(!values.areaId) return;
    let { projectId, areaId } = values
    querySiteInfo(projectId, areaId).then(res => {
      if(res.success){
        setCardData(res.data)
      }else{
        message.error(res.errMsg)
      }
    })

    queryStorageIncome(projectId, areaId).then(res => {
      let {success, data} = res
      if(success) {
        if(data){
          setBarData(data)
        }else{
          setBarData({})
        }
      }else{
        message.error(res.errMsg)
      }
    })

    queryStorageWarning(projectId, areaId).then(res => {
      let {success, data} = res
      if(success) {
        if(data){
          setWarningData(data)
        }else{
          setWarningData([])
        }
      }else{
        message.error(res.errMsg)
      }
    })

    queryTopologyDiagramInfo(projectId, areaId).then(res => {
      if(res.success){
        if(res.data){
          setTopologyData(res.data)
        }else{
          setTopologyData({})
        }
      }else{
        message.error(res.errMsg)
      }
    })

    queryRealtimeData(projectId, areaId).then(res => {
      let {success, data} = res
      if(success) {
        if(data){
          setRealData(data)
        }else{
          setRealData({
            lineInfo:{},
            solarPointBaseInfo:{},
          })
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const CardItem = props => {
    return <div className={style.leftCard} style={{ height: props.height }} >
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const Tips = props => {
    return <div className={style.tips} style={{ backgroundColor:props.bgcolor, width: props.width || 240 }}>
      <img src={props.imgUrl} className={style.tipImg}></img>
      <div className={style.tipsData} style={{ marginLeft: props.width ? 42 : 22 }}>
        <div className={style.tipTitle}>{props.title}</div>
        <div className={style.tipValue}>{props.value}</div>
      </div>
    </div>
  }
  const RightItem = props => {
    return <div className={style.rightCard} style={{height: props.height}}>
      <div className={style.cardTitle}>{props.title}</div>
      {props.children}
    </div>
  }
  const CustomProgress = props => {
    let {dischargeData, chargeData} = props
    let total = parseFloat(dischargeData)  + parseFloat(chargeData) 
    let dischargeCount = parseFloat(dischargeData) == 0 ? 0 : parseInt(((parseFloat(dischargeData) * 100 ) / total) / (100 / 65)) + 1
    let chargeCount = parseFloat(chargeData) == 0 ? 0 : parseInt(((parseFloat(chargeData) * 100 ) / total) / (100 / 65)) + 1
    let chargelist = range(chargeCount)
    let dischargeList = range(dischargeCount)
    const progressStyle = {
        width: 328,
        height: 36, 
        backgroundColor:'#fff', 
        display:'flex',
        alignItems:'center',
        overFlow:'hidden',
        paddingLeft: 1,
        border:'1px solid #d7d7d7'
    }
    return <div style={progressStyle}>
        {dischargeList.map(item => {
            return <div style={{width: 4, height: 32, backgroundColor:"#4370ff", marginRight: 1}} key={item}></div>
        })}
        {chargelist.map(item => {
            return <div style={{width: 4, height: 32, backgroundColor:"#f93", marginRight: 1}} key={item}></div>
        })}
    </div>
}
  const StateCard = props => {
    const customStyle = props.styles ? props.styles : null
    return <div className={style.stateCard} style={{width:props.width}}>
      <div className={style.stateTitle} style={customStyle}>{props.title}</div>
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
          <span className={style.time}>{props.data.warningTime}</span>
          <span className={style.description}>{props.data.content}</span>
          <span className={style.level} style={{fontSize: 12, color:'#6b6b6b'}}>{props.data.level}</span>
        </div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.sn}</span>
        </div>
      </div>
    </div>
  }
  const toPage = (key ,label) => {
    navigate(`/index/runtimeStorage/${key}`,{
      state: { type: 'index', primary: 'runtimeStorage', title: label,  nested: key  } 
    })
  }

  return (
    <div>
      <UseHeader getValues={getFromHeader} ></UseHeader>
      <div className={style.content}>
        <div className={style.left}>
          <CardItem title='站点信息' height='226px'>
            <div className={style.information}>
              <img src={imgurl.zhandian} className={style.siteImg}></img>
              <div className={style.siteData}>
                <div>
                  <span className={style.siteTitle}>设备类型</span>
                  <span className={style.siteValue}>{ cardData?.meterType }</span>
                </div>
                <div>
                  <span className={style.siteTitle}>运行功率</span>
                  <span className={style.siteValue}> { cardData?.runtimeP }&nbsp;kW</span>
                </div>
                <div>
                  <span className={style.siteTitle}>储能容量</span>
                  <span className={style.siteValue}>{ cardData?.storageCapacity } &nbsp;kWh</span>
                </div>
                <div>
                  <span className={style.siteTitle}>投运时间</span>
                  <span className={style.siteValue}>{cardData?.useDate}</span>
                </div>
              </div>
            </div>
          </CardItem>
          <CardItem title='实时状态' height='558px'>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'系统状态'} value={realData?.status} styles={{backgroundColor:'#237ae4', color:'#fff'}}></StateCard>
              <StateCard width={'156px'} title={'运行状态'} value={realData?.runtimeStatus} styles={{backgroundColor:'#237ae4', color:'#fff'}}></StateCard>
            </div>
            <div className={style.division} style={{marginTop:0}}></div>
            <CustomProgress dischargeData={realData?.canChargingCapacity} chargeData={realData?.canDisChargingCapacity}></CustomProgress>
            <div className={style.systemData}>
              <div className={style.leftItem}>
                <span className={style.diamond} style={{backgroundColor:'#4370ff'}}></span>
                <span>{'可放电量: '+ realData?.canChargingCapacity + ' kWh'}</span>
              </div>
              <div className={style.leftItem}>
                <span className={style.diamond} style={{backgroundColor:'#f93'}}></span>
                <span>{'可充电量: '+ realData?.canDisChargingCapacity + ' kWh'}</span>
              </div>
            </div>
            <div className={style.division}></div>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'储能效率 (%)'} value={realData?.storageEfficiency} ></StateCard>
              <StateCard width={'156px'} title={'SOC (%)'} value={realData?.soc}></StateCard>
              <StateCard width={'156px'} title={'放电功率 (kW)'} value={realData?.disChargingP} ></StateCard>
              <StateCard width={'156px'} title={'充电功率 (kWh)'} value={realData?.chargingP}></StateCard>
            </div>
            <div className={style.division} style={{marginTop:0}}></div>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'交流总有功功率 (kW)'} value={realData?.totalP} ></StateCard>
              <StateCard width={'156px'} title={'交流总无功功率 (kW)'} value={realData?.totalQ}></StateCard>
              <StateCard width={'156px'} title={'防逆流总功率 (kW)'} value={realData?.antiRefluxP} ></StateCard>
              <StateCard width={'156px'} title={'防逆流总电量 (kWh)'} value={realData?.antiRefluxE}></StateCard>
            </div>
          </CardItem>
        </div>
        <div className={style.right}>
          <div className={style.top}>
            <Tips imgUrl={imgurl.totalCharge} title={'总充电量 (kWh)'} value={cardData?.chargingCapacity} bgcolor={'#56b653'}></Tips>
            <Tips imgUrl={imgurl.totalDischarge} title={'总放电电量 (kWh)'} value={cardData?.disChargingCapacity} bgcolor={'#4370ff'}></Tips>
            <Tips imgUrl={imgurl.totalChargeCost} title={'总充电金额 (元)'} value={cardData?.chargingAmount} bgcolor={'#fea526'}></Tips>
            <Tips imgUrl={imgurl.totalDischargeCost} title={'总放电金额 (元)'} value={cardData?.disChargingAmount} bgcolor={'#ff6642'}></Tips>
            <Tips imgUrl={imgurl.totalIncome} title={'储能总收益 (元)'} value={cardData?.storageIncome} bgcolor={'#9951fe'} width={'280px'}></Tips>
          </div>
          <div className={style.bottom}>
            <div className={style.topology}>
              <img src={imgurl.zhanwei} className={style.zhanwei}></img>
              {/* 储能电表 */}
              <div className={style.storageMeter}>
                <div className={style.meterData}>
                  <span className={style.dataName}>电压:</span>
                  <span className={style.dataValue}>{topologyData?.lineInfo.v }</span>
                  <span className={style.dataUnit}>(V)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>电流:</span>
                  <span className={style.dataValue}>{topologyData?.lineInfo.i }</span>
                  <span className={style.dataUnit}>(A)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>功率:</span>
                  <span className={style.dataValue}>{topologyData?.lineInfo.p }</span>
                  <span className={style.dataUnit}>(kW)</span>
                </div>
              </div>
              {/*交流器*/}
              <div className={style.transformer}>
                <div className={style.transItem}>
                  <img src={imgurl.error} className={style.transImg}></img>
                  <span>{ topologyData?.pcsType }</span>
                </div>
                <div className={style.transItem}>
                  <img src={imgurl.normal} className={style.transImg}></img>
                  <span>{ topologyData?.status + ' . . .' }</span>
                </div>
              </div>
              {/*电池簇*/}
              <div className={style.batterys}>
                <div className={style.meterData}>
                  <span className={style.dataName}>电压:</span>
                  <span className={style.dataValue}>{topologyData?.solarPointBaseInfo.v }</span>
                  <span className={style.dataUnit}>(V)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>电流:</span>
                  <span className={style.dataValue}>{topologyData?.solarPointBaseInfo.i }</span>
                  <span className={style.dataUnit}>(A)</span>
                </div>
                <div className={style.meterData}>
                  <span className={style.dataName}>SOC:</span>
                  <span className={style.dataValue}>{topologyData?.solarPointBaseInfo.soc }</span>
                  <span className={style.dataUnit}>(%)</span>
                </div>
              </div>
              <div className={style.transPlaceholder} onClick={() => toPage('PCSMonitor', 'PCS监控')}></div>
              <div className={style.batteryPlaceholder} onClick={() => toPage('BMSMonitor', 'BMS监控')}></div>
            </div>
            <div className={style.otherDatas}>
              <RightItem title='能耗收益统计' height={'473px'}>
                <BarChart data={barData}></BarChart>
              </RightItem>
              <RightItem title='最新告警' height={'207px'}>
                <span className={style.toWarning} onClick={()=>toPage('alarmMessage', '告警信息')}>查看详情</span>
                <div className={style.warningDetails}>
                  {warningData.map((item, index) => {
                    return <Fragment key={index}>
                      <WarningCard data={item} ></WarningCard>
                      {warningData.length > (index + 1) ? <div className={style.division} style={{margin:'10px 0'}}></div> : null }
                    </Fragment>
                  } )}
                </div>
              </RightItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
