 // 车间
 import React, { useState, useEffect } from 'react'
 import {Form, Select} from 'antd'
 import {useRequest} from 'ahooks'
  
 import {Editapi} from '@api/api'
 const {Item} = Form
  
 export default function Index(props) {
   const {projectId,  setexparams, label="", itemprops={},selectprops={}, onchange } = props
   console.log(onchange)
   const form = Form.useFormInstance()
   const [data, setData] = useState([])
   const getData = async () => {
     try {    
      let {data, success} =  await Editapi.FilterDeviceStyle(projectId)
      let filte = data?.filter(d => d.deviceStyle!=6)
      if(success && Array.isArray(filte) && filte?.length > 0) { 
        
            setData(props.all ? [{deviceStyle: 0, name: "全部类型"}, ...filte] : filte)  
            form.setFieldValue('deviceStyle', props.all ? 0 : filte[0].id)  
            onchange && onchange(props.all ? 0 : filte[0].id)
         
        
      }else {
         setData([]) 
         form.setFieldValue('deviceStyle', null) 
         onchange && onchange(null) 
      }
 
     } catch (error) {
      
     
     }
    
   }
  useEffect(() =>  {
    if(Number.isInteger(projectId)) {
      getData().then(() => {
       let values =form.getFieldsValue()    
       setexparams && setexparams(values)
      })
     }
  }, [projectId,  setexparams])
   return ( 
     <Item name="deviceStyle"   {...itemprops} >
       <Select options={data}   fieldNames={{value: "deviceStyle", label: "name"}} onChange={onchange && onchange} {...selectprops} ></Select>
       </Item>
    )
 
 }