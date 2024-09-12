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
  grid-template-rows:repeat(${props=>props.rows},1fr);
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
 
  const [data, setData] = useState({})
 
  const runtimePoints = async () => {
    try {
      let {sn} = device 
      if(!sn) return
      let params ={
         projectId,
         sn
      }
      console.log(params)
      let {success, data} = await   DistributionRoomRuntime.RuntimePointsH(params)
      if(success && isObject(data)) {
        setData(data)
      }else {
        setData({})
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
            <span>{data.sn}</span>
            <div className='tag'>最佳经济运行状态</div>
          </div>
       </div>
       <CustomTable rows={4} cols={2}>
              <div className="item1">负荷状态</div>
              <div>额定容量</div>
              <div></div>
              <div>视在功率</div>
              <div></div>
              <div>负载率</div>
              <div></div>
            </CustomTable>
 
            <CustomTable rows={4} cols={4}>
              <div className="item1">功率状态</div>
              <div>有功功率</div>
              <div></div>
              <div>功率因数</div>
              <div></div>
              <div>无功功率</div>
              <div></div>
              <div>视在功率</div>
              <div></div>
              <div>单月最大需量</div>
              <div></div>
              <div>发生时间</div>
              <div></div>
            </CustomTable>
            <CustomTable rows={4} cols={4}>
              <div className="item1">电流/电压状态</div>
              <div>A相电流</div>
              <div></div>
              <div>A相电压</div>
              <div></div>
              <div>B相电流</div>
              <div></div>
              <div>B相电压</div>
              <div></div>
              <div>C相电流</div>
              <div></div>
              <div>C相电压</div>
              <div></div>
            </CustomTable>
            <CustomTable rows={2} cols={2}>
              <div className="item1">风机状态</div>
              <div>状态</div>
              <div></div>
            </CustomTable>
    </Box>
  )
}
