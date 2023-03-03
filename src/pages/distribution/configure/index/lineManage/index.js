import React, { useEffect, useRef, useState } from 'react'
import { Select, Button, Table, Space, Form, Input, Modal, Tree, message } from 'antd';
import { cloneDeep, update } from "lodash";
import style from './style.module.less'
import UseTransfer from '@com/useTransfer'
import { useRequest } from 'ahooks';
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { AreaSetting, distributionRoom } from '@api/api.js'

import dashed from '@imgs/dashed.png'
import firstwarn from '@imgs/warning.png' 

export default function Index() {
  const { QueryAllArea } = AreaSetting
  const { queryPageRoom, queryLine, addLine, updateLine, deleteLine, queryUnusedLineMeter, configLineMeter } = distributionRoom
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  const projectId = useSelector(selectProjectId);
  const [addModal, setAddModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [form] = Form.useForm()
  const Item = Form.Item

  const [areaList, setAreaList] = useState([])
  const [defaultArea, setDefaultArea] = useState()
  const [areaId,setAreaId] = useState(0)
  const getAreaData = () =>{
    return QueryAllArea (projectId, 1).then(res=> {
      let {success, data} = res
      if(success && data){
        setAreaList(data)
        setDefaultArea(data[0].id)
        setAreaId(data[0].id)
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }
  const { data:AreaData } = useRequest(getAreaData,{
    onSuccess:(result,params) => {}
  })
  const handleChange = (values) => {
    setAreaId(values)
  }
  //配电房下拉框
  const [roomList, setRoomList] = useState([])
  const [defaultRoom, setDefaultRoom] = useState()
  const [roomId, setRoomId] = useState()
  const getRoomData = () => {
    return queryPageRoom( projectId, areaId, 0, 0).then(res => {
      if(res.success){
        setRoomList(res.data)
        setDefaultRoom(res.data.length > 0 ? res.data[0].id : null)
        setRoomId(res.data.length > 0  ? res.data[0].id : null)
        if(res.data.length == 0){
          messageApi.open({
            type: 'warning',
            content:"当前园区没有配电房"
          })
          setTreeData([])
        }
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }
  const { run : queryRoom } = useRequest(getRoomData,{
    manual: true,
  })
  useEffect(()=>{
    if(areaId == 0){
      return
    }else{
      queryRoom()
    }
  },[areaId])
  const ChangeRoom = values => {
    setDefaultRoom(values)
    setRoomId(values)
  }

  //查询线路
  const getLine = () => {
    return queryLine(projectId, roomId).then(res=>{
      if(res.success && res.data){
        setTreeData(res.data)
      }else if(res.success && !res.data){
        setTreeData([])
      }else{
        messageApi.open({
          type: 'error',
          content: res.errMsg
        })
      }
    })
  }
  const {run: lineQuery } = useRequest(getLine,{
    manual: true
  })
  useEffect(()=> {
    if(roomId){
      lineQuery()
    }
  },[roomId])
  const [clickTag, setClickTag] = useState('')
  const [subId, setSubId] = useState(null)
  const showAdd = () => {
    setModalTitle('新增线路')
    setAddModal(true)
    setClickTag('addMain')
    form.resetFields();
  }
  const addSon = (record) => {
    setModalTitle('新增线路')
    setAddModal(true)
    setClickTag('addSub')
    setSubId(record)
    form.resetFields();
  }
  const edit = (id, name) => {
    setModalTitle('编辑线路')
    setAddModal(true)
    setClickTag('edit')
    setSubId(id)
    form.setFieldValue('name', name)
  }
  const addOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values)
      let params = {
        projectId,
        roomId,
        name: values.name
      };
      if(clickTag == 'edit'){
        updateLine(projectId, subId, values.name).then(res=> {
          if(res.success){
            messageContent('success', '线路名称修改成功!')
            lineQuery()
          }else{
            messageContent('error', res.errMsg)
          }
        })
      }else{
        if(clickTag == 'addMain'){
          params.parentId = 0
        }else if(clickTag == 'addSub'){
          params.parentId = subId
        }
        addLine(params).then(res=> {
          if(res.success){
            messageContent('success', '新增线路成功！')
            lineQuery()
          }else{
            messageContent('error', res.errMsg)
          }
        })
      }
      form.resetFields()
      setAddModal(false)
    }catch(errorInfo){}
  }
  const handleCancel = () => {
    setAddModal(false)
  }
  

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const deleteOk = () => {
    deleteLine(projectId, deleteId).then(res => {
      if(res.success){
        messageContent('success', '线路删除成功')
        lineQuery()
      }else{
        messageContent('error', res.errMsg)
      }
    })
    setDeleteModal(false)
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const deleteRecord = (record) => {
    setDeleteId(record)
    setDeleteModal(true)
  }

  //线路图
  const {TreeNode} = Tree;
  const [treeData, setTreeData] = useState([])
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const nodeTitle = {
    display: 'flex',
    position: 'relative',
    cursor:'default',
  }
  const nodeDevice = {
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
  }
  const nodeAction = {
    position: 'absolute',
    right: 0,
    width:'208px',
    display:'flex',
    justifyContent:'space-around',
    fontSize:'14px',
  }

  const renderTreeNodes = (data) => {
    data = cloneDeep(data);
    let nodeArr = data.map((item) => {
      let valName = cloneDeep(item.name);
        item.name = (
            <div style={nodeTitle}>
                <span>{item.name}</span>
                <div style={nodeDevice}>{item.deviceCount}</div>
                <div style={nodeAction}>
                    <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline' }} onClick={()=>addSon(item.id)}>新增</span>
                    <span style={{ color:'#237ae4',  cursor:'pointer', textDecoration:'underline'}} onClick={()=>edit(item.id, valName)}>编辑</span>
                    <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline' }} onClick={()=>settingClick(item.id, item.deviceSummary, item.deviceSub)}>配置</span>
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
  
  //穿梭框
  const [transTag, setTransTag] = useState('')
  const [lineId, setLineId] = useState()
  const settingClick =(id, deviceSummary, deviceSub) => {
    queryUnusedLineMeter(projectId, 1, areaId).then(res => {
      if(res.success){
        if(!res.data && !deviceSummary && !deviceSub){
          messageContent('warning', '当前园区无设备!')
          return
        }
        if(deviceSummary){
          setMainTable(deviceSummary)
        }else{
          setMainTable([])
        }
        if(deviceSub){
          setSubTable(deviceSub)
        }else{
          setSubTable([])
        }
        if(res.data){
          setUnknownTable(res.data)
        }else{
          setUnknownTable([])
        }
        setLineId(id)
        setTransTag('open');
      }else{
        messageContent('error', res.errMsg)
      }
    })
    
  }

  const getCloseValue = params => {
    console.log(params);
    setTransTag(params)
  }
  const getSaveValue = params => {
    let deviceSummary = []
    let deviceSub = []
    if(params.subData.length > 0){
      params.subData.map(item => {
        deviceSub.push(item.sn)
      })
    }
    if(params.mainData.length > 0){
      params.mainData.map(item => {
        deviceSummary.push(item.sn)
      })
    }
    let data = {
      projectId,
      lineId,
      deviceSummary,
      deviceSub
    }

    configLineMeter(data).then(res => {
      if(res.success){
        messageContent('success', '线路配置保存成功');
        setTransTag('close')
        lineQuery()
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const [mainTable, setMainTable] = useState([])
  const [subTable, setSubTable] = useState([])

  const [unknownTable,setUnknownTable] = useState([])

  const columns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'name',
        key:'name'
    },{
        align:'center',
        title: '安装地址',
        dataIndex:'address',
        key:'address'
    }
  ]
  const transferTitle = {
    mainTitle:'线路总表',
    subTitle:'线路分表',
    unknownTitle:'未选中设备'
  }  

  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <span className={style.headerTitle}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          style={{width: '200px'}}
          onChange={handleChange}
        >
          {areaList.map(item => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
        <div className={style.division}></div>
        <Select
          placeholder="请选择配电房"
          size="middle"
          // key={defaultRoom}
          // defaultValue={defaultRoom}
          value={defaultRoom}
          style={{width: '200px'}}
          onChange={ChangeRoom}
        >
          {roomList.map(item => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
      </div>
      <div className={style.mainContent}>
        <div className={style.contentTitle}>
            <span>配电房线路图</span>
            <Button type="primary" onClick={()=>showAdd()} style={{marginRight:0}}>
                新增主线
            </Button>
        </div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <div className={style.lineTree}>
            <div className={style.treeTitle}>
                <span className={style.treeItem}>线路图</span>
                <span className={style.deviceItem}>设备数</span>
                <span className={style.actionItem}>操作</span>
            </div>
            <div className={style.treeContent}>
                {/* <Tree treeData={treeData} defaultExpandAll blockNode onSelect={onSelect}></Tree> */}
                <Tree defaultExpandAll blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree>
            </div>
        </div>
        <div className={`${style.transferPage} ${transTag =='open' ? style.startAnimation : transTag =='close' ? style.endAnimation :''}`} >
          <UseTransfer transferTitle={transferTitle} saveValue={getSaveValue} columns={columns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
        </div>
        <Modal className={style.addModal} open={addModal} onOk={addOk} onCancel={handleCancel} width={592} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} >
        <div className={style.addHeader}>{ modalTitle }</div>
        <div className={style.addBody}>
          <Form name='addform' labelCol={{span:5}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off'>
            <Item label='线路名称' name='name' rules={[{required:true, message:'请输入线路名称'}]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
          </Form>
        </div>
        </Modal>
        <Modal className={style.deleteModal} open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} cancelText={'取消'} centered={true} closable={false} maskClosable={false} okText={'确认'} okType={'primary'} okButtonProps={{danger:true}}>
            <div className={style.deleteHeader}>删除提示</div>
            <div className={style.deleteBody}>
            <img className={style.warnIcon} src={firstwarn}></img>
            <span>是否确认删除选中线路？</span>
            </div>
        </Modal>
      </div>
    </div>
  )
}
