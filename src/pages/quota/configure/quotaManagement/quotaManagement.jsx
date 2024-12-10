import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Form, Space, Button, Tree, Input, message, Drawer, Divider, InputNumber } from 'antd'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import Titlelayout from "@com/titlelayout"
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import { cloneDeep, isObject } from 'lodash';
import { CustButtonT, CustButton, TreeBtnN, TreeBtnW } from "@com/useButton"
import CModal from "@com/useModal"
import Bluecolumn from "@com/bluecolumn"
import CustomDraw from "./draw.js"
const { TreeNode } = Tree;
import { QuotaManage } from '@api/api'
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1024px 1fr ;
  column-gap: 16px;
  .formbox {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex:1;
  }
  .ant-form {
    flex: 1;
    .ant-form-item {
    margin-bottom: 16px;
  }
  }
  .ant-drawer-header{
    display: none
  }
 
`
const CTree = styled(Tree)`
  && {
    flex:1;
    padding-right: 16px;
    margin-top: 16px;
    padding-top: 32px;
    border-top: 1px solid #d7d7d7;
    .ant-tree-title {
      display: block;
      margin-bottom: 16px;
    }
    .ant-tree-list-holder-inner {
      align-items: stretch;
    }
   .ant-tree-node-content-wrapper {
       display: block;
       flex: 1;
    }
    .ant-tree-show-line{
      .ant-tree-indent-unit:before {
        border-right: 4px solid ${props => props.theme.primaryColor};
      }  
       
    }
  }

`
const Custtitle = styled.div`
    display: flex;
    padding: 2px 32px;
    height: 22px;
    border-radius: 4px;
    color: var(--ant-primary-color);
    border: 1px solid ${props => props.theme.primaryColor};
    justify-content: center;
    align-items: center;
    font-size: 16px;
    .ant-tree-switcher-leaf-line:before {
      border-color: #237ae4;
    }

