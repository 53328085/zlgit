import React, { useRef, useState, useEffect } from 'react'
import { Select, Button, Table, Space,  message, Typography, Form, Input,} from 'antd';
import style from './style.module.less'
import UseTransfer from '@com/useTransfer'
import { useRequest } from 'ahooks';
import {useSelector} from 'react-redux'
import {utils, writeFile} from 'xlsx'
import {selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'
import { distributionRoom, DistributionMeter } from '@api/api.js'
import { cloneDeep } from 'lodash';
import CModal from '@com/useModal'
import dashed from '@imgs/dashed.png'
 
 
const {Link} = Typography

export default function Index() {
  const tableRef = useRef()
  const { queryPageRoom } = distributionRoom
  const { QueryPageFibreTempil,QueryUnusedFibreTempil,ConfigureFibreTempil, QueryGXCWBaseInfo, ConfigureGXCWInfo, DeleteGXCWInfo} = DistributionMeter
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  const projectId = useSelector(selectProjectId);
  //园区选择
  const areaList = useSelector(selectOneLevel)
  const levelName = useSelector(levelDefaultLabel) || '园区'
  const [defaultArea, setDefaultArea] = useState(areaList[0]?.id || undefined)
  const [areaId,setAreaId] = useState(areaList[0]?.id || undefined)
  const handleChange = (values) => {
    setPageNum(1)
    setAreaId(values)
  }
  //配电房下拉框
  const [roomList, setRoomList] = useState([])
  const [defaultRoom, setDefaultRoom] = useState()
  const [roomId, setRoomId] = useState()
  const getRoomData = () => {
    return queryPageRoom( projectId, areaId, 0, 0).then(res => {
      if(res.success){
        setRoomList(res.data)
        setDefaultRoom(res.data.length > 0 ? res.data[0].id : null)
        setRoomId(res.data.length > 0  ? res.data[0].id : null)
        if(res.data.length == 0){
          messageApi.open({
            type: 'warning',
            content:"当前园区没有配电房"
          })
        }
      }else{
        messageApi.open({
          type:'error',
          content:res.errMsg
        })
      }
    })
  }
  const { run : queryRoom } = useRequest(getRoomData,{
    manual: true,
  })
  useEffect(()=>{
    if(areaList.length == 0 || !areaList){
      message.error('当前项目尚未配置园区!')
      return;
    }
    if(areaId == 0 || !areaId){
      return
    }else{
      queryRoom()
    }
  },[areaId])
  const ChangeRoom = values => {
    setPageNum(1)
    setDefaultRoom(values)
    setRoomId(values)
  }

  //设备查询
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const getTableData = () => {
    return QueryPageFibreTempil(projectId, roomId, pageNum, pageSize).then(res => {
      if(res.success){
        if(res.data){
          setData(res.data)
        //  setSubTable(res.data)
        }else{
          setData([])
        //  setSubTable([])
        }
        setTotal(res.total)
      }
    })
  }
  const {run: queryTable } = useRequest(getTableData,{
    manual:true
  })
  useEffect(()=> {
    if(roomId){
      queryTable()
    }else{
      setData([])
    }
  },[roomId, pageNum])

  const columns = [
    {
      align:'center',
      title: '测温通道',
      dataIndex: 'channel',
      key: 'sn',
      render: (text) => `通道${text}`
    },
    {
      align:'center',
      title: '分区编号',
      dataIndex: 'subfield',
      key: 'subfield',
    },
    {
      align:'center',
      title: '分区名称',
      dataIndex: 'subfieldName',
      key: 'subfieldName',
    },
    
    {
      align:'center',
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
    },{
      align:'center',
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align:'center',
    },
    {
      title: '操作',
      key: 'action',
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <Link underline onClick={() => settingClick(record)} >绑定设备</Link>
          <Link underline onClick={() => onOpen(true, record)}>编辑分区</Link>
          <Link underline type="danger"  onClick={() =>delopen(record)}>删除分区</Link>
        </Space>
      ),
    },
  ];

  const [data, setData] = useState([])
 
  
 
 
// 创建、编辑分区
const rules = [{
  required: true
}]
 const zref = useRef()
 const recordref = useRef()
 const [form] =Form.useForm()
 const [channel, setChannel] = useState([])
 const [items, setItem] = useState([])
 const [state, setState] = useState(false)
 
  const title = state ? "编辑测温分区" : "新建测温分区"
 const changeCh = (_, option) => {    
    setItem([...option.items])
 }
 const onOk = async () => {
     console.log(recordref)
     try {
       let values = await  form.validateFields()
       let params = {
        ...values,
        id: state ? recordref.current?.id : 0,
        projectId,
        roomId,
       }
       console.log(params)
      let {success} = await ConfigureGXCWInfo(params)
      if(success) {
        message.success( state ? "修改成功" : '新增成功')
        state && zref.current.onCancel();
        queryTable()
      }
     } catch (error) {
       console.log(error)
     }
 }
 const onOpen = (s, record) => {
    if(!roomId) return message.warning("请先选择配电房")
     if(s) {
       recordref.current = record
       console.log(recordref)
       form.setFieldsValue({...record})
     }
     setState(s)
     zref.current.onOpen()
 }
 const getInfo =async () => {
    try {
     let {data, success} = await QueryGXCWBaseInfo()
     if(success) {
        if(Array.isArray(data) && data.length > 0) {
          setChannel(data)
          setItem(Array.isArray(data[0].items) ? data[0].items : [])
        }else {
          setChannel([])
          setItem([])
        }
     }else {
       setChannel([])
     }
    } catch (error) {
      
    }
     
 }
 const delref = useRef()
 const delId = useRef()
 const delopen = (id) => {
    delId.current = id;
    delref.current.onOpen()
 }
 const delOk = async () => {
      console.log(delId)
      let {success, errMsg} = await  DeleteGXCWInfo(delId.current);
      if(success) {
        message.success("删除成功");
        delref.current.onCancel()
        queryTable()
      }else {
       message.warning(errMsg || "数据出错")
      }
 }

 
 
  
 useEffect(() => {
    getInfo()
 }, [])

  //   绑定设备  穿梭框
  const [fibre, setFibre] = useState()
 
  const [transTag, setTransTag] = useState('')
  const settingClick =(record) => {
    if(areaId == 0 || !areaId){
      message.warning('请先选择园区!')
      return;
    }
    if(roomId){
      QueryUnusedFibreTempil({projectId, areaId, alike: ''}).then(res => {
        let { success, data } = res
        if(success){
          setFibre({...record})
          if(record.sn) {
            setSubTable([record])
          }else {
            setSubTable([])
          }
          
          if(data){
            setUnknownTable(data)
          }else{
            setUnknownTable([])
          }
          setTransTag('open');
        }else{
          messageContent('error', res.errMsg)
        }
      })
    }else{
      messageContent('warning', '请先选择配电房')
    }
  }
  const  getSaveValue = params => {
    
    if (params.subData.length < 1) return message.warning("必须选择一个设备")
     
    let data = {
      projectId,
      id: fibre?.id,
      sn: params.subData[0].sn
    }
    ConfigureFibreTempil(data).then(res=> {
      if(res.success){
        messageContent('success','光纤测温设备配置成功!')
        queryTable()
        setTransTag('close')
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }

  const getCloseValue = params => {
    setTransTag(params)
  }

  const mainTable = []
  const [subTable, setSubTable]= useState([])
  const [unknownTable, setUnknownTable] = useState([])
  const transferColumns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'name',
        key:'name'
    }
    ]

  const transferTitle = {
    mainTitle:'',
    subTitle:'光纤测温',
    unknownTitle:'未选中的光纤测温设备'
  }  
  //分页
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    total, // 总条数
    onChange: page => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
  }
  const handlePageChange = (page) => {
    setPageNum(page)
  }

  const exportData = () => {
    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿   
    let table = tableRef.current  
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    let file =  "xlsx";
    writeFile(workbook, '配电房光纤测温.xlsx', { bookType: file }); // 下载
  }

  return (
    <div>
      {transTag =='open' ? <div className={style.mask}></div> : null }
      {contextHolder}
      <div className={style.header}>
        <span className={style.headerTitle}>{levelName + '选择'}</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          style={{width: '200px'}}
          onChange={handleChange}
        >
          {areaList.map(item => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
        <div className={style.division}></div>
        <Select
          placeholder="请选择配电房"
          size="middle"
          // key={defaultRoom}
          // defaultValue={defaultRoom}
          value={defaultRoom}
          style={{width: '200px'}}
          onChange={ChangeRoom}
        >
          {roomList?.map((item) => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
      </div>
      <div className={style.mainContent}>
        <div className={style.contentTitle}>
            <span>配电房光纤测温</span>
            <div>
           {/*  <Button type="primary" onClick={()=> settingClick()}style={{ width: 96}}>
                选择设备
            </Button> */}
             <Button type="primary" onClick={() => onOpen(false)} >
               创建测温分区
            </Button>
            <Button type="primary" style={{marginLeft:'16px', width: 96}} onClick={()=>exportData()}>
                导出
            </Button>
            </div>
        </div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <div className={`${style.transferPage} ${transTag =='open' ? style.startAnimation : transTag =='close' ? style.endAnimation :''}`} >
        <UseTransfer 
        type="fibre"
        fibre={fibre}
        transferTitle={transferTitle} 
        saveValue={getSaveValue} 
        columns={transferColumns} 
        mainTable={mainTable} 
        subTable={subTable} 
        unknownTable={unknownTable}
        closeValue={getCloseValue}></UseTransfer>
        </div>
      <Table ref={tableRef} style={{marginTop:'16px'}} bordered columns={columns} dataSource={data} rowKey='id' pagination={paginationProps}></Table>
     
      <CModal title={title} ref={zref} closable={false}  mold="cust"  custft={!state} onOk={onOk} width={592}>
      <Form
            labelAlign="left"
            form={form}
            colon={false}
            labelCol={{span: 4}}
            initialValues={{
              channel: channel[0]?.channel,
              subfield: items[0]?.subfield
            }}
            preserve={false}
            >
                 <Form.Item label="测温通道" >
                    <Input.Group compact style={{display: 'flex'}}>
                     <Form.Item  name="channel" rules={rules} noStyle >
                         <Select options={channel} onChange={changeCh} fieldNames={{label: "name", value: "channel"}} disabled={state} style={{width: "148px"}}></Select>
                  
                     </Form.Item>
                     <Form.Item label="分区编号" name="subfield" rules={rules} style={{marginLeft: "auto"}}  >
                         <Select options={items} fieldNames={{label: 'subfieldName', value: 'subfield'}} disabled={state} style={{width: "148px"}}    ></Select>    
                      </Form.Item>
                      </Input.Group>
                 </Form.Item>
                
              <Form.Item label="分区名称" name="subfieldName" rules={rules}>
                 <Input allowClear />
              </Form.Item>
              <Form.Item label="备注信息" name="remark">
                 <Input allowClear />
              </Form.Item>
        </Form>

      </CModal>
     
     

      <CModal title="删除提示"  ref={delref} onOk={delOk}   width={512}  closable={false} type="warn" mold="cust"  >
        是否要删除光纤测温分区？ 
      </CModal>
      </div>
    </div>
  )
}
