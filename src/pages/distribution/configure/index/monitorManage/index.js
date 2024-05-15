import React, { useRef, useState, useCallback } from 'react'
import { Button, Space, message, Typography, Divider } from 'antd';
 
import UseTransfer from '@com/useTransfer'
import { useAntdTable } from 'ahooks';
import {useSelector} from 'react-redux'
import {selectProjectId, selectcurlRommid} from '@redux/systemconfig.js'
import { DistributionMeter } from '@api/api.js'
 
import CModal from '@com/useModal'

import Usetable from "@com/useTable"
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import {  ExportExcel} from '@com/useButton'
const {Link} = Typography
export default function Index() {
  const tableRef = useRef()
  const roomId = useSelector(selectcurlRommid)
  const { queryPageCamera,  queryUnusedCamera, configureCamera } = DistributionMeter
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content)=>{
    messageApi.open({
      type,
      content
    })
  }
  const projectId = useSelector(selectProjectId);
 
  

  //设备查询
 
  const [total, setTotal] = useState(0)
 
  const getTableData = ({current, pageSize}) => {
    if(!roomId || !projectId) {
      setTotal(0)
      return {
      list: [],
      total: 0
    } 
  }
    return queryPageCamera(projectId, roomId, current, pageSize).then(res => {
      if(res.success){
        setTotal(res.total)
        if(Array.isArray(res.data) && res.data?.length > 0){
          setSubTable(res.data)
          return {
            list: res.data,
            total: res.total
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
    defaultPageSize: 14,
    refreshDeps: [projectId, roomId]
  })
 


  const columns = [
    {
      align:'center',
      title: '监控名称',
      dataIndex: 'name',
      key: 'name',
    },
    { 
      align:'center',
      title: '监控类型',
      dataIndex: 'accessMode',
      key: 'accessMode',
      render:(_, record) => {
        let {accessMode} = record || {};
        return  accessMode == 1 ? "云视频监控" : accessMode == 2 ? "本地视频监控" : '';
      }
    },
    {
      title: '监控设备SN',
      dataIndex: 'sn',
      key: 'sn',
      align:'center',
    },{
        title: '监控型号',
        dataIndex: 'category',
        key: 'categoty',
        align:'center',
      },{
        title: '监控设备IP',
        dataIndex: 'ip',
        key: 'ip',
        align:'center',
      },{
        title: '通道号',
        dataIndex: 'channel',
        key: 'channel',
        align:'center',
      },{
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
        align:'center',
      },{
        title: '监控设备厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        align:'center',
      },{
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
          <Link  type="danger" underline onClick={() => deleteRecord(record)}>删除</Link>
        </Space>
      ),
    },
  ];

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const deleteOk = () => {    
   /*  let deleteArr = cloneDeep(subTable)
    deleteArr.map((item,i) => {
      if(item.id = deleteId){
        deleteArr.splice(i, 1)
      }
    })
    let group = []
    if(deleteArr.length > 0){
      deleteArr.map(item => {
        group.push(item.id)
      })
    } */

    let group = subTable.filter(i => i.id!=deleteId)?.map(m => m.id);
    console.log(group)
 
    let data = {
      projectId,
      roomId,
      group
    }
    configureCamera(data).then(res=> {
      if(res.success){
        
        queryTable()
        setDeleteModal(false)
      }else{
        messageContent('error', res.errMsg)
      }
    })
    
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const deleteRecord = (record) => {
    setDeleteId(record.id)
    setDeleteModal(true)
  }

  //穿梭框
  const [transTag, setTransTag] = useState('')
  const settingClick =() => {
    if(!roomId){
      message.warning('请先选择配电房')
      return;
    }
    if(roomId){
      queryUnusedCamera(projectId, roomId).then(res => {
        let { success, data } = res
        if(success){
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
    let group = []
    if(params.subData.length > 0){
      params.subData.map(item => {
        group.push(item.id)
      })
    }
    let data = {
      projectId,
      roomId,
      group
    }
    configureCamera(data).then(res=> {
      if(res.success){
        messageContent('success','监控设备配置成功!')
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
        title: '监控设备sn',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'name',
        key:'name'
    },{
        align:'center',
        title: '安装地址',
        dataIndex:'address',
        key:'address'
    }
    ]

  const transferTitle = {
    mainTitle:'',
    subTitle:'配电房监控',
    unknownTitle:'未选中的监控设备'
  }  
 
  const onExport =useCallback(async () => {    
   return getTableData({current: 1, pageSize: total})
}, [total, roomId, projectId])
  
  const Title = (
     <div style={{display: "flex", justifyContent: "space-between"}}>
         <span>配电房视频监控</span>
            <Space size={16}>
            <Button type="primary" onClick={()=> settingClick()}style={{ width: 96}}>
                选择设备
            </Button>
            <ExportExcel tb={tableRef} />
            </Space>
     </div>
  )
  return (
    <Pagecont showserach={false} custserach pd="0px" >  
      {contextHolder}
     
      <Titlelayout title={Title}  layout="flex" dr="column">  
        <Divider style={{margin: "16px 0"}} />
        
        <UseTransfer  mask={transTag} transferTitle={transferTitle} saveValue={getSaveValue} columns={transferColumns} mainTable={mainTable} subTable={subTable} unknownTable={unknownTable} closeValue={getCloseValue}></UseTransfer>
        
      <Usetable ref={tableRef}   columns={columns}  rowKey='id'  {...tableProps} sheetName="视频监控管理" onExport={onExport}></Usetable>
      <CModal title="删除提示" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512}  maskClosable={false}  mold="cust" type="warn">        
          是否确认在该配电房中删除视频监控设备？ 
      </CModal>
      
      </Titlelayout>
    </Pagecont>
  )
}
