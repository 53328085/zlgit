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
import { unbindcol, bindcol } from './data'
import {
  useOverview, useQueryStationList, useGetInverterList,
  useGetAreaInverterList, useAddGridTiedCabinet,
  useUpdateGridTiedCabinet, useAddACsConfig,
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
  // 存储已选中的逆变器设备ID
  const [selectedInverterIds, setSelectedInverterIds] = useState([])
  // 存储编辑模式下的原始数据
  const [editModeData, setEditModeData] = useState(null)
  // 存储已选中表格的数据（用于新增模式）
  const [bindTableData, setBindTableData] = useState([])

  // 获取设备数据函数
  const RuntimeDevice = async () => {
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
        pageSize: 100
      }

      let { success, data, total, errMsg } = await useOverview({}, params)

      if (success) {
        if (data && Array.isArray(data.details)) {
          console.log('获取设备数据成功，共', data.details.length, '条')
          setDeviceData(data.details)
          if (editModeData && editModeData.sn) {
            const matchedMeter = data.details.find(item => item.sn === editModeData.sn)
            setSelectedMeter(matchedMeter || data.details[0])
          } else {
            setSelectedMeter(data.details[0])
          }
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
      }

      let { success, data, total, errMsg } = await useQueryStationList(params)

      if (success) {
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
      setSelectedMeter(null)
      return
    }
    const matchedMeter = deviceData.find(item => item.sn === selectedSn)
    if (matchedMeter) {
      setSelectedMeter(matchedMeter)
    } else {
      setSelectedMeter(null)
      message.warning('未找到对应的设备信息')
    }
  }

  // 获取未绑定的逆变器列表
  const getUnBind = async ({ current, pageSize }, formDate = {}) => {
    if (areaId == undefined) return
    let fag = Number.isInteger(parseInt(projectId))
    if (!fag) return
    try {
      const { alike } = formDate
      let params = {
        projectId,
        pageSize,
        pageNum: current,
        areaId,
        alike
      }

      let { success, data, total, errMsg } = await useGetAreaInverterList(params)
      if (success && Array.isArray(data)) {
        // 过滤掉已选中的逆变器
        const filteredData = data.filter(item => !selectedInverterIds.includes(item.deviceId))
        return {
          list: filteredData,
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
      return {
        list: [],
        total: 0
      }
    }
  }

  // 获取已绑定的逆变器列表（编辑模式使用）
  const getBind = async ({ current, pageSize }, formData = {}) => {
    try {
      if (editModeData == null) return
      console.log(editModeData)
      // 新增模式下返回空数据，因为我们用本地状态管理
      if (modalTitle === '新增光伏并网柜') {
        return {
          list: bindTableData, // 使用本地状态数据
          total: bindTableData.length
        }
      }

      let fag = Number.isInteger(parseInt(projectId)) && Number.isInteger(parseInt(areaId))
      if (!fag) return

      const { alike = "" } = formData
      let params = {
        projectId,
        pageSize,
        pageNum: current,
        gridTiedCabinetId: editModeData?.id,
        alike
      }

      let { success, data, total, errMsg } = await useGetInverterList(params)
      if (success && Array.isArray(data)) {
        // 更新已选中的逆变器ID列表
        const selectedIds = data.map(item => item.deviceId)
        setSelectedInverterIds(selectedIds)

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
      return {
        list: [],
        total: 0
      }
    }
  }

  const { tableProps, search } = useAntdTable(getUnBind, {
    form,
    defaultPageSize: 14,
    refreshDeps: [areaId]
  })
  const { submit } = search

  const { tableProps: tablePropsed, run: runed, search: searched, refresh: refreshed } = useAntdTable(getBind, {
    form: formed,
    defaultPageSize: 14,
    refreshDeps: [projectId, treeId, areaId, editModeData, bindTableData] // 添加bindTableData依赖
  })

  const onOpen = async () => {
    try {
      console.log(Object.keys(editData).length, editData)
      mRef.current.onOpen()
      // 重置状态
      setSelectedInverterIds([])
      setBindTableData([])
      setEditModeData(null)

      // 设置表单默认值
      formTop.setFieldsValue({
        no: 'BWG' + Date.now(),
        name: '',
        address: '',
        areaId: areaList.length > 0 ? areaList[0].id : undefined,
        stationId: undefined
      })

      // 如果是编辑模式，设置编辑数据
      if (modalTitle == '编辑光伏并网柜' && editData && Object.getOwnPropertyNames(editData).length > 0) {
        setEditModeData(editData)
        formTop.setFieldsValue(editData)
      }

      setTimeout(() => {
        if (areaId) {
          RuntimeDevice()
          RuntimStation()
        }
      }, 100)
    } catch (error) {
      console.log(error)
    }
  }

  // 添加 / 撤销逆变器
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

  // 添加逆变器到已选中列表
  const addbind = async (type) => {
    try {
      if (type === 0) { // 添加操作
        if (unbindkey?.current?.length === 0) {
          return message.warning("请选择未选中的逆变器")
        }

        // 获取选中的逆变器数据
        const selectedInverters = tableProps.dataSource?.filter(item =>
          unbindkey.current.includes(item.deviceId)
        ) || []

        if (selectedInverters.length === 0) {
          return message.warning("未找到选中的逆变器数据")
        }

        // 获取当前已选中表格的数据
        const currentBindData = modalTitle === '新增光伏并网柜' ? bindTableData : tablePropsed.dataSource || []

        // 过滤掉已存在的设备（根据deviceId去重）
        const newInverters = selectedInverters.filter(newItem =>
          !currentBindData.some(existingItem => existingItem.deviceId === newItem.deviceId)
        )

        if (newInverters.length === 0) {
          message.warning("选中的逆变器已在已选中列表中")
          // 清空选择
          unbindkey.current = []
          if (rowSelection.onChange) {
            rowSelection.onChange([], [])
          }
          return
        }

        // 更新数据
        if (modalTitle === '新增光伏并网柜') {
          // 新增模式：更新本地状态
          const updatedBindData = [...currentBindData, ...newInverters]
          setBindTableData(updatedBindData)
        } else {
          // 编辑模式：需要调用接口，这里先更新本地状态以便立即显示
          const updatedBindData = [...currentBindData, ...newInverters]
          // 这里可以调用接口进行绑定
        }

        // 更新已选中的逆变器ID列表
        const newSelectedIds = [...selectedInverterIds, ...newInverters.map(item => item.deviceId)]
        setSelectedInverterIds(newSelectedIds)

        // 清空选择
        unbindkey.current = []
        if (rowSelection.onChange) {
          rowSelection.onChange([], [])
        }

        // 刷新未选中表格
        // refresh()

        // 刷新已选中表格
        if (modalTitle === '新增光伏并网柜') {
          // 新增模式手动触发表格更新
          runed(
            { current: 1, pageSize: 14 },
            formed.getFieldsValue()
          )
        } else {
        }

        // message.success(`成功添加 ${newInverters.length} 个逆变器`)

      } else if (type === 1) { // 撤销操作
        if (bindkey?.current?.length === 0) {
          return message.warning("请选择已选中的逆变器")
        }

        // 更新数据
        if (modalTitle === '新增光伏并网柜') {
          // 新增模式：更新本地状态
          const updatedBindData = bindTableData.filter(item => !bindkey.current.includes(item.deviceId))
          setBindTableData(updatedBindData)
        } else {
          // 编辑模式：需要调用接口，这里先更新本地状态
          const updatedBindData = tablePropsed.dataSource.filter(item => !bindkey.current.includes(item.deviceId))
          // 这里可以调用接口进行解绑
        }

        // 从已选中的逆变器ID列表中移除
        const newSelectedIds = selectedInverterIds.filter(id => !bindkey.current.includes(id))
        setSelectedInverterIds(newSelectedIds)

        // 清空选择
        bindkey.current = []
        if (rowSelectioned.onChange) {
          rowSelectioned.onChange([], [])
        }
        // message.success(`成功撤销 ${bindkey.current.length} 个逆变器`)
      }
    } catch (error) {
      console.error('操作逆变器失败:', error)
      message.error('操作失败，请重试')
    }
  }

  // 保存并网柜配置
  const onOk = async () => {
    try {
      // 验证表单
      return formTop.validateFields().then(async () => {

        if (!selectedMeter) {
          message.warning('请选择总表设备')
          return
        }

        const formData = formTop.getFieldsValue()

        // 准备请求参数
        const params = {
          areaId: formData.areaId,
          stationId: formData.stationId,
          name: formData.name,
          no: formData.no,
          sn: selectedMeter.sn || selectedMeter.meterSn,
          address: formData.address,
          deviceIds: selectedInverterIds
        }
        if (modalTitle !== '新增光伏并网柜' && editModeData?.id) {
          params.id = editModeData.id
        }
        console.log('保存参数:', params)

        // 这里调用实际的保存接口
        const apiFunction = modalTitle === '新增光伏并网柜' ? useAddGridTiedCabinet : useUpdateGridTiedCabinet
        let { success, errMsg } = await apiFunction(
          { projectId }, params)
        if (success) {
          message.success(modalTitle === '新增光伏并网柜' ? '新增成功' : '编辑成功')
          mRef.current.onCancel()
          updata({ current: curPage, pageSize: 14 })
        } else {
          message.warning(errMsg || "保存失败")
        }
      })
    } catch (error) {
      console.error('保存失败:', error)
      if (error.errorFields) {
        message.warning('请完善表单信息')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen,
  }))

  // 监听areaId和projectId变化，重新加载设备数据
  useEffect(() => {
    if (areaId) {
      RuntimeDevice()
      RuntimStation()
    } else {
      setDeviceData([])
      setSelectedMeter(null)
    }
  }, [areaId])

  // 初始化时设置默认园区
  useEffect(() => {
    if (areaList.length > 0 && !areaId && Object.keys(editData || {}).length === 0) {
      formTop.setFieldsValue({ areaId: areaList[0].id })
    }
  }, [areaList, formTop, areaId, editData])

  // 初始化时设置默认站点
  useEffect(() => {
    if (stationData.length > 0 && Object.keys(editData || {}).length === 0) {
      formTop.setFieldsValue({ stationId: stationData[0].id })
    }
  }, [stationData, formTop, areaId, editData])

  return (
    <div>
      <CModal title={modalTitle} onOk={onOk} custft={modalTitle == '新增光伏并网柜'} width={1380} mold="cust" ref={mRef} key="cabinet">
        <Bindwrap>
          <div className='top'>
            <Form
              colon={false}
              form={formTop}
              labelCol={{ flex: "90px" }}
              labelAlign="left"

            >
              <div
                style={{ display: 'flex', justifyContent: 'start', gap: '16px ' }}>
                <Form.Item
                  label="并网柜名称"
                  name="name"
                  rules={[{ required: true, message: '请输入并网柜名称' }]}
                >
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
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'start', gap: '16px ' }}>
                <Form.Item
                  name="stationId"
                  label='所属站点'
                  rules={[{ required: true, message: '请选择所属站点' }]}
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
                  label="安装地址"
                  name="address"
                  rules={[{ required: true, message: '请输入安装地址' }]}
                >
                  <Input placeholder='请输入安装地址' style={{ width: "200px" }} />
                </Form.Item>
              </div>
            </Form>
          </div>

          <div className='deviceInfo'>
            <div>
              总表绑定
              <Select
                filterOption={(input, option) => {
                  const device = option.device || {}
                  const sn = (device.sn || device.meterSn || '').toLowerCase()
                  const name = (device.name || device.meterName || '').toLowerCase()
                  const inputVal = (input || '').toLowerCase()
                  return sn.includes(inputVal) || name.includes(inputVal)
                }}
                fieldNames={{
                  label: "name",
                  value: "sn"
                }}
                style={{ width: "280px", marginLeft: "16px" }}
                options={deviceData.map(device => ({
                  ...device,
                  label: device.name || device.meterName,
                  value: device.sn || device.meterSn,
                  device: device
                }))}
                showSearch
                placeholder="请选择总表设备"
                notFoundContent={deviceData.length === 0 ? "暂无设备数据" : "无匹配设备"}
                onChange={handleMeterChange}
                value={selectedMeter?.sn || selectedMeter?.meterSn || undefined}
              />
            </div>
            <div className='searchDevice'>
              <div>
                电表名称：{selectedMeter ? (selectedMeter.name || selectedMeter.meterName) : "请选择总表设备"}
              </div>
              <div>
                电表编号：{selectedMeter ? (selectedMeter.sn || selectedMeter.meterSn) : ""}
              </div>
              <div>
                所属网关：{selectedMeter ? (selectedMeter.gateway || selectedMeter.gatewayName || "未设置") : ""}
              </div>
            </div>
          </div>

          {gridConnectedType == 3 ?
            <div className='correlationBox'></div>
            :
            <div className='correlationBox'>
              <div className='inverter_title'>— 关联逆变器 —</div>
              <div className='inwrap'>
                <div className='tbwrap'>
                  <Form form={form} layout="inline" colon={false}>
                    <Form.Item label="未选中的逆变器" name="alike">
                      <Serach onSearch={submit} placeholder="请输入逆变器名称或编号"></Serach>
                    </Form.Item>
                  </Form>
                  <UserTable
                    columns={unbindcol}
                    {...tableProps}
                    rowSelection={rowSelection}
                    rowKey={row => row.deviceId}
                  ></UserTable>
                </div>
                <div className='handler'>
                  <Button type="primary" onClick={() => addbind(0)} >
                    添加 <RightOutlined />
                  </Button>
                  <Button icon={<LeftOutlined />} onClick={() => addbind(1)} >
                    撤销
                  </Button>
                </div>
                <div className='tbwrap'>
                  <Form form={formed} layout="inline" colon={false}>
                    <Form.Item label="已选中的逆变器" name="alike">
                      <Serach onSearch={searched.submit} placeholder="请输入逆变器名称或编号"></Serach>
                    </Form.Item>
                  </Form>
                  <UserTable
                    columns={bindcol}
                    {...tablePropsed}
                    rowSelection={rowSelectioned}
                    rowKey={row => row.deviceId}
                  ></UserTable>
                </div>
              </div>
            </div>
          }
        </Bindwrap>
      </CModal>
    </div>
  )
})