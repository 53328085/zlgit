import React, { useState, useRef } from 'react'
import { useAntdTable } from 'ahooks'
import { flushSync } from 'react-dom'
import { Typography, Space, Form, Input, Divider, message } from 'antd'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import dayjs from 'dayjs';
import { User } from '@api/api.js'
import UserTable from '@com/useTable'
import { CustButtonT, CustLink } from '@com/useButton'
import { custMsg } from '@com/usehandler'
import { Serach } from "@com/comstyled"
import CModal from "@com/useModal";

const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 32px 2px 1fr;
  row-gap: 16px;
  height: 568px;
`
export default function Account() {
  const { Text, Link } = Typography
  const { t } = useTranslation(["button", "platformcig", "comm"])
  const { QueryOperationManager, AddOperationManager, DeleteAccount, ResetPassword, Update } = User
  const [form] = Form.useForm()
  const mref = useRef(null)
  const dref = useRef(null)
  const rref = useRef(null)
  const newpwd = useRef(null)
  const [Record, setRecord] = useState({})
  const [isAdd, setIsAdd] = useState(true)
  const title = isAdd ? t("platformcig:AddOperationAdministratorAccount") : t("platformcig:EditOperationAdministratorAccount");
  let initvalue = {
    password: true,
    enable: true,
    initialValues: {
      enabled: true
    }
  }
  const [initform, setInitialValues] = useState(initvalue)
  const showModl = () => {
    setIsAdd(true)
    setInitialValues({
      ...initvalue
    })
    mref.current.onOpen()

  }
  const del = async (record) => {
    setRecord({ ...Record, ...record })
    dref.current.onOpen()
  }
  const delOk = async () => {
    let { id } = Record
    try {
      let { success, errMsg } = await DeleteAccount(id)

      success && custMsg({
        content: t("comm:successfullydelete"), onClose: () => {
          dref.current.onCancel()
          refresh()
        }
      })
      !success && custMsg({ content: errMsg, type: 'warning' })

    } catch (error) {

    }
  }
  const reset = (record) => {
    setRecord({ ...Record, ...record });
    newpwd.current = `wuLian@${Math.random().toString().slice(2, 8)}`
    rref.current.onOpen();
  }
  const restOk = async () => {
    try {
      const { id } = Record
      const { success, errMsg } = await ResetPassword({ id, pwd: newpwd.current })

      success && custMsg({
        success, content: t("comm:Passwordresetsucceeded"), onClose: () => {

          rref.current.onCancel()
          refresh()
        }
      })
      !success && custMsg({ success, content: errMsg, type: 'warning' })

    } catch (error) {
      console.log(error)
    }

  }
  const edit = (item) => {
    setRecord({ ...item });

    setIsAdd(false)
    item.validStageTime = dayjs(item.validStageTime, 'YYYY-MM-DD HH:mm:ss')
    item.enabled = item.enabled == 1
    flushSync(() => {
      setInitialValues({
        ...initform,
        password: false,
        initialValues: { ...item }
      })
    })
    mref.current.onOpen()

  }
  const columns = [
    {
      dataIndex: "name",
      title: t("platformcig:LoginAccount"),
      key: 'name',
    },
    {
      dataIndex: "nickName",
      title: t("platformcig:UserName"),
      key: "nickName",
    },

    {
      dataIndex: "mobile",
      title: t("comm:MobileNumber"),
      key: 'mobile'
    },
    {
      dataIndex: "enabled",
      title: t("comm:Status", { text: "" }),
      key: 'enabled',
      render: (text) => <span>{text === 1 ? t("button:enable") : t("button:disable")}</span>
    },
    {
      dataIndex: "remark",
      key: 'remark',
      title: t("comm:remark"),
    },
    {
      dataIndex: "op",
      title: t("comm:Operation"),
      render: (_, record) => <Space size={16}>
        <CustLink onClick={edit.bind(null, record)} text="edit" />
        <CustLink onClick={reset.bind(null, record)} text="ResetPassword" />
        <CustLink type="danger" onClick={del.bind(null, record)} text="delete" />
      </Space>
    }

  ]

  let params = {
    pageNum: 1,
    pageSize: 10,
    alike: ''
  }
  const getTableData = ({ current, pageSize }, formData) => {
    let { alike } = formData
    formData.alike = encodeURIComponent(alike)
    params = Object.assign({}, params, { pageNum: current, pageSize }, formData)
    return QueryOperationManager(params).then(res => {
      let { success, data: { data, total } } = res
      if (success && Array.isArray(data)) {
        return {
          total,
          list: data
        }

      } else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    refreshDeps: [params.alike],
    defaultPageSize: 10,
    onError: (e) => {
      console.log(e)
    },

  })
  const { submit } = search;
  const onOk = async () => {
    try {
      let data = await mref.current.onGetvalue();
      delete data.repwd
      let handler = isAdd ? AddOperationManager : Update;
      let content = isAdd ? t("comm:newsuc") : t("comm:Editsuccessfully");
      let params = isAdd ? { ...data, enabled: data.enabled ? 1 : 0, validStageTime: data.validStageTime.format('YYYY-MM-DD') } : { ...data, enabled: data.enabled ? 1 : 0, id: Record.id, validStageTime: data.validStageTime.format('YYYY-MM-DD') };

      let { success, errMsg } = await handler(params)
      if (success) {
        mref.current.onCancel();
        custMsg({
          success, content, onClose: () => {
            refresh()
          }
        })
      }
      !success && message.error({ content: errMsg || t("comm:dataerr"), duration: 1 })



    } catch (error) {
      console.log(error)
    }
  }
  const normalize = (v) => {
    return v.trim()
  }
  return (
    <Mainbox>
      <Form form={form} layout="inline" initialValues={{ alike: '' }}>
        <Form.Item name="alike" label={t("platformcig:AccountInquiry")} normalize={normalize}>
          <Serach placeholder={t("platformcig:msgap")} style={{ width: '550px' }} onSearch={submit} />
        </Form.Item>
        <Form.Item style={{ marginLeft: "16px" }}>
          <CustButtonT onClick={showModl} text="new" src="new" />
        </Form.Item>
      </Form>
      <Divider style={{ margin: 0 }} />
      <UserTable columns={columns} {...tableProps} rowKey='id' />


      <CModal width={554} title={title} ref={mref} mold='default' onOk={onOk} fromprops={initform} >

      </CModal>

      <CModal width={554} title={t("comm:resetpasswords")} ref={rref} onOk={restOk} mold='cust' >
        <p>{t("comm:useraccount")}： <Link>{Record.name}</Link>，  {t("platformcig:pasrest")} <Link>{newpwd.current}</Link></p>

      </CModal>
      <CModal width={554} title={t("platformcig:DeletePrompt")} ref={dref} onOk={delOk} type="warn" mold='cust'>
        {t("platformcig:cofdeletion")} <Text type="danger">{Record.name}</Text> {t("comm:useraccount")}?
      </CModal>

    </Mainbox>

  )
}
