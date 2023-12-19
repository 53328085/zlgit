import React, { useRef, useEffect } from 'react'
 
import styled from 'styled-components';
import Titlelayout from '@com/titlelayout';
 
 

import gatewayRuntime from '../cdcw.svg'

const Divorder = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
  .card_icon{
    margin-left: 25px;
    width: 64px;
    height: 64px;
    margin-right: 16px;
  }
  .totalCount{
    display: flex;
    flex-direction: column;
    .count_title{
        font-size: 14px;
        color: #303133;
        line-height: 24px;
    }
    .count_val{
        font-size: 24px;
        line-height: 32px;
        color: #515151;
    }
  }
  .details{
    margin-left: 10px;
    border: 1px solid #e4e4e4;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.647058823529412);
    width: 224px;
    height: 112px;
    padding: 10px 32px 10px 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .detail_item{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
  }
  
`

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y"
}

export default function DefaultHome(props) {
  let {state={}} = props


  return (
    <Titlelayout title={'触点测温信息'} {...fs} style={{height: "200px"}}>
      <Divorder>
        <img src={ gatewayRuntime } className='card_icon'></img>
        <div className='totalCount'>
            <span className='count_title'>触点测温总数</span>
            <span className='count_val'>{ state.cdcwCount }</span>
        </div>
        <div className='details'>
            <div className='detail_item'>
                <span className='item_title'>触点测温在线</span>
                <span className='item_value' style={{ color: '#096' }}>{ state.cdcwOnlineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'>触点测温离线</span>
                <span className='item_value' style={{ color: '#f44336' }}>{ state.cdcwOfflineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'>在线率</span>
                <span className='item_value'>{ state.cdcwOnlineRate + '%' }</span>
            </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
