import React, { useRef, useState } from 'react'
import {Form, Select, Row, Col, Input,InputNumber, Cascader, Radio, Space, Switch, message} from "antd" 
import {useRequest, useAntdTable} from "ahooks"
import {useLocation} from "react-router-dom"
import {useUpdateAlarmSetting,useGetAlarmSettings,useGetListDeviceCount,useGetListDevicePaged} from "../api"
import { alarmoption, custvalidfn, rules} from "../data"
import { CustButton } from '@com/useButton'
import {isObject} from "@com/usehandler"
import Titlelayout from "@com/titlelayout";
import Custmodal from '@com/useModal'
import {TitleBox} from "../style"
import icon1 from '../icon/12.png'
import icon2 from '../icon/22.png'
import icon3 from '../icon/33.png'
import icon4 from '../icon/44.png'
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
        return isObject(data) ? data : {}
      }return Promise.reject(errMsg)
    } catch (error) {
      return Promise.reject(error)
    }

 }
 

 const {data:deviceCount,  refresh} =  useRequest(getData, {
  refreshDeps: [projectId,id]
})


const [sorting, setSorting] = useState("")
const [filterInfo, setFilterInfo] = useState("")
const [partitionType, setPartitionType] = useState("")
const getListData = async({current, pageSize}, formData)=> {
    try {
      let body = {
        pageNum: current,
        pageSize,
        sorting,
        projectId,
        id,
        filterInfo,
        partitionType
      }
      let {} = await useGetListDevicePaged({},body)  
    } catch (error) {
        
    }
}

useAntdTable(getListData, {
    refreshDeps: [projectId,id, sorting, filterInfo, partitionType]
})
const onRest = ()=> {}
const onSearch =(v)=> {
 console.log(v)
}
const mRef=useRef()
const onOK=()=> {

}
 

  const Ctitle =(<TitleBox ><span>关联表具</span><Space><span>表具查询</span> <Input.Search placeholder='请输入表具名称或编号' allowClear  onSearch={setFilterInfo}></Input.Search> <CustButton onClick={()=>{}} type="danger">删除</CustButton>
           <CustButton onClick={()=>{}}>新增</CustButton></Space></TitleBox>)
  return (
    <div className='device'>
        <div className="deviceUp" >
        <div className={"item "}  >
          <div className='imgbg'>
          <img src={icon1} alt='' className='img'></img>
          </div>
          <div className='info'>
           <span className='num'>{deviceCount?.totalCount}</span>
           <span className='tip'>
            表具总数
           </span>
          </div>
        </div>
        <div className="item">
        <div className='imgbg'>
          <img src={icon2} alt='' className='img'></img>
          </div>
          <div className='info'>
           <span className='num'>{deviceCount?.manageMeterCount}</span>
           <span className='tip'>
            分区总表
           </span>
          </div>
       
        </div>
        <div className="item">
        <div className='imgbg'>
          <img src={icon3} alt='' className='img'></img>
          </div>
          <div className='info'>
           <span className='num'>{deviceCount?.largeConsumerCount}</span>
           <span className='tip'>
            分区分表
           </span>
          </div>
      
        </div>
        <div className="item">
        <div className='imgbg'>
          <img src={icon4} alt='' className='img'></img>
          </div>
          <div className='info'>
           <span className='num'>  {deviceCount?.waterMeterCount}</span>
           <span className='tip'>
            分区用水表
           </span>
          </div>
      
        </div>
        </div>
      <Titlelayout title={Ctitle} layout="flex" pv="16px">
      
      </Titlelayout>
      <Custmodal title="表具选择"  ref={mRef}  mold="cust" width={1086}  onOk={onOK} >
        
       </Custmodal>
    </div>

  )
}
