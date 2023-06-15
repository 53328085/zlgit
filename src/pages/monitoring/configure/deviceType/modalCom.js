import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle,useContext } from 'react'
import { Button, Form, Input, Row, Col, Upload, Select, Switch, message, Divider } from 'antd';
import WarningPng from '@imgs/warning.png'
import Modal from '@com/useModal'
import style from './style.module.less'
import BlueColumn from '@com/bluecolumn'
import UploadImg from './upload.jsx'
import Table from '@com/useTable'
import upCloud from './imgs/upcloud.png'
import cusContext from '@com/content'
const { Dragger } = Upload;
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
    let [number,setNumber]=useState(0)
    const reduce = () => {
      if (value <=0) return
      arr[record.index-1]['dataOrder'] = value - 1
      setPointSource(arr)
      // setNumber(number-1)
    }
  
    const add = () => {
      arr[record.index-1]['dataOrder']  = value + 1
      console.log(arr)
      setPointSource(arr)
      // setNumber(number+1)
    }
    const inpBlur=(e)=>{
      console.log(typeof e.target.value)
      if(isNaN(Number(e.target.value)) ){
        return message.warning('请输入正确的内容')
      }
      arr[record.index-1]['dataOrder'] =Number(e.target.value) 
      setPointSource(arr)
      // setNumber(e.target.value)
    }
    return (
      <div className={style.countNum}>
        <div onClick={reduce} className={style.opts} style={{borderRight:'none'}}>-</div>
        <Input  className={style.numbers} defaultValue={value} value={record.dataOrder.toString()} onChange={inpBlur} />
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

//表格组件（新增）
  let TableForm = forwardRef(({ defaultTableData,tabledatas }, ref) => {
    const {updateTableRef} =useContext(cusContext)
 
    const [pointSource, setPointSource] = useState([...defaultTableData])
    console.log(updateTableRef,pointSource)
    console.log('pointSource更新了')
    const tableDataRef =useRef()
    tableDataRef.current=[...pointSource]
    let checedList=[]
    defaultTableData?.forEach(it=>{if(it.watchPoint){checedList.push(it.index) }})
    const [siwtched, setSwitched] = useState([...checedList])
    const [tableParams, setTableParams] = useState({ current: 1, pageSize: 10 })
    
    const choosemes =()=>{
      let count =0;
      tableDataRef.current?.forEach(it=>{
        it.watchPoint&& count++
      })
      if(count===0){
       // message.warning('请至少选择一项标记检测运行点！')
        return false
      }
      return  tableDataRef.current
    }
  
   useEffect(()=>{
    console.log(updateTableRef)
    setPointSource(JSON.parse(JSON.stringify(updateTableRef)))
   },[JSON.stringify(updateTableRef)])
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
                setPointSource([...pointSource])
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
      setTableParams,
      choosemes,
      tabledata:tableDataRef.current
    }))
    return (
      <Table
        columns={columns}
        dataSource={pointSource}
        rowKey={record => (record.index +' '+ record.dataMark)}
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
    ({ addForm, dataSource, getDeviceQueryCategoryFull, defaultTableData,  isShow=true }, ref) => {
      const tableRef = useRef(null)
      const [tabledatas,setTabledatas]=useState([...defaultTableData]) 
      const handleChange = async (option) => {
        getDeviceQueryCategoryFull(option)
        tableRef.current.setTableParams({ current: 1, pageSize: 10 })
      }
  



      useImperativeHandle(ref, () => ({
        pointSource: tableRef.current.pointSource,
        setPointSource: tableRef.current.setPointSource,
        setSwitched:tableRef.current.setSwitched,
        choosemes:tableRef.current.choosemes,
        tabledata:tableRef.current.tabledata,
        handleChange,
        setTabledatas
        // setIsControl,
        // setIsCount
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
                    showSearch
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
                 {isShow? <><Col className={style.ColGap}>
                  <Form.Item label="远程控制" name="Control" valuePropName="checked">
                    <Switch 
                    checkedChildren="是" unCheckedChildren="否" 
                    // disabled={!isControl} 
                    // checked={addForm.getFieldsValue().Control} 
                    />   
                  </Form.Item>
                 
                </Col>
                <Col className={style.ColGap}>
                  <Form.Item label="是否计量" name="IsCount" valuePropName="checked">
                    <Switch checkedChildren="是" unCheckedChildren="否" 
                    // disabled={!IsCount} 
                    />
                    
                  </Form.Item>
                 
                </Col>
                <Col className={style.ColGap}>
                  <Form.Item label="是否抄读" name="IsRead" valuePropName='checked'>
                    <Switch checkedChildren="是" unCheckedChildren="否" />
                  </Form.Item>
                </Col></> :null}
              
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
          <TableForm ref={tableRef} defaultTableData={defaultTableData} tabledatas={tabledatas}></TableForm>
          </div>
          
        </Form>
      )
    }
  ) 
  //编辑表格（编辑）
  let TableEditForm = forwardRef(({ defaultTableData,tabledatas }, ref) => {
    const [pointSource, setPointSource] = useState([...defaultTableData])
    const tableDataRef =useRef()
    tableDataRef.current=[...pointSource]
    let checedList=[]
    defaultTableData?.forEach(it=>{if(it.watchPoint){checedList.push(it.index) }})
    const [siwtched, setSwitched] = useState([...checedList])
    const [tableParams, setTableParams] = useState({ current: 1, pageSize: 10 })
    
    const choosemes =()=>{
      let count =0;
      tableDataRef.current?.forEach(it=>{
        it.watchPoint&& count++
      })
      if(count===0){
       // message.warning('请至少选择一项标记检测运行点！')
        return false
      }
      return  tableDataRef.current
    }
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
                setPointSource([...pointSource])
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
      setTableParams,
      choosemes,
      tabledata:tableDataRef.current
    }))
    return (
      <Table
        columns={columns}
        dataSource={pointSource}
        rowKey={record => (record.index +' '+ record.dataMark)}
        pagination={tableParams}
        onChange={
          (page, pageSize) => {
            setTableParams({ ...page })
          }
        }
      ></Table>
    )
    
    
  })
 //编辑设备类型
 export let EditModal =forwardRef(
  ({ editForm, getDeviceQueryCategoryFull,editDefaultTableData=[],isShow=true }, ref) => {
    const tableRef = useRef(null)
    // const [isControl,setIsControl] = useState()
    // const [IsCount,setIsCount] = useState()
    useEffect(() => {
      // setIsControl(editForm.getFieldsValue().Control)
      // setIsCount(editForm.getFieldsValue().IsCount)
    },[])
    useImperativeHandle(ref, () => ({
      pointSource: tableRef.current.pointSource,
      setPointSource: tableRef.current.setPointSource,
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
              {isShow?<>
                <Col className={style.ColGap}>
                <Form.Item label="远程控制" name="Control" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" 
                  //disabled={!isControl} 
                  // checked={addForm.getFieldsValue().Control} 
                  />
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否计量" name="IsCount" valuePropName="checked">
                  <Switch checkedChildren="是" unCheckedChildren="否" 
                  // disabled={!IsCount} 
                  />
                </Form.Item>
              </Col>
              <Col className={style.ColGap}>
                <Form.Item label="是否抄读" name="IsRead" valuePropName='checked'>
                  <Switch checkedChildren="是" unCheckedChildren="否" />
                </Form.Item>
              </Col>
              </>:null}
            
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
        <div className={style.minHt}>
        <TableEditForm  ref={tableRef} defaultTableData={editDefaultTableData}  ></TableEditForm>
        </div>
       
      </Form>
    )
  }
) 

//批量上传导入
export let MultImport = ({ modalImportRef, link = '/deviceExcel/gateway.xlsx',name='' ,uploadprops,...other }) => {
  return (
    <Modal mold='cust' ref={modalImportRef} {...other}>
      <BlueColumn name={name} styled={{ padding: '24px 0px' }}></BlueColumn>
      <Dragger {...uploadprops}>
        <img src={upCloud}></img>

        <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', }}>点击上传</span></p>
        <a style={{ color: '#237ae4', textDecoration: 'underline', fontSize: 16 }} onClick={(e) => { e.stopPropagation() }} href={link}>下载模板</a>
      </Dragger>
    </Modal>
  )
}