import React, { useState, useRef} from 'react'
import {useAntdTable} from 'ahooks'
 
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {  message, Space} from 'antd'
import {useOutletContext} from 'react-router-dom'
import {CustButtonT} from "@com/useButton"
import Titlelayout from "@com/titlelayout"
 
import {Carbon} from '@api/api'
import CTree from './ctree'
import Usetable from '@com/useTable'
import {getTime} from "@com/usehandler"
 
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: 296px minmax(1368px, auto);
  column-gap: 16px;
  flex: 1;
  .tablebox {
    flex: 1;
    display: flex;
    padding-top: 16px;
    .rowbg {
      background-color: #fdfdfd;
    }
  }
  
`
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 180
  },
  {
    title: '开始日期',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 180
  },
  {
    title: '结束日期',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 180
  },
  {
    title: '碳排量(tCO₂)',
    dataIndex: 'value',
    key: 'value',
    width: 180
  },
]
export default function Index() { 
  let {exparams, enterpriseId} = useOutletContext() 
  
  let {  date,   type} = exparams

  const [treeId, setTreeId] = useState([])
 
  const params = useRef({})
  const getTabledata =({current, pageSize}) => {
    if(Number.isInteger(enterpriseId) && type && date && Array.isArray(treeId)) {     
        let params = {
        enterpriseId,
        type,
        date: getTime(date, type),
        FacilityIds:  treeId
      }
      return Carbon.QueryEmissionDataPost(current, pageSize, params).then(res => {
          let {success, data, errMsg, total} = res
          if(success && Array.isArray(data) && data.length > 0) {
            return {
              list: data,
              total,
            }
          }else {
            if(!success) message.warning(errMsg || "数据出错")
             return {
              list: [],
              total: 0
             }
          }
      })         
    }else {
    
    }
  }
  const {tableProps} = useAntdTable(getTabledata, {
    defaultPageSize: 14,
    refreshDeps: [enterpriseId, treeId, date, type]
  })
 
  const onExport = async() => {
    try {
      let params = {
        enterpriseId,
        type,
        date: getTime(date, type),
        FacilityIds:  treeId
      }
       let {success} = await Carbon.ExportDataPost(params)
    } catch (error) {
      
    }
   
  }
  
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>碳排放(tCO₂)</span>
        <Space>
          <CustButtonT text="export" src='export' onClick={onExport} /> 
        </Space>
    </div>
  )
  return (
    <Pagecount bgcolor="transparent" pd="0">
       <Mainbox>
        <CTree enterpriseId={enterpriseId} setTreeId={setTreeId} />
      {/*  <UserTree areaId={areaId}   setTreeId={setTreeId} setLine={setLine}     />  */}
     
          <Titlelayout title={CTitle} layout="flex">
              <div className='tablebox'>
                 <Usetable columns={columns} {...tableProps} hbg="#ecf5ff" hbc="#515151" rowClassName={(_, index) => index %2==0 ? "rowbg" : null} />
              </div>
          </Titlelayout>
       </Mainbox> 
    </Pagecount>
  )
}
