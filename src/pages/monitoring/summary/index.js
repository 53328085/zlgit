import React, { useEffect, useState } from 'react'
import style from './style.module.less'
import { Select } from 'antd'
import Icard from './card'
import safeOperation from './images/safeOperation.png'
import carbonEmission from './images/carbonEmission.png'
import useCurr from './images/useCurr.png'
import useWater from './images/useWater.png'
import useGas from './images/useGas.png'
import warn from '@imgs/warn.png'
import {drawEcharts} from '@com/useEcharts'
import ChartData from './chartData'

export default function Index() {
  const { Option } = Select

  let pieData = {
    data:[
      { value: 35, name: '尖占比' },
      { value: 15, name: '峰占比' },
      { value: 20, name: '平占比' },
      { value: 30, name: '谷占比' },
    ],
    total:100,
  }

  useEffect(() => {
    let pieChart = document.getElementById('pieChart')
    drawEcharts(pieChart, {pieData, type:3})
  })

  let loadItem = [{
    name:'本月平均负载',
    value:1324.32,
    unit:'kWh'
},{
    name:'本月平均负载率',
    value:23.37,
    unit:'%'
},{
    name:'最大负荷',
    subTitle:'发生时间:',
    Time:'2022-7-8 12:45',
    value:1324.32,
    unit:'kW'
},{
    name:'运行情况',
    subTitle:'变压器最佳负载率为:65%~75%',
    theme:'hidden',
    description:"变压器轻载运行 经济性一般",
}]

  let loadOpts = {
    title:'负荷趋势',
    Time: ['7/1', '7/2', '7/3', '7/4', '7/5', '7/6','7/7', '7/8', '7/9', '7/10', '7/11', '7/12', '7/13', '7/14'],
    lineData: [2697.4, 3055.2, 2344.2, 3784.8, 2356.5, 2473.2, 2417.3, 657.4, 788.2, 3156.2, 3184.8, 2356.5, 2873.2, 2787.3]
  }

  let demandOpts = {
    title:'需量趋势',
    Time: ['7/1', '7/2', '7/3', '7/4', '7/5', '7/6','7/7', '7/8', '7/9', '7/10', '7/11', '7/12', '7/13', '7/14'],
    lineData: [267.4, 305.2, 234.2, 374.8, 256.5, 273.2, 217.3, 57.4, 788.2, 316.2, 314.8, 236.5, 273.2, 278.3]
  }

  let demandItem = [{
    name:'申报需量',
    value:4240.25,
    unit:'kW'
},{
    name:'本月最大需量',
    subTitle:'发生时间:',
    Time:'2022-7-8 12:45',
    value:31523.32,
    unit:'kWh'
},{
    name:'需量分析',
    subTitle:'',
    theme:'warning',
    description:"申报值偏高 请合理申报需量",
}]

  return (
    <div>
      <div className={style.header}>
        <span style={{marginLeft: '12px'}}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          style={{width: '320px', marginLeft: '12px'}}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
        </Select>
        <div className={style.line}></div>
        <span>能源类型</span>
        <Select
          placeholder="全部类型"
          size="middle"
          style={{width: '126px', marginLeft: '12px'}}
        >
          <Option value="0">电</Option>
          <Option value="1">水</Option>
          <Option value="2">燃气</Option>
        </Select> 
      </div>
      <div className={style.cardList}>
        <Icard img={ safeOperation } title={'安全运行(天)'} value={1825} />
        <Icard img={ useCurr } title={'本月用电量(kWh)'} value={'62,363.44'} />
        <Icard img={ useWater } title={'本月用水量(m³)'} value={'7500.00'} />
        <Icard img={ useGas } title={'本月用气量(m³)'} value={'8000.00'} />
        <Icard img={ carbonEmission } title={'年度碳排放(吨)'} value={'215.32'} />
        <div className={style.orderData}>
          <div className={style.orderItem}>
            <div className={style.itemTitle}>未处理工单</div>
            <div className={style.waitOrder}>8</div>
          </div>
          <div className={style.orderItem}>
            <div className={style.itemTitle}>进行中工单</div>
            <div className={style.duringOrder}>3</div>
          </div>
          <div className={style.orderItem}>
            <div className={style.itemTitle}>未完成巡检</div>
            <div className={style.waitInspection}>3</div>
          </div>
        </div>
      </div>
      <div className={style.content}>
        <div className={style.contentLeft}>
          <h4 className={style.pieTitle}>分时电量分析</h4>
          <div className={style.pieChart} id='pieChart'></div>
          <div className={style.tips}>
            <img className={style.warn} src={warn} alt='提示'></img>
            <div className={style.tipDesc}>
              <div>当前时段内，峰电量占总电量37%，占比较大</div>
              <div>请合理利用峰谷电</div>
            </div>
          </div>
        </div>
        <div className={style.contentRight}>
          <ChartData opts={loadOpts} itemValue={loadItem}></ChartData>
          <ChartData opts={demandOpts} itemValue={demandItem}></ChartData>
        </div>
      </div>
    </div>
  )
}
