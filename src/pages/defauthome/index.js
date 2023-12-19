import React, {useEffect, useState} from 'react'
import style from './configure/style.module.less';
import _ from 'lodash'
import { useRequest } from 'ahooks'; 
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { UISummary, Monitoring} from '@api/api.js'
import { useReactive } from 'ahooks';

import CompanyMessage from '../../components/defaultHome/companyMessage'
import TodayWarning from '../../components/defaultHome/todayWarning'
import OrderDetail from '../../components/defaultHome/orderDetail'
import WarningMessage from '../../components/defaultHome/warningMessage'
import ElectricValue from '../../components/defaultHome/electric'
import WaterValue from '../../components/defaultHome/water'
import GasValue from '../../components/defaultHome/gas'
import CarbonValue from '../../components/defaultHome/carbon'
import EnergyTrend from '../../components/defaultHome/energyTrend'
// import EnergyCost from '@com/defaultHome/energyCost'
import RealLoad from '../../components/defaultHome/load'
import WarningSpread from '../../components/defaultHome/spread'
import ElectricAnalysis from '../../components/defaultHome/electricAnalysis'
import TotalCharge from '@com/defaultHome/totalCharge'
import TotalDischarge from '@com/defaultHome/totalDischarge'
import ChargeCost from '@com/defaultHome/chargeCost'
import DischargeCost from '@com/defaultHome/disChargeCost'
import TotalIncome from '@com/defaultHome/totalIncome'
import MonthIncome from '@com/defaultHome/monthIncome'
import DayIncome from '@com/defaultHome/dayIncome'
import StorageStatistics from '@com/defaultHome/storageStatistics'
import StorageTrend from '@com/defaultHome/storageTrend'
import SocData from '@com/defaultHome/socData'
import GatewayMessage from '@com/defaultHome/gatewayMessage'
import DeviceMessage from '@com/defaultHome/deviceMessage'
import ChooperMessage from '@com/defaultHome/chooperMessage'
import EnergyRanking from '@com/defaultHome/energyRank'
import EnergyProportion from '@com/defaultHome/energyProportion'


import Sensor from '@com/defaultHome/sensorMessage' //传感器信息

import Transformer from '@com/defaultHome/transformerMessage' //变压器信息

import Gxcwmg from '@com/defaultHome/gxcwMessage' //光纤测温信息
import Cdcwmg from '@com/defaultHome/cdcwMessage' //光纤测温信息

import TodayElectricity from "@com/defaultHome/todayElectricity" // TodayElectricity 今日用电量

import TransformerTotal from "@com/defaultHome/transformerTotal" // TransformerTotal 变压器总负荷

import TransformerNum from "@com/defaultHome/transformerNum" // TransformerNum 变压器数量


import Inspection from "@com/defaultHome/inspection" // Inspection 本月巡检

// TodayElectricity 今日用电量  TransformerTotal 变压器总负荷 TransformerNum 变压器数量 


import RGL, { WidthProvider } from 'react-grid-layout'
const ReactGridLayout = WidthProvider(RGL);
import './configure/style.css';
import './index.css';
import { message } from 'antd';



