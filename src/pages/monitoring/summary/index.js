import React, { useState } from 'react'
import style from './style.module.less'
import { Select } from 'antd'
import Icard from './card'
import safeOperation from './images/safeOperation.png'
import carbonEmission from './images/carbonEmission.png'
import useCurr from './images/useCurr.png'
import useWater from './images/useWater.png'
import useGas from './images/useGas.png'
import waitOrder from './images/waitOrder.png'
import duringOrder from './images/duringOrder.png'
import waitInspection from './images/waitInspection.png'

export default function Index() {
  const { Option } = Select
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
        <Icard img={ carbonEmission } title={'年度碳排放(吨))'} value={'215.32'} />
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
    </div>
  )
}
