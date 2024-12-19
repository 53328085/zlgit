import React, { useEffect, useRef, useState } from 'react'
import {  Button,  Form, Input,  Tree, message, Divider, Space, Typography} from 'antd';
import { cloneDeep, update } from "lodash";
import {useTranslation} from 'react-i18next'
import styled from 'styled-components';
import style from './style.module.less'
import UseTransfer from '@com/useTransfer'
import { useRequest } from 'ahooks';
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId, publishState, selectcurlRommid} from '@redux/systemconfig.js'
import { distributionRoom } from '@api/api.js'
import CModal from '@com/useModal'
 
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
const {Link} = Typography
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
  const roomId = useSelector(selectcurlRommid)
  const areaId = useSelector(selectOneLevelDefaultId)
  const {  queryLine, addLine, updateLine, deleteLine, queryUnusedLineMeter, configLineMeter } = distributionRoom
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

 

  const addref = useRef();
  //配电房下拉框




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
    }).catch(e => {
      console.log(e)
    })
  }
  const {run: lineQuery } = useRequest(getLine,{
    manual: true
  })
  useEffect(()=> {
    if(roomId){
      lineQuery()
    }else {
      setTreeData([])
    }
  },[roomId])
  const [clickTag, setClickTag] = useState('')
  const [subId, setSubId] = useState(null)
  const showAdd = () => {
     
    setModalTitle('新增线路')
    setAddModal(true)
    setClickTag('addMain')
     addref.current.onOpen()
  }
  const addSon = (record) => {
    setModalTitle('新增线路')
    setAddModal(true)
    
    setClickTag('addSub')
    setSubId(record)
    addref.current.onOpen()
    
  }
  const edit = (id, name) => {
    setModalTitle('编辑线路')
    setAddModal(false)
    setClickTag('edit')
    setSubId(id)
    form.setFieldValue('name', name)
    addref.current.onOpen()
  }
  const addOk = async () => {
    try {
      
      return form.validateFields().then(async () => {
      const values = await form.validateFields();
      
      let params = {
        projectId,
        roomId,
        name: values.name?.trim()
      };
      if(clickTag == 'edit'){
        updateLine(projectId, subId, encodeURIComponent(values.name)).then(res=> {
          if(res.success){
            messageContent('success', '线路名称修改成功!')
            lineQuery()
            addref.current.onCancel();
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
            form.resetFields()
            lineQuery()
          }else{
            messageContent('error', res.errMsg)
          }
        })
      }
    })
     
    }catch(errorInfo){}
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

  const renderTreeNodes = (data) => {
    data = cloneDeep(data);
    let nodeArr = data.map((item) => {
      let valName = cloneDeep(item.name);
        item.name = (
            <div style={nodeTitle}>
                <span>{item.name}</span>
                <NodeDevice>{item.deviceCount}</NodeDevice>
                { isPublish ? null : <div style={nodeAction}>
                    <Link onClick={()=>addSon(item.id)}>{t("button:new")}</Link>
                    <Link onClick={()=>edit(item.id, valName)}>{t("button:edit")}</Link>
                    <Link onClick={()=>settingClick(item.id, item.deviceSummary, item.deviceSub)}>{t("button:configure")}</Link>
                    <Link type="danger" onClick={()=>deleteRecord(item.id)}>{t("button:delete")}</Link>
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
  const Title = (
    <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
       <span>配电房线路图</span>
       { isPublish ? null : <Button type="primary" disabled={!roomId}   onClick={showAdd} style={{marginRight:0}}>{t("button:newMainLine")}</Button> }
    </div>
  )
  return (
    <Pagecont showserach={false} custserach pd="0px" >   
      {contextHolder}
      <Titlelayout title= {Title}  layout="flex" dr="column">  
        <Divider style={{margin: "16px 0"}} />
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
       
      <UseTransfer  mask={transTag} transferTitle={transferTitle} saveValue={getSaveValue} columns={columns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
       
        <CModal title={modalTitle}  onOk={addOk} width={592}  closable={false}  mold="cust" ref={addref} custft={addModal}  >
       
          <Form name='addform' labelCol={{span:5}} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' preserve={false}>
            <Item label='线路名称' name='name' rules={[{required:true, message:'请输入线路名称'}, {
              type: 'string',
              max: 64,
              message: "名称最多为64个字符"
            }]}>
              <Input style={{width:'400px'}}></Input>
            </Item>
          </Form>
         
        </CModal>
        <CModal  title="删除提示" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} mold="cust" type="warn">
           是否确认删除选中线路？
        </CModal>
      
      </Titlelayout>
    </Pagecont>
  )
}
