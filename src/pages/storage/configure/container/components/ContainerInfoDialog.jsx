import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Form, Input, Select, message, Space, Tooltip, Checkbox } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import CustomUpload from '@com/useUpload.js'
import { levelDefaultLabel, selectOneLevel, selectProjectId } from '@redux/systemconfig'
import styled from 'styled-components'
import { SiteManagerDesigner, StorageContainerDesigner } from '@api/api.js'
import { binaryToValue, getBMSOptions, valueToBinary } from '@pages/storage/configure/container/Constant'

const CustomForm = styled(Form)`
    && {
        .ant-form-item {
            margin-bottom: ${props => props.theme.laptop ? '8px' : '24px'};
        }
    }
`
const ImageContentView = styled.div`
    width: 160px;
    height: 160px;
    border: 1px dotted #dedede;
    display: flex
`

/**
 * 容器信息弹窗组件
 * 用于新增或编辑储能柜信息
 */
const ContainerInfoDialog = ({ onRefreshClick }, ref) => {
  // 弹窗引用
  const modalRef = useRef()
  // 表单引用
  const [form] = Form.useForm()
  // 项目ID
  const projectId = useSelector(selectProjectId)
  // 一级层级标签
  const levelLabel = useSelector(levelDefaultLabel)
  // 一级选项
  const oneLevelOptions = useSelector(selectOneLevel)
  // 当前操作类型 (add: 添加, edit: 编辑)
  const [operation, setOperation] = useState('add')
  // 当前操作的信息
  const [operationInfo, setOperationInfo] = useState(null)
  // 站点选项
  const [options, setOptions] = useState([])

  /**
   * 显示弹窗
   * @param {Object} info - 要编辑的信息，如果是新增则为null
   * @param {string} areaId - 区域ID
   */
  const showDialog = useMemoizedFn((info, areaId) => {
    // 重置表单
    form.resetFields()
    setOperationInfo(info)

    if (info) {
      setOperation('edit')
      form.setFieldsValue({
        ...info,
        bmsStruct: binaryToValue(info?.bmsStructFlag ?? 0),
      })
    } else {
      setOperation('add')
    }
    // 获取区域下的站点枚举
    getSiteOptions(areaId)
    modalRef.current?.onOpen()
  })

  /**
   * 获取区域站点枚举
   * @param {string} areaId - 区域ID
   */
  const getSiteOptions = useMemoizedFn(async (areaId) => {
    try {
      let { success, data } = await SiteManagerDesigner.FindSiteList(projectId, areaId)
      if (success && Array.isArray(data) && data.length > 0) {
        setOptions([...data])
      } else {
        setOptions([])
      }
    } catch (error) {
      setOptions([])
    }
  })

  /**
   * 保存按钮点击事件
   */
  const onSaveClick = useMemoizedFn(async () => {
    try {
      const values = await form.validateFields()
      let params = {
        ...values,
        bmsStructFlag: valueToBinary(values.bmsStruct)
      }
      delete params.bmsStruct
      let result
      if (operation === 'add') {
        result = await StorageContainerDesigner.AddContainer(projectId, params)
      } else {
        params.id = operationInfo.id
        result = await StorageContainerDesigner.UpdateContainer(projectId, params)
      }
      if (result.success) {
        if (operation === 'add') {
          message.success('新增储能柜成功!')
        } else {
          message.success('储能柜信息修改成功!')
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

  /**
   * 获取文件base64
   * @param {Object} file - 文件对象
   * @returns {Promise} 返回base64字符串
   */
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      if (file.status === 'removed') {
        setImageUrl()
      } else {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      }
    })

  /**
   * 改变所属园区时，改变所属站点
   * @param {string} e - 选中的园区ID
   */
  const onChange = (e) => {
    form.setFieldsValue({ siteId: null })
    // 重新获取枚举
    getSiteOptions(e)
  }

  useImperativeHandle(ref, () => ({
    showDialog
  }))

  return (
    <>
      <CustomModal
        ref={modalRef}
        title={operation === 'add' ? '新增储能柜' : '编辑储能柜'}
        onOk={onSaveClick}
        onCancel={() => modalRef.current?.onCancel()}
        width={640}
        closable={false}
        custft={operation === 'add'}
        mold="cust"
      >
        <CustomForm
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
            label={'所属' + levelLabel}
            rules={[
              { required: true, message: `请选择${levelLabel}` },
            ]}
          >
            <Select
              placeholder={`请选择${levelLabel}`}
              onChange={onChange}
              options={oneLevelOptions}
              fieldNames={{ label: 'name', value: 'id', options: 'options' }}
            />
          </Form.Item>
          <Form.Item
            name="siteId"
            label="所属站点"
            rules={[{ required: true, message: '请选择所属站点' }]}
          >
            <Select
              placeholder="请选择所属站点"
              options={options}
              fieldNames={{ label: 'name', value: 'id' }}
            />
          </Form.Item>
          <Form.Item
            name="no"
            label="储能柜编号"
            rules={[{ required: true, message: '请输入储能柜编号' }]}
          >
            <Input placeholder="请输入储能柜编号"/>
          </Form.Item>
          <Form.Item
            name="name"
            label="储能柜名称"
            rules={[{ required: true, message: '请输入储能柜名称' }]}
          >
            <Input placeholder="请输入储能柜名称"/>
          </Form.Item>
          <Form.Item
            name="address"
            label="安装地址"
            rules={[{ required: true, message: '请输入安装地址' }]}
          >
            <Input placeholder="请输入安装地址"/>
          </Form.Item>
          <Form.Item
            name="bmsStruct"
            label={
              <Space>
                <div>BMS结构</div>
                <Tooltip title="根据所选储能柜设备情况，选择BMS结构，默认选择电池堆；">
                  <InfoCircleOutlined/>
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请选择BMS结构' }]}
          >
            <Checkbox.Group
              options={getBMSOptions()}
            />
          </Form.Item>
          <Form.Item name="remark" label="备注信息">
            <Input placeholder="请输入备注信息"/>
          </Form.Item>
          <Form.Item label="储能柜图片">
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

export default forwardRef(ContainerInfoDialog)
