import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import styled from 'styled-components';
import companyImg from './company.png'

const MainBox = styled.div`
width: 460px;
height: 200px;
background-color: #fff;
border-radius: 4px;
padding: 16px;
display: flex;
align-items: center;
.company{
  width: 188px;
  height: 100%;
  .headerTitle{
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 16px;
    border-left: 4px solid #237ae4;
  }
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
      width: 143px;
      line-height: 16px;
    }
  }
}
`


export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  
  return (
    <MainBox>
      <div className='company'>
        <div className='headerTitle'>诚办企业服务有限公司</div>
        <div className='dataItem'>
          <div className='square' style={{backgroundColor:'#237ae4'}}></div>
          <div className='items'>测点数量： 2563</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{backgroundColor:'#237ae4'}}></div>
          <div className='items'>网关数量： 2563</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{backgroundColor:'#008000'}}></div>
          <div className='items'>张三 / 13588566548</div>
        </div>
        <div className='dataItem'>
          <div className='square' style={{backgroundColor:'#333'}}></div>
          <div className='items'>浙江省杭州市滨江区月明路560号</div>
        </div>
      </div>
      <img src={companyImg} style={{width: 240, height: 168 }}></img>
    </MainBox>

    
  )
}
