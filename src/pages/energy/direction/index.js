import React, {useState, useEffect, Fragment} from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select,Input, Button, Radio } from 'antd';

export default function Index() {
  const { Option } = Select;
  const options = [
    {
      label: '按回路',
      value: 1,
    },
    {
      label: '按建筑',
      value: 2,
    },
  ];
  const [value, setValue] = useState(1);
  const onChange = ({target:{value}})=>{
    setValue(value)
  }

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
        <div className={style.contentLeft}>
          <Radio.Group className={style.radioCss} options={options} onChange={onChange} value={value} />
        </div>
        <div className={style.contentRight}></div>
      </div>
    </div>
  )
}
