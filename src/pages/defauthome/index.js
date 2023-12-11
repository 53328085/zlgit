import React, {useEffect, useState} from 'react'
import style from './configure/style.module.less';
import _ from 'lodash'
import { useRequest } from 'ahooks'; 
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { UISummary } from '@api/api.js'
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

import RGL, { WidthProvider } from 'react-grid-layout'
const ReactGridLayout = WidthProvider(RGL);
import './configure/style.css';
import './index.css';
import { message } from 'antd';



export default function Index() {
  const [layoutItem, setlayoutItem] = useState([])
  const state = useReactive({
    statusData:{},
  })

  const projectId = useSelector(selectProjectId)
  const { QueryUISummary } = UISummary

  

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

  

  const createElement = el => {
    const i = el.i;
    return (
      <div key = {i} data-grid={el}>
        { i.indexOf('公司信息') != -1 ? <CompanyMessage type={'runtTime'}></CompanyMessage> : null  }
        { i.indexOf('今日告警') != -1 ? <TodayWarning type={'runtTime'}></TodayWarning> : null  }
        { i.indexOf('今日工单') != -1 ? <OrderDetail type={'runtTime'}></OrderDetail> : null  }
        { i.indexOf('告警信息') != -1 ? <WarningMessage type={'runtTime'}></WarningMessage> : null  }
        { i.indexOf('用电量') != -1 ? <ElectricValue type={'runtTime'}></ElectricValue> : null }
        { i.indexOf('用水量') != -1 ? <WaterValue type={'runtTime'}></WaterValue> : null }
        { i.indexOf('用燃气量') != -1 ? <GasValue type={'runtTime'}></GasValue> : null }
        { i.indexOf('碳排放量') != -1 ? <CarbonValue type={'runtTime'}></CarbonValue> : null }
        {i.indexOf('网关信息') != -1 ? <GatewayMessage type={'runtTime'}></GatewayMessage> : null}
        {i.indexOf('电表信息') != -1 ? <DeviceMessage type={'runtTime'}></DeviceMessage> : null}
        {i.indexOf('断路器信息') != -1 ? <ChooperMessage type={'runtTime'}></ChooperMessage> : null}
        { i.indexOf('能耗趋势') != -1 ? <EnergyTrend type={'runtTime'}></EnergyTrend> : null }
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
