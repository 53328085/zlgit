import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback,useContext, useMemo, memo } from 'react'
import {useTranslation} from 'react-i18next'
import DeviceContent from './deviceContent'
import style from './style.module.less'
// import AllColumns from './columns'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Select, message, Upload, Image, Typography, Space } from 'antd';
import Table from '@com/useTable'
import Modal from '@com/useModal'

import cusContext from '@com/content'
import {publishState} from '@redux/systemconfig'
const { DeviceTypeManager: { GatewayCategory, AddCategory, QueryNotUsed, UpdateCategory, DeleteCategory } } = Monitoring;
const {Link, Text} = Typography
export default function Gateway() {
  const {t} = useTranslation(['button'])
  const publish = useSelector(publishState)
  const content =useContext(cusContext)
  const [form] = Form.useForm();
  const [editform] = Form.useForm()
  // const [selectOptions, setSelectOptions] = useState([])//下拉选项
  // const selectOptionsRef=useRef()
  // selectOptionsRef.current=selectOptions
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 10,
    hideOnSinglePage: false
  });
  const ModalRef = useRef(null)
  const EditModalRef = useRef(null)
  const DelModalRef = useRef(null)
  const tableLoadRef = useRef()
  
  const projectId = useSelector(state => state.system.menus.projectId)
  let categoryId = ''
  let AllColumns =   [
    {
        title: '网关型号',
        dataIndex: 'category',
        key:'category',
        align:'center',
      },
      {
        title: '网关缩略图',
        dataIndex: 'imageBase64',
        key:'imageBase64',
        align:'center',
        render:(t,r,i)=>(<Image src={'data:image/jpeg;base64,'+t} width="64px" height="53px" alt=""></Image>)
      },
      {
        title: '已用网关数量',
        dataIndex: 'cnt',
        key:'cnt',
        align:'center',
      },
      {
        title: '操作',
        dataIndex: 'options',
        key:'options',
        export:false,
        align:'center',
      },
] 
  if(publish){
    AllColumns.pop()
  }else{
    AllColumns[3].render = (_, v) => {
      return (
        <Space size={32}>
          <Link onClick={() => { openEditModal(v) }}>{t('button:edit')}</Link>
          <Link type="danger" onClick={() => { openDelModal(v) }}>{t('button:delete')}</Link>
        </Space>
      )
    }
  }
  


  //获取未使用的网关型号
  // const open = async () => {
  //   const result = await QueryNotUsed(projectId)
  //   const { success, data } = result;
  //   form.setFieldValue('Upload', '')
   
  //   if (success && Array.isArray(data)) {
    
  //     if (data.length > 0) {
  //       ModalRef.current.onOpen()
  //       // setSelectOptions(data)
  //       console.log(addformRef.current)
  //       form.setFieldsValue({
  //         GatewayType: data[0]['category'],
  //         ComNum: data[0]['com'],
  //         Image: 'data:image/jpeg;base64,' + data[0]['imageBase64']
  //       })
  //     } else {
  //       message.warning('无可用网关新增!')
  //     }

  //   }
  // }
 
  //保存新增网关类型
  const onOk = async () => {
    const { ComNum, GatewayType, Image, Upload = '' } = form.getFieldValue()
    const imageBase64 = await Upload
    let AddCategoryParams = {
      projectId,
      category: GatewayType,
      com: ComNum,
      imageBase64: imageBase64 ? imageBase64.split(',')[1] : Image.split(',')[1],
      download: 0
    }
    const res = await AddCategory(AddCategoryParams)
    const { success, errMsg } = res
    if (success) {
      message.success('新增网关设备成功')
  //    ModalRef.current.onCancel()
      getTableData()
    } else {
      message.error(errMsg)
    }
  }
  //确认新增应用
  const onSure=()=>{
    return new Promise(async(resolve,reject)=>{
      const { ComNum, GatewayType, Image, Upload = '' } = form.getFieldValue()
    const imageBase64 = await Upload
    let AddCategoryParams = {
      projectId,
      category: GatewayType,
      com: ComNum,
      imageBase64: imageBase64 ? imageBase64.split(',')[1] : Image.split(',')[1],
      download: 0
    }
    const res = await AddCategory(AddCategoryParams)
    resolve(true)
    const { success, errMsg } = res
    if (success) {
      message.success('应用成功')
      // open()
      getTableData()
    } else {
      message.error(errMsg)
    }
    })
    
  }
  //保存编辑
  const editOk = async () => {
    const { ComNum, GatewayType, Upload = '' } = editform.getFieldValue()
    if (!Upload) {
      message.success('保存成功')
      EditModalRef.current.onCancel()
      return
    }
    const imageBase64 = await Upload
    let params = {
      projectId,
      category: GatewayType,
      com: ComNum,
      imageBase64: imageBase64.split(',')[1],
      download: 0
    }
    const result = await UpdateCategory(params)
    if (result.success) {
      message.success('保存成功')
      EditModalRef.current.onCancel()
      getTableData()
    } else {
      message.error(result.errMsg)
    }
  }
  //确认编辑应用
  const onEditSure=async()=>{
    const { ComNum, GatewayType, Upload = '' } = editform.getFieldValue()
    if (!Upload) {
      message.success('应用成功')
      EditModalRef.current.onCancel()
      return
    }
    const imageBase64 = await Upload
    let params = {
      projectId,
      category: GatewayType,
      com: ComNum,
      imageBase64: imageBase64.split(',')[1],
      download: 0
    }
    const result = await UpdateCategory(params)
    if (result.success) {
      message.success('应用成功')
      getTableData()
    } else {
      message.error(result.errMsg)
    }
  }
  //确认删除
  const delOk = async () => {
    const res = await DeleteCategory({
      projectId,
      category: categoryId,
      deviceStyle:parseInt(content.value)
    })
    if (res.success) {
      if(tableParams.total%(tableParams.pageSize*(tableParams.current-1 ))===1){
        setTableParams({
          ...tableParams,
          current:tableParams.current-1
        })
      }else{
        getTableData()
      }
      message.success('删除成功')
      
    } else {
      message.error(res.errMsg)
    }
    DelModalRef.current.onCancel()

  }
  //打开编辑窗
  const openEditModal = (v) => {
    EditModalRef.current.onOpen()
    editform.setFieldsValue({
      GatewayType: v['category'],
      ComNum: v['com'],
      Image: `data:image/jpeg;base64,${v.imageBase64}`
    })
  }
  //打开删除窗
  const openDelModal = (v) => {
    DelModalRef.current.onOpen()
    categoryId = v.category
  }
  //获取网关型号
  const getTableData = async () => {
    setLoading(true)
    let params = {
      projectId,
      pageNum: tableParams.current,
      pageSize: tableParams.pageSize,
      alike: ''
    }
    const result = await GatewayCategory(params)
    setLoading(false)
    const { data, errMsg, success, total, pageNum, pageSize } = result;
    if (success && Array.isArray(data)) {
      setTableParams({
        ...tableParams,
        current: pageNum,
        pageSize: pageSize,
        total: total
      })
      setDataSource(() => data)

    } else {
      setDataSource([])
    }
  }
  //导出
  const exportExecel = () => {
    tableLoadRef.current.download()
  }
  const onExport = ()=>{
    return new Promise(async (resolve, reject) =>{
      let params = {
        projectId,
        pageNum: 1,
        pageSize: tableParams.total,
      }
      const res = await GatewayCategory(params)
      if(res.success){
        resolve({
            list:res.data?res.data:[],
            total:res.total
        })
      }else{
        reject(res.errMsg)
      }
    })
  }
  //分页
  const onChangePage = (page, pageSize) => {
    setTableParams({
      ...page
    })
  }
  useEffect(() => {
    getTableData()
  }, [tableParams.current])

  const addAodalProps = {
    form,
    // selectOptions
  }
  let deviceProps = {
    value: 0,
    // open,
    AddModal,
    ModalRef,
  //  cancelText: '返回',
  //  okText: '保存',
    onOk,
    onSure,
    name: '新增网关类型',
    width: 520,
    exportExecel,
    title:'配置网关类型',
    form,
    selectOptions:'',
    tb:tableLoadRef,
    onExport,
    // selectOptionsRef.current,
  };

  let editModal = {
 //   cancelText: '返回',
 //   okText: '保存',
    value: 1,
    // onOk: editOk
  }
  let editModalProps = {
    editform,
  }
  let delModal = {
    value: 2,
    onOk: delOk,
  }
  useEffect(()=>{
    
  },[])
  const EditModalComp=useMemo(()=>{
    return (
      <Modal mold='cust' ref={EditModalRef}  title="编辑网关类型" {...editModal} onOk={editOk}  >
      {/* <BlueColumn name='编辑网关类型' styled={{ padding: '24px 0px' }}></BlueColumn> */}
      <EditModal {...editModalProps}></EditModal>
    </Modal>
    )
  },[])
  return (
    <div>
      <DeviceContent {...deviceProps}  >
        <Table
          columns={AllColumns}
          bordered={false}
          dataSource={dataSource}
          ref={tableLoadRef}
          pagination={tableParams}
          loading={loading}
          onChange={onChangePage}
          onExport={onExport}
        ></Table>
       
      </DeviceContent>
      {EditModalComp}
      {/* <Modal mold='cust' ref={EditModalRef} {...editModal}>
        <BlueColumn name='编辑网关类型' styled={{ padding: '24px 0px' }}></BlueColumn>
        <EditModal {...editModalProps}></EditModal>
      </Modal> */}
      <DeleteModal DelModalRef={DelModalRef} {...delModal}></DeleteModal>
    </div>
  )
}



