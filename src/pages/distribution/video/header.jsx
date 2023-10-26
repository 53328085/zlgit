import React from 'react'
import { Select } from 'antd'
import style from './style.module.less'
export default function Header() {
  const { Option } = Select
  return (
    <div className={style.select}>
        <div style={{marginRight: 16}}>园区选择</div>
        <Select
          placeholder="Select a option and change input text above"
          defaultValue="1"
          style={{ width: 320,marginRight:156 }}
          size="default"
        >
          <Option value="1">滨江园区</Option>
          <Option value="2">温州园区</Option>
        </Select>
        <div>共 4 台摄像机</div>
        <div className={style.line}></div>
        <div>在线: &nbsp;&nbsp;4</div>
        <div className={style.line}></div>
        <div>离线: &nbsp;&nbsp;0</div>
      </div>
  )
}
