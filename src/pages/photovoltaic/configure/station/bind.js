import React, { useRef, forwardRef, useImperativeHandle, useState, useMemo, useEffect } from 'react'
import { Input, message, Row, Col, InputNumber, Radio, Button, Form, Select } from "antd"
import { useSelector } from 'react-redux'
import CModal from '@com/useModal'
import { selectOneLevel } from '@redux/systemconfig.js'
import { Bindwrap } from "./style"
import { GridConnectedTypeData } from './data'
import {
  useOverview, useAddPVStation, useUpdatePVStation
} from './api'

export default forwardRef(function Index({ projectId, updata, modalTitle, curPage, editData }, ref) {
  const areaList = useSelector(selectOneLevel).slice(1)
  const oneLevel = useSelector((state) => state.system.onelevel);
  const mRef = useRef()
  const [formTop] = Form.useForm()
  const [deviceData, setDeviceData] = useState([])
  // 存储选中的总表设备信息
  const [selectedMeter, setSelectedMeter] = useState(null)
  // 监听areaId变化
  const areaId = Form.useWatch('areaId', formTop);
  const [previousAreaId, setPreviousAreaId] = useState(null) // 记录上一次的areaId
  // 获取设备数据函数
  const RuntimeDevice = async () => {
    // 验证必要参数
    if (!projectId || !areaId) return

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

      console.log('请求设备数据参数:', params)
      let { success, data, total, errMsg } = await useOverview({}, params)

      if (success) {
        // 检查数据结构是否正确
        if (data && Array.isArray(data.details)) {
          console.log('获取设备数据成功，共', data.details.length, '条')
          setDeviceData(data.details)
          // setSelectedMeter(data.details[0])
        } else {
          setDeviceData([])
          setSelectedMeter(null)
        }
      } else {
        console.log('获取设备数据失败:', errMsg)
        setDeviceData([])
        setSelectedMeter(null)
        message.warning(errMsg || "获取设备数据失败")
      }
    } catch (error) {
      console.error('设备数据请求异常:', error)
      setDeviceData([])
      setSelectedMeter(null)
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
  // 新增保存
  const onOk = async () => {
    try {
      return formTop.validateFields().then(async () => {
        if (selectedMeter == null) {
          message.warning("总表未绑定");
          throw new Error("总表未绑定"); // 抛出错误阻止关闭
        }
        const interfaceName = modalTitle == '新增站点' ? useAddPVStation : useUpdatePVStation;
        let { areaId, name, no, capacity, address, type } = await formTop.validateFields()
        const params = {
          areaId,
          name,
          no: no ? no : '',
          capacity,
          address: address ? address : '',
          type,
          sn: selectedMeter.sn || selectedMeter.meterSn,
          id: editData.id || editData.id,
        }
        let { success, errMsg } = await interfaceName({ projectId }, params)
        if (success) {
          message.success(modalTitle + '成功')
          updata({ current: curPage, pageSize: 14 })
          if (modalTitle != '新增站点') return mRef.current.onCancel()
        } else {
          message.warning(errMsg || "数据出错")
          return Promise.reject("")
        }
      })

    } catch (error) {
      return Promise.reject("")
    }

  }
  const onOpen = async () => {
    try {
      mRef.current.onOpen()
      setPreviousAreaId(null);

      if (modalTitle === '编辑站点' && Object.keys(editData).length > 0) {
        formTop.setFieldsValue(editData);
        setSelectedMeter(editData);

        // 设置当前areaId作为基准
        if (editData.areaId) {
          setPreviousAreaId(editData.areaId);
          setTimeout(() => {
            RuntimeDevice();
          }, 100);
        }
      } else {
        setSelectedMeter(null);

        if (areaList.length > 0) {
          const defaultAreaId = areaList[0].id;
          // formTop.setFieldsValue({ areaId: defaultAreaId });
          setPreviousAreaId(defaultAreaId);
          setTimeout(() => {
            RuntimeDevice();
          }, 100);
        }
      }
    } catch (error) {
      console.log('onOpen error:', error)
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen,
  }))

  // 监听areaId和projectId变化，重新加载设备数据
  useEffect(() => {
    // 确保参数有效
    if (areaId) {
      if (previousAreaId !== null && previousAreaId !== areaId) {
        setSelectedMeter(null);
      }
      RuntimeDevice();
      setPreviousAreaId(areaId);
    } else {
      setDeviceData([]);
      if (previousAreaId !== null) {
        setSelectedMeter(null);
      }
    }
  }, [areaId])

  // 初始化时设置默认园区
  useEffect(() => {
    if (modalTitle != '新增站点') return
    if (areaList.length > 0 && !areaId) {
      formTop.resetFields()
      setSelectedMeter(null);
      formTop.setFieldsValue({ areaId: areaList[0].id })
      formTop.setFieldsValue({ no: 'ZD' + Date.now() });
    }
  }, [areaList])
  useEffect(() => {
    if (Object.keys(editData).length > 0) {
      formTop.setFieldsValue(editData);
      setSelectedMeter(editData);
    }
  }, [editData])

  return (
    <div>
      <CModal closable={false} title={modalTitle} width={880} mold="cust" ref={mRef} onOk={onOk} custft={modalTitle == '新增站点'} key="station">
        <Bindwrap>
          <div className='top'>
            <Form
              colon={false}
              preserve={false}
              form={formTop}
              labelCol={{ flex: "90px" }}
              labelAlign="left"
            >
              <Row gutter={16}>
                <Col span={11}>
                  <Form.Item
                    label="站点名称" name="name" rules={[{ required: true }]}>
                    <Input placeholder='请输入站点名称' style={{ width: "200px" }} />
                  </Form.Item>
                  <Form.Item label="装机容量" name="capacity" rules={[{ required: true }]}>
                    <InputNumber addonAfter="kW" min={0} style={{ width: '200px' }} />
                  </Form.Item>
                  <Form.Item
                    label="安装地址" name="address">
                    <Input placeholder='请输入安装地址' style={{ width: "200px" }} />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item label="站点编号"
                    labelCol={{ flex: "150px" }}
                    name="no">
                    <Input placeholder='请输入站点编号' disabled style={{ width: "200px" }} />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ flex: "150px" }}
                    name="areaId"
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
                  <Form.Item label="并网类型" name="type">
                    <Radio.Group
                      block
                      options={GridConnectedTypeData}
                      defaultValue={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <div className='deviceInfo'>
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

            {/* 4. 动态渲染设备信息：选中时显示name/sn/gateway，未选中时显示提示 */}
            <div className='info'>
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

          {/* <div className='inverter_title'>—— 关联逆变器 ——</div>
          <div className='inwrap'>
            <div style={{ overflow: "auto" }}>
              <UseTree
                areaId={0}
                setTreeId={setTreeId}
                setLine={() => { }}
                scroll={485}
                showline={false}
                datatype={NaN}
                energytype={1}
              />
            </div>
            <div className='tbwrap'>
              <Form form={form} layout="inline">
                <Form.Item label="未选中的逆变器" name="alike">
                  <Serach onSearch={submit} placeholder="请输入逆变器名称或编号" />
                </Form.Item>
              </Form>
              <UserTable
                columns={bindcol}
                {...tableProps}
                rowSelection={rowSelection}
                rowKey={row => row.id}
              />
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
              <Form form={formed} layout="inline">
                <Form.Item label="已选中的逆变器" name="alike">
                  <Serach onSearch={searched.submit} placeholder="请输入逆变器名称或编号" />
                </Form.Item>
              </Form>
              <UserTable
                columns={bindcol}
                {...tablePropsed}
                rowSelection={rowSelectioned}
                rowKey={row => row.id}
              />
            </div> */}
          {/* </div> */}
        </Bindwrap>
      </CModal>
    </div>
  )
})
