import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import CModal from '@com/useModal'
import { useMemoizedFn } from 'ahooks'
import styled from 'styled-components'
import { DatePicker, Divider, Form, Input, Select, Space, TimePicker } from 'antd'
import moment from 'moment'

const MainBox = styled.div`
    height: 600px;
    overflow: auto;

    .form {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        line-height: 1;

        .ant-form-item {
            margin-bottom: 0px;
        }

        .line {
            font-size: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #d7d7d7;
        }

        .save {
            width: 450px;
            display: flex;
            justify-content: flex-end;
        }

        .times {
            width: 450px;
            display: flex;
            flex-direction: column;
            row-gap: 16px;
            padding: 16px 0;

            .time {
                display: flex;
                align-items: center;
                justify-content: space-between;

            }
        }
    }
`

const Index = ({ params }, ref) => {
  //是否新增
  const [isAdd, setIsAdd] = useState(true)
  //表单
  const [form] = Form.useForm()
  //弹窗ref
  const modalRef = useRef(null)
  //弹窗标题
  const dialogTitle = isAdd ? '新增分时能耗时段设置' : '编辑分时能耗时段设置'

  /**
   * 显示弹窗
   */
  const showDialog = (info) => {
    if (info) {
      setIsAdd(false)
    } else {
      setIsAdd(true)
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
      modalRef.current?.onCancel()
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  useImperativeHandle(ref, () => ({
    showDialog,
  }))

  const format = 'HH:mm'
  const timePeriodOptions = [
    { label: '尖', value: 1 },
    { label: '峰', value: 2 },
    { label: '平', value: 3 },
    { label: '谷', value: 4 }
  ]
  const stepOptions = Array.from({ length: 14 }, (_, index) => ({ label: index + 1, value: index + 1 }))
  const disabledDate = (current) => {
    return current && current <= moment().endOf('day')
  }

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
        >
          <Form.Item
            label="方案名称"
            name="name"
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
              initialValue={4}
              rules={[{
                required: true,
                message: '请选择日时段数'
              }]}
            >
              <Select placeholder="请选择" options={stepOptions} style={{ width: '196px' }} allowClear={false}/>
            </Form.Item>
            <Form.Item
              label="启用日期"
              name="enableDate"
              labelCol={{ flex: '6em' }}
              initialValue={moment().add(1, 'day')}
              rules={[{
                required: true,
                message: '请选择启用日期'
              }]}
            >
              <DatePicker disabledDate={disabledDate} allowClear={false}/>
            </Form.Item>
          </Space>
          <Divider style={{margin:0}}/>
          <Form.Item shouldUpdate={(pre, cur) => pre.step !== cur.step} noStyle>
            {
              ({ getFieldValue }) => {
                const num = getFieldValue('step')
                if (Number.isInteger(num) && num > 0) {
                  return (
                    <div className="times">
                      {
                        Array.from({ length: num }, (_, index) => {
                          return (
                            <div className="time">
                              <Form.Item
                                name={['startTime', `${index}`]}
                                label={`时段${index + 1}`}
                                labelCol={{ flex: '6em' }}
                                labelAlign="right"
                                rules={[{
                                  required: true
                                }]}
                              >
                                <TimePicker format={format} style={{ width: '196px' }}></TimePicker>
                              </Form.Item>
                              <div className="line">&#x02500;</div>
                              <Form.Item
                                name={['timeShareType', `${index}`]}
                                rules={[{
                                  required: true,
                                  message: '请选择用电时段类型'
                                }]}
                              >
                                <Select options={timePeriodOptions} style={{ width: '114px' }}/>
                              </Form.Item>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }
              }
            }
          </Form.Item>
        </Form>
      </MainBox>
    </CModal>
  )
}
export default forwardRef(Index)
