import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { Select,DatePicker } from 'antd';
import RadioTree from '@com/radiotree'

export default function Index() {
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const onChange = (date, dateString)=>console.log(date, dateString);

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
        <div className={style.line}></div>
        <span>时间</span>
        <Select
          placeholder="全部类型"
          size="middle"
          style={{width: '126px', marginLeft: '12px'}}
        >
          <Option value="0">今日</Option>
          <Option value="1">本月</Option>
          <Option value="2">本年</Option>
          <Option value="3">自定义</Option>
        </Select> 
        <RangePicker onChange={onChange} size='middle' placeholder={['开始日期','结束日期']}></RangePicker>
      </div>
      <div className={style.content}>
        <RadioTree></RadioTree>
        <div className={style.contentRight}>
          <div className={style.rightTitle}>损耗分析</div>
        </div>
      </div>
    </div>
  )
}
