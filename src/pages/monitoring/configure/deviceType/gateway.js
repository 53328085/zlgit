import React, { useEffect, useState,useRef } from 'react'
import DeviceContent from './deviceContent'
import gateWayImg from '@imgs/gateway.png';
import style from './style.module.less'
import AllColumns from './columns'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Select,message,Upload } from 'antd';
import UploadImg from './uploadImg';
import Table from '@com/useTable'
export default function gateway() {

  const [selectOptions,setSelectOptions] = useState([])//下拉选项
  const { DeviceTypeManager: { GatewayCategory, AddCategory,QueryNotUsed } } = Monitoring;
  const [form] = Form.useForm();
  const uploadRef = useRef()
  const ModalRef = useRef(null)
  const projectId = useSelector(state => state.system.menus.projectId)
 
  const getTableData = async () => {
    let params = {
      projectId,
      pageNum: 1,
      pageSize: 10,
      alike: ''
    }
    const result = await GatewayCategory(params)
    const { data, errMsg, success } = result;
    console.log(result)
    if (success && Array.isArray(data)) {

    }
  }
  getTableData()
  //获取未使用的网关型号
  const openAdd=async ()=>{
    const result = await QueryNotUsed(projectId)
    const {success,data} = result;
    if(success&&Array.isArray(data)){
      setSelectOptions(data)
    }
  }
  //保存新增网关类型
  const onOk = async () => {  
    // let AddCategoryParams = {
    //   projectId,
    //   category: form.getFieldValue().GatewayType,
    //   com: form.getFieldValue().ComNum,
    //   imageBase64: uploadRef.current.imageUrl.split(',')[1],
    //   download:0
    // }
    // const res = await AddCategory(AddCategoryParams)
    // const {success,errMsg} = res
    // if(success){
    //   message.success('新增网关设备成功')
    //   ModalRef.current.onCancel()
    // }else{
    //   message.error(errMsg)
    // }
   
    console.log( form.getFieldValue())
  }
 
  //新增网关弹窗
  let AddModal = () => {
    const [imgUrl, setImaUrl] = useState(gateWayImg) //默认网关设备图
    const handleChange=(v,o)=>{
      console.log(v,o)
      form.setFieldsValue({
        ComNum:o.com
      })
      // const {setImageUrl} = uploadRef.current
      setImaUrl(`data:image/jpeg;base64,${o.imageBase64}`)
     
    }
    const normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };
    return (
      <Form
        labelCol={{ span: 4 }}
        labelAlign='left'
        colon={false}
        form={form}
      >
        <Form.Item
          label="网关型号"
          name="GatewayType"
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Select
            defaultValue={selectOptions[0]}
            style={{ width: 120 }}
            onChange={handleChange}
            fieldNames={{
              label:'category',
              value:'category'
            }}
            options={selectOptions}
          />
        </Form.Item>
        <Form.Item
          label="串口个数"
          name='wrapCol'
          rules={[{ required: true }]}
        >
          <>
            <Row align={"middle"} gutter={[0, 16]}>
              <Col flex="120px">
                <Form.Item
                  name="ComNum"
                  rules={[{ required: true, message: '请输入串口个数' }]}
                >
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col span={2} offset={1}>(个)</Col>
            </Row>
            <Row gutter={[0, 16]}>
              <Col><span style={{ color: '#999', fontSize: 12 }}>(1~5000)</span></Col>
            </Row>
          </>
        </Form.Item>
        <Form.Item label="缩略图">
          <>
            <Row >
              <Col style={{ border: '1px dashed #d9d9d9', height: 90 }} flex="120px">
                <img src={imgUrl} style={{ width: '100%', height: '100%' }}></img>
              </Col>
              <Col offset={1}>
                  <Form.Item name="uploadimg" valuePropName="fileList"  getValueFromEvent={normFile}>
                    {/* <UploadImg ref={uploadRef} /> */}
                    <Upload name="logo" action="/upload.do" listType="picture">
          <Button >Click to upload</Button>
        </Upload>
                  </Form.Item>
              </Col>
            </Row>
            <Row gutter={[0, 32]}>
              <Col><span style={{ color: '#999', fontSize: 12 }}>(图片尺寸136*136px，容量小于100KB)</span></Col>
            </Row>
          </>
        </Form.Item>
      </Form>
    )
  }
  let deviceProps = {
    value: 0,
    name: '新增网关类型',
    AddModal,
    canceltext: '返回',
    oktext: '保存',
    onOk,
    openAdd,
    ModalRef
  };
  return (
    <div>
      <DeviceContent {...deviceProps} >
         <Table columns = {  AllColumns[0] } bordered={false}></Table>
      </DeviceContent>
    </div>
  )
}
