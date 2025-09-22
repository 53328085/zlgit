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
  width: 222px;
  min-height: 200px;
 // padding: 16px;
  background-color: #9951fe;
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.349019607843137);
  .headerTitle{
    padding-left: 24px;
    border-left: 4px solid #fff;
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
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .centerImg{
        width: 72px;
        height: 72px;
       // margin-top: 16px;
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

  const { GetDayUnChargeIncome } = HomeRuntime

  const state = useReactive({
    dayIncome: 79
  })
  
  useEffect(() => {
    if (props.type == 'runtTime') {
      GetDayUnChargeIncome(projectId).then(res => {
        let {success, data} = res
          if(success){
            if(!isNaN(data)){
              state.dayIncome = data
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
            <div className='headerTitle'><CustTransO text="EnergyStorageDailyRevenue" /></div> {/* 中文为元 */}
            <div className='mainData'>
                <img src={imgUrl.dayIncome} className='centerImg'></img>
                <span className='data'>{state.dayIncome}</span>
            </div>
         </Mainbox>
           
  )
}
