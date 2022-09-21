import React, { useState } from 'react'
import { Select, Checkbox, Tabs } from 'antd'
import style from './style.module.less'
import PlanPage from './inspectionPlan'
import ManagePage from './inspectionManage'

export default function Index() {
  const [displayCheck, setDisPlayCheck] = useState(true);
  const {Option} = Select;

  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  const options = [
    { label: '待处理(5)', value: 'wait' },
    { label: '处理中(3)', value: 'progress' },
    { label: '已完成(21)', value: 'finish' },
  ];

  const InspectionPlan = ()=>{
    return <PlanPage></PlanPage>
  }

  const InspectionManage = () =>{
    return <ManagePage></ManagePage>
  }

  const items = [
    { label: '巡检计划', key: 'InspectionPlan', children: InspectionPlan() },
    { label: '巡检管理', key: 'InspectionManage', children: InspectionManage() },
  ]

  const changeTab = key =>{
    if(key == 'InspectionPlan'){
      setDisPlayCheck(true);
    }else{
      setDisPlayCheck(false);
    }
  }
  return (
    <div>
      <div className={style.header}>
        <span style={{marginLeft: '12px'}}>区域选择</span>
        <Select
          placeholder="请选择区域"
          size="middle"
          style={{width: '330px', marginLeft: '12px'}}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
        </Select>
        {displayCheck? <Checkbox.Group options={options} onChange={onChange} style={{marginLeft: 24}}></Checkbox.Group> : null }
      </div>
      <div className={style.content}>
        <Tabs items={items} type="card" onChange={changeTab}></Tabs>
      </div>
    </div>
  )
}
