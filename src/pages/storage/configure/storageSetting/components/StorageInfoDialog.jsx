import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { DatePicker, Form, Input, InputNumber, Select, message } from 'antd'
import CustomUpload from "@com/useUpload.js"
import { natureOptions } from '@pages/storage/configure/storageSetting/Constant'
import { useSelector } from 'react-redux'
import { selectOneLevel, selectProjectId } from '@redux/systemconfig'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { SiteManagerDesigner } from '@api/api.js'

// 自定义表单样式
const CustomForm = styled(Form)`
    && {
        .ant-form-item {
            margin-bottom: ${props => props.theme.laptop ? '8px' : '24px'};
        }
    }
`
// 图片显示区域样式
const ImageContentView = styled.div`
    width: 160px;
    height: 160px;
    border: 1px dotted #dedede;
    display: flex;
`

// 存储信息对话框组件
const StorageInfoDialog = ({ onRefreshClick }, ref) => {
  // 模态框引用
  const modalRef = useRef()
  // 表单引用
  const [form] = Form.useForm()
  // 项目ID
  const projectId = useSelector(selectProjectId)
  // 一级组织结构
  const oneLevel = useSelector((state) => state.system.onelevel)
  // 所属园区列表
  const areaList = useSelector(selectOneLevel)
  // 操作类型 ('add' 或 'edit')
  const [operation, setOperation] = useState('add')
  // 当前操作的信息
  const [operationInfo, setOperationInfo] = useState(null)

  // 显示对话框方法
  const showDialog = useMemoizedFn((info) => {
    // 重置表单
    form.resetFields()
    setOperationInfo(info)

    if (info) {
      setOperation('edit')
      form.setFieldsValue({
        ...info,
        deliveryTime: dayjs(info?.deliveryTime)
      })
    } else {
      setOperation('add')
    }
    modalRef.current?.onOpen()
  })

  /**
   * 保存按钮点击事件
   * 根据操作类型新增或更新站点信息
   * @returns {Promise<void>}
   */
  const onSaveClick = useMemoizedFn(async () => {
    try {
      const values = await form.validateFields()
      let params = {
        ...values,
        deliveryTime: dayjs(values.deliveryTime).format('YYYY-MM-DD'),
      }
      let result
      if (operation === 'add') {
        result = await SiteManagerDesigner.AddSite(projectId, params)
      } else {
        params.id = operationInfo.id
        result = await SiteManagerDesigner.UpdateSite(projectId, params)
      }
      if (result.success) {
        if (operation === 'add') {
          message.success('新增站点成功!')
        } else {
          message.success('站点信息修改成功!')
          modalRef.current?.onCancel()
        }
        onRefreshClick()
      } else {
        message.error(result.errMsg)
      }
    } catch (error) {
      throw error
    }
  })

  // 暴露方法给父组件调用
  useImperativeHandle(ref, () => ({
    showDialog
  }))

  return (
    <>
      <CustomModal
        ref={modalRef}
        title={operation === 'add' ? '新增站点' : '编辑站点'}
        onOk={onSaveClick}
        onCancel={() => modalRef.current?.onCancel()}
        width={640}
        closable={false}
        custft={operation === 'add'}
        mold="cust"
      >
        <CustomForm
          name="addform"
          form={form}
          autoComplete="off"
          labelAlign="left"
          colon={false}
          labelCol={{ flex: '110px' }}
          wrapperCol={{ flex: 1 }}
          preserve={false}
        >
          <Form.Item
            name="areaId"
            label={
              oneLevel[0]?.levelName ? '所属' + oneLevel[0]?.levelName : '所属园区'
            }
            rules={[
              { required: true, message: `请选择${oneLevel[0]?.levelName}` },
            ]}
          >
            <Select
              disabled={operation === 'edit'}
              placeholder={
                oneLevel[0]?.levelName
                  ? `请选择${oneLevel[0].levelName}`
                  : '园区名称'
              }
            >
              {areaList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="no"
            label="站点编号"
            rules={[{ required: true, message: '请输入站点编号' }]}
          >
            <Input placeholder="请输入站点编号" disabled={operation === 'edit'}/>
          </Form.Item>
          <Form.Item
            name="name"
            label="站点名称"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input placeholder="请输入站点名称"/>
          </Form.Item>
          <Form.Item
            name="address"
            label="站点地址"
            rules={[{ required: true, message: '请输入站点地址' }]}
          >
            <Input placeholder="请输入站点地址"/>
          </Form.Item>
          <Form.Item
            name="capacity"
            label="站点容量 (kWh)"
            rules={[{ required: true, message: '请输入站点容量' }]}
          >
            <InputNumber placeholder="请输入站点容量" style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item
            name="power"
            label="装机功率 (kW)"
            rules={[{ required: true, message: '请输入装机功率' }]}
          >
            <InputNumber placeholder="请输入站点容量" style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item
            label="投运时间"
            name="deliveryTime"
            rules={[
              {
                required: true,
                message: '请选择投运时间',
              },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="investmentNature"
            label="投资性质"
            rules={[{ required: true, message: '请选择所属站点' }]}
          >
            <Select
              placeholder="请选择投资性质"
              options={natureOptions}
            />
          </Form.Item>
          <Form.Item name="remark" label="备注信息">
            <Input placeholder="请输入备注信息"/>
          </Form.Item>
          <Form.Item label="站点图片">
            <ImageContentView>
              <Form.Item noStyle name="image">
              <CustomUpload
                wpx={160}
                hpx={160}
                swpx={160}
                shpx={120}
                maximum={100}
              />
              </Form.Item>
            </ImageContentView>
          </Form.Item>
        </CustomForm>
      </CustomModal>
    </>
  )
}

export default forwardRef(StorageInfoDialog)