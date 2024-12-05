import React, { useRef, useEffect, useContext } from 'react'
 
import styled, {css} from 'styled-components';
import Titlelayout from '@com/titlelayout';
import {CustTransO} from "@com/useButton"
import Context from "@com/content"

import gatewayRuntime from '../cdcw.svg'
import { layout } from '@topology/layout';
const sty = css`
 margin-top: 16px;
 flex: 1;
 .totalCount{
  flex: auto;
    justify-content: space-evenly;
  .count_title{
        line-height: 14px;
    }
  .count_val{
        font-size: 16px;
        line-height: 16px;
        color: #515151;
    }
 }
 .details{
  width: auto;
   flex: auto;
   padding: 8px;
 }
`
const Divorder = styled.div`
  display: flex;
//  align-items: center;
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
  ${props => props.laptop ? sty : null}
`

const fs = {
  hv: '24px',
  fc: '#333',
  shadow: "y",
  layout: 'flex'
}

export default function DefaultHome(props) {
  let {state={}, type} = props
  const {laptop} =useContext(Context)
  console.log("laptop", laptop)
  if(!type) {
    state = {}
  }
 
  return (
    <Titlelayout title={<CustTransO text="ContactTemperatureMeasurement" />} {...fs} style={{height: "200px"}}>
      <Divorder laptop={laptop}>
     { laptop ? null : <img src={ gatewayRuntime } className='card_icon'></img>}
        <div className='totalCount'>
            <span className='count_title'><CustTransO text="CTtotal" /></span>
            <span className='count_val'>{ state.cdcwCount }</span>
        </div>
        <div className='details'>
            <div className='detail_item'>
                <span className='item_title'><CustTransO text="CTon" /></span>
                <span className='item_value' style={{ color: '#096' }}>{ state.cdcwOnlineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'><CustTransO text="CToff" /></span>
                <span className='item_value' style={{ color: '#f44336' }}>{ state.cdcwOfflineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'><CustTransO text="CTrate" /></span>
                <span className='item_value'>{ state.cdcwOnlineRate}%</span>
            </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
