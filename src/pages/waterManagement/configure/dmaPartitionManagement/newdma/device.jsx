import React, { useRef, useState } from 'react'
import {Form, Select, Row, Col, Input,InputNumber, Cascader, Radio, Space, Popconfirm, message} from "antd" 
import {useRequest, useAntdTable} from "ahooks"
import {useLocation, useNavigate} from "react-router-dom"
import {useGetListUnboundDevicePaged,useGetListDeviceCount,useGetListDevicePaged, useAddDevices,useReomveDevices} from "../api"
import {unbindcols,purpose,direction,userType,bindcols} from "../data"
import { CustButton } from '@com/useButton'
import {isObject} from "@com/usehandler"
import Titlelayout from "@com/titlelayout";
import Custmodal from '@com/useModal'
import Usetabel from "@com/useTable"
import {TitleBox,Mcontent} from "../style"
import icon1 from '../icon/12.png'
import icon2 from '../icon/22.png'
import icon3 from '../icon/33.png'
import icon4 from '../icon/44.png'
import {AreaSelect} from "@com/useSerach/comhead" 
export default function Index({projectId,id}) {
 const [form] = Form.useForm()
 const [rform] = Form.useForm()

 const [sorting, setSorting] = useState("")
const [filterInfo, setFilterInfo] = useState("")
const [partitionType, setPartitionType] = useState("")
 
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





// 绑定的表具

const getListData = async({current, pageSize}, formData)=> {
    try {
      let fag = [parseInt(id), parseInt(projectId)].every((d)=>Number.isInteger(d))
      console.log("fag",fag)
      if(!fag) return // 没有id是新增
      let body = {
        pageNum: current,
        pageSize,
        sorting,
        projectId,
        id,
        filterInfo,
        partitionType
      }
      let {success, total, data, errMsg} = await useGetListDevicePaged({},body)  
      if(success && Array.isArray(data)) {
        return {
          list:data,
          total,
        }
      }else {
        if(!success) message.warning(errMsg)
        return {
          list:[],
          total:0
        }
      }
    } catch (error) {
        
    }
}
const [selectedRowKeysed, setSelectedRowKeysed] = useState([]);
const onSelectChanged = (newSelectedRowKeys) => {
  setSelectedRowKeysed(newSelectedRowKeys);
}
const rowSelectioned = {
  selectedRowKeys: selectedRowKeysed,
  onChange: onSelectChanged,
}
  const {tableProps:bindtable, refresh:bindrefresh} =useAntdTable(getListData, {
    defaultPageSize:20,
    refreshDeps: [projectId,id, sorting, filterInfo, partitionType]
})
const bindChange =(pagination, filters, sorter)=> {
   const {order, field} = sorter
   if(order=="descend") {
    setSorting(field + " desc")
   }else {
    setSorting(field)
   }
   
}

// 删除DMA分区设备
const reomveDevices = async()=> {
  try {
    if(selectedRowKeysed.length==0) return message.warning("请选择要删除的表具")
    let body = {
      deviceIdList: selectedRowKeysed,
      projectId,
      id,
    }
    let {success, errMsg} = await useReomveDevices({}, body)
    if(success) {
      message.success("删除成功")
      bindrefresh()
      refresh()
    }else {
      message.warning(errMsg || "数据出错")
    }
  } catch (error) {
    
  }

}


// 未绑定表具
const [open, setOpen] = useState({open: false})
 
const getunbindData = async({current, pageSize}, formData)=> {
  try {
    let {areaId=0, filterInfo=""} = formData
    let fag = [parseInt(id), parseInt(projectId)].every((d)=>Number.isInteger(d))
    if(!open.open) return
 //   if(!fag) return  
    let body ={
      pageNum:current,
      pageSize,
      sorting:"",
      projectId,
      id:parseInt(id),
      filterInfo,
      areaId: areaId==0 ? null : areaId,
    }
    let {success, data, total, errMsg} = await useGetListUnboundDevicePaged({},body)
    if(success && Array.isArray(data)) {
       return {
        list: data,
        total
       }
    }else {
      if(!success) message.warning(errMsg)
      return {
        list: [],
        total:0
      }
    }
  } catch (error) {
    
  }
}
const {tableProps: unbiddata, search} =  useAntdTable(getunbindData, {
  form,
  defaultPageSize:15,
  refreshDeps: [projectId,id,open]
})
const {submit} = search
const onRest = ()=> {}
const onSearch =(v)=> {
 console.log(v)
}
const mRef=useRef()

 
const onAdd = ()=> {
  setOpen({open:true})
  mRef.current.onOpen()
}
const [selectedRowKeys, setSelectedRowKeys] = useState([]);
const onSelectChange = (newSelectedRowKeys) => {
  setSelectedRowKeys(newSelectedRowKeys);
}
const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
}
const onOK=async()=> {
  try {
    if(selectedRowKeys?.length <1) return message.warning("请选择表具")
      let values = await rform.validateFields()
      let body= {
        deviceIdList:selectedRowKeys,  
        projectId , 
        id:parseInt(id),
        ...values,
      }
    let {success,errMsg} = await useAddDevices({},body)
    if(success) {
      message.success("添加设备成功")
      mRef.current.onCancel()
      setOpen({open:false})
      refresh()
      bindrefresh()
    }else {
      message.warning(errMsg || "数据出错")
    }
  } catch (error) {
    
  }
 
}

  const Ctitle =(<TitleBox >
    <span>关联表具</span><Space><span>表具查询</span> <Input.Search placeholder='请输入表具名称或编号' allowClear  onSearch={setFilterInfo}></Input.Search><Popconfirm title="确认删除" onConfirm={reomveDevices}><CustButton   type="danger">删除</CustButton></Popconfirm>
           <CustButton onClick={onAdd}>新增</CustButton></Space></TitleBox>)
  return (
    <div className='device'>
        <div className="deviceUp" >
        <div className={`item ${partitionType=="" ? 'active' : ""}`} onClick={()=> setPartitionType("")} >
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
        <div className={`item ${partitionType==1 ? 'active' : ""}`} onClick={()=> setPartitionType(1)}>
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
        <div className={`item ${partitionType==3 ? 'active' : ""}`} onClick={()=> setPartitionType(3)}>
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
        <div className={`item ${partitionType==2 ? 'active' : ""}`} onClick={()=> setPartitionType(2)}>
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
      <Usetabel columns={bindcols}  {...bindtable} rowKey={(row)=>row.id} 
    rowSelection={rowSelectioned}
    onChange={bindChange}
   scroll={{
    y:580
   }}></Usetabel>
      </Titlelayout>
      <Custmodal title="表具选择"  ref={mRef}  mold="cust" width={1086}  onOk={onOK} >
<Mcontent>
  <div className='mleft'>
  <Form form={form} layout="inline" className='form'   preserve={false}>
    
<Form.Item label="区域选择" name="areaId" initialValue={0}>
  <AreaSelect isall={{name: "全部",id: 0}} style={{width: "160px"}} />
</Form.Item>
<Form.Item label="表具" name="filterInfo">
  <Input placeholder='请输入表具编号/名称' style={{width: "160px"}}></Input>
</Form.Item>
<Form.Item>
  <CustButton onClick={submit}>查询</CustButton>
</Form.Item>
 
  </Form>
   <Usetabel columns={unbindcols}  {...unbiddata} rowKey={(row)=>row.id} 
    rowSelection={rowSelection}
   scroll={{
    y:580
   }}></Usetabel>
  </div>
  <div className='mright'>
   <Form form={rform} preserve={false}>
      <Form.Item label="表具用途" name="meterPurpose" initialValue={1}>
      <Radio.Group
        options={purpose} 
        optionType="button"
        buttonStyle="solid"
      />
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(cur, pre)=>cur.meterPurpose!=pre.meterPurpose}>
        {
          ({getFieldValue})=> {
            let type = getFieldValue("meterPurpose")
            if(type==1) {
              return (
                <Form.Item label="供水方向" name="waterSupplyDirection" initialValue={1}>
                <Radio.Group options={direction}></Radio.Group>
              </Form.Item>
              )
            }else if(type==2) {
              return (
                <Form.Item label="用水类型" name="waterType" initialValue={1}>
                  <Select options={userType}></Select>
              </Form.Item>
              )
            }else {
              return null
            }

          }
        }
      </Form.Item>
     
   </Form>
  </div>
</Mcontent>
       </Custmodal>
    </div>

  )
}
