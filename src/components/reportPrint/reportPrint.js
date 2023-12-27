import React, {forwardRef, memo} from 'react'
import {Image} from 'antd'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import { systemConfigInfo} from '@redux/systemconfig.js'
import bg from './bg.png'
import log from './log.png'
import moment from 'moment'


const Front = styled.div`
   &&{
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
                min-height: 136px;                
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
`



 const Bgcom = memo(() => {
    return  (<Image src={bg} preview={false} ></Image>)
 })

const  Logcom = memo(() => {
    return ( <Image src={log} height={57} preview={false}></Image>)
})
export default forwardRef(function Index(props, ref) {
  const {reportData={},reportName, cycle} = props
  const {chineseTitle} = useSelector(systemConfigInfo)
  const reportCrycle = [null, moment().format("yyyy-MM"), moment().format("yyyy")][cycle] +["","月","年"][cycle]    //报告分析周期 1月度2年度
  return (
    <div className='right printContet' ref={printRef} id="printRef">
                         
    <Front>
        <div className='title'>
         <Bgcom />
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
        
    </Front>
   
    {
    loading && <>
     <div className="page-break" />
    <Ccontent count={2}>
      <div className='header'>
        <span>{chineseTitle}</span>
        <span>本期报告分析周期为： {moment().format('YYYY-MM')}月</span> {/* 年，月 */}
      </div>
      <div className='main'>
       
      </div>
       
    </Ccontent>
    <div className="page-break" />
    <Ccontent count={1}>
      <div className='header'>
        <span>{chineseTitle}</span>
        <span>本期报告分析周期为： {reportCrycle}</span>
      </div>
      <div className='main'>
        <DesItem title="3. 充放电趋势" bordered size='small' layout='vertical'>
           <DesItem.Item label="放电电量">{reportData.totalUncharge}</DesItem.Item>
           <DesItem.Item label="充电电量">{reportData.totalCharge}</DesItem.Item>
        </DesItem>
        <div ref={eref} ></div>
      </div>
       
    </Ccontent>
    <div className="page-break" />
    <Ccontent rows='1fr 1fr'>
      <div className='header'>
        <span>储能系统分析报告</span>
        <span>本期报告分析周期为： {reportCrycle}</span>
      </div>
      <div className='main'>                   
        <div ref={bref} >
           
        </div>
        <div ref={aref}></div>
     
      </div>
       
    </Ccontent>
    <div className="page-break" />
    
    </>
    }
</div>
  )
})
