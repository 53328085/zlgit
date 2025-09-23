import React, { useRef, useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { selectProjectId, iszhCN } from '@redux/systemconfig.js'
import styled, {css} from 'styled-components';
import {TitlelayoutOv as Titlelayout} from '@com/titlelayout';
 import {useTranslation} from 'react-i18next';

import transformerNum from '../transformerNum.svg'
import { HomeRuntime } from '@api/api.js'
import Context from "@com/content"

const sty = css`
 //margin-top: 16px;
 flex: 1;
 .details{
  flex: auto;
  .detail_item {
      flex: 1;
       font-size: 14px;
       span:nth-child(2) {
         font-size: 20px;
       }
       span:last-child {
         font-size: 16px;
       }
     }
 }
`
const Divorder = styled.div`
  display: flex;
  align-items: center;
 // margin-top: 30px;
  justify-content: space-around;
  .card_icon{
   // margin-left: 25px;
    width: 64px;
    height: 64px;
  //  margin-right: 16px;
  }
  
  .details{
     display: flex;
     flex-direction: column;
     width: 200px;
     .detail_item {
       display: flex;
       justify-content: space-between;
       align-items: center;
       color:#515151;
       font-size: 16px;
       span:nth-child(2) {
         font-size: 28px;
       }
       span:last-child {
         font-size: 20px;
       }
     }
  }
  ${props => props.laptop ? sty : null}
`

const fs = {
 // hv: '24px',
  fc: '#333',
  shadow: "y",
  layout: 'flex'
}

export default function DefaultHome(props) {
   const [count, setCount] = useState({
    roomCnt: 0,
    transformerCnt:0,
   })
   const {t} = useTranslation(["overview", "comm"])
   const projectId = useSelector(selectProjectId)
   const iscn = useSelector(iszhCN)
   const {laptop} =useContext(Context)
   const getData = async () => {
      try {
       let {success, data} = await HomeRuntime.RoomInfo(projectId)
       if(success && data) {
          setCount({...count, ...data})
       }

      } catch (error) {
        
      }
  
   } 

   useEffect(() => {
    getData()
   }, [projectId])
  return (
    <Titlelayout title={t("overview:Numberoftransformers")} {...fs} style={{minHeight: '200px'}}>
      <Divorder laptop={laptop}>
      {laptop ? null : <img src={ transformerNum } className='card_icon'></img>}  
        
        <div className='details'>
            <div className='detail_item'>
                <span >{t("comm:distributionroom", {count: count.roomCnt})}</span>
                <span>{count.roomCnt}</span>
               {iscn && <span>个</span> }
            </div>
            <div className='detail_item'>
                <span>{t("comm:transformer", {count: count.transformerCnt})}</span>
                <span>{count.transformerCnt}</span>
               { iscn && <span>台</span>  }
            </div>
        </div>
      </Divorder>
    </Titlelayout>
  )
}
