import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import imgUrl from '@imgs'

const Mainbox = styled.div`
  width: 222px;
  height: 200px;
  padding: 16px;
  background-color: #9951fe;
  border-radius: 4px;
  .headerTitle{
    padding-left: 16px;
    border-left: 4px solid #fff;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
  }
  .mainData{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .centerImg{
        width: 72px;
        height: 72px;
        margin-top: 16px;
    }
    .data{
        font-size: 32px;
        color: #fff;
        font-weight: 700;
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
         <Mainbox>
            <div className='headerTitle'>储能日收益(元)</div>
            <div className='mainData'>
                <img src={imgUrl.dayIncome} className='centerImg'></img>
                <span className='data'>70.50</span>
            </div>
         </Mainbox>
           
  )
}
