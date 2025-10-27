import React,{  useState } from 'react'
import {  Form,  } from 'antd'
 
import Pagecount from '@com/pagecontent' 
 
 
import {Mainbox } from './style'
 
import {Serach} from "@com/comstyled"
import CustContext from '@com/content.js'
import Light from './light'
import Line from './line'
 


export default function Index() {
  const [form] = Form.useForm()
  const [value, setvalue] = useState("1")
  const tabs = [
    {
      label: "单灯控制", key:"1"
    },
    {
      label: "单线控制", key:"2"
    },
  ]
  const propsData ={
    value,
    setvalue,
    tabs,
  }
 
   
 const [formData, setFormData] = useState("")
 const onSearch=(v)=> {
   setFormData(v)
 }
 
 
 

 const Com = {
  "1": Light,
  "2": Line
 }[value]
  return (
    <Pagecount pd="0px"   bgcolor="none">
        <Mainbox>
        <div className="search">
          <Form form={form} layout="inline"   colon={false} >
             <Form.Item   name="alike">
              <Serach   placeholder="请输入方案名称或创建人" onSearch={onSearch} ></Serach>
            </Form.Item>
          </Form>
         
         </div>
         <CustContext.Provider value={propsData}>
         <Pagecount pd="0" bgcolor="none" >
          <Com formData={formData} />
 
      </Pagecount>
      </CustContext.Provider>
      </Mainbox>
    </Pagecount>
  )
}

