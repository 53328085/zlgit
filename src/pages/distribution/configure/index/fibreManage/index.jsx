import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Select, Button,  Space,  message, Typography, Form, Input, Divider} from 'antd';
import {useTranslation} from 'react-i18next'
import UseTransfer from '@com/useTransfer'
import { useAntdTable} from 'ahooks';
import {useSelector} from 'react-redux'
 
import {selectProjectId, selectcurlRommid, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import { DistributionMeter } from '@api/api.js'
 
import CModal from '@com/useModal'
 
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import {  ExportExcel, CustButton} from '@com/useButton'
import Usetable from '@com/useTable' 
 
const {Link} = Typography

export default function Index() {
  const {t} = useTranslation(["button"])
  const tableRef = useRef() 
  const { QueryPageFibreTempil,QueryUnusedFibreTempil,ConfigureFibreTempil, QueryGXCWBaseInfo, ConfigureGXCWInfo, DeleteGXCWInfo} = DistributionMeter
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  const projectId = useSelector(selectProjectId);
  const roomId = useSelector(selectcurlRommid)
  const areaId = useSelector(selectOneLevelDefaultId)

  //设备查询
 
  const [total, setTotal] = useState(0) 
  const getTableData = ({current, pageSize}) => {
    if(!areaId || !roomId) return  new Promise((resolve) => {
      setSubTable([])
      setTotal(0)
      resolve({
       list: [],
       total: 0
     })

   })
    return QueryPageFibreTempil(projectId, roomId, current, pageSize).then(res => {
      let {success, data, total} = res
      if(success){
        setTotal(total)
        if(Array.isArray(data) && data.length > 0){
           
         setSubTable(data)
         return {
           list: data,
           total
         }
        }else{ 
         setSubTable([])
         return {
          list: [],
          total: 0
         }
        }
      }
    })
  }
  const {refresh: queryTable, tableProps } = useAntdTable(getTableData,{
    refreshDeps: [roomId,projectId],
    defaultPageSize: 14,
  })
 

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
        <Space  size={16}>
          <Link underline onClick={() => settingClick(record)} >{t("button:bindDevice")}</Link>
          <Link underline onClick={() => onOpen(true, record)}>{t("button:editPartition")}</Link>
          <Link underline type="danger"  onClick={() =>delopen(record)}>{t("button:deletePartition")}</Link>
        </Space>
      ),
    },
  ];

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
      return form.validateFields().then(async () => {
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
    })
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
      let {success, errMsg} = await  DeleteGXCWInfo(delId.current.id, projectId);
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
    console.log(record)
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
  const Title = (
    <div style={{display: 'flex',justifyContent: "space-between", alignItems: "center"}}>
      <span>光纤测温</span>
            <Space size={16}>
            <CustButton  wh="auto" onClick={() => onOpen(false)} >
               {t("button:createTemperaturePartition")}
            </CustButton>
            <ExportExcel tb={tableRef} />
        
            </Space>
    </div>
 )

  const onExport =useCallback(async () => {   
    return getTableData({current: 1, pageSize: total})
   }, [total, roomId, projectId])

  return (
    <Pagecont showserach={false} custserach pd="0px" >       
      {contextHolder}
      <Titlelayout title= {Title}  layout="flex" dr="column">        
     {/*  <Divider style={{margin: "16px 0"}} /> */}
        
        <UseTransfer 
        type="fibre"
        fibre={fibre}
        mask={transTag} 
        transferTitle={transferTitle} 
        saveValue={getSaveValue} 
        columns={transferColumns} 
        mainTable={mainTable} 
        subTable={subTable} 
        unknownTable={unknownTable}
        closeValue={getCloseValue}></UseTransfer>
       
      <Usetable ref={tableRef}   columns={columns}   rowKey='id'  {...tableProps}  sheetName="配电房光纤测温" onExport={onExport}></Usetable>
     
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
                    <Space.Compact  style={{display: 'flex'}}>
                     <Form.Item  name="channel" rules={rules} noStyle >
                         <Select options={channel} onChange={changeCh} fieldNames={{label: "name", value: "channel"}} disabled={state} style={{width: "148px"}}></Select>
                  
                     </Form.Item>
                     <Form.Item label="分区编号" name="subfield" rules={rules} style={{marginLeft: "auto"}}  >
                         <Select options={items} fieldNames={{label: 'subfieldName', value: 'subfield'}} disabled={state} style={{width: "148px"}}    ></Select>    
                      </Form.Item>
                      </Space.Compact>
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
      </Titlelayout>
    </Pagecont>
  )
}
