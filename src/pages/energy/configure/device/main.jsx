import React, {  useState, useRef } from 'react'


import {Button,  message, Form, Input, Tree } from 'antd';
import style from './style.module.less'
import { useRequest } from 'ahooks';
import Custmodl from '@com/useModal'
import warning from '@imgs/warning.png'
import {  DesElectric} from '@api/api.js'
import { cloneDeep } from 'lodash';
import UseTransfer  from './transfer';
import Mask from '@com/mask.jsx'
import Titlelayout from '@com/titlelayout'


export default function Index ({projectId, areaId}) {
  const aref = useRef()
  const dref = useRef()
  const [form] = Form.useForm()
  const Item = Form.Item 
 
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content
    })
  }
  const { queryDrive, insertDrive, updateDrive, deleteDrive, queryDriveConfig, queryDriveUnconfig, conifgDrive,} = DesElectric
 
 

  //树形结构
  const {TreeNode} = Tree;
  const [treeData, setTreeData] = useState([])
  const getTreeData = () => {
    return queryDrive({projectId, areaId}).then(res => {
      if(res.success){
        setTreeData(res.data)
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { run: queryRun } = useRequest(getTreeData,{
    refreshDeps: [areaId]
  })


  const nodeTitle = {
    display: 'flex',
    position: 'relative',
    cursor:'default',
  }
  const nodeAction = {
    position: 'absolute',
    right: 0,
    width:'208px',
    display:'flex',
    justifyContent:'space-around',
    fontSize:'14px',
  }
  const mainStyle={
    fontSize: 16,
    color: '#303133',
    fontWeight: 700
  }
  const renderTreeNodes = (data) => {
    data = cloneDeep(data);
    let nodeArr = data.map((item) => {
      let valName = cloneDeep(item.name);
        item.name = (
            <div style={nodeTitle}>
                <span  style={item.parentId == 0? mainStyle : null}>{item.name}</span>
                <div style={nodeAction}>
                   
                    <span style={{ color:'#237ae4',  cursor:'pointer', textDecoration:'underline'}} onClick={()=>edit(item.id, valName)}>编辑</span>
                    <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline' }} onClick={()=>settingClick(item.id, valName)}>配置</span>
                    <span style={{ color:'#f33', cursor:'pointer', textDecoration:'underline' }} onClick={()=>deleteRecord(item.id)}>删除</span>
                </div>
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
  const [modalTitle,setModalTitle] = useState('')
  const [formLabel,setFormLabel] = useState('')
  const [parentId, setParentId] = useState(null)
  const [updateId, setUpdateId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [modalTag, setModalTag] = useState('')
 
  const addMain = () => {
    
    setModalTitle('新增重点设备')
    setFormLabel('重点设备名称')
    setParentId(0)
    setModalTag('add')
    aref.current.onOpen()
  }
  const edit = (id, value) => {
    setModalTitle('编辑重点设备')
    setFormLabel('重点设备名称')
    setUpdateId(id)
    setModalTag('edit')
    form.setFieldValue('name', value)
    aref.current.onOpen()
  }
  const deleteRecord = id => {
    setDeleteId(id)
    dref.current.onOpen()
  }
  const onOk = async() => {
    try{
      const {name} = await form.validateFields();
      let params = {
        name,
        parentId,
        areaId,
        projectId
      }
      if(modalTag == 'add'){
        insertDrive(params).then(res => {
          if(res.success){
            messageContent('success','新增重点设备成功!')
          }else{
            messageContent('error', res.errMsg)
          }
          queryRun()
          aref.current.onCancel()
        })
      }else if(modalTag == 'edit'){
        updateDrive({projectId, id: updateId, name}).then(res => {
          if(res.success){
            messageContent('success','修改重点设备成功!')
          }else{
            messageContent('error', res.errMsg)
          }
          queryRun()
          aref.current.onCancel() 
        })
      }
      
    } catch(error){}
  }
  const onDelete = () => {
    deleteDrive({projectId, id: deleteId}).then(res=> {
      if(res.success){
        messageContent('success','删除重点设备成功!')
      }else{
        messageContent('error', res.errMsg)
      }
      queryRun()
      dref.current.onCancel()
    }).catch(error);
  }

  //配置穿梭框
  const columns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'deviceName',
        key:'deviceName'
    },{
        align:'center',
        title: '安装地址',
        dataIndex:'address',
        key:'address'
    }
  ]
  const [transTag, setTransTag] = useState('')
  const [deleteDom, setDeleteDom] = useState(false)
  const [subTable, setSubTable] = useState([])
  const [transferTitle,setTransferTitle] = useState({})
  const [unknownTable, setUnknownTable] = useState([])
  const [structureId, setStructureId] = useState(null)
  const settingClick = async (id, valName) => {
    setStructureId(id)
    setTransferTitle({
      subTitle:valName + '-表计',
      unknownTitle:'未选中的表计',
    })
   const allSettledPromise =  Promise.allSettled([queryDriveUnconfig({projectId, id, areaId}), queryDriveConfig({projectId, id, areaId})])
   
   allSettledPromise.then(results => {
       let [{value: {success, data, errMsg}}, {value: {success: sus, data: cdata, errMsg: msg}}] = results
        if(success) {
          setUnknownTable(data || [])
        }else{
          setUnknownTable([])
          messageContent('error',errMsg)
        }
        if(sus) {
          setSubTable(cdata || [])
        }else {
          setSubTable([])
          messageContent('error',msg)
        }
        setDeleteDom(true)
        setTransTag('open')
   })
  }
  const getSaveValue = values => {
    let params = []
    values.subData.map(item => {
      params.push(item.sn)
    })
    
    conifgDrive({projectId, id: structureId}, params).then(res => {
      if(res.success){
        messageContent('success', '重点设备配置成功!')
        setTransTag('close')
        setTimeout(()=> {setDeleteDom(false)}, 600)
      }else{
        messageContent('error', res.errMsg)
      }
    }) 
  }
  const getCloseValue = params => {
    setTransTag(params)
    setTimeout(()=> {setDeleteDom(false)}, 600)
  }
 
  return (
    <div style={{flex: 1, display: 'flex'}}>
      {contextHolder}
      {transTag == 'open' ? Mask() : null}
     
      <Titlelayout title={<div style={{display: 'flex',alignContent: "center", justifyContent: "space-between"}}>
          <span>重点设备</span>
          <Button type='primary'  onClick={() => addMain()}>新增重点设备</Button>
        </div>}>
        <div className={style.lineTree}>
          <div className={style.treeTitle}>
            <span className={style.treeItem}>重点设备名称</span>
            <span className={style.actionItem}>操作</span>
          </div>
          <div className={style.treeContent}>
          { treeData.length>0 ? <Tree  height={654} defaultExpandedKeys={[treeData[0].id.toString()]} blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree> : null}
          </div>
        </div>
        {deleteDom ? <div className={`${style.transferPage} ${transTag =='open' ? style.startAnimation : transTag =='close' ? style.endAnimation :''}`} >
          <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>
        </div>  : null}
      </Titlelayout>
      <Custmodl title={modalTitle} ref={aref}  mold="cust" width={512} onOk={onOk}>
        <div style={{display:"flex", alignItems: "center"}}>
          <Form name='addform' labelCol={{span:7}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' preserve={false}>
            <Item label={formLabel} name='name' rules={[{required:true, message:'节点名称不能为空'}]}>
              <Input style={{width:'315px'}} placeholder={'请输入节点名称'}></Input>
            </Item>
          </Form>
        </div>
      </Custmodl>
      <Custmodl title='删除能源节点' ref={dref}  mold="cust" width={592} type="warn" onOk={onDelete}>
        <div style={{display:"flex", alignItems: "center", marginBottom: 32,fontSize: 16}}>
          <img style={{marginLeft:64, marginRight: 32}} src={warning}></img>
          <span> 是否确认删除该重点设备? </span>
        </div>
      </Custmodl>
    </div>
  )
}