import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Liquid} from "@ant-design/charts"
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';

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


const fs = {
  hv: '24px',
  fc: '#333'
}
const DemoLiquid = () => {
  const config = {
    percent: 0.4,
    outline: {
      border: 2,
      distance: 2,
    },
    wave: {
      length: 128,
    },
  
      statistic: {
        title: {
          formatter: () => '今日告警',
          style: {
            fontSize: 14,
            color: '#333',
            
          }
        },
        
        content: {
          style: {
            fontSize: 14,
            color: '#fff'
          },
          customHtml: () => {
            return <span>31次</span>
          }
        }
      }
   
  };
  return <Liquid {...config} />;
};

export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  
  
  return (
         <Titlelayout title={'今日告警'} {...fs}>
        <Mainbox>
          <div style={{width: '112px', height: '112px'}}>
              <DemoLiquid></DemoLiquid>
              
          </div>
          <div className='alarm'>
             <div>
                 <span>未确认 10%</span>
                 <span>3 条</span>
             </div>
             <div>
                 <span>已确认 90%</span>
                 <span>27 条</span>
             </div>
          </div>
        </Mainbox>
         </Titlelayout>
           
  )
}
