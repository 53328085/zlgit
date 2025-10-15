import React, { useRef, forwardRef, useImperativeHandle, useState, useMemo, useEffect, useCallback } from 'react'
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
  useUpdateGridTiedCabinet,
} from './api'

export default forwardRef(function Index({ projectId, updata, modalTitle, curPage, editData }, ref) {
  const areaList = useSelector(selectOneLevel).slice(1)
  const oneLevel = useSelector((state) => state.system.onelevel);
  const mRef = useRef()
  const [formTop] = Form.useForm()
  const [form] = Form.useForm()
  const [formed] = Form.useForm()

  const [deviceData, setDeviceData] = useState([])
  const [stationData, setStationData] = useState([])
  // 存储选中的总表设备信息
  const [selectedMeter, setSelectedMeter] = useState(null)
  // 监听areaId变化
  const areaId = Form.useWatch('areaId', formTop);
  const [previousAreaId, setPreviousAreaId] = useState(null) // 记录上一次的areaId
  const stationId = Form.useWatch('stationId', formTop);
  // 存储已选中的逆变器设备ID
  const [selectedInverterIds, setSelectedInverterIds] = useState([])
  // 存储编辑模式下的原始数据
  const [editModeData, setEditModeData] = useState(null)
  // 存储已选中表格的数据（用于新增模式）
  const [bindTableData, setBindTableData] = useState([])
  // 编辑模式下已选中数据的本地暂存（未提交到服务器前）
  const editBindTableData = useRef([])
  // 获取设备数据函数
  const RuntimeDevice = async () => {
    if (!projectId || !areaId) {
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
        pageNum: 1,
        pageSize: 100
      }

      let { success, data, total, errMsg } = await useOverview({}, params)

      if (success) {
        if (data && Array.isArray(data.details)) {
          setDeviceData(data.details)
          // if (editModeData && editModeData.sn) {
          //   const matchedMeter = data.details.find(item => item.sn === editModeData.sn)
          //   setSelectedMeter(matchedMeter || data.details[0])
          // } else {
          //   setSelectedMeter(data.details[0])
          // }
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
  const [unbindSelectedKeys, setUnbindSelectedKeys] = useState([])
  const [bindSelectedKeys, setBindSelectedKeys] = useState([])
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
        return {
          list: data, // 直接返回所有数据
          total: Number.isInteger(total) ? total : 0
        };
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

  // 获取已绑定的逆变器列表（完全重写）
  // 获取已绑定的逆变器列表（重构后：编辑模式完全本地处理，不调用接口）
  const getBind = async ({ current, pageSize }, formData = {}) => {
    try {
      const { alike = "" } = formData;

      // 1. 新增模式：基于本地 bindTableData（原逻辑保留，无接口调用）
      if (modalTitle === '新增光伏并网柜') {
        const filteredList = bindTableData.filter(item =>
          (item.name || '').includes(alike) || (item.sn || '').includes(alike)
        );
        const paginatedList = filteredList.slice((current - 1) * pageSize, current * pageSize);
        return {
          list: paginatedList,
          total: filteredList.length
        };
      }

      // 2. 编辑模式：强制使用本地 editBindTableData.current，完全不调用接口
      if (modalTitle === '编辑光伏并网柜') {
        // 从本地缓存获取数据（初始化时已加载，后续操作均更新本地）
        const localData = editBindTableData.current || [];

        // 本地搜索过滤
        const filteredList = localData.filter(item =>
          (item.name || '').includes(alike) || (item.sn || '').includes(alike)
        );

        // 本地分页处理
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedList = filteredList.slice(startIndex, endIndex);

        // 仅返回本地数据，不发起任何接口请求
        return {
          list: paginatedList,
          total: filteredList.length
        };
      }

      // 其他情况（理论不会进入）
      return { list: [], total: 0 };
    } catch (error) {
      console.log('getBind 本地处理异常:', error);
      return { list: [], total: 0 };
    }
  };
  const { tableProps, search, refresh: refreshUnbind } = useAntdTable(getUnBind, {
    form,
    defaultPageSize: 14,
    refreshDeps: [areaId, selectedInverterIds] // 只保留必要的依赖
    // 移除 selectedInverterIds，因为它在函数内部已经可以获取到最新值
  })
  const { submit } = search

  const { tableProps: tablePropsed, run: runed, search: searched, refresh: refreshed } = useAntdTable(getBind, {
    form: formed,
    defaultPageSize: 14,
    manual: true, // 改为手动触发
    refreshDeps: [] // 清空依赖，改为手动控制
  })

  const onOpen = async () => {
    try {
      mRef.current.onOpen()
      setPreviousAreaId(null);
      // 重置状态
      setSelectedInverterIds([]);
      setBindTableData([]);
      editBindTableData.current = []
      setEditModeData(null);
      setUnbindSelectedKeys([]);
      setBindSelectedKeys([]); // 清空已选表格选择状态

      // 设置表单默认值
      formTop.setFieldsValue({
        no: 'BWG' + Date.now(),
        name: '',
        address: '',
        areaId: areaList.length > 0 ? areaList[0].id : undefined,
        stationId: undefined
      })

      // 如果是编辑模式，设置编辑数据
      if (modalTitle === '编辑光伏并网柜' && Object.keys(editData).length > 0) {
        setEditModeData(editData)
        setSelectedMeter(editData);
        formTop.setFieldsValue(editData)
        if (editData.areaId) {
          setPreviousAreaId(editData.areaId);
          setTimeout(() => {
            RuntimeDevice();
            loadTableData();
          }, 100);
        } else {
          setSelectedMeter(null);

          if (areaList.length > 0) {
            const defaultAreaId = areaList[0].id;
            setPreviousAreaId(defaultAreaId);
            setTimeout(() => {
              RuntimeDevice();
              loadTableData();
            }, 100);
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 新增表格数据加载方法
  // 新增表格数据加载方法（优化：编辑模式仅初始化加载一次接口）
  const loadTableData = useCallback(() => {
    // 加载未绑定表格（左边表格，不影响撤回逻辑）
    refreshUnbind();

    if (modalTitle === '新增光伏并网柜') {
      // 新增模式：加载本地空数据
      searched.submit();
    } else if (modalTitle === '编辑光伏并网柜' && editModeData?.id) {
      // 编辑模式：仅初始化时调用一次接口，后续不再调用
      if (editBindTableData.current.length === 0) { // 仅本地无数据时加载
        const fetchInitialData = async () => {
          try {
            const params = {
              projectId,
              pageSize: 100, // 一次性加载所有数据（避免分页）
              pageNum: 1,
              gridTiedCabinetId: editModeData.id,
              alike: ""
            };
            const { success, data, total } = await useGetInverterList(params);
            if (success && Array.isArray(data)) {
              // 初始化本地缓存（后续操作基于此数据，不调用接口）
              editBindTableData.current = data;
              setSelectedInverterIds(data.map(item => item.deviceId));
              // 加载完成后触发表格渲染
              searched.submit();
            }
          } catch (err) {
            console.log('编辑模式初始化数据失败:', err);
            editBindTableData.current = []; // 异常时置空，避免后续报错
            searched.submit();
          }
        };
        fetchInitialData();
      } else {
        // 本地已有数据，直接渲染（不调用接口）
        searched.submit();
      }
    }
  }, [refreshUnbind, searched, modalTitle, editModeData, projectId]);

  const rowSelection = {
    selectedRowKeys: unbindSelectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // 获取当前已选中表格的数据
      const currentBindData = modalTitle === '新增光伏并网柜' ? bindTableData : editBindTableData.current || []

      // 过滤掉已经在已选中表格中的数据
      const filteredSelectedRows = selectedRows.filter(row =>
        !currentBindData.some(bindItem => bindItem.deviceId === row.deviceId)
      )

      const filteredSelectedKeys = filteredSelectedRows.map(row => row.deviceId)

      // 如果有被过滤掉的，提示用户
      if (filteredSelectedRows.length < selectedRows.length) {
        message.warning('部分选中的逆变器已存在，已自动过滤')
      }

      setUnbindSelectedKeys(filteredSelectedKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: selectedInverterIds.includes(record.deviceId) // 禁用已选中的行
    }),
    type: "checkbox",
  }

  const rowSelectioned = {
    selectedRowKeys: bindSelectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setBindSelectedKeys(selectedRowKeys)
    },
    type: "checkbox",
  }

  // 添加逆变器到已选中列表
  const addbind = async (type) => {
    try {
      if (type === 0) { // 添加操作（保持原逻辑不变，仅修改撤销逻辑）
        if (unbindSelectedKeys.length === 0) {
          return message.warning("请选择未选中的逆变器")
        }

        // 获取选中的逆变器数据
        const selectedInverters = tableProps.dataSource?.filter(item =>
          unbindSelectedKeys.includes(item.deviceId)
        ) || []

        if (selectedInverters.length === 0) {
          return message.warning("未找到选中的逆变器数据")
        }

        // 编辑模式：更新本地暂存数据（去重）
        if (modalTitle === '编辑光伏并网柜') {
          const newInverters = selectedInverters.filter(newItem =>
            !editBindTableData.current.some(existItem => existItem.deviceId === newItem.deviceId)
          );
          editBindTableData.current = [...editBindTableData.current, ...newInverters];
          // 更新已选ID（去重）
          const newSelectedIds = Array.from(new Set([
            ...selectedInverterIds,
            ...newInverters.map(item => item.deviceId)
          ]));
          setSelectedInverterIds(newSelectedIds);
        } else if (modalTitle === '新增光伏并网柜') {
          // 新增模式：原有逻辑保留
          const updatedBindData = [...bindTableData, ...selectedInverters];
          setBindTableData(updatedBindData);
          const newSelectedIds = Array.from(new Set([
            ...selectedInverterIds,
            ...selectedInverters.map(item => item.deviceId)
          ]));
          setSelectedInverterIds(newSelectedIds);
        }

        // 清空选择+刷新已选中表格（本地数据）
        setUnbindSelectedKeys([]);
        searched.submit(); // 仅触发本地数据渲染，不调用接口
      } else if (type === 1) { // 撤销操作（核心修改部分）
        if (bindSelectedKeys.length === 0) {
          return message.warning("请选择已选中的逆变器")
        }

        // 1. 获取当前已选中的本地数据（新增用state，编辑用useRef）
        const currentBoundData = modalTitle === '编辑光伏并网柜'
          ? editBindTableData.current
          : bindTableData;

        // 2. 过滤掉“要撤销的选中项”，得到更新后的本地数据
        const updatedBoundData = currentBoundData.filter(item =>
          !bindSelectedKeys.includes(item.deviceId)
        );

        // 3. 更新本地数据存储（不调用接口）
        if (modalTitle === '编辑光伏并网柜') {
          // 编辑模式：直接修改useRef的current（本地暂存，不触发重渲染）
          editBindTableData.current = updatedBoundData;
        } else {
          // 新增模式：更新state（触发组件重渲染，表格自动读取新数据）
          setBindTableData(updatedBoundData);
        }

        // 4. 更新“已选中逆变器ID列表”（移除被撤销的ID）
        const updatedSelectedIds = selectedInverterIds.filter(id =>
          !bindSelectedKeys.includes(id)
        );
        setSelectedInverterIds(updatedSelectedIds);

        // 5. 清空已选中表格的选择状态
        setBindSelectedKeys([]);

        // 6. 编辑模式特殊处理：手动触发表格重新读取本地数据
        // （因useRef变化不触发重渲染，需调用searched.submit()让getBind读取更新后的current）
        if (modalTitle === '编辑光伏并网柜') {
          const currentSearchParams = formed.getFieldsValue(); // 保留当前搜索条件
          searched.submit(currentSearchParams); // 仅处理本地数据，不调用接口
        }

        // 关键：不调用任何后端接口，不刷新未选中表格（左边表格保持不变）
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
        if (selectedMeter == null) {
          message.warning("总表未绑定");
          throw new Error("总表未绑定"); // 抛出错误阻止关闭
        }
        const formData = formTop.getFieldsValue()
        let deviceIds = [];
        deviceIds = modalTitle === '编辑光伏并网柜'
          ? editBindTableData.current.map(item => item.deviceId)
          : selectedInverterIds
        // 准备请求参数
        const params = {
          areaId: formData.areaId,
          stationId: formData.stationId,
          name: formData.name,
          no: formData.no,
          sn: selectedMeter.sn || selectedMeter.meterSn,
          address: formData.address,
          deviceIds: deviceIds
        }
        if (modalTitle !== '新增光伏并网柜' && editModeData?.id) {
          params.id = editModeData.id
        }

        // 这里调用实际的保存接口
        const apiFunction = modalTitle === '新增光伏并网柜' ? useAddGridTiedCabinet : useUpdateGridTiedCabinet
        let { success, errMsg } = await apiFunction(
          { projectId }, params)
        if (success) {
          message.success(modalTitle === '新增光伏并网柜' ? '新增成功' : '编辑成功')
          updata({ current: curPage, pageSize: 14 })
          if (modalTitle != '新增光伏并网柜') return mRef.current.onCancel()
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
      if (previousAreaId !== null && previousAreaId !== areaId) {
        setSelectedMeter(null);
        formTop.resetFields(['stationId'])
      }
      RuntimeDevice()
      RuntimStation()
      // 园区变化时重新加载表格数据
      loadTableData()
    } else {
      setDeviceData([])
      if (previousAreaId !== null) {
        setSelectedMeter(null);
      }
    }
  }, [areaId])

  // 初始化时设置默认园区
  useEffect(() => {
    if (areaList.length > 0 && !areaId && Object.keys(editData || {}).length === 0) {
      formTop.setFieldsValue({ areaId: areaList[0].id })
    }
  }, [areaList, formTop, areaId, editData])

  // 初始化时设置默认站点
  // useEffect(() => {
  //   if (stationData.length > 0 && Object.keys(editData || {}).length === 0) {
  //     formTop.setFieldsValue({ stationId: stationData[0].id })
  //   } else if (stationData.length > 0 && !Object.keys(editData || {}).length === 0) {
  //     formTop.setFieldsValue({ stationId: editData.id })
  //   }
  // }, [stationData, formTop, areaId, editData])

  return (
    <div>
      <CModal
        closable={false} title={modalTitle} onOk={onOk} custft={modalTitle == '新增光伏并网柜'} width={1380} mold="cust" ref={mRef} key="cabinet">
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
        </Bindwrap>
      </CModal>
    </div>
  )
})