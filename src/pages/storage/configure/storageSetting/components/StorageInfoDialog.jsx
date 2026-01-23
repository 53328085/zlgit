import CustomModal from '@com/useModal'
import React, { useImperativeHandle, useRef, forwardRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { DatePicker, Form, Input, InputNumber, Select, Upload, message } from 'antd'
import { natureOptions } from '@pages/storage/configure/storageSetting/Constant'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { selectOneLevel, selectProjectId } from '@redux/systemconfig'
import moment from 'moment/moment'
import CModal from '@com/useModal'
import styled from 'styled-components'
import { SiteManagerDesigner } from '@api/api.js'

const CustomForm = styled(Form)`
    && {
        .ant-form-item {
            margin-bottom: ${props => props.theme.laptop ? '8px' : '24px'};
        }
    }
`

const StorageInfoDialog = ({ onRefreshClick }, ref) => {
  const modalRef = useRef()
  const [form] = Form.useForm()
  const projectId = useSelector(selectProjectId)
  const oneLevel = useSelector((state) => state.system.onelevel)
  //&所属园区
  const areaList = useSelector(selectOneLevel)
  const [operation, setOperation] = useState('add')
  const [operationInfo, setOperationInfo] = useState(null)
  const [fileList, setFileList] = useState([]) //文件列表
  const [imageUrl, setImageUrl] = useState('') //上传的图片
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const showDialog = useMemoizedFn((info) => {
    //重置
    form.resetFields()
    setOperationInfo(info)

    if (info) {
      setOperation('edit')
      form.setFieldsValue({
        ...info,
        deliveryTime: moment(info?.deliveryTime)
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
    modalRef.current?.onOpen()
  })

  /**
   * 保存按钮点击事件
   */
  const onSaveClick = useMemoizedFn(async () => {
    try {
      const values = await form.validateFields()
      let params = {
        ...values,
        deliveryTime: moment(values.deliveryTime).format('YYYY-MM-DD'),
        image: imageUrl,
      }
      let result
      if (operation === 'add') {
        result = await SiteManagerDesigner.AddSite(projectId, params)
      } else {
        params.id = operationInfo.id
        result = await SiteManagerDesigner.UpdateSite(projectId, params)
      }
      if (result.success) {
        if(operation === 'add'){
          message.success('站点删除成功!')
        }else{
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
            label="站点容量 (kVA)"
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
          <Form.Item name="image" label="站点图片" getValueFromEvent={(e) => getBase64(e.file)}>
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

export default forwardRef(StorageInfoDialog)
