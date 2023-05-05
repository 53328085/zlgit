import React from 'react'
import {Form, Space, Select, Input} from 'antd'
const {Item} = Form

const opts = [
    {value: 0, label: "禁用"},
    {value: 1, label: "标准"},
    {value: 2, label: "高级"}
  ]
  const Options = (
    <Select options={opts} style={{width: "130px"}}></Select>
  )
  const moudles = [{value: '1', label: '模板01'}, {value: '2', label: '模板02'}]
  const Selectmod = (
    <Select options={moudles} style={{width: "130px"}}></Select>
  )
export default function Citem({label, name1, name2}) { 
    return (
        <Item label={label}>
        <Space  size={16} align='start'>

        <Item name={name1} noStyle >
              {Options}
         </Item>
         <Item  noStyle shouldUpdate={(pre, cur) => pre[name1]!=cur[name1]}>
                 {
                   ({getFieldValue}) => {
                      let type = getFieldValue(name1)
                      return type == 0 ? <Item name={name2}><Input style={{display: 'none'}} /> </Item> : type == 1 ? 
                     <Item name={name2} rules={[{
                        required: true,
                        message: `${label}数据是必须的`
                       }]}>{Selectmod}</Item>
                       : 
                       <Item name={name2} rules={[{
                        required: true,
                        message: `${label}数据是必须的`
                       }]}><Input placeholder='请输入大屏网址' style={{width: "800px"}}   allowClear  /></Item>
                   }  
                  
                 }
                 
         </Item>
              </Space>
     </Item>
 
    )
 }