`


const getId = (nodes, arr = []) => {
  if (Array.isArray(nodes)) {
    for (let node of nodes) {
      let { quotaAreaId } = node
      arr.push(quotaAreaId)

      if (node.nodes && Array.isArray(node.nodes) && node.nodes?.length > 0) {
        getId(node.nodes, arr)
      }
    }
  }
}

export default function QuotaManagement() {
  const projectId = useSelector(selectProjectId)
  const [treedata, setTreeData] = useState([])
  const [open, setOpen] = useState(false)
  const [mTitle, setMtitle] = useState()
  const [fLabel, setFlabel] = useState()
  const mref = useRef()
  const [form] = Form.useForm()
  const [setform] = Form.useForm()
  const drawref = useRef()
  const quotaAreaId = useRef()
  const isadd = useRef()

  const [expandedKeys, setExpandedKeys] = useState([]);
  const onExpand = (newExpandedKeys, obj) => {

    setExpandedKeys(newExpandedKeys);

  };

  const addSubitem = (id) => {
    quotaAreaId.current = id
    isadd.current = true
    setMtitle('新增定额能耗')
    setFlabel('新增定额能耗')
    mref.current.onOpen()
  }
  const editSubitem = (id, valName) => {
    isadd.current = false
    quotaAreaId.current = id;
    setMtitle('编辑定额能耗名称')
    setFlabel('编辑定额名称')
    form.setFieldValue('name', valName)
    mref.current.onOpen()
  }

  const onConfig = async (id) => {  // 配置
    try {
      quotaAreaId.current = id;
      let { success, data, errMsg } = await QuotaManage.QueryQuotaAreaConfig({ projectId, quotaAreaId: id })
      if (success) {
        setform.setFieldsValue(isObject(data) ? data : {})
        setOpen(true)
      } else {
        message.warning(errMsg || '数据出错')
      }
    } catch (error) {
      console.log(error)
    }


  }
  const [params, setParams] = useState({})
  const onDevicecig = async () => {
    let quotaAreaId = setform.getFieldValue('quotaAreaId')
    setParams({ projectId, quotaAreaId })
    drawref.current.drawOpen()
  }
  const onOk = async () => {   // 新增子项
    try {
      return form.validateFields().then(async () => {
        if (!quotaAreaId.current) return;
        let values = await form.validateFields();

        let params = isadd.current ? {
          projectId,
          parentId: quotaAreaId.current,
          name: values.name
        } : {
          projectId,
          quotaAreaId: quotaAreaId.current,
          name: values.name
        }
        let handler = isadd.current ? 'AddQuotaArea' : 'UpdateQuotaArea'
        let { success, errMsg } = await QuotaManage[handler](params)
        if (success) {
          message.success(isadd ? '新增成功' : '编辑成功')
          getTreeData(projectId)
          if (!isadd.current) mref.current.onCancel()
        } else {
          message.warning(errMsg)
        }
      })
    } catch (error) {

    }

  }
  const onDelete = async (quotaAreaId) => {
    try {
      let { success, errMsg } = await QuotaManage.DeleteQuotaArea({ projectId, quotaAreaId })
      if (success) {
        message.success('删除成功')
        getTreeData(projectId)
      } else {
        message.warning(errMsg || '数据出错')
      }
    } catch (error) {

    }

  }
  const getTreeData = async (id) => {
    try {
      let expand = []
      let { success, data } = await QuotaManage.QueryQuotaAreaTree(id)
      if (success && Array.isArray(data)) {
        setTreeData(data)
        getId(data, expand)
        setExpandedKeys(expand)
      } else {
        setTreeData([])
        setExpandedKeys(expand)
      }
    } catch (error) {
      console.log(error)
      setTreeData([])
    }

  }
  useEffect(() => {
    if (Number.isInteger(projectId)) {
      getTreeData(projectId)
    }
  }, [projectId])

  const submitForm = async () => {
    try {
      let val = await setform.validateFields()
      let params = { ...val, projectId, year: new Date().getFullYear() }
      let { success, errMsg } = await QuotaManage.SaveQuotaAreaConfig(params)
      if (success) {
        message.success('保存成功')
        setOpen(false)
      } else {
        message.warning(errMsg)
      }
    } catch (error) {

    }

  }
  const renderTreeNodes = (data) => {
    let valName = cloneDeep(data.name);
    let { name, quotaAreaId, nodes, areaLevel, parentId = '' } = data
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {parentId === 0 ? <CustButton wh="auto">{data.name}</CustButton> : <Custtitle>{data.name}</Custtitle>}
        <Space size={16}>
          {areaLevel < 3 && <TreeBtnN text="addSubitem" wh="auto" onClick={() => addSubitem(quotaAreaId, valName)} key="add" />}
          <TreeBtnN text="edit" key="edit" onClick={() => editSubitem(quotaAreaId, valName)} />
          {areaLevel > 0 ? <TreeBtnW text="delete" key="delete" onClick={() => onDelete(quotaAreaId)} /> : <TreeBtnW style={{ opacity: 0 }} />}
          <TreeBtnN text="configure" key="configure" onClick={() => onConfig(quotaAreaId)} />
        </Space>
      </div>
    )
  }



  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox className="drawlayout">
        <Titlelayout title="定额能耗设置" layout="flex" key="left">
          <CTree
            showLine blockNode
            selectable={false}
            treeData={treedata}
            expandedKeys={expandedKeys}

            onExpand={onExpand}
            fieldNames={{ title: 'name', key: 'quotaAreaId', children: 'nodes' }}
            titleRender={renderTreeNodes}
            defaultExpandAll
          ></CTree>
        </Titlelayout>
        <Drawer
          open={open}
          mask={false}
          width='100%'
          closeIcon={null}
          title={<Bluecolumn name="配置详细" />}
          style={{ position: 'relative', overflow: 'hidden' }}
          bodyStyle={{ padding: '16px 24px', border: '1px solid #d7d7d7', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          getContainer={() => document.querySelector(".drawlayout")}
        >
          <Bluecolumn name="配置详细" />
          <Divider style={{ margin: '16px 0', borderColor: '#d7d7d7' }}></Divider>
          <Form
            layout="vertical"
            form={setform}
            style={{ flex: 1 }}
          >

            <Form.Item label="去年能耗定额(kWh)" name="lastYearAreaQuotaValue">
              <InputNumber style={{ width: 176 }} min={0} placeholder="请输入去年能耗定额" />
            </Form.Item>
            <Form.Item label="本年能耗定额(kWh)" name="thisYearAreaQuotaValue">
              <InputNumber style={{ width: 176 }} min={0} placeholder="请输入本年能耗定额" />
            </Form.Item>
            <Form.Item label="负责人姓名" name="responsiblePerson">
              <Input style={{ width: 176 }} placeholder="请输入负责人姓名" />
            </Form.Item>
            <Form.Item label="负责人手机" name="phoneNumber">
              <Input style={{ width: 176 }} placeholder="请输入负责人手机" />
            </Form.Item>
            <Form.Item label="" noStyle name="quotaAreaId">
              <Input type="hidden" />
            </Form.Item>
            <Form.Item label="绑定设备">
              <Button type="primary" ghost style={{ width: 176 }} onClick={onDevicecig}>选择设备</Button>
            </Form.Item>

          </Form>
          <Space style={{ marginLeft: 'auto' }}>
            <Button type="primary" ghost style={{ width: 96 }} onClick={() => { setOpen(false) }}>
              取消
            </Button>
            <Button type="primary" onClick={submitForm} style={{ margin: '0 8px', width: 96 }} >
              确定
            </Button></Space>
        </Drawer>
      </Mainbox>
      <CModal title={mTitle} ref={mref} mold="cust" onOk={onOk} width={480} custft={isadd.current}>
        <Form form={form} preserve={false}>
          <Form.Item label={fLabel} name="name"
            normalize={value => value.trim()}
            rules={[{
              required: true,
              message: '名称不能为空'
            }]}>
            <Input placeholder='请输入定额能耗名称' allowClear />
          </Form.Item>

        </Form>

      </CModal>
      <CustomDraw ref={drawref} params={params} />
    </Pagecount>
  )
}
