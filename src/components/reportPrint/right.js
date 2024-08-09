import React, {forwardRef } from 'react'
import styled from 'styled-components'
import {Image} from 'antd'
 

import {useSelector} from 'react-redux'
import { systemConfigInfo, currProject} from '@redux/systemconfig.js'
import moment from 'moment'
 
 import log from './log.png'
 import bg from './bg.png'
// 2 在线， 3 告警， 其他：失联  //   a4纸大小210mm×297mm
const Mainbox = styled.div`
     @media  print {
          overflow: hidden;
          background-color: #fff;
          border: none;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
           width: 100%;
          padding: 0px;
          .frontp {
            width: 100%;
            height: 1123px;
           
            
          }
          .img {
            bottom: 0;
          }
    
        }
       
      
        background-color: #f2f2f2;
        padding: 16px 32px;
        border: 1px solid #ccc;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        row-gap: 32px;
        .front {
        
          background-color: #fff;
          page-break-after: always;
         
          min-height: 806px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
   
        
          .frontcont {
            display: flex;
             flex: 1; 
             align-content: center;
             justify-content: center;
             margin: 200px 0;
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
            padding: 32px;
            
           
          }
         .imgbox {
           background-color: var(--ant-primary-color);
         }
        }
`
 

 
export default  forwardRef(function Rightlayout(props, ref) { 
  const {reportName='', params} = props
  const {address, projectName, logoImage} = useSelector(currProject)  
  let reportDate = moment().format("yyyy-MM-DD")
  const {chineseTitle, systemLogoImage} = useSelector(systemConfigInfo)
  return (
          <Mainbox ref={ref} id="printRef">                         
               <div className='front'>
                   <div className='title'>
                    {logoImage ? <Image src={logoImage} preview={false}  /> : null}
                   {/*  <div className='imgbox'> <Image src={systemLogoImage ?  `data:image/png;base64,${systemLogoImage}` :log} height={57} preview={false}></Image></div> */}
                    <span className='name' style={{fontSize: '20px', color:"#666"}}>{chineseTitle}</span>
                   </div>
                   <div className="frontcont">
                   <div className='head'>
                      <h1 style={{fontSize: "32px", color:"#515151"}}>{reportName}</h1>
                      { params ? (<div className='box'>
                          <p>项目名称：{projectName}</p>
                          <p>项目地址：{address}</p>
                          <p>报告日期：{reportDate}</p>
                      </div>)
                      : (<div className='box'>
                        <p>项目名称：</p>
                        <p>项目地址：</p>
                        <p>报告日期：</p>
                       </div>)
                      }
                   </div>
                   </div>
                   <img src={bg}  /> 
               </div>
                
                  {props.children}
                 
          </Mainbox>
  )
})

 