import React, { useState } from 'react'
import {useRequest} from 'ahooks'
import {UserReportApi} from '@api/api.js'
import style from './style.module.less'
import { Select,Radio, DatePicker } from 'antd'
import PageList from './pageList'
import searchFile from './images/searchFile.png'
import logo from './images/logo.png'
import firstPage from './images/firstPage.png'


export default function Index() {
  const {Option} = Select
  const options = [{
    label:'月度报告',
    value:'month'
  },{
    label:'年度报告',
    value:'year'
  }]
  const [radioValue,setRadioValue] = useState('month');
  const changeType = ({ target: { value } }) =>{
    setRadioValue(value);
  }

  const changeDate = (date, dateString) =>{
    console.log(date,dateString)
  }

  return (
    <div className={style.content}>
      <div className={style.selectDiv}>
        <div className={style.item}>
          <div className={style.itemTitle}>园区选择</div>
          <Select
            placeholder="请选择园区"
            style={{width: '324px'}}
          >
            <Option value="1">正泰物联全部园区</Option>
            <Option value="2">正泰物联滨江园区</Option>
            <Option value="3">正泰物联温州园区</Option>
          </Select>
        </div>
        <div className={style.item}>
          <div className={style.itemTitle}>报告类型</div>
          <Radio.Group options={options} value={radioValue} optionType='button' onChange={changeType} buttonStyle="solid"></Radio.Group>
        </div>
        <div className={style.item}>
          <div className={style.itemTitle}>日期范围</div>
          <DatePicker style={{width:324}} onChange={changeDate} picker={radioValue}></DatePicker>
        </div>
        <div className={style.button}>
          <img src={searchFile} className={style.searchFile}></img>
          <span>生成报告</span>
        </div>
      </div>
      <div className={style.report}>
        <div className={style.firstPage}>
          <div className={style.header}>
            <img src={logo} className={style.logo}></img>
            <span>正泰智慧能源服务平台</span>
          </div>
          <div className={style.mainTitle}>运行监控报告</div>
          <div className={style.mainDetail}>
            <div className={style.detailItem}>项目名称: <span style={{marginLeft:18}}>正泰物联</span></div>
            <div className={style.detailItem}>项目地址: <span style={{marginLeft:18}}>浙江省杭州市滨江区月明路560号</span></div>
            <div className={style.detailItem}>报告日期: <span style={{marginLeft:18}}>2022-08-10</span></div>
          </div>
          <img src={firstPage} className={style.backgroundImg}></img>
        </div>
        <PageList></PageList>
      </div>
    </div>
  )
}
