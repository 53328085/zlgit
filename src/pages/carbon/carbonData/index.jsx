import React, {useEffect, useState} from 'react'
import {useAntdTable} from 'ahooks'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form, Select, Input} from 'antd'
import {useOutletContext} from 'react-router-dom'
import {CustButtonT} from "@com/useButton"
import Titlelayout from "@com/titlelayout"
import UserTree from "@com/useTree"
import {enterprise} from "@redux/systemconfig"
import {CarbonData, useBoundaryQuery} from './carbondataslice'
const {Item} = Form
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1334px;
  column-gap: 16px;
  flex: 1;
 
`
export default function Index() { 
  let {exparams} = useOutletContext() 
  const {id: enterpriseId} =useSelector(enterprise)
  let {areaId, data, projectId, type} = exparams
  const [treeId, setTreeId] = useState()
  const [line, setLine] = useState(0)
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 180
    },
    {
      title: '开始日期',
      dataIndex: 'name',
      width: 180
    },
    {
      title: '结束日期',
      dataIndex: 'name',
      width: 180
    },
    {
      title: '碳排量(tCO₂)',
      dataIndex: 'name',
      width: 180
    },
  ]
  // useLazyBoundaryQuery
// useLazyEmissionQuery
const can = useBoundaryQuery(enterpriseId,{
  skip: !Number.isInteger(enterpriseId),
  refetchOnFocus: true
})

console.log(can)
  // 获取数据
  /* "enterpriseId": "1",
    "type": "1",
    "date": "2024-01-01",
    "FacilityIds": [
        "1",
        "2",
    ] */

 /*  const [getData, {isLoading}] =CarbonData.useLazyCarbonEmissionQuery() 
 useEffect(() => {
  getData({pageSize: 14, pageNum: 1},{
    enterpriseId: 1,
    type: 1,
    date: '2024-01-01',
    FacilityIds: [
        "1",
        "2",
    ]
  })
 }, [treeId]) */
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
       <Mainbox>
       <UserTree areaId={areaId}   setTreeId={setTreeId} setLine={setLine}     /> 
          <Titlelayout title="碳排放(tCO₂)" layout="flex">
            
          </Titlelayout>
       </Mainbox> 
    </Pagecount>
  )
}
