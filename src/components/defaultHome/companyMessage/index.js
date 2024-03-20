import React, { useState,useEffect } from 'react'
 
import styled from 'styled-components';
import companyImg from './company.png'
import Titlelayout from '@com/titlelayout' 
import { Borderleft} from "@com/comstyled"
 
 
const MainBox = styled.div`
//width: 450px;
//height: 200px;
//background-color: #fff;
//border-radius: 4px;
//padding: 16px;
display: grid;
grid-template-columns: min-content 1fr;
gap: 8px;
align-items: stretch;
 flex: 1;
//box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
.company{
  width: 188px;
  height: 100%;
   
  .dataItem{
    display: flex;
    align-items: center;
    height: 24px;
    margin-top: 6px;
    font-size: 13px;
    color: #666;
    &:nth-child(5){
      align-items: flex-start;
      margin-top: 11px;
    }
    .square{
      width: 8px;
      height: 8px;
      margin-right: 16px;
    }
    .items{
      //width: 150px;
      line-height: 16px;
    }
  }
  
}
.img {
    height: inherit;
  }
`

export default function DefaultHome(props) {
   let {currproject, type} = props
   const [state, setState] =useState({
    projectName: '项目名称',
    deviceNum: 0,
    gatewayNum: 0,
    projectManager: '项目管理员名称',
    mobile: '手机号码',
    address: '项目地址',
    projectImage:'',
   }
  )
 
  useEffect(() => {
    if(type) {
      setState({
        ...state,
        ...currproject
      })
    }
}, [currproject, type])
 
  return (
    <Titlelayout layout="flex" shadow="y" style={{height: "200px"}}>
    <MainBox>
      <div className='company'>
        <Borderleft>{state.projectName}</Borderleft>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#237ae4' }}></div>
          <div className='items'>测点数量： {state.deviceNum}</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#237ae4' }}></div>
          <div className='items'>网关数量： {state.gatewayNum}</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#008000' }}></div>
          <div className='items'>{state.projectManager} / {state.mobile}</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#333' }}></div>
          <div className='items'>{state.address}</div>
        </div>
      </div>
      <img src={ state.projectImage ? state.projectImage : companyImg}  className='img'></img>
    </MainBox>
    </Titlelayout>

  )
}
