import React from 'react'
import style from './style.module.less'
import { Select } from 'antd'
import mapImg from './map.png'
import PVImg from './PVImg.png'
import inverter from './inverter.png'

export default function Index() {
  const {Option} = Select;

  const items = [
    {
      State:'Normal',
      Power:320,
    },{
      State:'Normal',
      Power:320,
    },{
      State:'Normal',
      Power:320,
    },{
      State:'Normal',
      Power:320,
    },{
      State:'Normal',
      Power:320,
    },{
      State:'Normal',
      Power:320,
    },
  ]

  const DataItem = (item)=>{
    return <div className={style.dataItem}>
      <div className={style.itemTitle}>{item.name}</div>
      <div className={style.itemValue}>{item.value} <span className={style.itemUnit}>{item.unit}</span></div>
    </div>
  }

  return (
    <div>
      <div className={style.header}>
        <span style={{marginLeft: '12px'}}>项目选择</span>
        <Select
          placeholder="请选择项目"
          size="middle"
          style={{width: '320px', marginLeft: '12px'}}
        >
          <Option value="1">正泰物联项目</Option>
        </Select>
        <span className={style.weather}>今日天气：晴  29℃</span>
      </div>
      <div className={style.content}>
        <img src={mapImg} className={style.mapImg}></img>
        <div className={style.topData}>
          <img src={PVImg} className={style.PVImg}></img>
          <div className={style.firstData}>
            {DataItem({name:'日照辐射',value:800, unit:'W/㎡'})}
            {DataItem({name:'实时功率',value:235.21, unit:'W'})}
            {DataItem({name:'电表读数',value:239.32, unit:'kWh'})}
          </div>
          <div className={style.line}></div>
          <div className={style.firstData}>
            {DataItem({name:'电压',value:220.021, unit:'V'})}
            {DataItem({name:'电流',value:15.21, unit:'A'})}
          </div>
        </div>
        <div className={style.bottomLeft}>
          <div>电站常规参数</div>
          <div className={style.bottomLeftContent}>
            <div className={style.contentValue}>
              <span className={style.ValueTitle}>电站功率</span>
              <span className={style.ValueData}>567890323</span>
              <span className={style.ValueUnit}>kW</span>
            </div>
            <div className={style.contentValue}>
              <span className={style.ValueTitle}>当天发电量</span>
              <span className={style.ValueData}>8965.25</span>
              <span className={style.ValueUnit}>kW</span>
            </div>
          </div>
          <div className={style.bottomLeftContent}>
            <div className={style.contentValue}>
              <span className={style.ValueTitle}>累计发电量</span>
              <span className={style.ValueData}>1352545.25</span>
              <span className={style.ValueUnit}>kW</span>
            </div>
            <div className={style.contentValue}>
              <span className={style.ValueTitle}>电站装机容量</span>
              <span className={style.ValueData}>3.025</span>
              <span className={style.ValueUnit}>MWp</span>
            </div>
          </div>
        </div>
        <div className={style.bottomRight}>
          {items.map((value, index) => {
            return(<div className={style.card} key={index}>
              <img src={inverter} className={style.inverterImg}></img>
              <div>
                <div className={style.cardContent}>
                  <div className={style.cardTitle}>1# 逆变器:</div>
                  <div className={style.cardValue}>{value.State == 'Normal' ? '正常' : ''}</div>
                </div>
                <div className={style.cardContent} style={{marginTop:16}}>
                  <div className={style.cardTitle}>功率:</div>
                  <div className={style.cardValue}>{value.Power} kW</div>
                </div>
              </div>
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}
