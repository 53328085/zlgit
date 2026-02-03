import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Form, Input, Select, Upload, message, Space, Tooltip, Checkbox } from 'antd'
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { levelDefaultLabel, selectOneLevel, selectProjectId } from '@redux/systemconfig'
import CModal from '@com/useModal'
import styled from 'styled-components'
import { SiteManagerDesigner, StorageContainerDesigner } from '@api/api.js'
import { binaryToValue, dealBMSData, getBMSOptions, valueToBinary } from '@pages/storage/configure/container/Constant'

const CustomForm = styled(Form)`
    && {
        .ant-form-item {
            margin-bottom: ${props => props.theme.laptop ? '8px' : '24px'};
        }
    }
`

const ContainerInfoDialog = ({ onRefreshClick }, ref) => {
  const modalRef = useRef()
  const [form] = Form.useForm()
  const projectId = useSelector(selectProjectId)
  const levelLabel = useSelector(levelDefaultLabel)
  const oneLevelOptions = useSelector(selectOneLevel)
  const [operation, setOperation] = useState('add')
  const [operationInfo, setOperationInfo] = useState(null)
  const [fileList, setFileList] = useState([]) //文件列表
  const [imageUrl, setImageUrl] = useState('') //上传的图片
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [options, setOptions] = useState([])

  const showDialog = useMemoizedFn((info, areaId) => {
    //重置
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
    if (info && info.image) {
      setImageUrl(info?.image)
      setFileList([{ url: info?.image }])
    } else {
      setImageUrl('')
      setFileList([])
    }
    //获取区域下的站点枚举
    getSiteOptions(areaId)
    modalRef.current?.onOpen()
  })

  /**
   * 获取区域站点枚举
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
      console.log(error)
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
        image: imageUrl,
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
   * 上传文件之前的钩子，参数为上传的文件
   */
  const beforeUpload = async (file) => {
    const url = await getBase64(file)
    setImageUrl(url)
    return false
  }

  /**
   * 预览图标时的回调
   */
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  /**
   * 改变所属园区时，改变所属站点
   */
  const onChange = (e) => {
    form.setFieldsValue({ siteId: null })
    //重新获取枚举
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
          <Form.Item name="image" label="储能柜图片" getValueFromEvent={(e) => getBase64(e.file)}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {imageUrl ?
                null : (
                  <div>
                    <PlusOutlined/>
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                )}
            </Upload>
          </Form.Item>
        </CustomForm>
      </CustomModal>
      <CModal
        open={previewOpen}
        footer={null}
        mold="cust"
        onCancel={() => setPreviewOpen(false)}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </CModal>
    </>
  )
}

export default forwardRef(ContainerInfoDialog)
