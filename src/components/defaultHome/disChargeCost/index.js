import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import imgUrl from '@imgs'

const Mainbox = styled.div`
  width: 222px;
  min-height: 200px;
  //padding: 16px;
  background-color: #ff6642;
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
  .headerTitle{
    padding-left: 28px;
  //  border-left: 4px solid #fff;
    height: 24px;
    line-height: 24px;
    font-size: 15px;
    color: #fff;
    display: flex;
    align-items: center;
  }
  .headerTitle:before{
       content: "";
       display: block;
       position: absolute;
       left: 16px;
      // top:13.5px;
       width: 3px;
       height: 13px;
       background-color: #fff;
    }
  .mainData{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    .centerImg{
        width: 72px;
        height: 72px;
       
    }
    .data{
        font-size: 32px;
        color: #fff;
        font-weight: 700;
    }
  }

`


const fs = {
 // hv: '24px',
  fc: '#333'
}

export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  
  
  return (
         <Mainbox>
            <div className='headerTitle'>总放电金额(元)</div>
            <div className='mainData'>
                <img src={imgUrl.totalDischargeCost} className='centerImg'></img>
                <span className='data'>187.36</span>
            </div>
         </Mainbox>
           
  )
}
