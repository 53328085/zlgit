import React, { useEffect, useMemo, useRef, useState } from 'react'
import {  Button,  Form, Input,  Tree, message, Alert, Space, Typography} from 'antd';
import { cloneDeep, update } from "lodash";
import {useOutletContext} from "react-router-dom"
import {useTranslation} from 'react-i18next'
import styled from 'styled-components';
import style from './style.module.less'
import UseTransfer from '@com/useTransfer'
import { useRequest } from 'ahooks';
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId, publishState, selectcurlRommid} from '@redux/systemconfig.js'
import { distributionRoom } from '@api/api.js'
import {useTree, useAdd, useUpdate,useDelete
} from "./api"
import CModal from '@com/useModal'
import BindLight from './bind'
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
const {Link, Text} = Typography
const NodeDevice =styled.div`
  position: absolute;
  right: 224px;
  width: 48px;
  height: 20px;
  font-size:14px;
  color:  ${props => props.theme.primaryColor};
  background-color:rgba(35, 122, 228, 0.2);
  border:1px solid #b3d8ff;
  display: flex;
  align-items: center;
  justify-content: center;
`
export default function Index() {
  const {t} = useTranslation(["button"])
  const isPublish = useSelector(publishState)
  let { exparams = {} } = useOutletContext() || {}
  let { projectId, areaId } = exparams
  const [nodename, setNodename] = useState("")
  const {  queryLine, addLine, updateLine, deleteLine, queryUnusedLineMeter, configLineMeter } = distributionRoom
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  
  const [addModal, setAddModal] = useState(1) // 1. 新增 主线路 2. 新增子线路 3. 编辑线路  
  // const [modalTitle, setModalTitle] = useState('')
  const [form] = Form.useForm()
  const Item = Form.Item

  const [modalTitle] = useMemo(()=> {
    console.log(addModal)
    let title =  {
      1: "新增主线路",
      2: "新增下级线路",
      3: "编辑线路"
    }[addModal]
    return [title]
  },[addModal] )
  console.log(modalTitle)
  const addref = useRef();
  //配电房下拉框




  //查询线路
  const getLine =async () => {
      try {
        const flag = Number.isInteger(parseInt(projectId)) && Number.isInteger(parseInt(areaId))
        if(!flag) return 
        let params ={
          projectId,
          areaId,
          lineType:22
        }
        let {success, data, errMsg} =  await  useTree(params)
        if(success && Array.isArray(data)) {
          setTreeData(data)
        }else {
          if(!success) message.warning(errMsg || "数据出错")
          setTreeData([])
        }
      } catch (error) {
        
      }
  }
  const { refresh} = useRequest(getLine,{
    refreshDeps: [projectId, areaId]
  })
 
 
  const [subId, setSubId] = useState(null)
  const showAdd = () => {
    
    setAddModal(1)
   
     addref.current.onOpen()
  }
  const addSon = (id) => {
    
    setAddModal(2)
    
    
    setSubId(id)
    addref.current.onOpen()
    
  }
  const edit = (id, name) => {
    
    setAddModal(3)
    setSubId(id)
    form.setFieldValue('name', name)
    addref.current.onOpen()
  }
  const addOk = async () => {
    try {
      
       
      const {name} =  await form.validateFields()  ;
      console.log(name)
      let body = addModal !== 3 ?{
          projectId,
          names:  [...new Set(name?.split(","))],
          lineType:22,
          parentId: addModal==1 ? 0 : subId,
          areaId 
      
      }: {
         projectId,
         id:subId,
         name: name?.trim?.()
      };
      let handler = {
        1: useAdd, 
        2: useAdd,
        3:useUpdate
      }[addModal]
      const {success, errMsg} = await handler({},body) 
      if(success) {
        message.success(modalTitle+"成功")
        if(addModal==3) {
          addref.current.onCancel()
        }
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }
     
    }catch(error){
      console.log(error)
      return Promise.reject(error)
      
    }
  }
 
  const delRef = useRef()
 // const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const deleteOk = async () => {
     try {
       let {success, errMsg} = await useDelete({projectId, id:deleteId})
       if(success) {
        delRef.current.onCancel()
        message.success('线路删除成功')
        refresh()
       }else {
        message.warning(errMsg || "数据出错")
       }
     } catch (error) {
      
     }
 
  }
 
  const deleteRecord = (id, name) => {
    setDeleteId(id)
    setNodename(name)
    delRef.current.onOpen()
  }

  //线路图
  const {TreeNode} = Tree;
  const [treeData, setTreeData] = useState([])
 

  const nodeTitle = {
    display: 'flex',
    position: 'relative',
    cursor:'default',
  }
