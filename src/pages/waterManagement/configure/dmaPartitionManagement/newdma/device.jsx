import React, { useState } from 'react'
import {Form, Select, Row, Col, Input,InputNumber, Cascader, Radio, Space, Switch, message} from "antd" 
import {useRequest} from "ahooks"
import {useLocation} from "react-router-dom"
import {useUpdateAlarmSetting,useGetAlarmSettings,useGetListDeviceCount} from "../api"
import { alarmoption, custvalidfn, rules} from "../data"
import { CustButton } from '@com/useButton'
import {isObject} from "@com/usehandler"
import Titlelayout from "@com/titlelayout";
import {TitleBox} from "../style"
export default function Index({projectId,id}) {
 const [form] = Form.useForm()
 const [devices, setDevices] = useState({})
 console.log("id",id)
 const getData = async()=> {
    try {
      let fag = [projectId,id].some(d => Number.isInteger(parseInt(d)))
      if(!fag) return
      let {success, data, errMsg} = await useGetListDeviceCount({projectId, id})
      if(success) {
        return Array.isArray(data) ? data : []
      }return Promise.reject(errMsg)
    } catch (error) {
      return Promise.reject(error)
    }

 }
 

 const {data, refresh} =  useRequest(getData, {
  refreshDeps: [projectId,id]
})

const onRest = ()=> {}
 

 

  const Ctitle =(<TitleBox ><span>分区报警设置</span><Space> <CustButton onClick={()=>{}} type="default">重置</CustButton>
           <CustButton onClick={()=>{}}>提交</CustButton></Space></TitleBox>)
  return (
    <div className='device'>
        <div className="up">
        <div className="item"   ></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        </div>
      <Titlelayout title={Ctitle} layout="flex" pv="16px">
      
      </Titlelayout>
    </div>
  )
}
