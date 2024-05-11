import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form, Select, Input} from 'antd'
import {useOutletContext} from 'react-router-dom'
import {CustButtonT} from "@com/useButton"
import Titlelayout from "@com/titlelayout"
import UserTree from "@com/useTree"
import {CarbonData} from './carbondataslice'
const {Item} = Form
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: 296px 1334px;
  column-gap: 16px;
  flex: 1;
 
`
export default function Index() { 
  let {exparams} = useOutletContext() 
  let {areaId, data, projectId, type} = exparams
  const [treeId, setTreeId] = useState()
  const [line, setLine] = useState(0)

  // 获取数据
  /* "enterpriseId": "1",
    "type": "1",
    "date": "2024-01-01",
    "FacilityIds": [
        "1",
        "2",
    ] */

  const [getData, {isLoading}] =CarbonData.useLazyCarbonEmissionQuery() 
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
 }, [treeId])
/*   const [form] = Form.useForm()
  const [no, setNo] = useState()
  const {data: {data: industry}} = useIndustryListQuery();
  const  {data: province, refetch} = useProvinceListQuery()
  const provinceList = Array.isArray(province) ? province.map(p => ({label:p, value:p})) : []
   
  console.log(apiSlice)
  const rules = [
    {required: true}
  ]
  const onchange = (no) => {
       setNo(no)
    
  }
  useEffect(() => {
    if(!no) return
    useSubIndustryListQuery(no)
  }, [no]) */
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
