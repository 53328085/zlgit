import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions, Divider, Tag, Radio } from 'antd'
 
import Titlelayout from '@com/titlelayout'
import {useSelector} from 'react-redux'
import {selectOneLevel, selectOneLevelDefaultId} from '@redux/systemconfig.js'
 
 
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
       }
       .ant-form-inline.ant-form-item {
          margin-right: 0px
        } 
       }
`
 
 
 
 function Maincom({projectId,  Statistical, CModal}) {
   const {from} = Form.useForm()
   const [type, setType] = useState('month')
   const levelone = useSelector(selectOneLevel)
   const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)  
   const onChange = () => {}
  return (
   
    <Mainbox>
         <div className='left'>
          <Titlelayout title='园区选择' bordered={'n'} style={{flex: 1}} pv="0px">  
            <div className="content">
                    <Select options={levelone} defaultValue={oneLevelDefaultId}
                    fieldNames={{label: 'name', value: 'id', options: 'options'}}
                    style={{width: '320px'}}
                    ></Select> 
                     <Divider  style={{margin: '0px'}} />
                  </div>
                 
          </Titlelayout> 
          
           <Titlelayout title='运行报告' bordered={'n'} style={{flex: 1}} pv="0px" > 
                 
            <div className="content">
              <Radio.Group  options={[{
                label: '月度报告',
                value: 'month'
              }, {
                label: '年度报告',
                value: 'year'
              }]} onChange={onChange} value={type}
              optionType="button"
              buttonStyle="solid"
               style={{width: '100%'}}
              />
                  
                  <Divider   style={{  margin: '0px'}} />
                  </div>
                
               
              
          </Titlelayout>      
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