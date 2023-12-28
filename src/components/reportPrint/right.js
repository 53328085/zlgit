import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form,  DatePicker,   Descriptions, Divider,   Radio, message } from 'antd'
 
 import {useReactToPrint} from 'react-to-print'

 
 import {exportPDF} from './topdf'
import Titlelayout from '@com/titlelayout'
import {useSelector} from 'react-redux'
import { systemConfigInfo} from '@redux/systemconfig.js'
 
 import log from './log.png'
 import bg from './bg.png'

const Mainbox = styled.div`
    && {
        background-color: #f2f2f2;
        padding: 16px 32px;
        border: 1px solid #ccc;
        height: 840px;
        overflow-y: auto;
        display: grid;
        grid-auto-rows: 806px;
        row-gap: 32px;
        .front {
          background-color: #fff;
          page-break-after: always;
          height: 806px;
          display: flex;
          flex-direction: column;
          position: relative;
          .frontcont {
            display: flex;
             flex: 1; 
             align-content: center;
             justify-content: center;
             .head {
              width: 432px;
              display: flex;
              flex-direction: column;
              justify-self: center;
              align-self: center;
              h1 {
                color: #ccc;
                font-size: 32px;
                text-align: center;
                margin-bottom: 32px;
              }
              .box {
                width: 432px;
                height: 136px;                
                background-color: rgba(242, 242, 242, 1);                
                border: 1px solid rgba(204, 204, 204, 1);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 16px;
                p {
                  color: #515151;
                  font-size: 18px;
                }
              }
            }
          }
          .title{ 
            display: flex;
            align-items: center; 
            padding: 16px;
            span {
              color: #999;
              font-size: 16px;
              padding-left: 16px;
            }
           
          }

        }
      
       }
`
 

 
export default  function Rightlayout(props) {

  const {reportData, reportName} = props
  const {chineseTitle} = useSelector(systemConfigInfo)
 



const printRef = useRef()
const reactToPrintContent = useCallback(() => {
  return printRef.current;
}, [printRef.current])



  return (
          <div className='right printContet' ref={printRef} id="printRef">                         
               <div className='front'>
                   <div className='title'>
                    <Image src={log} height={57} preview={false}></Image>
                    <span className='name' style={{fontSize: '20px', color:"#666"}}>{chineseTitle}</span>
                   </div>
                   <div className="frontcont">
                   <div className='head'>
                      <h1 style={{fontSize: "32px", color:"#515151"}}>{reportName}</h1>
                      <div className='box'>
                          <p>项目名称：{reportData.projectName}</p>
                          <p>项目地址：{reportData.projectAddress}</p>
                          <p>报告日期：{reportData.reportDate}</p>
                      </div>
                   </div>
                   </div>
                   <Image src={bg} preview={false} ></Image>
               </div>
               
          </div>
  )
}

 