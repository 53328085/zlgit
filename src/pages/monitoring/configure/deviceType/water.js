import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle,useContext } from 'react'
import DeviceContent from './deviceContent'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message, Divider } from 'antd';
import Table from '@com/useTable'
import Modal from '@com/useModal'
import BlueColumn from '@com/bluecolumn'
import { DeleteModal, AddModal, EditModal } from './modalCom.js'
import cusContext from '@com/content'
const { DeviceTypeManager: { UpdateDeviceCategory, DeviceQueryNotUsed, DeviceQueryCategoryFull, DeviceCategory, AddDeviceCategory, DeleteDeviceCategory } } = Monitoring;
export default function Electric() {
  const content =useContext(cusContext)
  const [dataSource, setDataSource] = useState([])//modal框表格数据
  const [tableDataSource, setTableDataSource] = useState([])//主页表格数据
  const [defaultTableData, setDefaultTableData] = useState(null)//新增时表格默认数据
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
  const columns = [
    {
      title: '设备型号',
      dataIndex: 'category'
    },
    {
      title: '设备厂家',
      dataIndex: 'manufacturer'
    },
    {
      title: '设备缩略图',
      dataIndex: 'imageBase64',
      render: (text) => {
        return (<img src={text} width={64} height={53}></img>)

      }
    },
    {
      title: '当前设备数量',
      dataIndex: 'cnt'
    },
    {
      title: '操作',
      dataIndex: 'options',
      render: (text, record) => {
        return (
          <div>
            <span style={optionStyle} onClick={() => { editOption(record) }}>编辑</span>
            <span style={{ ...optionStyle, paddingLeft: 32, color: `rgb(244,67,54)` }} onClick={() => { openDel(record) }}>删除</span>
          </div>
        )
      }
    }
  ]

  //保存编辑
  const onOkEditModal = async () => {
    console.log(editFromRef.current.pointSource, editForm.getFieldsValue())
    const tableforvalues = editFromRef.current.pointSource

    let count =0;
    tableforvalues.forEach(it=>{
      it.watchPoint&& count++
    })
    if(count===0){
      message.warning('请至少选择一项标记检测运行点！')
      return
    }

    const formvalues = editForm.getFieldsValue()
    const tableData = tableforvalues.map(it => ({
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


  //新增时获取未使用的电表名
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
        dataOrder: item.secquence
      }))

      // console.log(foRef, arr)
      if (foRef.current) {
        const watchPointArr = arr.filter(it => it.watchPoint)
        console.log(watchPointArr)
        foRef.current.setSwitched(watchPointArr)
        foRef.current.setPointSource(arr)
      } else {
        setDefaultTableData(arr)
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
    let count =0;
    console.log(foRef.current.pointSource)
    foRef.current.pointSource.forEach(it=>{
      it.watchPoint&& count++
    })
    if(count===0){
      message.warning('请至少选择一项标记检测运行点！')
      return
    }

    const formValue = addForm.getFieldsValue()
    const tableData = foRef.current.pointSource.map(it => ({
      name: it.dataMark,
      isSave: it.isSave,
      isRuningPoint: it.watchPoint,
      secquence: it.dataOrder
    }))
    console.log(addForm.getFieldsValue(), foRef.current.pointSource)
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
  //导出表格
  const exportExecel = () => {
    tableLoadRef.current.download()
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
    title:'配置水表类型'
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
    cancelText: '取消',
    okText: '确认',
    content: '是否确认删除水表类型?',
    name: '删除水表类型',
    onOk: delOK
  }
  return (
    <div>
      <DeviceContent {...deviceProps} >
        <Table
          columns={columns}
          dataSource={tableDataSource}
          bordered={false}
          ref={tableLoadRef}
          loading={loading}
          pagination={tableParams}
          onChange={onChangePage}
        ></Table>
      </DeviceContent>
      <Modal mold='cust' {...editModalProps}>
        <BlueColumn name='编辑水表类型' styled={{ padding: '24px 0px' }}></BlueColumn>
        <EditModal {...editFormProps}></EditModal>
      </Modal>
      <DeleteModal {...delModalProps}></DeleteModal>
    </div>
  )
}