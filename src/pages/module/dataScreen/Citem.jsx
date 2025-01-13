import React from 'react'
import {Form, Space, Select, Input} from 'antd'
import {useSelector} from "react-redux"
import { adaptation } from "@redux/systemconfig";
import screenes from '../../screen'
import {useTranslation} from "react-i18next"
const {Item} = Form


 
 
  const Selectmod = ({num, value, onChange}) => {
    const moudles = []
    if (num > 0) {
        Array.from({length: num}, (v, i) => {
             let n = i + 1
             moudles.push({value: n.toString(), label: '模板'+ n})
        })
    }
    const opchange = (e) => {
        onChange(e)
    }
    console.log(moudles)
    return (
    <Select defaultValue={value} options={moudles} style={{width: "240px"}} onChange={opchange}></Select>
    )
  }
export default function Citem({label, name1, name2, form}) { 
  const {laptop} = useSelector(adaptation)
  const {t} =useTranslation("common","comm")
    const opChange = (e, filed) => {
      if(e == 0) {
        form.setFieldValue(filed, '')
      }
    }
    return (
        <Item label={label}>
        <Space  size={16} align='start' styles={{width: 'auto'}}>

        <Item name={name1} noStyle >
            <Select options={[
                {value: 0, label:t("common:Disable")},
                {value: 1, label:t("common:Standard"), disabled: screenes[name2] == 0},
                {value: 2, label: t("common:Advanced")}
            ]} style={{width: "130px"}} onChange={(e) => opChange(e, name2)}></Select>
         </Item>
         <Item  noStyle shouldUpdate={(pre, cur) => pre[name1]!=cur[name1]}>
                 {
                   ({getFieldValue}) => {
                      let type = getFieldValue(name1)
                      return type == 0 ? <Item name={name2}><Input style={{display: 'none'}} /></Item> : type == 1 ? 
                     <Item name={name2} rules={[{
                        required: true,
                        message: `${label}数据是必须的`
                       }]}><Selectmod num={screenes[name2]} /></Item>
                       : 
                       <Item name={name2} rules={[{
                        required: true,
                        message: `${label}数据是必须的`
                       }]}><Input placeholder='请输入大屏网址' style={{width: laptop ? "500px" : "800px"}}   allowClear  /></Item>
                   }  
                  
                 }
                 
         </Item>
              </Space>
     </Item>
 
    )
 }
