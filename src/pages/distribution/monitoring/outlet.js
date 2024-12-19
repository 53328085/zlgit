import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Descriptions} from 'antd'
import {DistributionRoomRuntime} from '@api/api.js'
import transform from '@imgs/transform.png'
import UseTable from '@com/useTable'
import { isObject } from '@com/usehandler'
import {columns} from './columns.jsx'
const Box = styled.div`
  display: flex;
  column-gap: 16px;
  height: 126px;
  .card {
    width:234px;
    display: flex;
  
    justify-content: space-between;
    padding: 16px 16px 20px 4px;
    border: 1px solid #c9c9c9;
    background-color: #f6f6f6;
    color:#333;
    .tag {
      background-color: #093;
      color: #fff;
      margin-top: auto;
      padding: 2px;
    }
    .info {
      display: flex;
      flex-direction: column;
    }
  }
`
 
 
export default function Index({device, projectId}) {
 
  const [point, setPoint] = useState({})
  const [runstate, setRunstate] = useState()
  const stateText = Number.isInteger(parseInt(runstate)) ?  {2: '最佳经济运行状态'}[runstate] : ''
  const runtimePoints = async () => {
    try {
      let {sn} = device 
      if(!sn) return
      let params ={
         projectId,
         sn
      }
      
      let {success, data} = await   DistributionRoomRuntime.RuntimePointsH(params)
      if(success && isObject(data)) {
        let {state} = data
        setRunstate(state)
        if(Array.isArray(data.data)) {
          let obj = {}
          data.data.forEach(d => {
            obj[d.name] =d
          })
          setPoint(obj)
        }else {
          setPoint({})
        }
      
      }else {
        setRunstate(null)
        setPoint({})
      }
    } catch (error) {
      
    }
 }
 useEffect(() => {
   
   if(device&& Number.isInteger(parseInt(projectId))) {
    runtimePoints()
   }
 }, [device, projectId])
 
  return (
    <Box>
       <div className='card'>
          <img src={transform} />
          <div className='info'>
            <span>{device?.label}</span>
            <span>{device?.sn}</span>
            <div className='tag'>{stateText}</div>
          </div>
       </div>
       <UseTable  
              hbg="#ecf5ff"
             hbc="#515151"
            columns={columns}  
            bordered  
            dataSource={[]}
            ></UseTable>
    </Box>
  )
}
