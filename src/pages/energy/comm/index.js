import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { Select,DatePicker,Table,Button } from 'antd';
import Searchtree from './searchTree';
import Barchart from './barChart';
import Ringchart from './ringChart';
import Percent from './percent'

export default function Index() {
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const RegionList = [{
    Id:0,
    Name:'正泰物联全部园区'
  },{
    Id:1,
    Name:'正泰物联滨江园区'
  },{
    Id:2,
    Name:'正泰物联温州园区'
  }];
  const BuildingList = [{
    Id:0,
    Name:'全部建筑物'
  },{
    Id:1,
    Name:'研发1号楼'
  },{
    Id:2,
    Name:'研发2号楼'
  }];
  const FloorList = [{
    Id:0,
    Name:'全部楼层'
  },{
    Id:1,
    Name:'1层'
  },{
    Id:2,
    Name:'2层'
  }];

  const [showDate, setShowDate] = useState(false);

  const onSelect = (value) => {
    value == 3 ? setShowDate(true): setShowDate(false)
  }
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
          { RegionList.map((item,index)=>{
            return <Option key={index} value={item.Id}>{item.Name}</Option>
          }) }
        </Select>
        <div className={style.line}></div>
        <Select
          placeholder="请选择建筑物"
          size="middle"
          style={{width: '224px', marginLeft: '12px'}}
        >
          { BuildingList.map((item,index)=>{
            return <Option key={index} value={item.Id}>{item.Name}</Option>
          }) }
        </Select>
        <Select
          placeholder="请选择楼层"
          size="middle"
          style={{width: '128px', marginLeft: '12px'}}
        >
          { FloorList.map((item,index)=>{
            return <Option key={index} value={item.Id}>{item.Name}</Option>
          }) }
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
          onSelect={onSelect}
        >
          <Option value="0">今日</Option>
          <Option value="1">本月</Option>
          <Option value="2">本年</Option>
          <Option value="3">自定义</Option>
        </Select> 
        { showDate ? <RangePicker style={{marginLeft:12}} onChange={onChange} size='middle' placeholder={['开始日期','结束日期']}></RangePicker> : null }
        {showDate ? <Button style={{marginLeft:12}} type='primary' size='middle'>查询</Button> : null}
      </div>
      <div className={style.content}>
        <Searchtree></Searchtree>
        <div className={style.contentMiddle}>
          <span className={style.title}>公共能耗</span>
          <Barchart></Barchart>
        </div>
        <div className={style.contentRight}>
          <div className={style.rightTop}>
            <span className={style.title}>公共能耗占比</span>
            <Ringchart></Ringchart>
          </div>
          <Percent></Percent>
        </div>
      </div>
    </div>
  )
}
