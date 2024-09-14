import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Descriptions} from 'antd'
import {DistributionRoomRuntime} from '@api/api.js'
import transform from '@imgs/transform.png'

import { isObject } from '@com/usehandler'

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
const CustomTable =styled.div`
  display:grid;
  grid-template-rows:repeat(${props=>props.rows}, ${props => props.rows>2 ? '1fr' : '32px'});
  grid-template-columns:repeat(${props=>props.cols/2},101px 121px);
  .item1{
    grid-column:1/${props=>props.cols+1};
    background:#237ae4;
    color:#fff;
    text-align:center;
  }
  div{
    display: flex;
    align-items: center;
    justify-content: center;
    border:1px solid #e4e4e4;
    margin-right:-1px;
    margin-bottom:-1px;
    text-align:center
  }
  div:nth-child(2n){
    background:#ecf5ff;
    /* margin-left:-1px; */
    //width
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
 /* 1 离线  /// 2 在线  /// 3 告警 */
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
       <CustomTable rows={4} cols={2}>
              <div className="item1">负荷状态</div>
              <div>{point['Load']?.description}</div>
              <div>{point['Load']?.display}</div>
              <div>{point['TotW']?.description}</div>
              <div>{point['TotW']?.display}</div>
              <div>{point['TotVar']?.description}</div>
              <div>{point['TotVar']?.display}</div>
            </CustomTable>
 
            <CustomTable rows={4} cols={2}>
              <div className="item1">功率状态</div>
              <div>{point['TotVA']?.description}</div>
              <div>{point['TotVA']?.display}</div>
              <div>{point['TotPF']?.description}</div>
              <div>{point['TotPF']?.display}</div>
              <div>{point['SupWh']?.description}</div>
              <div>{point['SupWh']?.display}</div>
            {/*   <div>{point['Load']?.description}</div>
              <div>{point['Load']?.display}</div>
              <div>{point['TotW']?.description}</div>
              <div>{point['TotW']?.display}</div>
              <div>{point['TotVar']?.description}</div>
              <div>{point['TotVar']?.display}</div> */}
            </CustomTable>
            <CustomTable rows={4} cols={4}>
              <div className="item1">电流/电压状态</div>
              <div>{point['Ia']?.description}</div>
              <div>{point['Ia']?.display}</div>
              <div>{point['Ua']?.description}</div>
              <div>{point['Ua']?.display}</div>
              <div>{point['Ib']?.description}</div>
              <div>{point['Ib']?.display}</div>             
              <div>{point['Ub']?.description}</div>
              <div>{point['Ub']?.display}</div>
              <div>{point['Ic']?.description}</div>
              <div>{point['Ic']?.display}</div>
              <div>{point['Uc']?.description}</div>
              <div>{point['Uc']?.display}</div>
            </CustomTable>
            <CustomTable rows={2} cols={2}>
              <div className="item1">风机状态</div>
              <div>状态</div>
              <div>{point['Fan']?.display}</div>
            </CustomTable>
    </Box>
  )
}
