import React, {forwardRef } from 'react'
import styled from 'styled-components'
import {Image} from 'antd'
 

import {useSelector} from 'react-redux'
import { systemConfigInfo, currProject} from '@redux/systemconfig.js'
import moment from 'moment'
 import up from './upbg.png'
 
 import down from './downbg.png'
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
          background-image: url(${up}), url(${down});
        background-position: 0 0, 0 642px;
         background-repeat: no-repeat, no-repeat;
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
                color: rgba(48, 49, 51, 1);
                font-size: 28px;
                text-align: center;
                margin-bottom: 47px;
              }
              .box {
                width: 483px;
                height: 142px;
             //   height: 136px;                
                background-color: rgba(30, 81, 231, 0.15);                
             //   border: 1px solid rgba(204, 204, 204, 1);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 24px 60px 28px;
                border-radius: 12px;
                p {
                  color: #303133;
                  font-size: 17px;
                  line-height: 1;
                }
              }
            }
          }
          .title{ 
            display: flex;
            align-items: center; 
            width: 134px;
            height: 64px;
            background-color: ${props=>props.theme.primaryColor};
            overflow: hidden;
            img {
              max-width: 100%;
            }
           // padding: 32px;
            
           
          }
          .foot {
             height: 60px;
             display: flex;
             align-items: center;
             justify-content: center;
             font-size: 16px;
             color:#303133;
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
                  {/*   <span className='name' style={{fontSize: '20px', color:"#666"}}>{chineseTitle}</span> */}
                   </div>
                   <div className="frontcont">
                   <div className='head'>
                      <h1>{reportName}</h1>
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
                  <div className="foot">
                  <span>{chineseTitle}</span>
                  </div>
               </div>
                
                  {props.children}
                 
          </Mainbox>
  )
})

 