import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { Select, } from 'antd';
import RadioTree from '@com/radiotree'
import { Sankey } from '@ant-design/plots';

export default function Index() {
  const { Option } = Select;
  const data = [{
    source:'园区总进线',
    target:'A区总进线',
    value: 200,
  },{
    source:'A区总进线',
    target:'A区1号楼',
    value: 120,
  },{
    source:'A区总进线',
    target:'A区2号楼',
    value: 80,
  },{
    source:'A区1号楼',
    target:'1号楼1层',
    value: 40,
  },{
    source:'A区1号楼',
    target:'1号楼2层',
    value: 10,
  },{
    source:'A区1号楼',
    target:'1号楼3层',
    value: 10,
  },{
    source:'A区2号楼',
    target:'2号楼1层',
    value: 8,
  },{
    source:'A区2号楼',
    target:'2号楼2层',
    value: 27,
  },{
    source:'A区2号楼',
    target:'2号楼3层',
    value: 30,
  },{
    source:'2号楼2层',
    target:'2号楼2层203',
    value: 5,
  },{
    source:'2号楼2层',
    target:'2号楼2层204',
    value: 10,
  },{
    source:'2号楼2层',
    target:'2号楼2层205',
    value: 15,
  },]
  
  const config = {
    data: data,
    sourceField: 'source',
    targetField: 'target',
    weightField: 'value',
    nodeWidthRatio: 0.01,
    nodePaddingRatio: 0.03,

  };

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
      <div className={style.content}>
        <RadioTree></RadioTree>
        <div className={style.contentRight}>
          <div className={style.rightTitle}>能源流向</div>
          <Sankey style={{width:'1300px',height:650,margin:'24px'}} {...config} />
        </div>
      </div>
    </div>
  )
}
