import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message, Divider } from 'antd';
import WarningPng from '@imgs/warning.png'
import Modal from '@com/useModal'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import UploadImg from './upload.jsx'
import Table from '@com/useTable'
//删除modal组件
export let DeleteModal=({DelModalRef,name='',content='',...other})=>{
    return(
      <Modal mold='cust' ref={DelModalRef} {...other} className={style.DelModal}>
          <BlueColumn name={name}  styled={{ padding: '24px 0px',color:'#ff4d4f' }} bg={{backgroundColor: '#ff4d4f'}}></BlueColumn>
          <div>
            <img src={WarningPng} style={{margin:'0 32px',width:48,height:48}}></img>
            <span>{content}</span>
          </div>
      </Modal>
    )
  }
//计数器组件
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
//展示图片
  let ImageUpload = ({ value = {} }) => {
    return (
      <img src={value} style={{ width: 120, height: 96, marginRight: 16 }}></img>
    )
  }

//表格组件
  let TableForm = forwardRef(({ defaultTableData }, ref) => {
    
    const [pointSource, setPointSource] = useState([...defaultTableData])
    let checedList=[]
    defaultTableData.forEach(it=>{if(it.watchPoint){checedList.push(it.index) }})
    const [siwtched, setSwitched] = useState([...checedList])
    const [tableParams, setTableParams] = useState({ current: 1, pageSize: 10 })
    console.log(pointSource)
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
        width:118,
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
        width: 160,
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
     useEffect(()=>{
     },[])
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


  //新增设备类型
export let AddModal = forwardRef(
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
          <div className={style.minHt}>
          <TableForm ref={tableRef} defaultTableData={defaultTableData}  ></TableForm>
          </div>
          
        </Form>
      )
    }
  ) 

 //编辑设备类型
 export let EditModal =forwardRef(
  ({ editForm, getDeviceQueryCategoryFull,editDefaultTableData }, ref) => {
    const tableRef = useRef(null)
    const [isControl,setIsControl] = useState()
    const [IsCount,setIsCount] = useState()
    useEffect(() => {
      setIsControl(editForm.getFieldsValue().Control)
      setIsCount(editForm.getFieldsValue().IsCount)
    },[])
    useImperativeHandle(ref, () => ({
      pointSource: tableRef.current.pointSource,
      // setPointSource: tableRef.current.setPointSource,
      setSwitched:tableRef.current.setSwitched


    }))
    return (
      <Form
        layout="vertical"
        form={editForm}
      >
        <Row align='bottom'>
          <Col span={16}>
            <Row style={{ marginBottom: 16 }}>
              <Form.Item label="设备型号" name="DeviceType">
                <Input disabled/>
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
                  <Switch checkedChildren="是" unCheckedChildren="否" disabled={!isControl} 
                  // checked={addForm.getFieldsValue().Control} 
                  />
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
        <TableForm  ref={tableRef} defaultTableData={editDefaultTableData}  ></TableForm>
      </Form>
    )
  }
) 
 