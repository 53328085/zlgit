import React,{useMemo, useRef, useState, useCallback, useEffect} from 'react'
import {Space, Form, message, Typography, Select, Input} from 'antd'
import {useAntdTable} from "ahooks"
import {useOutletContext} from "react-router-dom"
import Pagecount from '@com/pagecontent'

import UserTable from "@com/useTable";
import Titlelayout from '@com/titlelayout';
import {CustButtonT,CustButton, ExportExcel} from "@com/useButton"
import CModal from '@com/useModal'
import {Serach} from "@com/comstyled"
import {AreaSelect} from "@com/useSerach/comhead"
import {usePage,useAdd,useUpdate,useDelete, useImport, useList,useQuerySelectList } from "./api"
import {cols,  items} from "./data"
import {Mainbox } from './style'
 const {Link} = Typography


export default function Index() {
  const delref= useRef()
  const exprotref = useRef()
  const [form] = Form.useForm()
  const [newform] = Form.useForm()
  const {projectId} =useOutletContext()
  const [isadd, setIsadd] =useState(false)
  const [total, setTotal] = useState(0)
  const [lists, setLists] = useState([])
 // const [cmsn, setCmsn]=useState({csn:[], msn:[]}) //  控制器，计量设备
  const [csn, setCsn] = useState([])
  const [msn, setMsn] = useState([])
  const editRef = useRef()
  const tbref = useRef()
  const [Ctitle,msg] = useMemo(()=> {
   let title = isadd ? "新增园区路灯" : "编辑园区路灯"
   let msg = isadd ? "新增成功" : "编辑成功"
   return [title, msg]
  },[isadd])
  const downParams = useRef()

 
 const getSn = async()=> {
     try {
      let promises = [useQuerySelectList({projectId, deviceStyle:22}),useQuerySelectList({projectId, deviceStyle:1})]
      let [csn, msn ] = await Promise.allSettled(promises)  // 控制器， 计量设备
      
       if(csn?.value?.success) {
         if(Array.isArray(csn.value?.data)) {
          console.log(csn.value.data)
          setCsn(csn.value.data)
         }else {
           setCsn([])
         }
        
       }
       if(msn?.value?.success) {
        if(Array.isArray(msn.value?.data)) {
         setMsn( msn.value.data)
        }else {
         setMsn([])
        }
       
      }
     } catch (error) {
      console.log(error)
     }
    

 }


  const getList = async()=> {
    try {
      let {success, data, errMsg} = await useList({projectId})
      if(success && Array.isArray(data)) {
        setLists(data)
      }else  {
       setLists([])
       if(!success) message.warning(errMsg)
      }
    } catch (error) {
      
    }
 }
 const fromitem = useMemo(()=> {
  return items(lists,csn, msn)
 },[lists,csn, msn])
  const getData= async ({current, pageSize }, formData)=> { 
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      const {alike="", areaId} = formData
      let params ={
        projectId,
        areaId,
        alike,
       pageNum: current,
       pageSize,
    }
    downParams.current = params
    let {data, success, total, errMsg} =await usePage({},params)

    if(success && Array.isArray(data)) {
      setTotal(total)
      return {
        list: data,
        total,
      }
    }else {
      if(!success) message.warning(errMsg || "接口出错" )
      return {
        list: [],
        total:0
      }
    }
    } catch (error) {
      console.log(error)
    }

  }
  const {tableProps, search, refresh} = useAntdTable(getData, {
    form,
    defaultPageSize: 18,
    refreshDeps: [projectId]
  })
  const {submit} = search
  const onAdd=()=> {
     setIsadd(true)
     newform.setFieldValue("projectId", projectId)
     editRef.current.onOpen()
  }
  const delparams = useRef()
  const onDel=({id})=> {
     delparams.current={
      id,
      projectId
     }
     delref.current.onOpen()
  }
  const onEdit=(row)=> {
    setIsadd(false)
    const {projectId:id, ...params} = row

    newform.setFieldsValue({...params, projectId},)
    editRef.current.onOpen()
  }
  const onOk= async()=> {
    try {
      let values = await newform.validateFields()
      
      let hander = isadd ? useAdd : useUpdate;
      let {success, errMsg} =await hander({}, values)
      if(success) {
        message.success(msg)
        if(!isadd) {
          editRef.current.onCancel()
        }
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }

    } catch (error) {
      return Promise.reject("")
    }

  }
  const onOkDel=async()=> {
     try {
      let {success, errMsg} = await useDelete(delparams.current)
      if(success) {
        message.success("删除成功")
        delref.current.onCancel()
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }
     } catch (error) {
      
     }
  }
  const files = useRef()
  const dragprops = {
    link: '/deviceExcel/streetLight2.xlsx',
    maxCount: 1,
    beforeUpload(file) {
        files.current = file
        return false
    }
  }
  const onUpload=async()=> {
     try {
      let formdata = new FormData()
      formdata.append("projectId", projectId)
      formdata.append("file", files.current)
       let {success, errMsg} =  await  useImport({projectId}, formdata)
       if(success) {
        message.success("导入成功")
        exprotref.current.onCancel()
        refresh()
       }else {
        message.warning(errMsg || "数据出错")
       }
     } catch (error) {
      console.log(error)
     }
   

  }
  const onexport = ()=> {
    exprotref.current.onOpen()
  }
  const columns = [
    ...cols,
    {
      title: '操作', 
      key:'option',
      render: (_, row)=> <Space><Link onClick={()=> onEdit(row)}>编辑</Link><Link type="danger" onClick={()=> onDel(row)}>删除</Link></Space>
    },
  ]
  
  const onExport =useCallback(() => {  
    downParams.current.pageSize=1;
    downParams.current.pageSize=total
    return   usePage({}, downParams.current).then(res => {
      let {success, data, total} =res
      if(success && Array.isArray(data)) { 
        return {
          list: data,
          total,
        }
      }else {
        if(!success) message.warning(errMsg || "接口出错" )
        return {
          list: [],
          total:0
        }
      }

    })
 }, [total])
 useEffect(()=> {
  if(Number.isInteger(parseInt(projectId))){
    getList()
    getSn()
  }

 }, [projectId])
  return (
    <Pagecount pd="0">
      <Titlelayout layout="flex" title="路灯档案">
        <Mainbox>
         <div className="search">
          <Form form={form} layout="inline"  >
            <Form.Item name="areaId" initialValue={0}>
            <AreaSelect style={{width: "264px"}} isall={{name: "全部", id:0}} onChange={submit} />
            </Form.Item>
            <Form.Item label="设备查询" name="alike" style={{marginLeft: "16px"}} >
         <Serach onSearch={submit} />
            </Form.Item>
          </Form>
          <Space size={16}>
            <CustButtonT text="new" onClick={()=> onAdd()}></CustButtonT>
            <CustButton onClick={()=> onexport()}>批量导入</CustButton>
            <ExportExcel tb={tbref}></ExportExcel>
          </Space>
         </div>
        <UserTable columns={columns} {...tableProps} onExport={onExport} ref={tbref}  sheetName="路灯档案"></UserTable>
        </Mainbox>
       
      </Titlelayout>
       <CModal title={Ctitle}   onOk={onOk}   width={832} mold="cust" custft={isadd}  ref={editRef}>
        <Form form={newform} labelAlign="right" labelCol={{flex: "7em"}} preserve={false}>
          {fromitem}
        </Form>
       </CModal>
        <CModal title="删除"  ref={delref} width={512} mold="cust" type="warn" onOk={onOkDel} >
                 是否确认删除备件？
               </CModal>
               <CModal title="批量导入"  ref={exprotref} width={512} dragprops={dragprops}  type="drag" onOk={onUpload} > 
               </CModal>
    </Pagecount>
  )
}