export default function Index() {

 

  const { RuntimeStatus } = Monitoring.Runtime
  const [layoutItem, setlayoutItem] = useState([])
  const [data, setData] = useState({})
  const state = useReactive({
    statusData:{},
  })

  const projectId = useSelector(selectProjectId)
 
  const { QueryUISummary } = UISummary

  const getData = async () => {
    try {
       let {success, data} = await RuntimeStatus({projectId: projectId,areaId: 0})
       if(success) {
         setData(data || {})
       }else {
        setData({})
       }
    } catch (error) {
      
    }
       
  }
   useEffect(() => {
     if(projectId) getData()
   }, [projectId])
  //RGL布局
  const [defaultProps, setDefaultProps]  = useState({
    className:'layout',
    rowHeight: 200,
    cols: 8,
    margin:[16, 16],
  })

  // useEffect(()=>{
  //   if(!JSON.parse(sessionStorage.getItem('layoutItem'))) return;
  //   let itemValue = JSON.parse(sessionStorage.getItem('layoutItem'))
  //   for(let value = 0 ; value<itemValue.length;value++){
  //     itemValue[value].static = true;
  //   }
  //   setlayoutItem(itemValue)
  // },[])

  const getLayoutData = () => {
    return QueryUISummary(projectId).then(res => {
      let {success, data } = res
      if (success && data) {
        return {
          list: data
        }
      }else {
        return {
          list: []
        }
      }
    })
  }

  const {queryData} = useRequest(getLayoutData, {
    onSuccess:(result, params) => {
      if(result.list.length > 0 ){
        for(let val = 0; val <result.list.length; val++){
          result.list[val].static = true;
        }
      }
      setlayoutItem(result.list)
    }
  });

  
// TodayElectricity 今日用电量  TransformerTotal 变压器总负荷 TransformerNum 变压器数量 Inspection 本月巡检
  const createElement = el => {
    const i = el.i;
    const end = i.indexOf('_');
    return (
      <div key = {i} data-grid={el}>
       {i.substring(0, end)=='公司信息'? <CompanyMessage></CompanyMessage> : null}
        {i.substring(0, end)=='今日告警'? <TodayWarning></TodayWarning> : null}
        {i.substring(0, end) =='本月工单' ? <OrderDetail></OrderDetail> : null}
        {i.substring(0, end)=='告警信息' ? <WarningMessage></WarningMessage> : null}
        {i.substring(0, end) =='用电量' ? <ElectricValue></ElectricValue> : null}
        {i.substring(0, end)=='用水量' ? <WaterValue></WaterValue> : null}
        {i.substring(0, end)=='用燃气量' ? <GasValue></GasValue> : null}
        {i.substring(0, end)=='碳排放量' ? <CarbonValue></CarbonValue> : null}
        {i.substring(0, end)=='网关信息' ? <GatewayMessage></GatewayMessage> : null}
        {i.indexOf('电表信息') != -1 ? <DeviceMessage type={'runtTime'} state={data}></DeviceMessage> : null}
        {i.indexOf('断路器信息') != -1 ? <ChooperMessage type={'runtTime'} state={data}></ChooperMessage> : null}        
        {i.indexOf('传感器信息') != -1 ? <Sensor type={'runtTime'} state={data}></Sensor> : null} 
        {i.indexOf('变压器信息') != -1 ? <Transformer type={'runtTime'} state={data}></Transformer> : null} 
        {i.indexOf('触点测温') != -1 ? <Cdcwmg type={'runtTime'} state={data}></Cdcwmg> : null} 
        {i.indexOf('光纤测温') != -1 ? <Gxcwmg type={'runtTime'} state={data}></Gxcwmg> : null} 

        {i.substring(0,end)=='今日用电量' ? <TodayElectricity type={'runtTime'} state={data}></TodayElectricity> : null} 
        {i.indexOf('变压器总负荷') != -1 ? <TransformerTotal type={'runtTime'} state={data}></TransformerTotal> : null} 

        {i.indexOf('配电房监测') != -1 ? <TransformerNum type={'runtTime'} state={data}></TransformerNum> : null} 

        {i.indexOf('本月巡检') != -1 ? <Inspection type={'runtTime'} state={data}></Inspection> : null} 

        { i.indexOf('月度能耗') != -1 ? <EnergyTrend type={'runtTime'}></EnergyTrend> : null }         
        { i.indexOf('实时负荷率') != -1 ? <RealLoad type={'runtTime'}></RealLoad> : null }
        { i.indexOf('告警分布') != -1 ? <WarningSpread type={'runtTime'}></WarningSpread> : null }
        { i.indexOf('分时电量分析') != -1 ? <ElectricAnalysis type={'runtTime'}></ElectricAnalysis> : null }
        { i.indexOf('总充电量') != -1 ? <TotalCharge type={'runtTime'}></TotalCharge> : null }
        { i.indexOf('总放电量') != -1 ? <TotalDischarge type={'runtTime'}></TotalDischarge> : null }
        { i.indexOf('总充电金额') != -1 ? <ChargeCost type={'runtTime'}></ChargeCost> : null }
        { i.indexOf('总放电金额') != -1 ? <DischargeCost type={'runtTime'}></DischargeCost> : null }
        { i.indexOf('储能总收益') != -1 ? <TotalIncome type={'runtTime'}></TotalIncome> : null }
        { i.indexOf('储能月收益') != -1 ? <MonthIncome type={'runtTime'}></MonthIncome> : null }
        { i.indexOf('储能日收益') != -1 ? <DayIncome type={'runtTime'}></DayIncome> : null }
        { i.indexOf('储能收益统计') != -1 ? <StorageStatistics type={'runtTime'}></StorageStatistics> : null }
        { i.indexOf('充放电量趋势') != -1 ? <StorageTrend type={'runtTime'}></StorageTrend> : null }
        { i.indexOf('站点soc') != -1 ? <SocData type={'runtTime'}></SocData> : null }
        {i.indexOf('能耗排名') != -1 ? <EnergyRanking type={'runtTime'}></EnergyRanking> : null}
        { i.indexOf('分类能耗') != -1 ? <EnergyProportion type={'runtTime'}></EnergyProportion> : null }
      </div>
    )
  }

  



  return (
    <div className={style.mainContent} style={{backgroundColor:'#135abd'}}>
      <ReactGridLayout layout={layoutItem} {...defaultProps} >
        {_.map( layoutItem, el =>createElement(el) )} 
      </ReactGridLayout>
    </div>
  )
}
