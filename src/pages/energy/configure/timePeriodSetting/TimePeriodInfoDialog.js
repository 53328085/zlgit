import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import CModal from '@com/useModal'
import { useMemoizedFn, useRequest } from 'ahooks'
import styled from 'styled-components'
import { DatePicker, Divider, Form, Input, message, Select, Space, TimePicker } from 'antd'
import moment from 'moment'
import {
  DefaultFormInfo, getStepOptions,
  getTimePeriodOptions,
  getTimePeriodTypeOptions
} from '@pages/energy/configure/timePeriodSetting/Constant'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig'
import { EnergyManagement } from '@api/api'
import { merge } from 'lodash'

const MainBox = styled.div`
    height: 600px;
    overflow: auto;

    .form {
        display: flex;
        flex-direction: column;
        row-gap: 16px;

        .save {
            width: 450px;
            display: flex;
            justify-content: flex-end;
        }

        .times {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px 0;
        }
    }
`

const Index = ({ onRefreshClick }, ref) => {
  //是否新增
  const [isAdd, setIsAdd] = useState(true)
  //项目id
  const projectId = useSelector(selectProjectId)
  //编辑的分时设置唯一标识
  const [editKey, setEditKey] = useState('')
  //表单
  const [form] = Form.useForm()
  //弹窗ref
  const modalRef = useRef(null)
  //弹窗标题
  const dialogTitle = isAdd ? '新增分时能耗时段设置' : '编辑分时能耗时段设置'

  const timePeriodStep = Form.useWatch('step', form)

  /**
   * 显示弹窗
   */
  const showDialog = (info) => {
    if (info) {
      setEditKey(info.enableDate)
      setIsAdd(false)
      form.setFieldsValue({
        ...info,
        step: info.count,
        enableDate: moment(info.enableDate)
      })
      //获取详情
      getInfoDetail({ projectId, enableDate: info.enableDate })
    } else {
      setIsAdd(true)
      form.setFieldsValue({
        ...DefaultFormInfo
      })
    }
    modalRef.current?.onOpen()
  }

  /**
   * 提交按钮点击事件
   */
  const onSubmitClick = useMemoizedFn(async () => {
    try {
      let values = await form.validateFields()
      if (!values) return
      checkTimeInfo(values)
      const params = merge({
        projectId,
        enableDate: '',
        newTariffTimes: []
      }, values)
      if (isAdd) {
        params.enableDate = moment(params.enableDate).format('YYYY-MM-DD')
      } else {
        params.newEnableDate = moment(params.enableDate).format('YYYY-MM-DD')
        params.oldEnableDate = moment(editKey).format('YYYY-MM-DD')
        delete params.enableDate
      }
      params.newTariffTimes.forEach(item => {
        if (item.endTime === '24:00') {
          item.endTime = '00:00'
        }
      })
      let result
      if (isAdd) {
        result = await EnergyManagement.setTimePeriodSettingInfoApi(params)
      } else {
        result = await EnergyManagement.editTimePeriodSettingInfoApi(params)
      }
      if (result.success) {
        message.success('保存成功')
        modalRef.current?.onCancel()
        onRefreshClick()
      } else {
        throw new Error(result?.errMsg || '未知错误')
      }
    } catch (error) {
      error.message && message.error(error.message)
      throw error
    }
  })

  useImperativeHandle(ref, () => ({
    showDialog,
  }))

  const disabledDate = (current) => {
    return current && current <= moment().endOf('day')
  }

  // 在组件内添加时间处理函数
  const handleTimeChange = (changedValues, allValues) => {
    const { newTariffTimes = [] } = allValues
    // 更可靠的变化字段检测方式
    let changedField = null
    let changedIndex = null

    // 检测newTariffTimes数组的变化
    if (changedValues.newTariffTimes) {
      changedIndex = Object.keys(changedValues.newTariffTimes)[0]
      if (changedIndex !== undefined) {
        const changedTime = changedValues.newTariffTimes[changedIndex]
        changedField = Object.keys(changedTime)[0]
      }
    }

    if (changedIndex !== null) {
      const currentIndex = parseInt(changedIndex)
      const currentTime = newTariffTimes[currentIndex]

      // 处理同一时段endTime > startTime
      if (currentTime.startTime && currentTime.endTime) {
        const start = moment(currentTime.startTime, 'HH:mm')
        const end = moment(currentTime.endTime, 'HH:mm')
        if (end.isSameOrBefore(start)) {
          // 清空当前endTime和后一时段startTime
          form.setFieldsValue({
            newTariffTimes: newTariffTimes.map((t, i) => {
              if (i === currentIndex) {
                return { ...t, endTime: '' }
              } else if (i === currentIndex + 1) {
                return { ...t, startTime: '' }
              } else if (i === currentIndex - 1) {
                // 前一时段endTime同步为当前startTime
                return { ...t, endTime: currentTime.startTime }
              }
              return t
            })
          })
          return
        }
      }

      // 双向联动处理
      if (changedField === 'startTime' && currentIndex > 0) {
        // 修改后一时段startTime时，同步更新前一时段endTime
        form.setFieldsValue({
          newTariffTimes: newTariffTimes.map((t, i) =>
            i === currentIndex - 1 ? { ...t, endTime: currentTime.startTime } : t
          )
        })
      } else if (changedField === 'endTime' && currentIndex < newTariffTimes.length - 1) {
        // 修改前一时段endTime时，同步更新后一时段startTime
        form.setFieldsValue({
          newTariffTimes: newTariffTimes.map((t, i) =>
            i === currentIndex + 1 ? { ...t, startTime: currentTime.endTime } : t
          )
        })
      }
    }
  }

  const checkTimeInfo = useMemoizedFn((values) => {
    const { newTariffTimes = [] } = values
    // 1. 检查必填字段
    for (let i = 0; i < newTariffTimes.length; i++) {
      const item = newTariffTimes[i]
      if (!item.tariffTimeType || !item.startTime || !item.endTime) {
        throw new Error(`时段${i + 1}的所有字段必须填写完整`)
      }
    }
    // 2. 检查单个时段的时间有效性
    for (let i = 0; i < newTariffTimes.length; i++) {
      const { startTime, endTime } = newTariffTimes[i]
      const start = moment(startTime, 'HH:mm')
      const end = moment(endTime, 'HH:mm')
      if (end.isSameOrBefore(start)) {
        throw new Error(`时段${i + 1}的结束时间必须大于开始时间`)
      }
    }
    // 3. 检查时段连续性
    for (let i = 1; i < newTariffTimes.length; i++) {
      const prevEnd = moment(newTariffTimes[i - 1].endTime, 'HH:mm')
      const currentStart = moment(newTariffTimes[i].startTime, 'HH:mm')
      if (!currentStart.isSame(prevEnd)) {
        throw new Error(`时段${i}的结束时间必须等于时段${i + 1}的开始时间`)
      }
    }
    // 4. 检查首尾时段
    const firstStart = moment(newTariffTimes[0].startTime, 'HH:mm')
    if (!firstStart.isSame(moment('00:00', 'HH:mm'))) {
      throw new Error('第一个时段的开始时间必须为00:00')
    }
    const lastEnd = moment(newTariffTimes[newTariffTimes.length - 1].endTime, 'HH:mm')
    if (!lastEnd.isSame(moment('24:00', 'HH:mm'))) {
      throw new Error('最后一个时段的结束时间必须为24:00')
    }
    return true // 所有校验通过
  })

  /**
   * 获取分时能耗时段设置
   */
  const { run: getInfoDetail } = useRequest(EnergyManagement.getTimePeriodSettingInfoApi, {
    onSuccess: ({ success, errMsg, data }) => {
      if (success && data) {
        form.setFieldsValue({
          newTariffTimes: data?.tariffTimes
        })
      } else {
        message.error(errMsg)
      }
    },
    manual: true,
    refreshDeps: [projectId]
  })

  useEffect(() => {
    if (timePeriodStep) {
      form.setFieldsValue({
        newTariffTimes: Array.from({ length: timePeriodStep }, (_, index) => ({
          tariffTimeType: null,
          startTime: index === 0 ? '00:00' : '',
          endTime: index === (timePeriodStep - 1) ? '24:00' : '',
        }))
      })
    }
  }, [timePeriodStep])

  return (
    <CModal
      width={750}
      ref={modalRef}
      onOk={onSubmitClick}
      mold="cust"
      title={dialogTitle}
      custft={isAdd}
    >
      <MainBox>
        <Form
          form={form}
          className="form"
          labelAlign="right"
          colon={false}
          preserve={false}
          onValuesChange={handleTimeChange}  // 添加这行
        >
          <Form.Item
            label="方案名称"
            name="planName"
            labelCol={{ flex: '6em' }}
            rules={[{
              required: true,
              message: '请输入方案名称'
            }]}
          >
            <Input placeholder="请输入" style={{ width: '196px' }}/>
          </Form.Item>
          <Space size={32}>
            <Form.Item
              label="日时段数"
              name="step"
              labelCol={{ flex: '6em' }}
              rules={[{
                required: true,
                message: '请选择日时段数'
              }]}
            >
              <Select placeholder="请选择" options={getStepOptions()} style={{ width: '196px' }} allowClear={false}/>
            </Form.Item>
            <Form.Item
              label="启用日期"
              name="enableDate"
              labelCol={{ flex: '6em' }}
              rules={[{
                required: true,
                message: '请选择启用日期'
              }]}
            >
              <DatePicker disabledDate={disabledDate} allowClear={false} format="YYYY-MM-DD"/>
            </Form.Item>
          </Space>
          <Divider style={{ margin: 0 }}/>
          <Form.List name="newTariffTimes">
            {(fields) => (
              <div className="times">
                {fields.map(({ key, name }) => (
                  <Space key={key}>
                    <Form.Item
                      name={[name, 'tariffTimeType']}
                      label={`时段${key + 1}`}
                      labelCol={{ flex: '6em' }}
                      labelAlign="right"
                    >
                      <Select
                        options={getTimePeriodTypeOptions()}
                        style={{ width: '114px' }}
                      />
                    </Form.Item>
                    <Form.Item
                      style={{ marginLeft: 32 }}
                      name={[name, 'startTime']}
                    >
                      <Select
                        disabled
                        options={getTimePeriodOptions()}
                        style={{ width: '114px' }}
                      />
                    </Form.Item>
                    <div style={{ margin: '0 12px' }}>至</div>
                    <Form.Item
                      name={[name, 'endTime']}
                    >
                      <Select
                        disabled={key === fields.length - 1}
                        options={getTimePeriodOptions()}
                        style={{ width: '114px' }}
                      />
                    </Form.Item>
                  </Space>
                ))}
              </div>
            )}
          </Form.List>
        </Form>
      </MainBox>
    </CModal>
  )
}
export default forwardRef(Index)