/*   const nodeDevice = {
    position: 'absolute',
    right: 224,
    width: 48,
    height: 20,
    fontSize:'14px',
    color: '#237ae4',
    backgroundColor:'rgba(35, 122, 228, 0.2)',
    border:'1px solid #b3d8ff',
    lineHeight:'20px',
    textAlign:'center'
  } */
  const nodeAction = {
    position: 'absolute',
    right: 0,
    width:'208px',
    display:'flex',
    justifyContent:'space-around',
    fontSize:'14px',
  }
  const bindRef = useRef()
  const [config, setConfig] = useState({})
  const showlineconfig =(id,switchId ) => {
      setConfig({
        lineId:id,
        initId:switchId
      })
     bindRef.current.onOpen()
  }
  const lineprop = useMemo(()=> {
     return {
       projectId, 
       updata:refresh,
       ...config
     }
  }, [projectId, config])
  const renderTreeNodes = (data) => {
    data = cloneDeep(data);
    let nodeArr = data.map((item) => {
      let valName = cloneDeep(item.name);
        item.name = (
            <div style={nodeTitle}>
                <span>{valName}</span>
                <NodeDevice>{item.deviceCount}</NodeDevice>
                { isPublish ? null : <div style={nodeAction}>
                    <Link onClick={()=>addSon(item.id)}>{t("button:new")}</Link>
                    <Link onClick={()=>edit(item.id, valName)}>{t("button:edit")}</Link>
                    <Link onClick={()=>showlineconfig(item.id, item.switchId)}>{t("button:configure")}</Link>
                    <Link type="danger" onClick={()=>deleteRecord(item.id,valName)}>{t("button:delete")}</Link>
                </div>}
            </div>
        )
        if(item.nodes){
            return (
                <TreeNode title={item.name} key={item.id} dataRef={item}>
                    {renderTreeNodes(item.nodes)}
                </TreeNode>
            )
        }
        return <TreeNode title={item.name} key={item.id}></TreeNode>
    })
    return nodeArr;
  }
  
  
  const Title = (
    <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
       <span>路灯回路</span>
       { isPublish ? null : <Button type="primary" disabled={!areaId}   onClick={showAdd} style={{marginRight:0}}>{t("button:newMainLine")}</Button> }
    </div>
  )
  return (
    <Pagecont showserach={false} custserach pd="0px" >   
      {contextHolder}
      <Titlelayout title= {Title}  layout="flex" dr="column">  
       {/*  <Divider style={{margin: "16px 0"}} /> */}
        <div className={style.lineTree}>
            <div className={style.treeTitle}>
                <span className={style.treeItem}>线路图</span>
                <span className={style.deviceItem}>设备数</span>
                { isPublish ? null : <span className={style.actionItem}>操作</span>}
            </div>
            <div className={style.treeContent}>
                {/* <Tree treeData={treeData} defaultExpandAll blockNode onSelect={onSelect}></Tree> */}
                <Tree defaultExpandAll blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree>
            </div>
        </div>
       
       
       
       

        <CModal title={modalTitle}  onOk={addOk} width={592}  closable={false}  mold="cust" ref={addref} custft={addModal!=3}  >
       
          <Form name='addform' labelCol={{span:5}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' preserve={false}>
          {addModal!=2 ? <Item label='线路名称' name='name' rules={[{required:true, message:'请输入线路名称'}, {
              type: 'string',
              min: 1,
              message: "名字至少一个字符"
            },
            {
              whitespace: true,
              message: "线路名称不能为空字符串"
            }
            ]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
            : <div>
              <Text type="warning" style={{fontSize: "12px", marginBottom: "12px"}}>提示：批量添加同级线路时请使用英文逗号分隔线路名称，重复添加的线路名称将会被自动删除</Text> 
               <Item name="name" rules={[
                {
                required:true,
                message: "请输入线路名称"
               },
               {
                type: 'string',
                min: 1,
                message: "名字至少一个字符"
               },
               {
                whitespace: true,
                message: "线路名称不能为空字符串"
               }
               ]}><Input.TextArea rows={12} allowClear placeholder='请输入线路名称(示例:线路1,线路2,线路3),中文逗号"，"视为字符串一部分'  onResize={()=>undefined}></Input.TextArea>
               </Item>
            </div>
    }       
          </Form>
         
        </CModal>
        <CModal  title="删除提示" ref={delRef} onOk={deleteOk}   width={512} mold="cust" type="warn">
           是否确认删除{nodename}线路？
        </CModal>
      
      </Titlelayout>
      <BindLight   {...lineprop}   ref={bindRef}  update={refresh} />
    </Pagecont>
  )
}
