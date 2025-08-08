import React, {useRef, forwardRef,useImperativeHandle,useState, useMemo,useEffect} from 'react'
import {Space, message, Button, Form, Select} from "antd"
import {LeftOutlined,RightOutlined} from "@ant-design/icons"

import CModal from '@com/useModal'
import {useAntdTable, useRequest} from "ahooks"
import UserTable from "@com/useTable";
 
import UseTree from "@com/useTree"
import {Bindwrap} from "./style"
import {Serach} from "@com/comstyled"
import {bindcol,rules,w255} from './data'
import {useLineBindLight, useLineUnBindLight,usePageBind, usePageUnBind,useLineBindSwitch,useLoadSwitch} from './api'
export default forwardRef(function Index({lineId,initId, projectId, update}, ref){
  console.log(lineId)
  const mRef = useRef()
  const [form] = Form.useForm()
  const [formed] = Form.useForm()
  const [sform] = Form.useForm()
  const [treeId, setTreeId] = useState([])
  const [switchids, setSwitchid] = useState([])

  const sid = Form.useWatch("switchId",sform)
  const swtichItem = useMemo(()=> {
    if (sid && Array.isArray(switchids) && switchids?.length) {
       return switchids.find(s => s.id == sid) || {}
    } 
    return {}

  },[sid,switchids])
  useEffect(()=> {
    if(parseInt(initId)>0) {
      sform.setFieldValue("switchId", initId)
    }
  }, [initId])

  const onOk =async()=> {
       try {
        if(!Number.isInteger(parseInt(projectId))) return message.warning("项目Id 不能为空")
        if(!Number.isInteger(parseInt(lineId))) return message.warning("线路Id 不能为空")
        let {switchId} = await sform.validateFields()
        let params ={
          projectId,
          id:lineId,
          switchId
        }
        let {success, errMsg} =  await useLineBindSwitch(params)
        if(success) {
          message.success("断路器绑定成功")
          mRef.current.onCancel()
          update?.()
        }else {
          message.warning(errMsg || "断路器绑定失败")
        }
       } catch (error) {
        
       }
  }
  const getSwitchs =async() => {
     try {
      if(!Number.isInteger(parseInt(projectId))) return
         const {success, data} =    await useLoadSwitch({projectId})
         if(success && Array.isArray(data)) {
          setSwitchid(data)
         }else {
          setSwitchid([])
         }
     } catch (error) {
        console.log(error)
     }
  }
  useRequest(getSwitchs, {
    refreshDeps: [projectId]
  })
  const getUnBind = async ({current, pageSize}, formDate={})=> {
    let fag = Number.isInteger(parseInt(projectId))&&Number.isInteger(parseInt(lineId))
    if(!fag) return
    try {
      const {alike} = formDate
      let body = {
        projectId,
        lineId,
        pageSize,
        pageNum:current,
        alike,
        areaIds:treeId || []
      }
  
     let {success, data, total,errMsg}  = await  usePageUnBind({}, body)
     if(success && Array.isArray(data)) {
        return {
          list: data,
          total: Number.isInteger(total) ? total : 0
        }
     }else {
       if(!success) message.warning(errMsg || "数据出错")
        return {
          list:[],
          total: 0
        }
     }
    } catch (error) {
      console.log(error)
    }

  }

  const getBind = async ({current, pageSize}, formData={})=> {
    try {
      let fag = Number.isInteger(parseInt(projectId))&&Number.isInteger(parseInt(lineId))
      if(!fag) return
      console.log(formData)
      const {alike} = formData
      let body = {
        projectId,
        lineId,
        pageSize,
        pageNum:current,
        alike,
        areaIds:treeId || []
      }
  
     let {success, data, total,errMsg}  = await  usePageBind({}, body)
     if(success && Array.isArray(data)) {
        return {
          list: data,
          total: Number.isInteger(total) ? total : 0
        }
     }else {
       if(!success) message.warning(errMsg || "数据出错")
        return {
          list:[],
          total: 0
        }
     }
    } catch (error) {
      console.log(error)
    }

  }
const  {tableProps,  search, refresh} = useAntdTable(getUnBind, {
  //  manual:true,
    form,
    defaultPageSize: 14,
    refreshDeps: [lineId, projectId,treeId]
  })
  const {submit} = search

  const  {tableProps:tablePropsed , run: runed, search:searched, refresh: refreshed} = useAntdTable(getBind, {
 //   manual:true,
    form:formed,
    defaultPageSize: 14,

    refreshDeps: [lineId, projectId,treeId]
  })
  const onOpen =async ()=> {
    try {
    //  run({current:1, pageSize: 14})
    //  runed({current:1, pageSize: 14})
      mRef.current.onOpen()
    } catch (error) {
      console.log(error)
    }

  }

  // 添加 / 撤销
  const unbindkey = useRef([])
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => { 
      unbindkey.current = selectedRowKeys
    },
    type: "checkbox",
  };
  const  bindkey = useRef([])
  const rowSelectioned = {
    onChange: (selectedRowKeys, selectedRows) => { 
      bindkey.current = selectedRowKeys
    },
    type: "checkbox",
  };
  const addbind= async(type)=> {
    try {
      if(unbindkey?.current?.length ==0 && type==0) return message.warning("请选择未选中的路灯")
      if(bindkey?.current?.length ==0 && type==1) return message.warning("请选择已选中的路灯")
      if(!Number.isInteger(parseInt(lineId))) return
        let body ={
          projectId ,
          lineId,
          lightIds: [unbindkey.current,bindkey.current][type]
        }
       let {success,errMsg} = await  [useLineBindLight, useLineUnBindLight][type]({}, body)
       if(success) {
         refresh()
         refreshed()
       }else {
         message.warning(errMsg || "数据出错")
       }
    } catch (error) {
      
    }
   
  }


 
  useImperativeHandle(ref, ()=> ({
    onOpen,
  }))
  return (
    <div>
          <CModal title="路灯绑定"   onOk={onOk}   width={1380} mold="cust"    ref={mRef}>
            <Bindwrap>
              <div className="switch"> 
                <Form layout="inline" className='switchform' form={sform} preserve={false}>
                  <div className='layout'> 
                  <Form.Item label="断路器绑定" name="switchId" rules={rules}>
                    <Select options={switchids} fieldNames={{label: "name", value: "id"}} style={w255}></Select>
                  </Form.Item> 
                {/*   <Form.Item label="断路器名称">
                     <label>{swtichItem.name}</label>
                  </Form.Item> */}
                  <Form.Item label="断路器编号">
                     <span className='val'>{swtichItem?.sn}</span>
                  </Form.Item>
                  <Form.Item label="所属网关">
                     <span className='val'>{swtichItem?.gatewayName}</span>
                  </Form.Item>
                  </div>
                </Form>
              </div>
              <div className='inwrap'>
              <div style={{overflow: "auto"}}>
               <UseTree areaId={0} setTreeId={setTreeId} setLine={()=>{}} showline={false} datatype={NaN} energytype={1} ></UseTree>
               </div>
               <div className='tbwrap'> 
                   <Form form={form} layout="inline">
                        <Form.Item label="未选中的路灯" name="alike">
                        <Serach   onSearch={submit} placeholder="请输入路灯名称或控制器编号"></Serach>
                        </Form.Item>
                   </Form>                  
                 <UserTable columns={bindcol} {...tableProps} rowSelection={rowSelection} rowKey={row => row.id}></UserTable>
               </div>
               <div className='handler'>
                 <Button type="primary" icon={<RightOutlined/>} onClick={()=>addbind(0)} >添加</Button>
                 <Button icon={<LeftOutlined />}  onClick={()=>addbind(1)} >撤销</Button>
               </div>
               <div className='tbwrap'>
               <Form form={formed} layout="inline">
                        <Form.Item label="已选中的路灯" name="alike">
                        <Serach   onSearch={searched.submit}  placeholder="请输入路灯名称或控制器编号"></Serach>
                        </Form.Item>
                   </Form>
                 <UserTable columns={bindcol} {...tablePropsed} rowSelection={rowSelectioned} rowKey={row=>row.id} ></UserTable>
               </div>
               </div>
            </Bindwrap>
                
           </CModal>   
    </div>
  )
})
