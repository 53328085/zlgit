import React, { useEffect, useState, useRef, useContext, useMemo } from 'react'
import {useTranslation} from 'react-i18next'
import DeviceContent from './devicecomp'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Typography, message, Image, Space } from 'antd';
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { DeleteModal, AddModal, EditModal } from './modalCom.js'
import cusContext from '@com/content'
import {publishState} from '@redux/systemconfig'
import {  ExportExcel, NewButton, CustButton} from '@com/useButton'
import lodash from 'lodash';
const {Link} = Typography
const { DeviceTypeManager: { UpdateDeviceCategory, DeviceQueryNotUsed, DeviceQueryCategoryFull, DeviceCategory, AddDeviceCategory, DeleteDeviceCategory } } = Monitoring;
export default function Electric() {
  const {t} = useTranslation(["button"])
  const publish = useSelector(publishState)
  const content =useContext(cusContext)
  const [dataSource, setDataSource] = useState([])//modal框表格数据
  const [tableDataSource, setTableDataSource] = useState([])//主页表格数据
  const [defaultTableData, setDefaultTableData] = useState([])//新增时表格默认数据
  const [editDefaultTableData, setEditDefaultTableData] = useState()//编辑时表格默认数据
  const [isOpenModal, setIsOpenModal] = useState(true)
  const [isAdd, setIsAdd] = useState(false)
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 10,
    hideOnSinglePage: false
  });
  const ModalRef = useRef(null)
  const EditModalRef = useRef(null)
  const foRef = useRef(null)
  const editFromRef = useRef(null)
  const DelModalRef = useRef()
  const tableLoadRef = useRef()
  const updateTableRef =useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const optionStyle = {
    color: '#1890ff',
    cursor: 'pointer',
  }
  let categoryId;
  //获取设备列表
  const getTableData = async () => {
    setLoading(true)
    let params = {
      projectId,
      pageNum: tableParams.current,
      pageSize: tableParams.pageSize,
      deviceStyle: 2
    }
    const result = await DeviceCategory(params)
    const { data, errMsg, success,pageNum ,pageSize,total } = result;
    setLoading(false)
    if (success && Array.isArray(data)) {
      setTableDataSource(data)
      setTableParams({
        ...tableParams,
        current: pageNum,
        pageSize: pageSize,
        total: total
      })
    } else {
      setTableDataSource([])
    }
  }

  //确认删除
  const delOK = async () => {
    const resp = await DeleteDeviceCategory({
      projectId,
      category: categoryId,
      deviceStyle:parseInt(content.value)
    })
    if (resp.success) {
      DelModalRef.current.onCancel()
      message.success("删除成功")
      if(tableParams.total%(tableParams.pageSize*(tableParams.current-1 ))===1){
        setTableParams({
          ...tableParams,
          current:tableParams.current-1
        })
      }else{
        getTableData()
      } 
      
      getDeviceQueryNotUsed()
    } else {
      message.error(resp.errMsg)
    }
  }
  //打开删除窗口
  const openDel = (record) => {
    DelModalRef.current.onOpen();
    categoryId = record.category;

  }

  //打开编辑窗口
  const editOption = (record) => {
    EditModalRef.current.onOpen()
    const editModalData = tableDataSource.filter(it => it.category === record.category)
    console.log(editModalData, editForm)
    editForm.setFieldsValue({
      DeviceType: editModalData[0]?.category,
      Control: editModalData[0]?.control,
      IsCount: editModalData[0]?.calculate,
      IsRead: editModalData[0]?.realTimeReading,
      DefaulImg: editModalData[0]?.imageBase64,
      ImageUpload: '',
    })
    const arr = editModalData[0]?.points.map((item, index) => ({
      index: index + 1,
      dataMark: item.name,
      dataName: item.description,
      dataUnit: item.unit,
      isSave: item.isSave,
      watchPoint: item.isRuningPoint,
      dataOrder: item.secquence
    }))
    setEditDefaultTableData(arr)
    // const watchPointArr = arr.filter(it=>it.watchPoint)
    // console.log(watchPointArr)
    // editFromRef.current.setSwitched(watchPointArr)
  }
  let columns = [
    {
      title: '设备型号',
      dataIndex: 'category',
      align:'center',
    },
    {
      title: '设备厂家',
      dataIndex: 'manufacturer',
      align:'center',
    },
    {
      title: '设备缩略图',
      dataIndex: 'imageBase64',
      align:'center',
      render: (text) => {
        return (<Image src={text} width={64} height={53}></Image>)

      }
    },
    {
      title: '当前设备数量',
      dataIndex: 'cnt',
      align:'center',
    },
    {
      title: '操作',
      dataIndex: 'options',
      export:false,
      align:'center',
      render: (text, record) => {
        return (
          <Space size={32}>
            <Link onClick={() => { editOption(record) }}>{t("button:edit")}</Link>
            <Link type="danger" onClick={() => { openDel(record) }}>{t("button:delete")}</Link>
          </Space>
        )
      }
    }
  ]
  if(publish){
    columns.pop()
  }
  //保存编辑
  const onOkEditModal = async () => {
    const tabledata =  editFromRef.current.choosemes()
    if(!tabledata){
      message.warning('请至少选择一项标记检测运行点！')
       return
     }

    const formvalues = editForm.getFieldsValue()
    const tableData = tabledata.map(it => ({
      name: it.dataMark,
      isSave: it.isSave,
      isRuningPoint: it.watchPoint,
      secquence: it.dataOrder
    }))
    let params = {
      projectId,
      category: formvalues.DeviceType,
      control: formvalues.Control,
      calculate: formvalues.IsCount,
      realTimeReading: formvalues.IsRead,
      imageBase64: formvalues.ImageUpload ? formvalues.ImageUpload : formvalues.DefaulImg,
      points: tableData
    }
    const resp = await UpdateDeviceCategory(params)
    if (resp.success) {
      EditModalRef.current.onCancel()
      message.success("编辑成功")
      getTableData()
    } else {
      message.error(resp.errMsg)
    }
  }
  //应用编辑
  const onSureEditModal=async () => {
    const tabledata =  editFromRef.current.choosemes()
  if(!tabledata){
    message.warning('请至少选择一项标记检测运行点！')
     return
   }

    const formvalues = editForm.getFieldsValue()
    const tableData = tabledata.map(it => ({
      name: it.dataMark,
      isSave: it.isSave,
      isRuningPoint: it.watchPoint,
      secquence: it.dataOrder
    }))
    let params = {
      projectId,
      category: formvalues.DeviceType,
      control: formvalues.Control,
      calculate: formvalues.IsCount,
      realTimeReading: formvalues.IsRead,
      imageBase64: formvalues.ImageUpload ? formvalues.ImageUpload : formvalues.DefaulImg,
      points: tableData
    }
    const resp = await UpdateDeviceCategory(params)
    if (resp.success) {
      message.success("应用成功")
      getTableData()
    } else {
      message.error(resp.errMsg)
    }
  }


  //新增时获取未使用的表名
  const getDeviceQueryNotUsed = async () => {
    let params = {
      projectId,
      deviceStyle: 2
    }
    const r = await DeviceQueryNotUsed(params)
    if (r.success && Array.isArray(r.data)) {
      if (r.data.length > 0) {
        setIsOpenModal(true)
        const arr = r.data.map((item, index) => ({ label: item, value: item }))
        setDataSource(arr)
        getDeviceQueryCategoryFull(r.data[0])
      } else {
        setIsOpenModal(false)
        setIsAdd(true)
        ModalRef.current.onCancel()
        
      }

    }
  }

  //获取默认水表的详细信息
  const getDeviceQueryCategoryFull = async (category) => {
    let params = {
      projectId,
      category,
    }
    const r = await DeviceQueryCategoryFull(params)
    if (r.success) {
      const data = r.data
      const arr = data.points?.map((item, index) => ({
        index: index + 1,
        dataMark: item.name,
        dataName: item.description,
        dataUnit: item.unit,
        isSave: item.isSave,
        watchPoint: item.isRuningPoint,
        dataOrder: item.secquence,
        category:data.category
      }))

      updateTableRef.current = lodash.cloneDeep(arr)
      if (foRef.current) {
        const watchPointArr = arr.filter(it => it.watchPoint)
        console.log(watchPointArr)
        foRef.current.setSwitched(watchPointArr)
        foRef.current.setPointSource(lodash.cloneDeep(arr))
      } else {
        setDefaultTableData(arr?arr:[])
      }
      addForm.setFieldsValue({
        DeviceType: data.category,
        Cycle: data.rateType,
        Control: data.control,
        IsCount: data.calculate,
        IsRead: data.realTimeReading,
        DefaulImg: `data:image/jpeg;base64,${data.imageBase64}`,
        ImageUpload: '',
        // Point:arr,
      })
      setIsAdd(true)
    }

  }
  //打开新增modal
  const open = () => {
    console.log(isAdd,isOpenModal)
    if (!isAdd) return
    if (isOpenModal) {
      ModalRef.current.onOpen()
    } else {
      message.warning('无可用新增设备!')
    }
  }
  //关闭新增modal
  const onCancel = () => {
    getDeviceQueryNotUsed()
    ModalRef.current.onCancel()
  }
  //保存新增设备
  const onOk = async () => {
  const result= foRef.current?.choosemes()
   if(!result){
    message.warning('请至少选择一项标记检测运行点！')
     return
   }
    const formValue = addForm.getFieldsValue()
    const tableData = result.map(it => ({
      name: it.dataMark,
      isSave: it.isSave,
      isRuningPoint: it.watchPoint,
      secquence: it.dataOrder
    }))
    console.log(addForm.getFieldsValue(), foRef.current.pointSource,result)
    let params = {
      projectId,
      category: formValue.DeviceType,
      control: formValue.Control,
      calculate: formValue.IsCount,
      realTimeReading: formValue.IsRead,
      imageBase64: formValue.ImageUpload ? formValue.ImageUpload : formValue.DefaulImg,
      points: tableData
    }
    const resp = await AddDeviceCategory(params)
    console.log(resp)
    if (resp.success) {
      ModalRef.current.onCancel()
      message.success("新增成功")
      getTableData()
      getDeviceQueryNotUsed()
    } else {
      message.error(resp.errMsg)
    }
  }
  //新增确认应用
  const onSure=async ()=>{
    const result= foRef.current?.choosemes()
   if(!result){
    message.warning('请至少选择一项标记检测运行点！')
     return false
   }
   
    const formValue = addForm.getFieldsValue()
    const tableData = result.map(it => ({
      name: it.dataMark,
      isSave: it.isSave,
      isRuningPoint: it.watchPoint,
      secquence: it.dataOrder
    }))
    console.log(addForm.getFieldsValue(), foRef.current.pointSource,result)
    let params = {
      projectId,
      category: formValue.DeviceType,
      control: formValue.Control,
      calculate: formValue.IsCount,
      realTimeReading: formValue.IsRead,
      imageBase64: formValue.ImageUpload ? formValue.ImageUpload : formValue.DefaulImg,
      points: tableData
    }
    const resp = await AddDeviceCategory(params)
   
    if (resp.success) {
      message.success("应用成功")
      getTableData()
      getDeviceQueryNotUsed()
    } else {
      message.error(resp.errMsg)
    }
  }
  //导出表格
  const exportExecel = () => {
    tableLoadRef.current.download()
  }
  const onExport = () => {
    return new Promise(async (resolve, reject) => {
      let params = {
        projectId,
        pageNum: 1,
        pageSize: tableParams.total,
        deviceStyle: 2
      }
      const result = await DeviceCategory(params)
      const { data, errMsg, success,total} = result;
      if(success){
        resolve({list:data?data:[],total})
      }else{
        reject(errMsg)
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
    getDeviceQueryNotUsed()
    //getDeviceQueryCategoryFull()
  }, [tableParams.current])
  let addModalProp = {
    addForm,
    dataSource,
    getDeviceQueryCategoryFull,
    defaultTableData
  }
  let deviceProps = {
    value: 0,
    name: '新增水表类型',
    AddModal: <AddModal ref={foRef} {...addModalProp} />,
    cancelText: '取消',
    okText: '确认',
    onOk,
    width: 1032,
    open,
    ModalRef,
    onCancel,
    exportExecel,
    onSure,
    title:'配置水表类型',
    tb:tableLoadRef
  };
  let editFormProps = {
    editForm,
    ref: editFromRef,
    editDefaultTableData
  }
  let editModalProps = {
    ref: EditModalRef,
    width: 1032,
    onOk: onOkEditModal
  }
  let delModalProps = {
    DelModalRef,
   // cancelText: '取消',
  //  okText: '确认',
    content: '是否确认删除水表类型?',
    name: '删除水表类型',
    onOk: delOK
  }
  const EditModalComp=useMemo(()=>{
    return (<Modal mold='cust' {...editModalProps} title="编辑水表类型"  onOk={onOkEditModal}>
    <EditModal {...editFormProps}></EditModal>
  </Modal>)
  },[editDefaultTableData])
  return (
    <div>
      <cusContext.Provider value={{updateTableRef:updateTableRef.current}}>
      <DeviceContent {...deviceProps} >
        <Table
          columns={columns}
          dataSource={tableDataSource}
          bordered={false}
          ref={tableLoadRef}
          loading={loading}
          pagination={tableParams}
          onChange={onChangePage}
          onExport={onExport}
        ></Table>
      </DeviceContent>
      {EditModalComp}
      <DeleteModal {...delModalProps}></DeleteModal>
      </cusContext.Provider>
    </div>
  )
}