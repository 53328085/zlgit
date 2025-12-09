// 区域层级
 
import React, {useState, useEffect} from 'react'
import {Form, Select, Space} from 'antd'
import { useSelector } from 'react-redux'
import { useGetQueryAll,useGetAllLevel } from './usecusthook'
import {selectProjectId, adaptation} from '@redux/systemconfig.js'
//import {w200 } from './data'
import {CSelect} from "./style"
export default function Index({setexparams}) {
  const projectId= useSelector(selectProjectId)  
  const laptop = useSelector(adaptation)?.laptop
  const areaLevels =useGetAllLevel(projectId)
 
  const instance = Form.useFormInstance()
   const w200= laptop?{width:160}:{width:200}
  const level = Form.useWatch("levelnum", instance)
  const subopt = useGetQueryAll(projectId, level)
  console.log(subopt)
  useEffect(() => {  
    instance?.setFieldValue("levelnum", areaLevels?.[0]?.level)
 
  }, [areaLevels])
  useEffect(() => {
    instance.setFieldValue("selectlevel", subopt?.map(s =>s.id) )
    setexparams?.({ ...instance.getFieldsValue(true) })
  }, [subopt])
 

 const onChange = (value) => { 
    setexparams?.({ ...instance.getFieldsValue(true) })
  }
  return (
    <Space size={16}>
     <Form.Item label="区域级别" name="levelnum">
        <Select options={areaLevels} style={w200} fieldNames={{label: 'name', value: 'level'  }}  ></Select>
     </Form.Item>
     <Form.Item label="区域选择" name="selectlevel">
        <CSelect mode="multiple" options={subopt} style={{minWidth: 200}} fieldNames={{label: 'name', value: 'id'}} onChange={onChange} ></CSelect>
     </Form.Item>
    </Space>
  )
}
