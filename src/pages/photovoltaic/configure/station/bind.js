import React, { useRef, forwardRef, useImperativeHandle, useState, useMemo, useEffect } from 'react'
import { Space, Input, message, Button, Form, Select } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { useSelector, useDispatch } from 'react-redux'
import CModal from '@com/useModal'
import { useAntdTable, useRequest } from "ahooks"
import UserTable from "@com/useTable";
import { selectProjectId, selectOneLevel, adaptation } from '@redux/systemconfig.js'
import UseTree from "@com/useTree"
import { Bindwrap } from "./style"
import { Serach } from "@com/comstyled"
import { bindcol, rules, w255 } from './data'
import {
  useQueryACsUnConfigByPage, useQueryACsConfigByPage, useAddACsConfig,
  useRemoveACsConfig,
} from './api'
export default forwardRef(function Index({ projectId, areaId = 1, update, modalTitle }, ref) {

  const areaList = useSelector(selectOneLevel).slice(1)
  console.log(areaList)
  const oneLevel = useSelector((state) => state.system.onelevel);
  const mRef = useRef()
  const [form] = Form.useForm()
  const [formed] = Form.useForm()
  const [formTop] = Form.useForm()
  const [formCenter] = Form.useForm()

  const [treeId, setTreeId] = useState([])







  const getUnBind = async ({ current, pageSize }, formDate = {}) => {
    let fag = Number.isInteger(parseInt(projectId))
    if (!fag) return
    try {
      const { alike } = formDate
      let body = {
        projectId,
        pageSize,
        type: 1,
        pageNum: current,
        alike,
        rId,
      }

      let { success, data, total, errMsg } = await useQueryACsUnConfigByPage({}, body)
      if (success && Array.isArray(data)) {
        return {
          list: data,
          total: Number.isInteger(total) ? total : 0
        }
      } else {
        if (!success) message.warning(errMsg || "数据出错")
        return {
          list: [],
          total: 0
        }
      }
    } catch (error) {
      console.log(error)
    }

  }

  const getBind = async ({ current, pageSize }, formData = {}) => {
    try {
      let fag = Number.isInteger(parseInt(projectId)) && Number.isInteger(parseInt(areaId))
      if (!fag) return
      console.log(formData)
      const { alike = "" } = formData
      let body = {
        projectId,
        type: 1,
        pageSize,
        pageNum: current,
        alike,
        rId: areaId,
      }

      let { success, data, total, errMsg } = await useQueryACsConfigByPage({}, body)
      if (success && Array.isArray(data)) {
        return {
          list: data,
          total: Number.isInteger(total) ? total : 0
        }
      } else {
        if (!success) message.warning(errMsg || "数据出错")
        return {
          list: [],
          total: 0
        }
      }
    } catch (error) {
      console.log(error)
    }

  }
  const { tableProps, search, refresh } = useAntdTable(getUnBind, {
    //  manual:true,
    form,
    defaultPageSize: 14,
    refreshDeps: [projectId, treeId]
  })
  const { submit } = search

  const { tableProps: tablePropsed, run: runed, search: searched, refresh: refreshed } = useAntdTable(getBind, {
    //   manual:true,
    form: formed,
    defaultPageSize: 14,

    refreshDeps: [projectId, treeId, areaId]
  })
  const onOpen = async () => {
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
  const bindkey = useRef([])
  const rowSelectioned = {
    onChange: (selectedRowKeys, selectedRows) => {
      bindkey.current = selectedRowKeys
    },
    type: "checkbox",
  };
  const addbind = async (type) => {
    try {
      if (unbindkey?.current?.length == 0 && type == 0) return message.warning("请选择未选中的逆变器")
      if (bindkey?.current?.length == 0 && type == 1) return message.warning("请选择已选中的逆变器")

      let body = {
        projectId,
        type: 1,
        rId: areaId,
        acIds: [unbindkey.current, bindkey.current][type]
      }
      let { success, errMsg } = await [useAddACsConfig, useRemoveACsConfig][type]({}, body)
      if (success) {
        refresh()
        refreshed()
      } else {
        message.warning(errMsg || "数据出错")
      }
    } catch (error) {

    }

  }

  const onChange = (value) => {
    setareaIdIn(value)
  }
  const onCancel = () => {
    mRef.current.onCancel()
  }
  const onSearchElectricMeter = () => {

  }

  useImperativeHandle(ref, () => ({
    onOpen,
  }))
  return (
    <div>
      <CModal title={modalTitle} width={1380} mold="cust" ref={mRef} footer={<Button onClick={onCancel}>取消</Button>}>
        <Bindwrap>
          <div className='top'>
            <Form colon={false} form={formTop} layout="inline">
              <Form.Item label="站点名称" name="name" rules={[{ required: true }]}>
                <Input placeholder='请输入站点名称' />
              </Form.Item>
              <Form.Item label="路灯编号" name="sn" rules={[{ required: true }]}>
                <Input placeholder='请输入站点编号' />
              </Form.Item>
              <Form.Item name="areaId"
                label={
                  oneLevel[0]?.levelName ? '所属' + oneLevel[0]?.levelName : "所属园区"
                }
                rules={[
                  { required: true, message: `请选择${oneLevel[0]?.levelName}` },
                ]}
                key="areaId">
                <Select
                  // disabled={modalTitle === "编辑站点"}
                  placeholder={
                    oneLevel[0]?.levelName
                      ? `请选择${oneLevel[0].levelName}`
                      : "园区名称"
                  }
                  defaultValue={areaList[0].id}
                  style={{ width: "180px" }}
                >
                  {areaList.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="站点编号" name="address">
                <Input placeholder='请输入安装地址' />
              </Form.Item>
            </Form>
          </div>
          <div className='center'>
            <Form form={formCenter} layout="inline">
              <Form.Item label="总表绑定" name="address">
                <Serach onSearch={onSearchElectricMeter} placeholder="请输入电表名称/编号"></Serach>
              </Form.Item>
              <Form.Item label="电表名称" name="address">
                光伏逆变器总表1
              </Form.Item>
              <Form.Item label="电表编号" name="address">
                2382938
              </Form.Item>
              <Form.Item label="所属网关" name="address">
                834532938
              </Form.Item>
            </Form>
          </div>
          <div className='inverter_title'>—— 关联逆变器 ——</div>
          <div className='inwrap'>
            <div style={{ overflow: "auto" }}>
              <UseTree areaId={0} setTreeId={setTreeId} setLine={() => { }} scroll={485} showline={false} datatype={NaN} energytype={1} ></UseTree>
            </div>
            <div className='tbwrap'>
              <Form form={form} layout="inline">
                <Form.Item label="未选中的逆变器" name="alike">
                  <Serach onSearch={submit} placeholder="请输入逆变器名称或编号"></Serach>
                </Form.Item>
              </Form>
              <UserTable columns={bindcol} {...tableProps} rowSelection={rowSelection} rowKey={row => row.id}></UserTable>
            </div>
            <div className='handler'>
              <Button type="primary" onClick={() => addbind(0)} >添加 <RightOutlined /></Button>
              <Button icon={<LeftOutlined />} onClick={() => addbind(1)} >撤销</Button>
            </div>
            <div className='tbwrap'>
              <Form form={formed} layout="inline">
                <Form.Item label="已选中的逆变器" name="alike">
                  <Serach onSearch={searched.submit} placeholder="请输入逆变器名称或编号"></Serach>
                </Form.Item>
              </Form>
              <UserTable columns={bindcol} {...tablePropsed} rowSelection={rowSelectioned} rowKey={row => row.id} ></UserTable>
            </div>
          </div>
        </Bindwrap>

      </CModal>
    </div >
  )
})
