import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select,Input, Button } from 'antd';

export default function Index() {
  const {Option} = Select
  let cardList = [{
    Address:'正泰物联滨江园区-研发1号楼-1层-101',
    Status:'Normal',
    QuotaEnergy:'2.00',
    UsedEnergy:'1.00',
    SurEnergy:'1.00',
    Percent: 75
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
        <Select
          placeholder="请选择建筑物"
          size="middle"
          style={{width: '224px'}}
        >
          <Option value="0">全部建筑物</Option>
          <Option value="1">研发1号楼</Option>
          <Option value="2">研发2号楼</Option>
          <Option value="3">行政楼</Option>
        </Select>
        <Select
          placeholder="请选择楼层"
          size="middle"
          style={{width: '128px', marginLeft: '12px'}}
        >
          <Option value="0">全部楼层</Option>
          <Option value="1">1F</Option>
          <Option value="2">2F</Option>
          <Option value="3">3F</Option>
        </Select>
        <div className={style.line}></div>
        <span>周期</span>
        <Select
          placeholder="请选择楼层"
          size="middle"
          style={{width: '96px', marginLeft: '12px'}}
        >
          <Option value="0">月度</Option>
          <Option value="1">季度</Option>
          <Option value="2">年度</Option>
        </Select>
        <div className={style.line}></div>
        <div className={style.search}>
          <Input size="middle" placeholder='请输入房间号' style={{width:'260px'}} />
          <Button type='primary' size="middle" icon={<SearchOutlined />}>查询</Button>
        </div>
      </div>
      <div style={{paddingTop: '12px'}}>
        { cardList.map((item, index) => {
        return <div className={style.card} key={index}>
          <div className={style.cardTop}>
            <span>{item.Address}</span>
            <span>{item.Status == 'Normal' ?'能耗正常':'能耗异常'}</span>
          </div>
          <div className={style.cardMiddle}>
            <img src='./img/bg.png' style={{width:'60px',height:'60px'}} />

          </div>
        </div>
      }) }
      </div>
    </div>
  )
}