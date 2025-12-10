// 下级区域
 
import React, {useState, useEffect} from 'react'
import {Form, TreeSelect, Space} from 'antd'
import { useSelector } from 'react-redux'
import { useGetSpaceTrees } from './usecusthook'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import {CtreeSelect} from "./style.js"
const { SHOW_PARENT } = TreeSelect
export default function Index({setexparams,id,isall=true,defaultId, ...rest }) {
  const projectId= useSelector(selectProjectId)  
  const areaId =typeof id =="number" ? id : useSelector(selectOneLevelDefaultId)
  const [areaLevels, allAreaId] =useGetSpaceTrees(projectId, areaId, isall)
  const instance = Form.useFormInstance()
  useEffect(() => {  
      
        instance?.setFieldValue("sublevel", defaultId || allAreaId )
        setexparams?.({ ...instance.getFieldsValue(true) })
      
    
  }, [areaLevels,allAreaId,defaultId])
  const onChange = (v) => { 
    setexparams?.({ ...instance.getFieldsValue(true) })
  }
  const tProps = {
    treeData:areaLevels, 
    onChange,
    treeCheckable: true,    
    showSearch:true,
    fieldNames: {
     label: 'name',
      value: 'areaId',
      children: 'nodes',
      
    },
    showCheckedStrategy: SHOW_PARENT,
    dropdownStyle:{
      maxHeight: 400,
      overflow: 'auto', 
    },
    style: {
      minWidth: '200px',
      maxWidth: "400px"
    },
    treeDefaultExpandAll:true,
    ...rest
  };


  return ( 
     <Form.Item label="区域选择" name="sublevel">
        <CtreeSelect     {...tProps}  /> 
     </Form.Item> 
  )
}
