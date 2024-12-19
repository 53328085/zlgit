import React, { useMemo, useRef,useState } from 'react'
import { useAntdTable } from 'ahooks';
import styled from 'styled-components'

import { Select, Divider, Input, Button, message, Form, Space, Typography } from 'antd'
import Table from '@com/useTable'
import { useSelector } from 'react-redux'
import { publishState } from '@redux/systemconfig'
import Modal from '@com/useModal'
import style from './style.module.less'
import { CustButton } from '@com/useButton'
import { operationDesigin } from '@api/api'
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import { Serach } from '@com/comstyled'
import { CustButtonT, CustLink } from "@com/useButton"
const { Link } = Typography

const DropstartDiv = styled.div`
 .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before{
        /* display: none; */
      }
`
const ContainerDiv = styled.div`
      display: grid;
      grid-template-rows: 32px 1px 1fr;
      row-gap: 32px;
      padding-top: 16px;
      flex: 1;
  `
const { TextArea } = Input
export default function Index() {
  const [isAdd, setIsAdd] = useState(false)
  const publish = useSelector(publishState)
  const projectId = useSelector(state => state.system.menus.projectId)
  const onelevel = useSelector(state => state.system.onelevel);
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName + '(全部)', id: 0 }, ...onelevel]), [onelevel]) : []
  const addoptions = [{
    label: '常规',
    value: 1
  }, {
    label: '配电',
    value: 2
  }, {
    label: '光伏',
    value: 3
  }, {
    label: '储能',
    value: 4
  },]
  const maparr = new Map([[1, '常规'], [2, '配电'], [3, '光伏'], [4, '储能']])
  const typeoptions = [{
    label: '全部',
    value: 0
  }, ...addoptions]

  let delid;
  const columns = [
    { title: '检查项名称', dataIndex: 'name', align: "center", },
    { title: '详细内容', dataIndex: 'remark', align: "center", },
    {
      title: '检查项类别', dataIndex: 'type', align: "center", render: (v) => {
        return <span>{maparr.get(v)}</span>
      }
    },
    {
      title: '操作', dataIndex: 'options', align: "center", width: 180, render: (v, text) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <CustLink onClick={() => {
              editform.setFieldsValue(text); editRef.current.onOpen();
              setIsAdd(false)
            }} text="edit" />
            <CustLink type="danger" onClick={() => { delid = text.id; delRef.current.onOpen() }} text="delete" />
          </div>
        )
      }
    }]

  const addRef = useRef()
  const editRef = useRef()
  const delRef = useRef()
  const [form] = Form.useForm()
  const [addform] = Form.useForm()
  const [editform] = Form.useForm()

  const totalItem = useRef();
  const curPage = useRef();
  const PageSize = 14
  const addDevice = () => {
    setIsAdd(true)
    addform.resetFields()
    addRef.current.onOpen()
  }


  //新增检查项
  const addItems = async () => {
    return  addform.validateFields().then(async () => {
      const add = addform.getFieldsValue()
      let params = {
        projectId,
        type: add.type,
        name: add.name,
        remark: add.remark
      }
      const res = await operationDesigin.AddInspectionContent(params)
      if (res.success) {
        message.success('新增成功!')
        refresh()
        addform.resetFields()
        //  addRef.current.onCancel()
      } else {
        message.error(res.errMsg)
      }
      console.log(add, params)
    })
  }
  //更新检查项
  const updateItems = () => {
    editform.validateFields().then(async () => {
      const edit = editform.getFieldValue()
      let params = {
        projectId,
        id: edit.id,
        type: edit.type,
        name: edit.name,
        remark: edit.remark
      }
      const res = await operationDesigin.UpdateInspectionContent(params)
      if (res.success) {
        message.success('编辑成功!')
        editRef.current.onCancel()
        refresh()
      } else {
        message.error(res.errMsg)
      }
    })
  }
  //删除检查项
  const delItems = async () => {
    const res = await operationDesigin.DeleteInspectionContent({
      projectId,
      id: delid
    })

    if (res.success) {
      message.success('删除成功!')

      try {
        let current = Math.ceil((totalItem.current - 1) / 14) < curPage.current

        if (current) {
          let values = form.getFieldsValue()
          run({ current: curPage.current - 1, pageSize: PageSize }, values)
        } else {
          refresh()
        }

        delRef.current.onCancel()
      } catch (error) {

      }
    } else {
      message.error(res.errMsg)
    }
  }
  //获取检查项数据
  const getPage = ({ current, pageSize }, formData) => {
    curPage.current = current
    let { alike, typeical } = formData
    let params = {
      projectId,
      pageNum: current,
      pageSize: pageSize,
      alike: alike,
      type: typeical
    }
    return operationDesigin.QueryPageInspectionContent(params).then(res => {
      let { success, data, total } = res
      totalItem.current = total
      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total,
        }
      } else {
        return {
          list: [],
          total: 0,
        }
      }
    })
  }
  const { tableProps, refresh, search, run } = useAntdTable(getPage, {
    form,
    defaultPageSize: 14,
    refreshDeps: [projectId]
  })
  const { submit } = search
  return (
    <Pagecont showserach={false} pd="0px" >
      <Titlelayout title="检查项管理" layout="flex" dr="column">
        <ContainerDiv>

          <Form
            layout="inline"
            form={form}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            initialValues={{
              typeical: 0,
              alike: ''
            }}
          >
            <Space size={64} split={<Divider type="vertical" style={{ margin: 0, borderColor: '#d7d7d7', height: '32px' }} dashed />}>
              <Form.Item name="alike" label="检查项" style={{ marginBottom: 0, marginRight: 0 }}>
                <Serach
                  placeholder="检查项关键字查询"
                  onSearch={submit}
                />
              </Form.Item>
              <Form.Item name="typeical" label="类别" style={{ marginBottom: 0 }}>
                <Select
                  options={typeoptions}
                  style={{ width: 166 }}

                  onChange={submit}
                ></Select>
              </Form.Item>
            </Space>
            <Form.Item>
              {publish ? null : <CustButtonT onClick={addDevice} text="new" />

              }
            </Form.Item>
          </Form>
          <Divider style={{ margin: '0px', borderColor: '#d7d7d7' }} dashed ></Divider>

          <Table columns={columns}  {...tableProps} ></Table>


          <Modal mold='cust' ref={addRef} onOk={addItems} title="新增检查项" custft={isAdd}>

            <DropstartDiv>
              <Form
                form={addform}
                labelCol={{ span: 5 }}
                colon={false}
                labelAlign="left"
                initialValues={{ type: 1, name: '', remark: '' }}
              >
                <Form.Item label="检查项类别" name="type" >
                  <Select
                    style={{ width: 160 }}
                    options={addoptions}

                  ></Select>
                </Form.Item>
                <Form.Item label="检查项名称" name="name" rules={[{ required: true }]}>
                  <Input placeholder="请输入检查项名称"></Input>
                </Form.Item>
                <Form.Item label="详细内容" name="remark">
                  <TextArea allowClear placeholder='请输入详细内容' />
                </Form.Item>
              </Form>
            </DropstartDiv>
          </Modal>


          <EditItem editRef={editRef} editform={editform} addoptions={addoptions} updateItems={updateItems} />
          <DeleteModal delRef={delRef} name='删除检查项' content="是否确认删除检查项" onOk={delItems} />
        </ContainerDiv>
      </Titlelayout>
    </Pagecont>
  )
}

//编辑
const EditItem = ({ editRef, editform, addoptions, updateItems }) => {
  return (
    <Modal mold='cust' ref={editRef} onOk={updateItems} title="编辑检查项">
      {/* <BlueColumn name="编辑检查项" styled={{ padding: '24px 0px', color: '#237ae4' }} ></BlueColumn> */}
      <DropstartDiv>
        <Form
          form={editform}
          labelCol={{ span: 5 }}
          colon={false}
          labelAlign="left"

        >
          <Form.Item label="检查项类别" name="type" >
            <Select style={{ width: 160 }} options={addoptions}></Select>
          </Form.Item>
          <Form.Item label="检查项名称" name="name" rules={[{ required: true }]}>
            <Input ></Input>
          </Form.Item>
          <Form.Item label="详细内容" name="remark" >
            <TextArea allowClear placeholder='请输入详细内容' />
          </Form.Item>
        </Form>
      </DropstartDiv>
    </Modal>
  )
}

//删除组件
let DeleteModal = ({ delRef, name = '', content = '', ...other }) => {
  return (
    <Modal mold='cust' ref={delRef} {...other} className={style.DelModal} type="warn" title={name}>
      {content}
    </Modal>


  )
}


