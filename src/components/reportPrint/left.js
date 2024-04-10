import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form,  DatePicker,   Descriptions, Divider,   Radio, message } from 'antd'
 import moment from 'moment'
 import {useReactToPrint} from 'react-to-print'

 import printContext from './context'
 import {exportPDF} from './topdf'
import Titlelayout from '@com/titlelayout'
import {useSelector} from 'react-redux'
import { selectProjectId} from '@redux/systemconfig.js'
import {CustButton} from '@com/useButton'
 
 
 
const Left = styled.div`
  && {
        padding: 32px;
        margin-bottom: 16px;
         display: flex;
         flex-direction: column;
         background: #fff; 
         .content {
          padding: 32px;
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

`
 
const {Item} = Form
const { RangePicker } = DatePicker;


 const RadioGroup = styled(Radio.Group)`
   && {
    width: 100%;
    .ant-radio-button-wrapper {
      width: 50%;
      text-align: center;
    }
   }
 `

 
 export default  function Leftlayout(props) {
  let {printRef, title} = props
   const {getReport} = useContext(printContext)   
   const projectId = useSelector(selectProjectId)
   const [form] = Form.useForm()
   const [type, setType] = useState(2)  
   const datetype = ['','', 'month', 'year'][type]
   const [loading, setLoading] = useState(false)
  
const create = async () => {
    try {
        let {type, date} = form.getFieldsValue(true);
        let params = {
            type,
            date:  type== 2? date.startOf('month').format("yyyy-MM-DD") : date.startOf("year").format("yyyy-MM-DD"),
            projectId
        }
     let suc =  await  getReport(params)
     setLoading(suc)
    } catch (error) {
        
    }
   
    
}
 
const reactToPrintContent = useCallback(() => {
  return printRef;
}, [loading])

// 导出
const downloadReport = (id) => {
   try {
    if(!loading) return message.warning('请先生成报告', 0.3)  
     exportPDF(title,  id)
   } catch (error) {
    
   }
 
}

const handlePrint = useReactToPrint({
  content: reactToPrintContent,
})
 
const onPrint = () => {  
  try {
    if(!loading) return message.warning('请先生成报告', 0.3)  
    handlePrint()
  } catch (error) {
    console.log(error)
  }

}
 
// 打印 end
  const changedate = (e) => {  
    setType(e.target.value)
  }
  return (
         <Left>
           <Titlelayout title='运行报告' bordered={'n'} style={{flex: 'auto'}} pv="0px" > 
                 
            <Form className="content" form={form} initialValues={{type: 2, date: moment()}}>
              <Item name="type" noStyle>
              <RadioGroup  options={[{
                label: '月度报告',
                value: 2
              }, {
                label: '年度报告',
                value: 3
              }]}   value={type}
              optionType="button"
              buttonStyle="solid"
              onChange={changedate}
              />
              </Item>
              <Item name="date" noStyle>
               <DatePicker picker={datetype} allowClear={false} />
              </Item>
                  <Divider   style={{  margin: '0px'}} />
                 
             </Form>
             <div className='btns'>
                    <CustButton wh="192px" width="20px" src="search" onClick={create}>生成报告</CustButton>
                    <CustButton wh="192px" width="20px" src="print" onClick={onPrint}>打印报告</CustButton>
                    <CustButton wh="192px" width="20px" src="export" onClick={() => downloadReport('printRef')}>导出报告</CustButton>
             </div>              
          </Titlelayout>      
          </Left>
         
         
    
  )
}

 