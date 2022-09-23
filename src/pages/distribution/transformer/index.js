import React, { useState } from 'react'
import { Select } from 'antd'
import style from './style.module.less'
import TranCard from './transcard'
import UseTable from '@com/useTable'
import { columns } from './columns'

import SelectHeader from './selectHeader'
const { Option } = Select;


export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0) //变压器切换
  const [typeIndex,setTypeIndex] = useState(0) //参数类型
  const [typeDate,setTypeDate] = useState(0) //日期类型
  const list = [
    {
      name: '1#变压器',
      value: '100Kwh'
    },
    {
      name: '2#变压器',
      value: '200Kwh'
    },
    {
      name: '3#变压器',
      value: '300Kwh'
    },
  ]
  const type = [
    { name: '电压(V)', value: 0 }, { name: '电流(A)', value: 1 }, { name: '总有功功率', value: 2 }, 
    { name: '总无功功率', value: 3 }, { name: '总视在功率', value: 4 }, { name: '总功率因数', value: 5 }, 
    { name: '总负荷', value: 6 }, { name: '总负荷率', value: 7 }
  ]



  const choose = (i) => {
    console.log(i)
    setActiveIndex(i)
  }
  const TranCardProps = {
    activeIndex,
    choose
  }
  const SelectHeaderProps={
    typeIndex,
    setTypeIndex,
    typeDate,
    setTypeDate
  }
  return (
    <div className={style.transform}>
      <div className={style.transformheader}>
        <span className={style.areachoose}>区域选择</span>
        <Select defaultValue="" style={{ width: 330 }} size="default">
          <Option value="1">Jack</Option>
          <Option value="2">Lucy</Option>
        </Select>

        <span className={style.areachoose}>配电房</span>
        <Select defaultValue="" style={{ width: 330 }} size="default">
          <Option value="1">Jack</Option>
          <Option value="2">Lucy</Option>
        </Select>
      </div>
      <div className={style.transformContent} >
        <div className={style.transformList}>
          {
            list.map((item, index) => <TranCard message={item} key={index} {...TranCardProps} index={index} />)
          }
        </div>
        <div className={style.chatrts}>
          <div className={style.table}>
            <UseTable columns={columns} bordered className={style.transformerTable}></UseTable>
          </div>
          <div className={style.chartArea}>
            <SelectHeader {...SelectHeaderProps} type={type}/>
            <SelectHeader {...SelectHeaderProps} type={type}/>
          </div>
        </div>


      </div>
    </div>
  )
}