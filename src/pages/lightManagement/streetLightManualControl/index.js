import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form, Select, Input,Checkbox,Typography, message } from "antd";
import Pagecount from "@com/pagecontent";
import {useSelector} from "react-redux"
 import {selectProjectId} from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import {Cslider} from "@com/Custantd"
import { CustButtonT, ExportExcel, ChartList } from "@com/useButton";
import UseTree from "@com/useTree"
import { options,states } from "./data";
import CModal from "@com/useModal";
import {isObject} from "@com/usehandler"
 import { useList,useSetControl, useTree } from "./api.js";
 import opensvg from './svgs/open.svg'
 import closesvg from './svgs/close.svg'
import { Mainwrap, TitleBox } from "./style";
 
const {Text} = Typography
export default function Index() {
   const [treeId, setTreeId] = useState(null)
   const [lingts, setLights] = useState({})
   const [indeterminate, setIndeterminate] = useState(false)
   const [checkedList, setCheckedList] = useState([]);
   const [line, setLine] = useState(0)
   const [checked, setChecked] = useState(false)
   const [checkedLen, lightName] = useMemo(()=> {
       let len =  checkedList?.length
       let names = lingts.details?.filter?.(d =>checkedList.includes(d.id))?.map?.(d=> d.name) || []
       return [len, names]
   }, [checkedList])
  const [form] = Form.useForm();
 
  const  projectId  =  useSelector(selectProjectId)
  const mRef=useRef()
 // console.log(lingts)
  const getData = async () => {
    if(!Array.isArray(treeId)) return;

    const {alike="", type=0,ioState} = form.getFieldsValue()
    try {
      let { success,data } = await useList({},{
        areaIds:treeId,
        projectId,
        alike,
         type,
         ioState
      });
      if(success && isObject(data)) {
        data?.details?.forEach?.(d => {
          d.close = d.fields?.some(f => f?.name?.includes?.("亮度") && f.value==0)
        })
        data.idlist = data?.details?.map(d => d.id)
        setLights(data)
      }else {
        setLights({})
      }
    } catch (error) {
       console.log(error)
    }
  };

 useEffect(()=> {
   if(Number.isInteger(projectId)&& Array.isArray(treeId)) {
    getData()
   }
 },[projectId, treeId, line])
 const checkChange=(c)=> {
  // console.log(c)
   setCheckedList(c)
   setIndeterminate(c.length !== lingts.idlist?.length)
   setChecked(c.length == lingts.idlist?.length)
   
 }
 const allChagne =(e)=> {
    if(e.target.checked) {
      setCheckedList(lingts.idlist) 
      setChecked(true)
    }else {
      setCheckedList([])
      
      setChecked(false)
    }
    setIndeterminate(false)
 }
const [brightness, setBrightness] = useState(0)
const copy= useMemo(()=> {
  if (brightness>0) {
    return  "开启"+ lightName.join()+ "。亮度值为："+brightness
  }else {
    return "关闭:"+lightName.join()
  }
},[brightness,lightName])
const lingthChnage=(v)=> {
  setBrightness(v)
}

 const onControl=()=> {
   if(checkedList.length==0) return message.warning("请选择要控制的路灯")
    mRef.current.onOpen()
 }
 const onOk= async()=> {
   let points =  lingts?.details?.filter(l => checkedList.includes(l.id))?.map(m => ({gateway:m.gateway, dev:m.dev}))
   try {
    let body ={
       projectId,
       brightness,
       points, 
    }
     let {success, errMsg} = await  useSetControl({}, body)
     if(success) {
       getData()
       message.success("设置成功")
       mRef.current.onCancel()
     }else {
       message.warning(errMsg || "数据出错")
     }
   } catch (error) {
    
   }
 }
  const title = (
    <TitleBox>
      <span>路灯列表</span>
      <Space size={16}>
        <Cslider onChange={lingthChnage}  />
        <CustButtonT text="control" onClick={onControl}></CustButtonT>
      </Space>
    </TitleBox>
  );
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <div className="left">
           <UseTree areaId={0} title="路灯设备列表" setTreeId={setTreeId} setLine={setLine} showline={true} datatype={line==0 ? 0 : 4} energytype={1} ></UseTree>
        </div>
        <div className="right">
          <div className="up">
            <Form form={form} layout="inline">
              <Space size={32}>
              <Form.Item name="alike" label="路灯名称/编号">
                <Input placeholder="请输入路灯名称或编号" allowClear></Input>
              </Form.Item>
              <Form.Item name="type" label="路灯类型" initialValue={0}>
                <Select options={options} style={{width: "200px"}}></Select>
              </Form.Item>
              <Form.Item name="ioState" label="开关状态" initialValue={0}>
                <Select options={states} style={{width: "200px"}}></Select>
              </Form.Item>
              <Form.Item>
                <CustButtonT text="search" onClick={getData}></CustButtonT>
              </Form.Item>
              </Space>
            </Form>
          </div>
          <Titlelayout layout="flex" title={title}>
            <div className="content">
              <div className="tip">
               <Space><Checkbox indeterminate={indeterminate} checked={checked} onChange={allChagne}>全选</Checkbox><Text>已选择{checkedLen}台</Text></Space>
               <Text>开启/关闭: {lingts?.openNum}/{lingts?.closeNum}</Text>
              </div>
              <Checkbox.Group onChange={checkChange} value={checkedList}>
              <div className="lights">
                   {
                    lingts?.details?.map?.(l => (<div className={l.close ? "light close" : "light" }>
                       <Checkbox value={l.id}>
                      <div>
                        {l.name}
                      <div > {`(${l.cSn})`} </div>
                      </div>
                      <div className="imgbox">
                      <img src={l.state==1 ? opensvg : closesvg} className="img"></img>
                      {
                        l.fields?.map(f=> (<span>{f.name}:{f.value}</span>))
                      }
                      </div>
                      </Checkbox>
                    </div>))
                   }
              </div>
              </Checkbox.Group>
            </div>

          </Titlelayout>
        </div>
        <CModal mold="cust" type="question" title="远程控制" width={592} ref={mRef} onOk={onOk} >
        确认要远程<Text strong>{copy}</Text> ？
        </CModal>
      </Mainwrap>
    </Pagecount>
  );
}
