import React, { useRef, useEffect, useState } from 'react'
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
    span:not(:first-of-type) {
      color: #515151;
      font-size: 20px;
     // font-weight: bold;
    }
  }
 }
`

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

const rate = (all,p) => {
     if(all == 0) return "0%"
   return  (p/all).toFixed(3)*100 + "%"
}
export default function DefaultHome(props) {
  const projectId = useSelector(selectProjectId)

  const { InspectionStatistics } = HomeRuntime

  const [idata, setData] = useState({
    all: 0,
    finish: 0,
    process: 0,
    wait: 0,
  })
  useEffect(() => {
    if (props.type == 'runtTime') {
      InspectionStatistics(projectId).then(res => {
        let { success, data } = res
        if (success && data) {
            setData({
               ...idata,
               ...data,
            })
        

        } else {
          message.error(res.errMsg)
        }
      }).catch()
    } else if (props.type == 'configure') {
      return;
    }
  }, [projectId])


  return (
    <Titlelayout title="本月巡检" {...fs} style={{height: '200px'}}>
      <Divorder>
        <div className='order'>
          <p>{idata.all}</p>
        </div>
        <div className='list'>
          <div>
            <span>未分派</span>
            <span>{idata.wait}</span>
            <span>{rate(idata.all, idata.wait)}</span>
          </div>
          <div>
            <span>已分派</span>
            <span>{idata.process}</span>
            <span>{rate(idata.all, idata.process)}</span>
          </div>
          <div>
            <span>已处理</span>
            <span>{idata.finish}</span>
            <span>{rate(idata.all, idata.finish)}</span>
          </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
