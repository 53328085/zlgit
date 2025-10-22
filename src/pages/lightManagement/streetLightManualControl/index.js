import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form, Select, Input,Checkbox,Typography, message, Switch } from "antd";
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
 import { useList,useSetControl, useOneByOneControl, useLineControl} from "./api.js";
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
   const single = line==1
   const [node, setNode] = useState()
   const [checked, setChecked] = useState(false)
   const [onOff, setOnoff] = useState(false)
   const [checkedLen, lightName] = useMemo(()=> {
       let len =  checkedList?.length
       let names = lingts?.details?.filter?.(d =>checkedList.includes(d.id))?.map?.(d=> d.name) || []
       return [len, names]
   }, [checkedList, lingts])
  const [form] = Form.useForm();
 
  const  projectId  =  useSelector(selectProjectId)
  const mRef=useRef()
 // console.log(lingts)
  const getData = async () => {
    if(!Array.isArray(treeId)) return;
    if(!treeId?.[0]) return
  //  console.log("treeId",treeId)
    const {alike="", type=0,ioState} = form.getFieldsValue()
    try {
      let body = line==0 ? {
        areaIds:treeId,
        projectId,
        alike,
         type,
         ioState
      }: {
        lineId: treeId?.[0],
        projectId,
        alike,
         type,
         ioState,
         areaIds:[]
         
      }
      let { success,data } = await useList({},body);
      if(success && isObject(data)) {
        data?.details?.forEach?.(d => {
          d.close = d.fields?.some(f => f?.name?.includes?.("亮度") && f.value==0)
        })
        data.idlist = data?.details?.map(d => d.id)
        if(Array.isArray(data?.details) && data?.details?.length>0) {
           let ids = data.details.map(d =>d.id)
           let checked = checkedList.filter(d => ids.includes(d))
           setCheckedList(checked)
           setChecked(ids?.length==checked?.length)
           if (single) {
              setOnoff(data.details[0].state==2 ? 1 :2) // 状态是1 开， 显示 关

           }

        }else {
          setCheckedList([])
          setChecked(false)
        }
        setLights(data)
      }else {
        setLights({})
        setCheckedList([])
        setChecked(false)
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
   console.log(c)
   setCheckedList(c)
   setIndeterminate(c.length !== lingts.idlist?.length&& c.length >0)
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
  let str =""
  
  if (brightness>0) {
    str=  "开启"+ lightName.join()+ "。亮度值为："+brightness
  }else {
    str= "关闭:"+lightName.join()
  }
  let str2 = onOff==1 ? `开启${node?.name}线路` :  `关闭${node?.name}线路`
  return single ? str2 : str;
},[brightness,lightName,single, node,onOff])
const lingthChnage=(v)=> {
  setBrightness(v)
}
 const stateRef = useRef()
 const onControl=(e)=> {
   if(single) {
     if(Array.isArray(treeId) && treeId?.length==0) {
       return message.warning("请选择要开关的线路")
     }else if(Array.isArray(treeId) && treeId?.length == 1) {
      setOnoff(e)
       stateRef.current = e
      mRef.current.onOpen()
     }
   }else {
    if(checkedList.length==0) return message.warning("请选择要控制的路灯")
      mRef.current.onOpen()
   }

 }
 const onOk= async()=> {   // 单灯控制
   let points =  lingts?.details?.filter(l => checkedList.includes(l.id))?.map(m => ({gateway:m.gateway, dev:m.dev}))
   try {
    let body =single? {
      projectId,
      state:onOff,
      sn:node.sn
    } :
    {
       projectId,
       brightness,
       points, 
    }
   
     let {success, errMsg} =single ? await  useLineControl(body) : await useOneByOneControl({}, body)
     if(success) {
       getData()
       message.success("开关成功")
      
     }else {
       message.warning("开关失败")
     }
     mRef.current.onCancel()
   } catch (error) {
    
   }
 }
 
 
  const title = (
    <TitleBox>
      <span>路灯列表</span>
     {single ? <Space><CustButtonT text="open" onClick={()=>onControl(1)}></CustButtonT><CustButtonT type="default" text="close" onClick={()=>onControl(2)}></CustButtonT></Space> : <Space size={16}>
        <Cslider onChange={lingthChnage}  />
        <CustButtonT text="control" onClick={onControl}></CustButtonT>
      </Space>}
    </TitleBox>
  );
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <div className="left">
           <UseTree areaId={NaN} title="路灯设备列表" setTreeId={setTreeId} setNode={setNode} setLine={setLine} showline={true} allselect={line==0}  multiple={line==0}   datatype={line==0 ? 0 : 4} energytype={1} ></UseTree>
        </div>
        <div className="right">
          <div className="up">
            <Form form={form} layout="inline" disabled={single}>
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
           {single ?
           <div className="content">
            <div className="lights">
            {
             lingts?.details?.map?.(l => {
               const {name, value}= l.fields?.find(f=> f.name=="亮度") || {}
               let islight = (typeof parseFloat(value)=="number") && parseFloat(value) >0
              return (<div className={!islight ? "light close" : "light" }>
               
               <div>
                 {l.name}
               <div > {`(${l.cSn})`} </div>
               </div>
               <div className="imgbox">
               <img src={islight ? opensvg : closesvg} className="img"></img>
              
                  <span>{name}:{value}</span>
               
               </div>
             
             </div>)})
            }
       </div>
       </div>
           :
           <div className="content">
              <div className="tip">
               <Space><Checkbox indeterminate={indeterminate} checked={checked} onChange={allChagne}>全选</Checkbox><Text>已选择{checkedLen}台</Text></Space>
               <Text>开启/关闭: {lingts?.openNum}/{lingts?.closeNum}</Text>
              </div>
              <Checkbox.Group onChange={checkChange} value={checkedList} >
              <div className="lights">
                   {
                    lingts?.details?.map?.(l => {
                      const {name, value}= l.fields?.find(f=> f.name=="亮度") || {}
                      let islight = (typeof parseFloat(value)=="number") && parseFloat(value) >0
                    return  (<div className={!islight ? "light close" : "light" }>
                       <Checkbox value={l.id}>
                      <div>
                        {l.name}
                      <div > {`(${l.cSn})`} </div>
                      </div>
                      <div className="imgbox">
                      <img src={islight ? opensvg : closesvg} className="img"></img>
                        { islight && <span>{name}:{value}</span>}
                      </div>
                      </Checkbox>
                    </div>)})
                   }
              </div>
              </Checkbox.Group>
            </div>
}

          </Titlelayout>
        </div>
        <CModal mold="cust" type="question" title="远程控制" width={592} ref={mRef} onOk={onOk} >
             确认要远程<Text strong>{copy}</Text> ？
        </CModal>
      </Mainwrap>
    </Pagecount>
  );
}
