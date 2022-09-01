import React, {useState, useEffect} from 'react'
import {useSelector, useStore, useDispatch} from 'react-redux'
import {useAntdTable, usePagination} from 'ahooks'
import {Form} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import UserCard from '@com/useCard'
import {SettingManage} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import {selectDisplay} from '@redux/params.js'
import columns,  { onDesc} from './columns'
import {nanoid} from '@reduxjs/toolkit'

export default function Index() {
  const [form] = Form.useForm()
  const projectId = useSelector(selectCurProject)?.id 
  let [display, setDisplay] = useState(useSelector(selectDisplay))
  const store = useStore()
  store.subscribe(() => {
      setDisplay(store.getState().params.display)
  })

  let params = {
    projectId: projectId,
    enableState:1,
    pageNum: 1,
    pageSize: 12,
    alike: '',
  }

  const getTableData = ({ current, pageSize}, formData) => {
    params = Object.assign({}, params, {PageNum: current, pageSize}, formData)
    return SettingManage.GatewayFindAlike(params).then(res => {
      let {success, data, totalNum} = res;
      console.log(data)
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const getCardData = ({ current, pageSize}) => {
    params = Object.assign({}, params, {PageNum: current, pageSize})
    return SettingManage.GatewayFindAlike(params).then(res => {
      let {success, data, totalNum} = res;
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const {tableProps, search} = useAntdTable(getTableData,{
    form,
    refreshDeps: [projectId],
    defaultPageSize:12,
  })
  console.log(tableProps)

  const {data, pagination} = usePagination(getCardData,{
    refreshDeps: [projectId],
    defaultPageSize:9,
  })

  return (
    <Pagecount form={form} search={search}>
      {display ? <UserTable columns={columns}   {...tableProps} rowKey='id' /> : 
        <UserCard   {...{data, pagination}} /> 
      }
    </Pagecount>
  )
}
