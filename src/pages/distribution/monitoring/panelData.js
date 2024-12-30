import React, {useEffect, useState} from 'react'
import styled, {keyframes} from 'styled-components'
import {Image, Typography} from 'antd'
import {DistributionRoomRuntime} from '@api/api.js'
import transform from '@imgs/transform.png'

import { isObject } from '@com/usehandler'
import zlp from './zlp.png'
import zlpbg from './zlpbg.png'
import nbg from './nbg.png'
const {Text} = Typography
const flicker = keyframes`
  from  {
    background-color: #f30;
  }
  to {
    background-color: #900;
  }
`
const Box = styled.div`
  display: flex;
  column-gap: 16px;
  height: 258px; 
  .card {
    height:258px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    flex-direction: column;
    .title {
      height: 25px;
      background-color: ${props => props.theme.primaryColor};
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .content {
       padding: 16px;
       flex: 1;
    }
    
  }
  .card.name {
     width: 234px;
  }
  .card.state {
    width: 555px;
    .content {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      row-gap: 22px;
      column-gap: 16px;
      overflow-y: auto;
      .item {
       width: 116px;
       height: 32px;
    
       background-color: #393;
       display: flex;
       align-items: center;
       justify-content: center;
       .ant-typography{
        color: rgba(0, 255,153, 0.8);
       }
      
    }
    .flicker {
        width: 116px;
        height: 32px;
        display: flex;
       align-items: center;
       justify-content: center;
        animation: ${flicker} 1s linear infinite;
        .ant-typography{
          color: #fff;
        }
      }
    }
   
  }
  .card.mock {
    width: 833px;
    background-image: url(${zlpbg});
    background-position: 0 0;
    background-size: 100% 100%;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 22px 50px;
      color: #fff;
      .item {
        display: flex;
        justify-content: space-between;
        .numwrap {
        display: flex;
        align-items: center;
        column-gap: 8px;
        .num {
         min-width: 96px;
          height: 25px;
          background-image: url(${nbg});
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f0
        }
      }
      }
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
 let texts=["系统故障","交流缺相","合母电压过高","充电方式 浮充", '交流欠压',"控母电压过低"]
 useEffect(() => {
   
   if(device&& Number.isInteger(parseInt(projectId))) {
    runtimePoints()
   }
 }, [device, projectId])
 /* 1 离线  /// 2 在线  /// 3 告警 */
  return (
    <Box>
       <div className='card name'>
           <div className='title'>直流屏名称</div>
           <div className='content'>
            <Image src={zlp} />
           </div>
           
       </div>
       <div className='card state'>
           <div className='title'>开关量状态</div>
           <div className='content'>
             {
              texts.map((t,index) => (<div className='item' key={index}>
                <Text>{t}</Text>
              </div>))
             } 
             <div className='flicker'>
              <Text>拉姆电压过高</Text>
             </div>
           </div>
           
       </div>
       <div className="card mock">
                <div className="title">模拟量参数</div>
                <div className="content">
                  <div className='item'><span>交流输入一</span>
                    <div className='numwrap'> <span>控母电压</span><div className='num'>405.21  V</div></div>
                  </div>
                  <div className='item'> <div className='numwrap'><span>充电电压</span><div className='num'>40.21  A</div></div>
                  <div className='numwrap'> <span>控母电流</span><div className='num'>40.21  V</div></div>
                  </div>
                  <div className='item'><span>交流输入一</span>
                  <div className='numwrap'> <span>合母电压</span><div className='num'>402.21  V</div></div>
                  </div>
                </div>
       </div>
    </Box>
  )
}
