import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';

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
  fc: '#333'
}

export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)

  
  return (
         <Titlelayout title={'工单信息'} {...fs}>
            <Divorder>
               <div className='order'>
                  <p>本月工单数</p>
                  <p>100</p>
               </div>
               <div className='list'>
                   <div>
                      <span>未分派</span>
                      <span>30</span>
                      <span>30.0%</span>
                    </div>  
                    <div>
                      <span>已分派</span>
                      <span>12</span>
                      <span>12.0%</span>
                    </div> 
                    <div>
                      <span>已处理</span>
                      <span>58</span>
                      <span>28.0%</span>
                    </div> 
               </div>
               </Divorder>
         </Titlelayout> 
  )
}
