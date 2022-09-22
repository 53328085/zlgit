import React from 'react'
import { Select } from 'antd'
import style from './style.module.less'
import peidian from '@imgs/peidian.png'
const { Option } = Select;
export default function Index() {
  return (
    <div className={style.map}>
      <div className={style.mapheader}>
        <span className={style.areachoose}>区域选择</span>
        <Select defaultValue="" style={{ width: 330 }} size="default">
          <Option value="1">Jack</Option>
          <Option value="2">Lucy</Option>
        </Select>
      </div>
      <div style={{marginTop: 16}}>
        <img src={peidian}></img>
      </div>
    </div>
  )
}