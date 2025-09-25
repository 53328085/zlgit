import React, {useRef, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import styled from 'styled-components';
import imgUrl from '@imgs'
import { useReactive } from 'ahooks';
import { HomeRuntime } from '@api/api.js'
import { message } from 'antd';
import {CustTransO} from "@com/useButton"
const Mainbox = styled.div`
   min-width: 222px;
   width: 100%;
  min-height: 200px;
  height: 100%;
  background-color: rgba(254, 165, 38, 1);
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
  display: flex;
  flex-direction: column;
  .headerTitle{
    padding-left: 24px; 
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
     //  top:13.5px;
       width: 3px;
       height: 13px;
       background-color: #fff;
    }
  .mainData{
    flex:1;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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

export default function DefaultHome(props){
  const projectId = useSelector(selectProjectId)

  const { GetChargeFee } = HomeRuntime

  const state = useReactive({
    chargeCost: 2917.36
  })
  
  useEffect(() => {
    if (props.type == 'runtTime') {
      GetChargeFee(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(!isNaN(data)){
              state.chargeCost = data
            }
          }else{
            message.error(res.errMsg)
          }
      })
    } else if (props.type == 'configure') {
      return;
    }
  }, [])
  
  
  return (
         <Mainbox>
            <div className='headerTitle'><CustTransO text="TotalChargeAmount" /></div> {/* 货币单位中文是元，英文？ */}
            <div className='mainData'>
                <img src={imgUrl.totalChargeCost} className='centerImg'></img>
                <span className='data'>{state.chargeCost}</span>
            </div>
         </Mainbox>
           
  )
}
