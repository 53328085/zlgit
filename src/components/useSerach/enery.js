import React from 'react'
import {Form, Select,Space, DatePicker} from 'antd'
import moment from 'moment'
const {Item} = Form
export default function  Enery() {
  
    const viewstyle = {
        display: 'flex',
         justifyContent: "space-between",
         flex: 1,
         'marginLeft': '32px',
        'paddingLeft': '32px',
        'borderLeft': '1px dotted #d7d7d7',
      }
      return (
        <div style={viewstyle}>
         <Item  label="能源类型" initialValue={1}    name="meterType">
          <Select
          
          style={{width: "112px"}}
          options={[
            {
              label: '电力',
              value: 1,
            },
            {
              label: '用水',
              value: 2,
            }]}
           />
          </Item>
        <Space size={16}>
          <Item  name="type" initialValue={0} >
             <Select style={{width: '80px'}}   options={[
              {value: 0, label: '日'},
              {value: 1, label: '月'},
              {value: 2, label: '年'},
             ]}
             ></Select>
          </Item>
  
          <Item nostyle name="date" initialValue={moment()}>
            <DatePicker placeholder="请选择日期"  style={{width: '160px'}} />
          </Item>       
        </Space>
        </div>
  )
}
