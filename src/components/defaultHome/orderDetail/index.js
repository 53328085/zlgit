import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';

const Divorder = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 16px;
  grid-template-rows: 126px;
  padding-top: 16px;
  .order {
   text-align: center; 
   p:last-of-type {     
      font-size: 32px;
      color:#515151;
      line-height: 80px;
   }

 }
 .list {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  align-items: flex-start;
  div {
    display: flex;
    justify-content: space-between;
    &:first-of-type span:first-child{
       color: #ff3333;
    }
    &:nth-of-type(2) span:first-child{
       color: #ff6600;
    }
    &:last-of-type span:first-child{
       color: #009900;
    }
  }
 }
`

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

export default function DefaultHome(props) {
  const projectId = useSelector(selectProjectId)

  const { GetOrderInfo } = HomeRuntime

  const state = useReactive({
    orderCount: 100,
    unAssignNum: 30,
    unAssignRate: 30,
    assignNum: 12,
    assignRate: 12,
    finishNum: 58,
    finishRate: 58
  })

  useEffect(() => {
    if (props.type == 'runtTime') {
      GetOrderInfo(projectId).then(res => {
        let { success, data } = res
        if (success && data) {

          state.orderCount = data.orderCount
          state.unAssignNum = data.unAssign.orderNum
          state.unAssignRate = data.unAssign.rate
          state.assignNum = data.assign.orderNum
          state.assignRate = data.assign.rate
          state.finishNum = data.finish.orderNum
          state.finishRate = data.finish.rate

        } else {
          message.error(res.errMsg)
        }
      })
    } else if (props.type == 'configure') {
      return;
    }
  }, [])


  return (
    <Titlelayout title={'工单信息'} {...fs} style={{height: "200px"}}>
      <Divorder>
        <div className='order'>
          <p>本月工单数</p>
          <p>{state.orderCount}</p>
        </div>
        <div className='list'>
          <div>
            <span>未分派</span>
            <span>{state.unAssignNum}</span>
            <span>{state.unAssignRate + '%'}</span>
          </div>
          <div>
            <span>已分派</span>
            <span>{state.assignNum}</span>
            <span>{state.assignRate + '%'}</span>
          </div>
          <div>
            <span>已处理</span>
            <span>{state.finishNum}</span>
            <span>{state.finishRate + '%'}</span>
          </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
