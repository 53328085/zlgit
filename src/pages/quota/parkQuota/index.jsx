import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import { Select, message } from 'antd'
import Pagecount from '@com/pagecontent'
 
 
 
import { energyQuota} from "@api/api.js";
import { selectProjectId } from '@redux/systemconfig.js'

import {isObject} from '@com/usehandler'
import Areaimg from './areaimg'
import Rank from './rank'

const Mainbox = styled.div`
  && {
    flex: 1;
    display: grid;
    grid-template-rows: 48px 1fr;
    row-gap: 16px;
    .area {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    .content {
       display: grid;
       grid-template-columns: 1368px minmax(464px, 1fr);
      overflow-x: auto;
      .right{
      display: flex;
      padding: 16px;
    }
    }
  
  }
`

 
 


export default function ParkQuota() {
  const projectId = useSelector(selectProjectId)
  const [parkAreaId, setParkAreaId] = useState(0)
  const [park, setPark] = useState()
  const [quota, setQuota] = useState({})
  const {parkAnnualQuota, areaAnnualQuota, quotaRemainRanking, parkNum, structureNum,roomNum} = isObject(quota) ? quota : {}
  
 const propsdata = {
    projectId,
    areaAnnualQuota,
    parkNum, 
    structureNum,
    roomNum
 }
 const rankprops = {
   parkAnnualQuota,
 
   quotaRemainRanking,
 }

 const onChange =(e) => {
    setParkAreaId(e)
 }

 const getParklist = async(params) => {
   try {
    let {success, data, errMsg} = await energyQuota.QueryParkList(params)
    if(success && Array.isArray(data) && data?.length >0) {
       setPark([{name: '全部园区', quotaAreaId: 0},...data])
    }else {
      if(!success) return message.warning(errMsg || '数据出错')
      if(data?.length === 0 )return message.warning('没有设置园区')
        setPark([])  
        setParkAreaId(null)
    }
   } catch (error) {
    
   }
 }
 const queryParkQuota = async() => {
  try {
    let {success, data} = await energyQuota.QueryParkQuota({projectId: 1, parkAreaId:0})
    if(success && isObject(data)) {
       setQuota(data)
    }else {
      setQuota({})
    }

  } catch (error) {
    
  }
 }
 useEffect(() => {
    if([projectId, parkAreaId].every(n => Number.isInteger(parseInt(n)))) {
      queryParkQuota({projectId, parkAreaId})
    }
 }, [projectId, parkAreaId])
 
useEffect(() => {
  getParklist({projectId, parkAreaId:0})
}, [])

 
  return (
    <Pagecount pd="0">
      <Mainbox>
        <div className='area'>
           <Select options={park} value={parkAreaId} onChange={onChange} style={{width: '200px'}} fieldNames={{label: 'name', value: 'quotaAreaId'}}></Select>
        </div>
        <div className='content'>
        <Areaimg {...propsdata}  />
       <div className='right'>
          <Rank  {...rankprops} />
       </div>
       </div>
      </Mainbox>
    </Pagecount>
  )
}
