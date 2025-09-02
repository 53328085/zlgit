import React,{useState, useEffect} from 'react'
import {Form, Select } from 'antd'
 
import {useSelector} from "react-redux"
import {Editapi} from "@api/api"
import {selectProjectId} from "@redux/systemconfig"
const {Item} = Form
export default function  Index({ value, onChange }) {
      const projectId= useSelector(selectProjectId)
       const [energyoptions, setEnergyoptions] = useState()
       const instance = Form.useFormInstance()
       
      const [initialValue, setInitialValue] = useState()
      const getEnergyType = async () => {
        try {
          if (!Number.isInteger(parseInt(projectId))) return
          let { success, data } = await Editapi.QueryEnergyType(projectId)
          if (success && Array.isArray(data) && data?.length) {
            let types = data.map((d, index) => ({ label: d.name, value: d.type }))
            setEnergyoptions(types)
            instance.setFieldValue("meterType", types?.[0]?.value)
          } else {
            
            setEnergyoptions([])
            instance.setFieldValue("meterType", null)
          }
        } catch (error) {
          console.log(error)
        }
      }
      useEffect(()=>{
        if(Number.isInteger(parseInt(projectId))) {
             getEnergyType()

        }
      },[projectId])
      return ( 
        <Select
          value={value}
          style={{width: "112px"}}
          options={energyoptions}
          onChange={onChange}
           />
  )
}
