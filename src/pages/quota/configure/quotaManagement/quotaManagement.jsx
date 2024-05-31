import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Form, Space, Button, Tree, Input, message, Drawer, Divider } from 'antd'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import Titlelayout from "@com/titlelayout"
import { cloneDeep } from 'lodash';
import { CustButtonT, CustButton, TreeBtnN, TreeBtnW } from "@com/useButton"
import CModal from "@com/useModal"
import Bluecolumn from "@com/bluecolumn"
import CustomDraw from "./draw.js"
const { TreeNode } = Tree;
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
const treedata =
  [
    {
      "id": 1,
      "name": "正泰物联温州园区",
      "parentId": 0,
      "nodes": [
        {
          "id": 3,
          "name": "2号厂房",
          "parentId": 1,
          "nodes": [
            {
              "id": 20,
              "name": "123",
              "parentId": 3,
              "nodes": []
            }
          ]
        },
        {
          "id": 4,
          "name": "锅炉房",
          "parentId": 1,
          "nodes": []
        },
        {
          "id": 5,
          "name": "研发楼",
          "parentId": 1,
          "nodes": []
        },
        {
          "id": 26,
          "name": "1号仓库",
          "parentId": 1,
          "nodes": [
            {
              "id": 27,
              "name": "1号仓库楼",
              "parentId": 26,
              "nodes": []
            }
          ]
        }
      ]
    }
  ]

export default function QuotaManagement() {
  const [open, setOpen] = useState(false)
  const [mTitle, setMtitle] = useState()
  const [fLabel, setFlabel] = useState()
  const mref = useRef()
  const [form] = Form.useForm()
  const [setform] = Form.useForm()
  const drawref = useRef()
  const addSubitem = (id) => {
    setMtitle('新增定额能耗')
    setFlabel('新增定额能耗')
    mref.current.onOpen()
  }
  const editSubitem = () => {
    setMtitle('编辑定额能耗名称')
    setFlabel('编辑定额名称')
    mref.current.onOpen()
  }
  const onDelete = () => {

  }
  const onConfig = () => {
    setOpen(true)
  }
  const onOk = () => {

  }
  const submitForm=(val)=>{console.log(val)}
  const renderTreeNodes = (data) => {
    let valName = cloneDeep(data.name);
    let { name, id, nodes, parentId = '' } = data
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {parentId === 0 ? <CustButton wh="auto">{data.name}</CustButton> : <Custtitle>{data.name}</Custtitle>}
        <Space size={16}>
          <TreeBtnN text="addSubitem" wh="auto" onClick={() => addSubitem(id, valName)} key="add" />
          <TreeBtnN text="edit" key="edit" onClick={() => editSubitem(id, valName)} />
          {parentId !== 0 ? <TreeBtnW text="delete" key="delete" onClick={() => onDelete(id)} /> : <TreeBtnW style={{ opacity: 0 }} />}
          <TreeBtnN text="configure" key="configure" onClick={() => onConfig(data)} />
        </Space>
      </div>
    )
  }


  useEffect(() => {

  }, [])

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox className="drawlayout">
        <Titlelayout title="定额能耗设置" layout="flex" key="left">
          <CTree
            showLine blockNode
            selectable={false}
            treeData={treedata}
            fieldNames={{ title: 'name', key: 'id', children: 'nodes' }}
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
          bodyStyle={{ padding: '16px 24px' ,border: '1px solid #d7d7d7', borderRadius: '4px', overflow: 'hidden'}}
          getContainer={() => document.querySelector(".drawlayout")}
        >
          <Bluecolumn name="配置详细" />
          <Divider style={{ margin: '16px 0', borderColor: '#d7d7d7' }}></Divider>
          <Form
            layout="vertical"
            form={setform}
            onFinish={submitForm}
            style={{ width: 176 }}
          >

            <Form.Item label="去年能耗定额(kWh)" name="lastQuota">
              <Input placeholder="请输入去年能耗定额" />
            </Form.Item>
            <Form.Item label="本年能耗定额(kWh)" name="quota">
              <Input placeholder="请输入本年能耗定额" />
            </Form.Item>
            <Form.Item label="负责人姓名" name="person">
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
            <Form.Item label="负责人手机" name="phone">
              <Input placeholder="请输入负责人手机" />
            </Form.Item>
            <Form.Item label="绑定设备">
              <Button type="primary" ghost style={{width: 176}} onClick={()=>{drawref.current.drawOpen()}}>选择设备</Button>
            </Form.Item>
            <Form.Item style={{position: 'absolute',right: 24,bottom: 24}}>
              <Button  type="primary" ghost style={{width: 96}} onClick={()=>{setOpen(false)}}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" style={{ margin: '0 8px' ,width: 96}} >
                确定
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </Mainbox>
      <CModal title={mTitle} ref={mref} mold="cust" onOk={onOk} width={480} custft>
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
      <CustomDraw ref={drawref} params={{}}/>
    </Pagecount>
  )
}
