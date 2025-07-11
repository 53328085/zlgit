import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Select, Button, Space, message, Form, Input, Tree } from 'antd';
import style from './style.module.less'
import { useRequest } from 'ahooks';
import Custmodl from '@com/useModal'
import { AreaSetting, energyStructure } from '@api/api.js'
import { cloneDeep } from 'lodash';
import UseTransfer from './transfer';
import Mask from '@com/mask.jsx'
import { Ptag, Wtag } from '@com/comstyled'
import { useOutletContext } from 'react-router-dom'
import { CustButton, TreeBtn } from "@com/useButton"
import Pagecount from "@com/pagecontent";
import CustContext from '@com/content.js'
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components';
const Main = styled.div`
  flex:1;
`
export default function Index() {

  const tabs = [
    { label: '电', key: 1 },
    { label: '冷水', key: 2 },
    { label: '热水', key: 7 },
  ]
  const [energyType, setvalue] = useState(1)
  const propsData = {
    tabs,
    energyType,
    setvalue
  }
  const { t } = useTranslation(["button"])
  let { exparams } = useOutletContext()
  let { areaId, projectId } = exparams
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
  const { QueryAllArea } = AreaSetting
  const { queryEnergyStructure,
    addEnergyStructure,
    updateEnergyStructure,
    deleteEnergyStructure,
    configEnergyStructure,
    queryEnergyStructureConfig } = energyStructure
  //树形结构
  const { TreeNode } = Tree;
  const [treeData, setTreeData] = useState([])
  const getTreeData = () => {
    if (!(Number.isInteger(projectId) && Number.isInteger(areaId) && areaId > 0)) return
    return queryEnergyStructure(projectId, areaId, '', energyType).then(res => {
      if (res.success) {
        setTreeData(res.data)
      } else {
        messageContent('error', res.errMsg)
      }
    })
  }
  const { run: queryRun } = useRequest(getTreeData, {
    refreshDeps: [areaId, projectId, energyType]
  })


  const nodeTitle = {
    display: 'flex',
    position: 'relative',
    cursor: 'default',
  }
  const nodeAction = {
    position: 'absolute',
    right: 0,
    width: '265px',
    display: 'flex',
    justifyContent: 'space-between',

  }
  const mainStyle = {
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
          <span style={item.parentId == 0 ? mainStyle : null}>{item.name}</span>
          <div style={nodeAction}>
            <TreeBtn onClick={() => addSon(item.id)} wh="60px" text="new" />
            <TreeBtn onClick={() => edit(item.id, valName)} wh="60px" text="edit" />
            <TreeBtn onClick={() => settingClick(item.id, valName)} wh="auto" text="configure" />
            <TreeBtn onClick={() => deleteRecord(item.id)} wh="60px" text="delete" type={3} />
          </div>
        </div>
      )
      if (item.nodes) {
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
  const [modalTitle, setModalTitle] = useState('')
  const [formLabel, setFormLabel] = useState('')
  const [parentId, setParentId] = useState(null)
  const [updateId, setUpdateId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [modalTag, setModalTag] = useState('')
  const addSon = id => {
    setModalTitle('新增能源节点')
    setFormLabel('能源节点名称')
    setParentId(id)
    setModalTag('add')
    aref.current.onOpen()
  }
  const addMain = () => {
    if (areaId == 0 || !areaId) {
      message.warning('请先选择园区！')
      return;
    }
    setModalTitle('新增主节点')
    setFormLabel('主节点名称')
    setParentId(0)
    setModalTag('add')
    aref.current.onOpen()
  }
  const edit = (id, value) => {
    setModalTitle('编辑能源节点')
    setFormLabel('能源节点名称')
    setUpdateId(id)
    setModalTag('edit')
    form.setFieldValue('name', value)
    aref.current.onOpen()
  }
  const deleteRecord = id => {
    setDeleteId(id)
    dref.current.onOpen()
  }
  const onOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values)
      let params = {
        name: values.name,
        parentId,
        areaId,
        energyType
      }
      if (modalTag == 'add') {
        addEnergyStructure(projectId, params).then(res => {
          if (res.success) {
            messageContent('success', '新增能源节点成功!')
          } else {
            messageContent('error', res.errMsg)
          }
          queryRun()
          aref.current.onCancel()
        })
      } else if (modalTag == 'edit') {
        let params = {
          projectId,
          id: updateId,
          name: values.name
        }
        updateEnergyStructure(params).then(res => {
          if (res.success) {
            messageContent('success', '修改能源节点成功!')
          } else {
            messageContent('error', res.errMsg)
          }
          queryRun()
          aref.current.onCancel()
        }).catch(e => {
          console.log(e)
        })
      }

    } catch (error) { }
  }
  const onDelete = () => {
    deleteEnergyStructure(projectId, deleteId).then(res => {
      if (res.success) {
        messageContent('success', '删除能源节点成功!')
      } else {
        messageContent('error', res.errMsg)
      }
      queryRun()
      dref.current.onCancel()
    })
  }

  //配置穿梭框
  const columns = [
    {
      align: 'center',
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn'
    }, {
      align: 'center',
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName'
    }, {
      align: 'center',
      title: '安装地址',
      dataIndex: 'address',
      key: 'address'
    }
  ]
  const [transTag, setTransTag] = useState(false)
  const [deleteDom, setDeleteDom] = useState(false)
  const [subTable, setSubTable] = useState([])
  const [transferTitle, setTransferTitle] = useState({})
  const [unknownTable, setUnknownTable] = useState([])
  const [structureId, setStructureId] = useState(null)
  const settingClick = (id, valName) => {
    setStructureId(id)
    setTransferTitle({
      subTitle: valName + '-表计',
      unknownTitle: '未选中的表计',
    })
    queryEnergyStructureConfig(projectId, id, areaId, energyType).then(res => {
      let { success, data } = res
      if (success) {
        if (!data) {
          setSubTable([])
          setUnknownTable([])
        } else {
          if (Array.isArray(data.relations)) {
            setSubTable(data.relations)
          } else {
            setSubTable([])
          }
          if (Array.isArray(data.noRelations)) {
            setUnknownTable(data.noRelations)
          } else {
            setUnknownTable([])
          }
        }
        setDeleteDom(true)
        setTransTag(true)
      } else {
        messageContent('error', res.errMsg)
      }
    })
  }
  const getSaveValue = values => {
    let Sns = []
    values.subData.map(item => {
      Sns.push(item.sn)
    })
    let params = {
      EnergyStructureId: structureId,
      Sns
    }
    configEnergyStructure(projectId, params).then(res => {
      if (res.success) {
        messageContent('success', '能源节点配置成功!')
        setTransTag(false)
        setTimeout(() => { setDeleteDom(false) }, 600)
      } else {
        messageContent('error', res.errMsg)
      }
    })
  }
  const getCloseValue = params => {
    setTransTag(false)
    setTimeout(() => { setDeleteDom(false) }, 600)
  }
  const Title = (
    <div style={{ display: 'flex', justifyContent: "space-between", alignContent: "center" }}>
      <span style={{ lineHeight: "32px" }}>能源结构</span>
      <CustButton wh="auto" onClick={() => addMain()}>{t("button:addMasterNode")}</CustButton>
    </div>
  )
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount value={energyType}>
        {contextHolder}
        <Titlelayout title={Title} layout="flex" dr="column" pv="0" bordered="n" rad="0px">
          <div className={style.lineTree}>
            <div className={style.treeTitle}>
              <span className={style.treeItem}>线路图</span>
              <span className={style.actionItem}>操作</span>
            </div>
            <div className={style.treeContent}>
              {treeData.length > 0 ? <Tree height={654} defaultExpandedKeys={[treeData[0].id.toString()]} blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree> : null}
            </div>
          </div>

          <Mask task={transTag}>
            {transTag && <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue} />}
          </Mask>
        </Titlelayout>
        {/* <div className={style.mainContent}>
          <div className={style.title}>
            <span>能源结构</span>
            <CustButton wh="auto" onClick={() => addMain()}>{t("button:addMasterNode")}</CustButton>
          </div>
          <div className={style.lineTree}>
            <div className={style.treeTitle}>
              <span className={style.treeItem}>线路图</span>
              <span className={style.actionItem}>操作</span>
            </div>
            <div className={style.treeContent}>
              {treeData.length > 0 ? <Tree height={654} defaultExpandedKeys={[treeData[0].id.toString()]} blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree> : null}
            </div>
          </div>

          <Mask task={transTag}>
            {transTag && <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue} />}
          </Mask>

        </div> */}
        <Custmodl title={modalTitle} ref={aref} mold="cust" width={512} onOk={onOk}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form name='addform' labelCol={{ span: 7 }} form={form} labelAlign={'left'} requiredMark={false} autoComplete='off' preserve={false}>
              <Item label={formLabel} name='name' rules={[{ required: true, message: '节点名称不能为空' }]}>
                <Input style={{ width: '315px' }} placeholder={'请输入节点名称'}></Input>
              </Item>
            </Form>
          </div>
        </Custmodl>
        <Custmodl title='删除能源节点' ref={dref} mold="cust" width={592} type="warn" onOk={() => onDelete()}>
          是否确认删除该能源节点?
        </Custmodl>
      </Pagecount>
    </CustContext.Provider>
  )
}