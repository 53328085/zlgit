import React, { useRef, forwardRef, useImperativeHandle, useState, useMemo, useEffect } from 'react'
import { Space, Input, message, Row, Col, InputNumber, Button, Form, Select, Radio } from "antd"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { useSelector, useDispatch } from 'react-redux'
import CModal from '@com/useModal'
import { useAntdTable, useRequest } from "ahooks"
import UserTable from "@com/useTable";
import { selectProjectId, selectOneLevel, adaptation } from '@redux/systemconfig.js'
import UseTree from "@com/useTree"
import { Bindwrap } from "./style"
import { Serach } from "@com/comstyled"
import { bindcol } from './data'
import {
  useOverview, useQueryStationList, useQueryACsUnConfigByPage, useQueryACsConfigByPage, useAddACsConfig,
  useRemoveACsConfig,
} from './api'
export default forwardRef(function Index({ projectId, updata, modalTitle, curPage, editData }, ref) {
  const areaList = useSelector(selectOneLevel).slice(1)
  const oneLevel = useSelector((state) => state.system.onelevel);
  const mRef = useRef()
  const [formTop] = Form.useForm()
  const [form] = Form.useForm()
  const [formed] = Form.useForm()
  const [treeId, setTreeId] = useState([])

  const [deviceData, setDeviceData] = useState([])
  const [stationData, setStationData] = useState([])
  // 存储选中的总表设备信息
  const [selectedMeter, setSelectedMeter] = useState(null)
  // 监听areaId变化
  const areaId = Form.useWatch('areaId', formTop);
  const stationId = Form.useWatch('stationId', formTop);

  const [gridConnectedType, setGridConnectedType] = useState(1)
  // 获取设备数据函数
  const RuntimeDevice = async () => {
    // 验证必要参数
    if (!projectId || !areaId) {
      console.log('缺少必要参数:', { projectId, areaId })
      setDeviceData([])
      return
    }
    try {
      const params = {
        projectId,
        areaId,
        deviceStyle: 1,
        alike: "",
        state: 0,
        category: "",
        pageNum: 1,
        pageSize: 100 // 增加分页大小，确保获取足够数据
      }

      let { success, data, total, errMsg } = await useOverview({}, params)

      if (success) {
        // 检查数据结构是否正确
        if (data && Array.isArray(data.details)) {
          console.log('获取设备数据成功，共', data.details.length, '条')
          setDeviceData(data.details)
          setSelectedMeter(data.details[0])
        } else {
          setDeviceData([])
          setSelectedMeter(null)
        }
      } else {
        setDeviceData([])
        setSelectedMeter(null)
        message.warning(errMsg || "获取设备数据失败")
      }
    } catch (error) {
      setDeviceData([])
      setSelectedMeter(null)
      message.error('网络异常，无法获取设备数据')
    }
  }
  // 获取站点数据函数
  const RuntimStation = async () => {
    if (projectId == undefined || areaId == undefined) return
    try {
      const params = {
        projectId,
        areaId,
        pageNum: 1,
        pageSize: 100// 增加分页大小，确保获取足够数据
      }

      let { success, data, total, errMsg } = await useQueryStationList(params)

      if (success) {
        // 检查数据结构是否正确
        if (data && Array.isArray(data)) {
          setStationData(data)
        } else {
          setStationData([])
        }
      } else {
        setStationData([])
        message.warning(errMsg || "获取设备数据失败")
      }
    } catch (error) {
      setStationData([])
      message.error('网络异常，无法获取设备数据')
    }
  }
  // 处理总表设备选中变化
  const handleMeterChange = (selectedSn) => {
    if (!selectedSn) {
      // 未选中时清空状态
      setSelectedMeter(null)
      return
    }
    // 根据选中的sn从deviceData中匹配对应的设备信息
    const matchedMeter = deviceData.find(item => item.sn === selectedSn)
    if (matchedMeter) {
      setSelectedMeter(matchedMeter)
    } else {
      setSelectedMeter(null)
      message.warning('未找到对应的设备信息')
    }
  }





  const getUnBind = async ({ current, pageSize }, formDate = {}) => {
    // let fag = Number.isInteger(parseInt(projectId))
    // if (!fag) return
    // try {
    //   const { alike } = formDate
    //   let body = {
    //     projectId,
    //     pageSize,
    //     type: 1,
    //     pageNum: current,
    //     alike,
    //     rId,
    //   }

    //   let { success, data, total, errMsg } = await useQueryACsUnConfigByPage({}, body)
    //   if (success && Array.isArray(data)) {
    //     return {
    //       list: data,
    //       total: Number.isInteger(total) ? total : 0
    //     }
    //   } else {
    //     if (!success) message.warning(errMsg || "数据出错")
    //     return {
    //       list: [],
    //       total: 0
    //     }
    //   }
    // } catch (error) {
    //   console.log(error)
    // }

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
      mRef.current.onOpen()
      // 打开弹窗时主动加载一次数据
      formTop.setFieldsValue({ no: 'BWG' + Date.now() })
      setTimeout(() => {
        if (areaId) {
          RuntimeDevice()
        }
      }, 100)
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
    // try {
    //   if (unbindkey?.current?.length == 0 && type == 0) return message.warning("请选择未选中的逆变器")
    //   if (bindkey?.current?.length == 0 && type == 1) return message.warning("请选择已选中的逆变器")

    //   let body = {
    //     projectId,
    //     type: 1,
    //     rId: areaId,
    //     acIds: [unbindkey.current, bindkey.current][type]
    //   }
    //   let { success, errMsg } = await [useAddACsConfig, useRemoveACsConfig][type]({}, body)
    //   if (success) {
    //     refresh()
    //     refreshed()
    //   } else {
    //     message.warning(errMsg || "数据出错")
    //   }
    // } catch (error) {

    // }

  }
  const onOk = () => {
    mRef.current.onCancel()
  }
  useImperativeHandle(ref, () => ({
    onOpen,
  }))
  // 监听areaId和projectId变化，重新加载设备数据
  useEffect(() => {
    // 确保参数有效
    if (areaId) {
      RuntimeDevice()
    } else {
      setDeviceData([])
      setSelectedMeter(null) // 切换园区时清空选中
    }
  }, [areaId])

  // 监听areaId和projectId变化，重新加载设备数据
  useEffect(() => {
    // 确保参数有效
    RuntimStation()
  }, [areaId, stationId])
  // 初始化时设置默认园区
  useEffect(() => {
    if (areaList.length > 0 && !areaId && Object.getOwnPropertyNames(editData).length == 0) {
      formTop.setFieldsValue({ areaId: areaList[0].id })
    } else if (areaList.length > 0 && !areaId && !Object.getOwnPropertyNames(editData).length == 0) {
      formTop.setFieldsValue(editData)
      setSelectedMeter(editData)
    }
  }, [areaList, formTop, areaId])
  // 初始化时设置默认站点
  useEffect(() => {
    console.log(stationData.length > 0)
    if (stationData.length > 0 && !areaId && Object.getOwnPropertyNames(editData).length == 0) {
      formTop.setFieldsValue({ stationId: stationData[0].id })
    } else if (stationData.length > 0 && !areaId && !Object.getOwnPropertyNames(editData).length == 0) {
      formTop.setFieldsValue(editData)
      setSelectedMeter(editData)
    }
  }, [stationData, formTop, areaId])
  return (
    <div>
      <CModal title={modalTitle} onOk={onOk} custft={modalTitle == '新增光伏并网柜'} width={1380} mold="cust" ref={mRef} key="cabinet">
        <Bindwrap>
          <div className='top'>
            <Form
              colon={false}
              form={formTop}
              labelCol={{ flex: "90px" }}
              layout="inline"
              labelAlign="left"
              style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '16px ' }}
            >
              <Form.Item
                label="并网柜名称" name="name" rules={[{ required: true }]}>
                <Input placeholder='请输入并网柜名称' style={{ width: "200px" }} />
              </Form.Item>
              <Form.Item label="并网柜编号" name="no">
                <Input placeholder='请输入并网柜编号' disabled style={{ width: "200px" }} />
              </Form.Item>
              <Form.Item
                name="areaId"
                labelCol={{ flex: "150px" }}
                label={oneLevel[0]?.levelName ? `所属${oneLevel[0].levelName}` : "所属园区"}
                rules={[{ required: true, message: `请选择${oneLevel[0]?.levelName || '园区'}` }]}
              >
                <Select
                  placeholder={oneLevel[0]?.levelName ? `请选择${oneLevel[0].levelName}` : "园区名称"}
                  style={{ width: "200px" }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {areaList.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="stationId"
                label='所属站点'
                rules={[{ required: true }]}
              >
                <Select
                  placeholder='请选择所属站点'
                  style={{ width: "200px" }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {stationData.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="安装地址" name="address">
                <Input placeholder='请输入安装地址' style={{ width: "200px" }} />
              </Form.Item>
            </Form>
          </div>

          <div className='deviceInfo'>
            <div>
              总表绑定
              <Select
                filterOption={(val, opts) => {
                  const sn = (opts.sn ?? '').toLowerCase();
                  const name = (opts.name ?? '').toLowerCase();
                  const inputVal = (val ?? '').toLowerCase();
                  return sn.includes(inputVal) || name.includes(inputVal);
                }}
                fieldNames={{ label: "sn", value: "sn" }} // value为sn，与设备数据匹配
                style={{ width: "280px", marginLeft: "16px" }} // 增加底部间距，优化布局
                options={deviceData}
                showSearch
                placeholder="请选择总表设备"
                notFoundContent={deviceData.length === 0 ? "暂无设备数据" : "无匹配设备"}
                onChange={handleMeterChange} // 绑定选中变化事件
                value={selectedMeter?.sn || selectedMeter?.meterSn || undefined} // 回显选中的sn
              />
            </div>
            {/* 4. 动态渲染设备信息：选中时显示name/sn/gateway，未选中时显示提示 */}
            <div className='searchDevice'>
              <div>
                电表名称：{selectedMeter ? (selectedMeter.name || selectedMeter.meterName) : "请选择总表设备"}
              </div>
              <div>
                电表编号：{selectedMeter ? (selectedMeter.sn || selectedMeter.meterSn) : ""}
              </div>
              {/* <div>
                          电表型号：{selectedMeter ? (selectedMeter.category || "未设置") : ""}
                        </div> */}
              <div>
                所属网关：{selectedMeter ? (selectedMeter.gateway || selectedMeter.gatewayName || "未设置") : ""}
              </div>
            </div>
          </div>
          {gridConnectedType == 3 ? <div className='correlationBox'></div> :
            <div className='correlationBox'>
              <div className='inverter_title'>— 关联逆变器 —</div>
              <div className='inwrap'>
                <div style={{ overflow: "auto" }}>
                  <UseTree areaId={0} setTreeId={setTreeId} setLine={() => { }} scroll={485} showline={false} datatype={NaN} energytype={1} ></UseTree>
                </div>
                <div className='tbwrap'>
                  <Form form={form} layout="inline" colon={false}>
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
                  <Form form={formed} layout="inline" colon={false}>
                    <Form.Item label="已选中的逆变器" name="alike">
                      <Serach onSearch={searched.submit} placeholder="请输入逆变器名称或编号"></Serach>
                    </Form.Item>
                  </Form>
                  <UserTable columns={bindcol} {...tablePropsed} rowSelection={rowSelectioned} rowKey={row => row.id} ></UserTable>
                </div>
              </div>
            </div>}
        </Bindwrap>

      </CModal>
    </div >
  )
})
