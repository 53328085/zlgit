import React, { useState,useEffect, useContext } from 'react'
import Context from "@com/content"
import styled from 'styled-components';
import companyImg from '@imgs/projectimg.png'
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout' 
import { Borderleft} from "@com/comstyled"
import {CustTransO} from "@com/useButton"
 
const MainBox = styled.div`
//width: 450px;
//height: 200px;
//background-color: #fff;
//border-radius: 4px;
//padding: 16px;
display: grid;
grid-template-columns: ${props => props.laptop ? "1fr" : "min-content 1fr"} ;
gap: 8px;
align-items: stretch;
 flex: 1;
//box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
.company{
  min-width: 188px;
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
    width: 100%;
    height: 100%;
   //object-fit: cover;
  }
`

export default function DefaultHome(props) {
   let {currproject, type, Trans } = props
   const {laptop} =useContext(Context)
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
    <Titlelayout layout="flex"  style={{minHeight: "200px",height: "100%"}}>
    <MainBox laptop={laptop}>
      <div className='company'>
        <Borderleft>{state.projectName}</Borderleft>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#237ae4' }}></div>
          <div className='items'><CustTransO text="NumberOfMeasuringPoints" /> {state.deviceNum}</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{ backgroundColor: '#237ae4' }}></div>
          <div className='items'><CustTransO text="NumberOfGateways" /> {state.gatewayNum}</div>
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
      <div style={{overflow: 'hidden'}}>
      {laptop ? null : <img src={ state.projectImage ? state.projectImage : companyImg}  className='img' /> } 
      
      </div>
    </MainBox>
    </Titlelayout>

  )
}
