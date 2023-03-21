import React,{Fragment, useState}from 'react'
import style from './style.module.less'
import { useNavigate } from 'react-router-dom'
import UseHeader from '@com/useHeader'
import { StorageSummaryRuntime, StorageAlarmRuntime } from '@api/api.js'
import { message } from 'antd'
import { range } from 'lodash'
import BarChart from './barChart'
import zhandian from './imgs/zhandian.png'
import zhanwei from './imgs/zhanwei.png'
import warningPoint from '@imgs/warningPoint.png'
import totalCharge from './imgs/totalCharge.png'
import totalDischarge from './imgs/totalDischarge.png'
import totalIncome from './imgs/totalIncome.png'
import totalChargeCost from './imgs/totalChargeCost.png'
import totalDischargeCost from './imgs/totalDischargeCost.png'

export default function Index() {
  const { statistic, 
    queryEchartsInfo, 
    queryPowerTrends, 
    queryTopologyDiagramInfo, 
    queryRealtimeData } = StorageSummaryRuntime
  const { alarmStatistic } = StorageAlarmRuntime
  const navigate = useNavigate()
  const [cardData, setCardData] = useState({})//卡片数据
  const [barData, setBarData] = useState({
    x:['3月1日', '3月2日', '3月3日', '3月4日', '3月5日', '3月6日', '3月7日'],
    y:['523.23', '418.58', '306.98', '489.32', '874.59', '742.63', '684.25'],
    z:['685.25', '514.23', '415.36', '598.32', '957.32', '845.36', '874.39'],
    line:['162.02', '95.65', '144.38', '109', '82.73', '107.73', '190.14']
  }) //收益统计
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
          <span className={style.time}>{props.data.time}</span>
          <span className={style.description}>{props.data.description}</span>
          <span className={style.level} style={{fontSize: 12, color:'#6b6b6b'}}>{props.data.level == 1? '一级告警' : props.data.level == 2? '二级告警' :'三级告警'}</span>
        </div>
        <div className={style.warningbottom}>
          <span className={style.sn}>{props.data.sn}</span>
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
    navigate('/index/runtimeStorage/alarmMessage',{
      state: { type: 'index', primary: 'runtimeStorage', title: '告警信息',  nested: 'alarmMessage'  } 
    })
  }

  return (
    <div>
      <UseHeader getValues={getFromHeader} ></UseHeader>
      <div className={style.content}>
        <div className={style.left}>
          <CardItem title='站点信息' height='226px'>
            <div className={style.information}>
              <img src={zhandian} className={style.siteImg}></img>
              <div className={style.siteData}>
                <div>
                  <span className={style.siteTitle}>设备类型</span>
                  <span className={style.siteValue}>分布式储能</span>
                </div>
                <div>
                  <span className={style.siteTitle}>运行功率</span>
                  <span className={style.siteValue}>120 &nbsp;kW</span>
                </div>
                <div>
                  <span className={style.siteTitle}>储能容量</span>
                  <span className={style.siteValue}>200 &nbsp;kWh</span>
                </div>
                <div>
                  <span className={style.siteTitle}>投运时间</span>
                  <span className={style.siteValue}>2023/01/20</span>
                </div>
              </div>
            </div>
          </CardItem>
          <CardItem title='实时状态' height='558px'>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'系统状态'} value={'正常'} styles={{backgroundColor:'#237ae4', color:'#fff'}}></StateCard>
              <StateCard width={'156px'} title={'运行状态'} value={'充电中'} styles={{backgroundColor:'#237ae4', color:'#fff'}}></StateCard>
            </div>
            <div className={style.division} style={{marginTop:0}}></div>
            <CustomProgress dischargeData={'60.40'} chargeData={'139.60'}></CustomProgress>
            <div className={style.systemData}>
              <div className={style.leftItem}>
                <span className={style.diamond} style={{backgroundColor:'#4370ff'}}></span>
                <span>{'可放电量: 60.40 kWh'}</span>
              </div>
              <div className={style.leftItem}>
                <span className={style.diamond} style={{backgroundColor:'#f93'}}></span>
                <span>{'可充电量: 139.60 kWh'}</span>
              </div>
            </div>
            <div className={style.division}></div>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'储能效率 (%)'} value={'98.2'} ></StateCard>
              <StateCard width={'156px'} title={'SOC (%)'} value={'30.2'}></StateCard>
              <StateCard width={'156px'} title={'放电功率 (kW)'} value={'0'} ></StateCard>
              <StateCard width={'156px'} title={'充电功率 (kWh)'} value={'65.2'}></StateCard>
            </div>
            <div className={style.division} style={{marginTop:0}}></div>
            <div className={style.stateItems}>
              <StateCard width={'156px'} title={'交流总有功功率 (kW)'} value={'65.2'} ></StateCard>
              <StateCard width={'156px'} title={'交流总无功功率 (kW)'} value={'65.2'}></StateCard>
              <StateCard width={'156px'} title={'防逆流总功率 (kW)'} value={'0.00'} ></StateCard>
              <StateCard width={'156px'} title={'防逆流总电量 (kWh)'} value={'0.2'}></StateCard>
            </div>
          </CardItem>
        </div>
        <div className={style.right}>
          <div className={style.top}>
            <Tips imgUrl={totalCharge} title={'总充电量 (kWh)'} value={'2154.25'} bgcolor={'#56b653'}></Tips>
            <Tips imgUrl={totalDischarge} title={'总放电电量 (kWh)'} value={'1987.85'} bgcolor={'#4370ff'}></Tips>
            <Tips imgUrl={totalChargeCost} title={'总充电金额 (元)'} value={'879.32'} bgcolor={'#fea526'}></Tips>
            <Tips imgUrl={totalDischargeCost} title={'总放电金额 (元)'} value={'1804.25'} bgcolor={'#ff6642'}></Tips>
            <Tips imgUrl={totalIncome} title={'储能总收益 (元)'} value={'924.33'} bgcolor={'#9951fe'} width={'280px'}></Tips>
          </div>
          <div className={style.bottom}>
            <div className={style.topology}>
              <img src={zhanwei} className={style.zhanwei}></img>
            </div>
            <div className={style.otherDatas}>
              <RightItem title='能耗收益统计' height={'473px'}>
                <BarChart data={barData}></BarChart>
              </RightItem>
              <RightItem title='最新告警' height={'207px'}>
                <span className={style.toWarning} onClick={()=>toWarning()}>查看详情</span>
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
