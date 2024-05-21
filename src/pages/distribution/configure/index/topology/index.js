import React, { useRef, useState } from 'react'
import { useAntdTable } from 'ahooks';
import { Button,  Space,  message, Divider, Typography } from 'antd';
import {useTranslation} from 'react-i18next'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { selectProjectId,  publishState,selectcurlRommid, selectOneLevelDefaultId } from '@redux/systemconfig.js'
import { distributionRoom } from '@api/api.js' 
import Usetable from '@com/useTable'
import CustModal from '@com/useModal'
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import {NewButton} from '@com/useButton'
const {Link} = Typography
export default function Index() {
  const {t} = useTranslation(["button"])
  const roomId = useSelector(selectcurlRommid)
  const areaId = useSelector(selectOneLevelDefaultId)
  const isPublish = useSelector(publishState)
  const projectId = useSelector(selectProjectId);
  const dref = useRef()
 
  //配电房下拉框
  const { queryPageChart, deleteChart } = distributionRoom 

  const columns = isPublish ? [
    {
      align: 'center',
      title: '配电系统图名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 680,
      align: 'center',
    },
  ] : [
    {
      align: 'center',
      title: '配电系统图名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: 680,
    },
    isPublish ? null : {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 280,
      render: (_, record) => (
        <Space size="middle">
          <Link type='primary' underline onClick={() => edit(record)}>{t("button:edit")}</Link>
          <Link type="danger" underline onClick={() => deleteRecord(record)}>{t("button:delete")}</Link>
        </Space>
      ),
    },
  ];

  const tableRef = useRef()
  const getTableData = ({current, pageSize}) => {
    if(!roomId || !projectId) {
      setTotal(0)
      return {
      list: [],
      total: 0
    } 
  }
   return  queryPageChart(projectId, roomId, current, pageSize).then(res => {

      if(res.success){
           if(Array.isArray(res.data) && res.data?.length > 0) {
             return {
               list: res.data,
               total: res.total
             }
           }else {
             return {
              list: [],
              total: 0
             }
           }        
      }else{
        message.error(res.errMsg)
      }
    })
  }
  const {tableProps, refresh} = useAntdTable(getTableData, {
    defaultPageSize: 14,
    refreshDeps: [projectId, roomId]
  })
  const showAdd = (type) => {
    window.open(`/topology?projectId=${projectId}&areaId=${areaId}&roomId=${roomId}&type=${type}`, '_blank')
    
  }

  const edit = (record) => {
    let { id } = record
    let type = 'edit'
    window.open(`/topology?projectId=${projectId}&areaId=${areaId}&id=${id}&type=${type}`, '_blank')
  }

  const [deleteId, setDeleteId] = useState(null)
  const deleteRecord = (record) => {
    setDeleteId(record.id)
    dref.current.onOpen()
  }

  const onDelete = () => {
    deleteChart(projectId, deleteId).then(res => {
      if(res.success){
        message.success('配电图删除成功!')
        dref.current.onCancel()
        refresh()
      }else{
        message.error(res.errMsg)
      }
    })
  }

  return (
    <Pagecont showserach={false} custserach pd="0px" >     
     <Titlelayout title="配电系统图"   layout="flex" dr="column">         
      <Divider style={{margin: "16px 0"}} />
        {isPublish ? null : <NewButton onClick={() => showAdd('add')} />}
        <Usetable style={{marginTop: 16}} ref={tableRef} columns={columns}   rowKey='id'  {...tableProps} />
        <CustModal title='删除提示' ref={dref} mold="cust" width={512} type="warn" onOk={() => onDelete()} maskClosable={false}>        
          是否确认删除配电系统图？ 
      </CustModal>
       </Titlelayout>
    </Pagecont>
  )
}
