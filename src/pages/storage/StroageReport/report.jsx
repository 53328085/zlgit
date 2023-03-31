import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions, Divider, Tag, Radio } from 'antd'
 
import Titlelayout from '@com/titlelayout'
import {useSelector} from 'react-redux'
import {selectOneLevel, selectOneLevelDefaultId} from '@redux/systemconfig.js'
 import {CustButton} from '@com/useButton'
 import log from './log.png'
 import bg from './bg.png'
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
      padding-top: 16px;
       display: grid;
       grid-template-columns: 384px 678px;
       column-gap: 32px; 
       flex: 1;
       color:#515151;
       .left {
         padding: 32px;
         display: flex;
         flex-direction: column;
         background: #fff; 
         .content {
          padding: 32px 0;
          display: grid;
          row-gap: 32px;
          .ant-radio-group.ant-radio-group-solid {
            width: 100%;
            .ant-radio-group.ant-radio-group-solid {
              width: 50%;
            }
          }
         }
         .btns {
         
          display: grid; 
          row-gap: 16px;
          justify-items: center;
         }
       }
       .right {
        background-color: #f2f2f2;
        padding: 16px 32px;
        border: 1px solid #ccc;
        .front {
          background-color: #fff;
          padding: 8px;
          height: 806px;
          display: flex;
          flex-direction: column;
          position: relative;
          .title{
            position: absolute;
            left: 0;
            top:0;
            display: flex;
            align-items: center;
            height: 58px;
            span {
              color: #999;
              font-size: 16px;
              padding-left: 16px;
            }
           
          }
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
                  color: #ccc;
                  font-size: 18px;
                }
              }
            }
        }
       }
       .ant-form-inline.ant-form-item {
          margin-right: 0px
        } 
       }
`
 const RadioGroup = styled(Radio.Group)`
   && {
    width: 100%;
    .ant-radio-button-wrapper {
      width: 50%;
      text-align: center;
    }
   }
 `
 
 
 function Maincom({projectId,  Statistical, CModal}) {
   const {from} = Form.useForm()
   const [type, setType] = useState('month')
   const levelone = useSelector(selectOneLevel)
   const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)  
   const onChange = (e) => {
     console.log(e);
     setType(e.target.value)
   }
  return (
   
    <Mainbox>
         <div className='left'>
          <Titlelayout title='园区选择' bordered={'n'} style={{flex: 'auto'}} pv="0px">  
            <div className="content">
                    <Select options={levelone} defaultValue={oneLevelDefaultId}
                    fieldNames={{label: 'name', value: 'id', options: 'options'}}
                    style={{width: '320px'}}
                    ></Select> 
                     <Divider  style={{margin: '0px'}} />
                  </div>
                 
          </Titlelayout> 
          
           <Titlelayout title='运行报告' bordered={'n'} style={{flex: 'auto'}} pv="0px" > 
                 
            <div className="content">
              <RadioGroup  options={[{
                label: '月度报告',
                value: 'month'
              }, {
                label: '年度报告',
                value: 'year'
              }]} onChange={onChange} value={type}
              optionType="button"
              buttonStyle="solid"
              />
                   <DatePicker picker={type} />
                  <Divider   style={{  margin: '0px'}} />
                 
             </div>
             <div className='btns'>
                    <CustButton wh="192px" src="createrpt">生成报告</CustButton>
                    <CustButton wh="192px" src="print">打印报告</CustButton>
                    <CustButton wh="192px" src="export">导出报告</CustButton>
             </div>
               
              
          </Titlelayout>      
          </div>
          <div className='right'>
               <div className='front' style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundSize: '614px 260px',
          backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 550px'}}>
                   <div className='title'>
                    <Image src={log} height={57} preview={false}></Image>
                    <span className='name'>正泰综合能源服务平台</span>
                   </div>
                   <div style={{display: 'flex', flex:1, alignContent: 'center', justifyContent: 'center'}}>
                   <div className='head'>
                      <h1>储能系统分析报告</h1>
                      <div className='box'>
                          <p>项目名称：</p>
                          <p>项目地址：</p>
                          <p>报告日期：</p>
                      </div>
                   </div>
                   </div>
               </div>
          </div>
          </Mainbox>
    
  )
}

const Statistical = ({data}) => {
  const contentStyle = {
    width: '172px',
    height: '40px',
    backgroundColor: 'rgba(0, 51, 204, 1)',
    fontsize: '14px',
    color: '#FFFFFF',
    alignItems: 'center',
    justifyCcontent: 'center',
    paddingBottom: '0px'
  }
  const labelStyle = {
    width: '172px',
    height: '40px',
    backgroundColor: 'rgba(0, 51, 102, 1)',
    fontsize: '12px',
    color: '#FFFFFF',
    alignItems: 'center',
    justifyCcontent: 'center',
    paddingBottom: '0px'
  }
  return (
     <div className='list'>
      <div style={{display: 'flex', border: '2px solid #fff'}}>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        </div>
        <div style={{display: 'flex', border: '2px solid #fff'}}>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        </div>
        <div style={{display: 'flex', border: '2px solid #fff'}}>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        <div   className='listitem'>
            <div className='up' >
                  当日放电量(kwh)
              </div>
              <div className='downinfo'>200</div> 
        </div>
        </div>
     </div>
  )
}


export default function Index(props) {
    return (
        <Maincom {...props}   Statistical={Statistical}   />
    )
}