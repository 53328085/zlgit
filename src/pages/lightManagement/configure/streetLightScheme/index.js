import React,{useMemo, useRef, useState, useCallback} from 'react'
import {Space, Form, message, Typography} from 'antd'
import moment from 'moment'
import {useAntdTable} from "ahooks"
import {useSelector} from "react-redux"
import {useOutletContext} from "react-router-dom"
import Pagecount from '@com/pagecontent' 
import UserTable from "@com/useTable";
import Titlelayout from '@com/titlelayout';
import {CustButtonT,CustButton, ExportExcel} from "@com/useButton"
import CModal from '@com/useModal'
import {selectUser} from "@redux/user"
import {selectOneLevelDefaultId} from "@redux/systemconfig"
import {usePage,useAdd,useUpdate,useDelete } from "./api"
import {cols, items} from "./data"
import {Mainbox, Title } from './style'
import BindLight from './bind'
import {Serach} from "@com/comstyled"
 const {Link} = Typography


export default function Index() {
  const delref= useRef()
  const exprotref = useRef()
  const bindRef = useRef()
  const {name} = useSelector(selectUser)
  const [form] = Form.useForm()
  const [newform] = Form.useForm()
  const {projectId} =useOutletContext()
  const areaId = useSelector(selectOneLevelDefaultId)
  
  const [isadd, setIsadd] =useState(1) // 0 新增 1 编辑 2 克隆
  const [total, setTotal] = useState(0)
  const [strategyName, setStrategyName] = useState("")
  const editRef = useRef()
  const tbref = useRef()
  const [Ctitle,msg] = useMemo(()=> {
   let title =  ["新建路灯控制方案" , "编辑方案", "新建路灯控制方案"][isadd]
   let msg =   ["新增成功", "编辑成功", "克隆成功"][isadd]
   return [title, msg]
  },[isadd,strategyName])
  const downParams = useRef()
  const getData= async ({current, pageSize }, formData)=> { 
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      const {alike="" } = formData
      let params ={
        projectId, 
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
    defaultPageSize: 14,
    refreshDeps: [projectId]
  })
   
  const onAdd=()=> {
     setIsadd(0)
     newform.setFieldsValue({projectId, creater: name, id:0})
    
     editRef.current.onOpen()
  }
  const onBind=()=>{
    bindRef.current.onOpen()
  }
  const delparams = useRef()
  const onDel=({strategyId,strategyName})=> {
    setStrategyName(strategyName)
     delparams.current={
      id:strategyId,
      projectId
     }
     delref.current.onOpen()
  }
  const onEdit=(row, type)=> {
    setIsadd(type)
   // console.log(row)
    const {scenes, strategyName,strategyId, ...rest} = row
    
    let parseScenes = JSON.parse(scenes)
    parseScenes.forEach((s,index, arr) => {
      let {tasks, sceneName} = s
       let tsk = tasks.map(t => {
        let {timeType, excueTime,brightness, ...r} = t
        if(timeType==0) {
          let [type, timing] = excueTime.split("|") || []
          return {excueTime: type, timing,light:brightness, ...r}
         }else {
          return {timeType, excueTime2:moment(excueTime,"HH:mm"),light:brightness, ...r }
         }
       })
       arr[index] ={
         tasks:tsk,
         sName:sceneName
       }
    })
  //  console.log(parseScenes)  

   let params = {
    projectId,
    schemeName: type==1 ? strategyName : strategyName+"_副本",
    scenes: parseScenes,
    id: type==1 ? strategyId : 0,
    ...rest,
   }
    
   newform.setFieldsValue(params)
    editRef.current.onOpen()
  }
  
  const onOk= async()=> {
    try {
      let values = await newform.validateFields()     
      const {schemeName, scenes, ...rest} = values
      scenes.forEach(element => {
         let {tasks, sName} = element
       
         let task=  tasks.map(( {  timing,excueTime,excueTime2,light, ...rest },index) => ({
             taskName: `时间点${index+1}`,
             excueTime: rest.timeType==0 ? `${excueTime}|${timing}` : excueTime2?.format?.("HH:mm"),
             brightness:light,
             ...rest,
         }))
         delete element.sName
         element.tasks = task
         element.sceneName=sName

      });      
      let params = {
          schemeName,
          scenes: JSON.stringify(scenes),
          ...rest
         
      }
      let hander =  [useAdd,useUpdate,useAdd][isadd];
      let {success, errMsg} =await hander({}, params)
      if(success) {
        message.success(msg)
        if(isadd!==0) {
          editRef.current.onCancel()
        }
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }

    } catch (error) {
      console.log(error)
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
  
  const showexport = ()=> {
    exprotref.current.onOpen()
  }
  const columns = [
    ...cols,
    {
      title: '操作', 
      key:'option',
      render: (_, row)=> <Space><Link onClick={()=> onEdit(row, 1)}>编辑</Link><Link onClick={()=> onEdit(row, 2)}>克隆</Link><Link type="danger" onClick={()=> onDel(row)}>删除</Link></Space>
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
 const [strategyId , setStrategyId ] = useState(null)
 const title=<Title>
  <span>路灯控制方案列表</span>
  <Space size={16}>
            <CustButton   onClick={()=> onAdd()}>新建方案</CustButton>
            <CustButton  disabled={!strategyId}  onClick={()=> onBind()}>绑定路灯</CustButton>
            <ExportExcel tb={tbref}></ExportExcel>
          </Space>
 </Title>

 const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    setStrategyId(selectedRowKeys)
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  type: "radio",
  columnTitle: "选择"
   
};
  return (
    <Pagecount pd="0" bgcolor="none">
        <Mainbox>
        <div className="search">
          <Form form={form} layout="inline"   colon={false} >
             <Form.Item   name="alike">
              <Serach   onSearch={search.submit} placeholder="请输入方案名称或创建人"></Serach>
            </Form.Item>
          </Form>
         
         </div>
      <Titlelayout layout="flex" title={title}>
      
       
        <UserTable columns={columns} {...tableProps} onExport={onExport} rowKey={row => row.strategyId}  ref={tbref} rowSelection={rowSelection}  sheetName="路灯档案"></UserTable>
        
       
      </Titlelayout>
      </Mainbox>
       <CModal title={Ctitle}   onOk={onOk}   width={1380} mold="cust" custft={isadd==0}  ref={editRef}>
        <Form form={newform} labelAlign="right" labelCol={{flex: "7em"}} preserve={false} size="small" colon={false}>
         {items}
        </Form>
       </CModal>
     
        <CModal title="删除"  ref={delref} width={512} mold="cust" type="warn" onOk={onOkDel} >
                 是否确认删除“{strategyName}”方案？
               </CModal>
               <CModal title="批量导入"  ref={exprotref} width={512}   type="drag" onOk={onOkDel} > 
               </CModal>
               <BindLight  strategyId={strategyId} projectId={projectId} areaId={areaId} ref={bindRef} />
    </Pagecount>
  )
}