let ImageUpload = ({ value = {} }) => {
  return (
    <img src={value} style={{ width: 118, height: 90 }}></img>
  )
}



//新增网关窗口
export let AddModal =forwardRef((props, ref) => {
  const {
    form,
    // selectOptions,
    ...other
  } = props
  const projectId = useSelector(state => state.system.menus.projectId)
  const [fileList, setFileList] = useState() //文件列表
  const [imageUrl, setImageUrl] = useState(''); //上传的图片
  const [selectOptions, setSelectOptions] = useState([])//下拉选项

   const open = async () => {
    try {
      const result = await QueryNotUsed(projectId)
      const { success, data } = result;
    //  form.setFieldValue('Upload', '')
     // setImageUrl("")
      if (success && Array.isArray(data)) {
     
        if (data.length > 0) {
          // ModalRef.current.onOpen()
        
          setSelectOptions(data)
          form.setFieldsValue({
            GatewayType: data[0]['category'],
            ComNum: data[0]['com'],
            Image: 'data:image/jpeg;base64,' + data[0]['imageBase64']
          })
          return true
        } else {
          message.warning('无可用网关新增!')
          return false
        }
  
      }
    } catch (error) {
      
    }
 
  
  }
  
  useEffect(()=>{
    open()
  },[])

  const handleChange = (v, o) => {
    console.log(v);
    console.log(selectOptions)
    let {imageBase64, com} = selectOptions?.find(s => s.category == v) || {}
    form.setFieldsValue({
      ComNum: com,
      Image: `data:image/jpeg;base64,${imageBase64}`,
    })
  }

  const normFile = async (e) => {
    return await getBase64(e.file);
  };

  const beforeUpload = async (file) => {
    const url = await getBase64(file)
    setImageUrl(url);
    return false
  }
  //获取图片base64结果
  const getBase64 = (img) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  }

  useImperativeHandle(ref, () => ({
    setImageUrl,
    imageUrl,
    selectOptions,
    setSelectOptions,
    open
  }))
  return (
    <Form
      labelCol={{ span: 4 }}
      labelAlign='left'
      colon={false}
      form={form}
      preserve={false}
    >
      <Form.Item
        label="网关型号"
        name="GatewayType"
        rules={[{ required: true, message: 'Please input your username!' }]}>
        <Select
          showSearch
          style={{ width: 256 }}
          onChange={handleChange}
         
        //  options={selectOptions}
          filterOption={true}
       >
        {
         selectOptions?.length> 0 &&  selectOptions.map(s => {
          return <Select.Option value={s.category} key={s.category} ><Text>{s.category}</Text>&nbsp;<Text type="secondary">{s.description}</Text></Select.Option>
        })
        }
       </Select>
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
                <Input disabled />
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
            <Col style={{ border: '1px dashed #d9d9d9', height: 90, width: 118 }} flex="120px">
              <Form.Item name="Image" >
                <ImageUpload></ImageUpload>
              </Form.Item>
            </Col>
            <Col offset={1}>
              <Form.Item
                name="Upload"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={style.uploader}
                  showUploadList={false}
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                >
                  {
                    imageUrl ?
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      /> : <div style={{ background: '#fafafa', height: '100%', lineHeight: '90px', textAlign: 'center', color: '#999', cursor: 'pointer' }}>更新图片</div>
                  }

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
}) 
//编辑网关窗口
let EditModal = ({ name, EditModalRef, editform, ...other }) => {
  const [fileList, setFileList] = useState() //文件列表
  const [imageUrl, setImageUrl] = useState(''); //上传的图片

  const normFile = async (e) => {
    const res = await getBase64(e.file);
    return res
  };
  const beforeUpload = async (file) => {
    const url = await getBase64(file)
    setImageUrl(url);
    return false
  }
  //获取图片base64结果
  const getBase64 = (img) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  }
  return (

    <Form
      labelCol={{ span: 4 }}
      labelAlign='left'
      colon={false}
      form={editform}

    >
      <Form.Item
        label="网关型号"
        name="GatewayType"
        rules={[{ required: true, message: 'Please input your username!' }]}>

        <Input disabled style={{ width: 256 }} />
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
                <Input disabled />
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
              <Form.Item name="Image" >
                <ImageUpload></ImageUpload>
              </Form.Item>
            </Col>
            <Col offset={1}>
              <Form.Item
                name="Upload"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={style.uploader}
                  showUploadList={false}
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                >
                  {
                    imageUrl ?
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      /> :
                      <div style={{ background: '#fafafa', height: '100%', lineHeight: '90px', textAlign: 'center', color: '#999', cursor: 'pointer' }}>更新图片</div>
                  }

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
//删除网关窗口
let DeleteModal = ({ DelModalRef, ...other }) => {

  return (
    <Modal mold='cust' ref={DelModalRef} {...other} className={style.DelModal} title="删除网关类型" type="warn">
  
      
      是否确认删除网关类型?
      
    </Modal>
  )
}