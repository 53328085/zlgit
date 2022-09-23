import React from 'react'
import style from './style.module.less'
import { Select } from 'antd'
import mapImg from './map.png'
import PVImg from './PVImg.png'

export default function Index() {
  const {Option} = Select;

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
        <div className={style.bottomLeft}></div>
      </div>
    </div>
  )
}
