import React, {useContext} from 'react'

import styled, {css} from 'styled-components';
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';

import {useTranslation} from "react-i18next"
import gatewayRuntime from '../sensor.svg'
import Context from "@com/content"
import { head } from 'lodash';
const sty = css`
 //margin-top: 16px;
 flex: 1;
 align-items: stretch;
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
  align-items: center;
  height: 100%;
  justify-content: space-around;
 // margin-top: 30px;
  .card_icon{
   // margin-left: 25px;
    width: 64px;
    height: 64px;
   // margin-right: 16px;
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
  //  margin-left: 14px;
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
 // hv: '24px',
  fc: '#333',
  shadow: "y"
}

export default function DefaultHome(props) {
  const {laptop} =useContext(Context)
  const {t} = useTranslation("overview")
  let {state={}, type} = props
  if(type !=="runtTime") {
    state={}
  }

  return (
    <Titlelayout title={t("SensorInformation")} {...fs} style={{minHeight: "200px", height: "100%"}}>
      <Divorder laptop={laptop}>
       {laptop ? null : <img src={ gatewayRuntime } className='card_icon'></img>} 
        <div className='totalCount'>
            <span className='count_title'>{t("total")}</span>
            <span className='count_val'>{ state.sensorCount }</span>
        </div>
        <div className='details'>
            <div className='detail_item'>
                <span className='item_title'>{t("online")}</span>
                <span className='item_value' style={{ color: '#096' }}>{ state.sensorOnlineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'>{t("offline")}</span>
                <span className='item_value' style={{ color: '#f44336' }}>{ state.sensorOfflineCount }</span>
            </div>
            <div className='detail_item'>
                <span className='item_title'>{t("rate")}</span>
                <span className='item_value'>{state.sensorOnlineRate}%</span>
            </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
