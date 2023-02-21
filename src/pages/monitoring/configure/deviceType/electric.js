import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import DeviceContent from './deviceContent'
import style from './style.module.less'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message, Divider } from 'antd';
import Table from '@com/useTable'
import Modal from '@com/useModal'
import UploadImg from './upload.jsx'

const { DeviceTypeManager: { AllDeviceStyle, DeviceQueryNotUsed, DeviceQueryCategoryFull,DeviceCategory, AddDeviceCategory} } = Monitoring;
export default function Electric() {
  const [dataSource, setDataSource] = useState([])//modal框表格数据
  const [tableDataSource,setTableDataSource]=useState([])//主页表格数据
  const [defaultTableData, setDefaultTableData] = useState(null)
  const { DeviceTypeManager: { } } = Monitoring;
  const ModalRef = useRef(null)
  const foRef = useRef(null)
  const projectId = useSelector(state => state.system.menus.projectId)
  const [addForm] = Form.useForm()
  const optionStyle={
    color: '#1890ff',
    cursor: 'pointer',
  }
  const columns =  [
    {
        title:'设备型号',
        dataIndex: 'category'
    },
    {
        title:'设备厂家',
        dataIndex: 'manufacturer'
    },
    {
        title:'设备缩略图',
        dataIndex: 'imageBase64',
        render:(text)=>{
          return( <img src={text} width={64} height={53}></img>)
         
        }
    },
    {
        title:'当前设备数量',
        dataIndex: 'cnt'
    },
    {
        title:'操作',
        dataIndex: 'options',
        render:(text,record)=>{
          console.log(text,record)
          return(
            <div>
              <span style={optionStyle} onClick={()=>{editOption(record)}}>编辑</span>
              <span style={{...optionStyle,paddingLeft:32,color:`rgb(244,67,54)`}} onClick={()=>{DelModalRef.current.onOpen(),categoryId=record.category}}>删除</span>
            </div>
          )
        }
    }
]

  //获取设备列表
  const getTableData = async () => {
    let params = {
      projectId,
      pageNum: 1,
      pageSize: 10,
      deviceStyle:1
    }
    const result = await DeviceCategory(params)
    const { data, errMsg, success } = result;
    if (success && Array.isArray(data)) {
      setTableDataSource(data)
    } 
  }
  //新增时获取未使用的电表名
  const getDeviceQueryNotUsed = async () => {
    let params = {
      projectId,
      deviceStyle: 1
    }
    const r = await DeviceQueryNotUsed(params)
    if (r.success && Array.isArray(r.data)) {
      const arr = r.data.map((item, index) => ({ label: item, value: item }))
      setDataSource(arr)
      getDeviceQueryCategoryFull(r.data[0])
    }
  }

  //获取默认电表的详细信息
  const getDeviceQueryCategoryFull = async (category) => {
    let params = {
      projectId,
      category,
    }
    const r = await DeviceQueryCategoryFull(params)
    if (r.success) {
      const data = r.data
      const arr = data.points.map((item, index) => ({
        index: index + 1,
        dataMark: item.alias,
        dataName: item.name,
        dataUnit: item.unit,
        isSave: item.isSave,
        watchPoint: item.isRuningPoint,
        dataOrder: item.secquence
      }))
      
      //console.log(foRef, arr)
      if (foRef.current) {
        const watchPointArr = arr.filter(it=>it.watchPoint)
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
    }

  }
  const open = () => {
    ModalRef.current.onOpen()
  }
  const onCancel=()=>{
    getDeviceQueryNotUsed()
    console.log(1111)
    ModalRef.current.onCancel()
  }
  //保存新增设备
  const onOk = async () => {
    const formValue = addForm.getFieldsValue()
    const tableData =  foRef.current.pointSource.map(it=>({
      name:it.dataName,
      isSave:it.isSave,
      isRuningPoint:it.watchPoint,
      secquence:it.dataOrder
    }))
    console.log(addForm.getFieldsValue(), foRef.current.pointSource)
    let params ={
      projectId,
      category:formValue.DeviceType,
      control:formValue.Control,
      calculate:formValue.IsCount,
      realTimeReading:formValue.IsRead,
      imageBase64:formValue.ImageUpload?formValue.ImageUpload:formValue.DefaulImg,
      points:tableData
    }
    const resp = await AddDeviceCategory(params)
    console.log(resp)
    if(resp.success){
      ModalRef.current.onCancel()
      message.success("新增成功")
      getTableData()
    }else{
      message.error(resp.errMsg)
    }
  }

  useEffect(() => {
    getTableData()
    getDeviceQueryNotUsed()
    getDeviceQueryCategoryFull()
  }, [])
  let addModalProp = {
    addForm,
    dataSource,
    getDeviceQueryCategoryFull,
    defaultTableData
  }
  let deviceProps = {
    value: 0,
    name: '新增电表类型',
    AddModal: <AddModal ref={foRef} {...addModalProp} />,
    cancelText: '取消',
    okText: '确认',
    onOk,
    width: 1032,
    open,
    ModalRef,
    onCancel
  };
  return (
    <div>
      <DeviceContent {...deviceProps} >
        <Table columns={columns} dataSource={tableDataSource}></Table>
      </DeviceContent>
      <Modal>
        
      </Modal>
    </div>
  )
}


let Count = ({ value, record, pointSource,setPointSource }) => {
  let arr=[...pointSource]
  const reduce = () => {
    if (value <=0) return
    arr[record.index-1]['dataOrder'] = value - 1
    setPointSource(arr)
  }

  const add = () => {
    arr[record.index-1]['dataOrder']  = value + 1
    setPointSource(arr)
  }
  const inpBlur=(e)=>{
    arr[record.index-1]['dataOrder'] =Number(e.target.value) 
    setPointSource(arr)
    console.log(e.target.value)
  }
  return (
    <div className={style.countNum}>
      <div onClick={reduce} className={style.opts} style={{borderRight:'none'}}>-</div>
      <Input  className={style.numbers} defaultValue={value}  onBlur={inpBlur} />
      <div onClick={add} className={style.opts} style={{borderLeft:'none'}}>+</div>
    </div>
  )
}

let ImageUpload = ({ value = {} }) => {
  return (
    <img src={value} style={{ width: 120, height: 96, marginRight: 16 }}></img>
  )
}







let TableForm = forwardRef(({ defaultTableData }, ref) => {
  const [pointSource, setPointSource] = useState([...defaultTableData])
  const [siwtched, setSwitched] = useState([])
  const [tableParams, setTableParams] = useState({ current: 1, pageSize: 10 })

  const columns = [
    {
      title: '序号',
      key: 'index',
      dataIndex: 'index'
    },
    {
      title: '数据标识',
      key: 'dataMark',
      dataIndex: 'dataMark'
    },
    {
      title: '数据名称',
      key: 'dataName',
      dataIndex: 'dataName'
    },
    {
      title: '数据单位',
      key: 'dataUnit',
      dataIndex: 'dataUnit'
    },
    {
      title: '是否存储',
      key: 'isSave',
      dataIndex: 'isSave',
      // shouldCellUpdate:()=>true,
      render: (_, v, index) => {
        return (
          <Switch checkedChildren="存储" unCheckedChildren="不存储" defaultChecked={_}
            onChange={(o) => {
              let arr =[...pointSource]
              arr.forEach((it, index) => {
                if (it.index === v.index) {
                  it.isSave = o
                }
              })
            setPointSource(arr)
            }} />

        )
      }

    },
    {
      title: '标记运行监测点',
      key: 'watchPoint',
      dataIndex: 'watchPoint',
      shouldCellUpdate: (r, o) => { },
      render: (t, record, index) => {
        return (
          <Switch
            checkedChildren="标记"
            unCheckedChildren="不标记"
            defaultChecked={t}
            disabled={siwtched.length>3&&!siwtched.includes(record.index)}
            onChange={(o) => {
              pointSource.forEach((it, i) => {
                if (it.index === record.index) {
                  it.watchPoint = o
                }
              })
              if (o&&siwtched.length <= 3) {
                  setSwitched([...siwtched,record.index])
              }else{
                let arr= siwtched.filter(it=>it!==record.index)
                setSwitched([...arr])
              }
            }}
          />
        )
      }

    },
    {
      title: '数据显示顺序',
      key: 'dataOrder',
      dataIndex: 'dataOrder',
      render: (text, record, i) => {
        return <Count value={text} record={record} pointSource={pointSource} setPointSource={setPointSource}></Count>
      }
    },
  ]

  useImperativeHandle(ref, () => ({
    setSwitched,
    pointSource,
    setPointSource,
    setTableParams
  }))
  return (
    <Table
      columns={columns}
      dataSource={pointSource}
      rowKey={record => record.index}
      pagination={tableParams}
      onChange={
        (page, pageSize) => {
          setTableParams({ ...page })
        }
      }
    ></Table>
  )
})


//新增电表类型
let AddModal = forwardRef(
  ({ addForm, dataSource, getDeviceQueryCategoryFull, defaultTableData }, ref) => {
    const tableRef = useRef(null)
    const [isControl,setIsControl] = useState()
    const [IsCount,setIsCount] = useState()
    const handleChange = async (option) => {
      await getDeviceQueryCategoryFull(option)
      setIsControl(addForm.getFieldsValue().Control)
      setIsCount(addForm.getFieldsValue().IsCount)
      tableRef.current.setTableParams({ current: 1, pageSize: 10 })
      //tableRef.current.setSwitched([])
    }

    useEffect(() => {
      setIsControl(addForm.getFieldsValue().Control)
      setIsCount(addForm.getFieldsValue().IsCount)
    },[])
    useImperativeHandle(ref, () => ({
      pointSource: tableRef.current.pointSource,
      setPointSource: tableRef.current.setPointSource,
      setSwitched:tableRef.current.setSwitched
      // handleChange: tableRef.current.handleChange,

    }))
    return (
      <Form
        layout="vertical"
        form={addForm}
       
      >
        <Row align='bottom'>
          <Col span={16}>
            <Row style={{ marginBottom: 16 }}>
              <Form.Item label="设备型号" name="DeviceType">
                <Select
                  style={{ width: 200 }}
                  options={dataSource}
                  onChange={handleChange}
                />
              </Form.Item>
            </Row>
            <Row >
              {/* <Col>
                <Form.Item label="心跳周期(秒)" name="Cycle">
                  <Count></Count>
                </Form.Item>
              </Col> */}
              <Col className={style.ColGap}>
                <Form.Item label="远程控制" name="Control" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!isControl} checked={addForm.getFieldsValue().Control} />
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否计量" name="IsCount" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!IsCount} />
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否抄读" name="IsRead" valuePropName='checked'>
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={8} align="bottom">
            <Row align="bottom">
              <Form.Item label="设备图片" name='DefaulImg' style={{ margin: 0 }}>
                <ImageUpload></ImageUpload>
              </Form.Item>
              <Form.Item name='ImageUpload' >
                <UploadImg></UploadImg>
              </Form.Item>
            </Row>
          </Col>
        </Row>
        <Divider dashed />
        <Row style={{ fontWeight: 'bold', marginBottom: 16 }}>数据点表（请启用4项数据标记为菜单【运行监测】卡片核心数据项）</Row>
        {/* <Table columns={columns} dataSource={pointSource} rowKey={record=>record.index}></Table> */}
        <TableForm ref={tableRef} defaultTableData={defaultTableData}  ></TableForm>
      </Form>
    )
  }
) 
let EditModal = ()=>{
  ({ addForm, dataSource, getDeviceQueryCategoryFull, defaultTableData }, ref) => {
    const tableRef = useRef(null)
    const [isControl,setIsControl] = useState()
    const [IsCount,setIsCount] = useState()
    const handleChange = async (option) => {
      await getDeviceQueryCategoryFull(option)
      setIsControl(addForm.getFieldsValue().Control)
      setIsCount(addForm.getFieldsValue().IsCount)
      tableRef.current.setTableParams({ current: 1, pageSize: 10 })
      //tableRef.current.setSwitched([])
    }

    useEffect(() => {
      setIsControl(addForm.getFieldsValue().Control)
      setIsCount(addForm.getFieldsValue().IsCount)
    },[])
    useImperativeHandle(ref, () => ({
      pointSource: tableRef.current.pointSource,
      setPointSource: tableRef.current.setPointSource,
      setSwitched:tableRef.current.setSwitched
      // handleChange: tableRef.current.handleChange,

    }))
    return (
      <Form
        layout="vertical"
        form={addForm}
       
      >
        <Row align='bottom'>
          <Col span={16}>
            <Row style={{ marginBottom: 16 }}>
              <Form.Item label="设备型号" name="DeviceType">
                <Select
                  style={{ width: 200 }}
                  options={dataSource}
                  onChange={handleChange}
                />
              </Form.Item>
            </Row>
            <Row >
              {/* <Col>
                <Form.Item label="心跳周期(秒)" name="Cycle">
                  <Count></Count>
                </Form.Item>
              </Col> */}
              <Col className={style.ColGap}>
                <Form.Item label="远程控制" name="Control" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!isControl} checked={addForm.getFieldsValue().Control} />
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否计量" name="IsCount" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!IsCount} />
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否抄读" name="IsRead" valuePropName='checked'>
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={8} align="bottom">
            <Row align="bottom">
              <Form.Item label="设备图片" name='DefaulImg' style={{ margin: 0 }}>
                <ImageUpload></ImageUpload>
              </Form.Item>
              <Form.Item name='ImageUpload' >
                <UploadImg></UploadImg>
              </Form.Item>
            </Row>
          </Col>
        </Row>
        <Divider dashed />
        <Row style={{ fontWeight: 'bold', marginBottom: 16 }}>数据点表（请启用4项数据标记为菜单【运行监测】卡片核心数据项）</Row>
        {/* <Table columns={columns} dataSource={pointSource} rowKey={record=>record.index}></Table> */}
        <TableForm ref={tableRef} defaultTableData={defaultTableData}  ></TableForm>
      </Form>
    )
  }
}