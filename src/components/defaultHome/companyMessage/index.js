import React, {useRef, useEffect} from 'react'
import {Image, Timeline} from 'antd'
import {useSelector} from 'react-redux'
import {Liquid} from "@ant-design/charts"
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import {ExclamationCircleFilled} from '@ant-design/icons'
import Titlelayout from '@com/titlelayout';
import {drawEcharts} from '@com/useEcharts'
import company from './company.png'

const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 248px;
 column-gap: 16px;
 height: 142px;
 align-items: stretch;
 justify-items: center;
 .alarm {
   display: grid;
   grid-template-rows: repeat(2, 52px);
   row-gap: 16px;
   div {
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
     &:first-of-type {
      border-left: 2px solid #f8857d;
     }
     &:last-of-type {
      border-left: 2px solid #5d9fff;
     }
   }
 }
 
 .list {
   display: grid;
   grid-template-rows: repeat(4, 26px);
   color: #666;  
   align-items: center;
   row-gap: 8px;   
   padding: 0;
   span {
    line-height: 22px;
    b{
      font-size: 8px;
      padding-right: 1em;
    }
    &:first-child b{
     color: #237Ae4
    }
    &:nth-of-type(2) b {
      color: #325dca
    }
    &:nth-of-type(3) b {
      color: #008000;
    }
    &:last-child {
      
      b {
        color:#333;
      }
    }
   }
 }
`

const Imgbox = styled(Image)`
  position: absolute;
  top: -24px;
`
const fs = {
  hv: '24px',
  fc: '#333'
}

export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  
  return (
   
         <Titlelayout title={'公司信息'}  {...fs}>
          <Mainbox>
              <div className='list'>
                  <span><b>■</b>测点数量：2563</span> 
                  <span><b>■</b>网关数量：2563</span> 
                  <span><b>■</b>张某/135897754</span> 
                  <span><b>■</b>浙江省杭州市滨江区月明路560号 </span> 
              </div>
              <Imgbox src={company} preview={false} width={248} height={168}   />
          </Mainbox>
          </Titlelayout>
    
  )
}
