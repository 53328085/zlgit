import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Monitoring } from '@api/api.js'
import { useSelector, useStore, useDispatch } from 'react-redux'
import style from './style.module.less'
import { Select, Radio, DatePicker, Button, message, Form, Divider } from 'antd'
import { ExportOutlined, PrinterOutlined } from '@ant-design/icons'
import PageList from './pageList'
import searchFile from './images/searchFile.png'
import downFile from './images/img.jpg'
import printFile from './images/print.png'
import logo from './images/logo.png'
import firstPage from './images/firstPage.png'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import moment from "moment";
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/useButton'
// import ReactToPrint from "react-to-print";
import printJs from 'print-js'

const {Item} = Form;


const Leftbox = styled.div`
  && {
      width: 384px;
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
export default function Index() {
  const [form] = Form.useForm()
  const { RuntimeReport: { QueryReport } } = Monitoring
  // let componentRef = useRef();
  const projectId = useSelector(selectProjectId)

 
  const today = moment();
  const changeArea = (value) => {
    setAreaId(value);
  };
  const { Option } = Select
  const options = [{
    label: '月度报告',
    value: 2
  }, {
    label: '年度报告',
    value: 1
  }]
  const [radioValue, setRadioValue] = useState(2);
  const [date, setdate] = useState();
  const picker= [,"year", 'month'][radioValue]
  console.log(picker)
  const [reportData, setReportdata]= useState(null)
 
  const changetype = (e) => {
     
    setRadioValue(e.target.value)
  }

  const getData = async () => {
    try {
      let {type, date} = await form.getFieldsValue(true)
      let params = {
        type,
        projectId,
        date: type == 1 ? date.format("yyyy")+'-1'+'-1' : date.format("yyyy-M")
      }
     let {success, data} = await  QueryReport(params)
      if(success) {
        if(data.constructor == Object)  {
          setReportdata({...data, Data: new Date().toLocaleDateString(), timetype: radioValue})
        }else {
          setReportdata(null)
        } 
      }else {
        setReportdata(null)
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }
   /*  QueryReport(params).then(res => {
      let { success, data } = res
      if (success) {
        if(data.constructor == Object)  {
          setReportdata({...data, Data: new Date().toLocaleDateString(), timetype: radioValue})
        }else {
          setReportdata(null)
        }
      } else {
        setReportdata(null)
        message.error(res.errMsg)
      }
    })
  } */
 
}
  const createReport = async () => {
    getData()
  }
  const printReport = () => {
    let printDom = document.getElementById('contentPage');
    let wholeNodes = document.querySelectorAll(".pages")
    //打印的时候因为页面高度问题，需要改变margin-bottom的值
    for (let i = 0; i < wholeNodes.length; i++) {
      if (i !== 6) {
        wholeNodes[i].classList.replace('pageMargin', 'printPageMargin')
      }
    }

    html2canvas(printDom, {
      height: printDom.scrollHeight,
      windowHeight: printDom.scrollHeight,
      allowTaint: true,
      scale: '1',//设置放大倍数
      // dpi: '192',
      background: '#fff',
      // 开启跨域配置
      useCORS: true,//支持图片跨域
    }).then(canvas => {
      let pageData = canvas.toDataURL('image/jpeg', 1.0)
      printJS({
        printable: pageData,
        type: 'image',
        style: '@media print { @page {size: auto; margin: 0; } body{margin:0 5px}}' // 去除页眉页脚
      })
    })
  }//打印报表
  const downloadReport = () => {
    //先生成图片再导出
    html2canvas(document.getElementById('contentPage'), {
      // 导出pdf清晰度
      allowTaint: true,
      taintTest: false,
      scale: '1',//设置放大倍数
      height: document.getElementById('contentPage').scrollHeight,
      windowHeight: document.getElementById('contentPage').scrollHeight,
      // dpi: '192',
      background: '#fff',
      // 开启跨域配置
      useCORS: true,//支持图片跨域
    }).then((canvas) => {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      // 一页pdf显示html页面生成的canvas高度;
      let pageHeight = contentWidth / 592.28 * 841.89;
      // 未生成pdf的html页面高度
      let leftHeight = contentHeight;
      // pdf页面偏移
      let position = -8;
      // html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
      let imgWidth = 595.28;
      let imgHeight = 592.28 / contentWidth * contentHeight;

      let pageData = canvas.toDataURL('image/jpeg', 1);
      let pdf = new jsPDF('', 'pt', 'a4');

      // 有两个高度需要区分，一个是html页面的实际高度leftHeight，和生成pdf的页面高度(841.89)pageHeight
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= (pageHeight + 20);
          //原来高度是841.89，因为页面之间有20的padding,还有多余的7是因为页面比A4的高多了一点
          position -= 869.89;
          // 避免添加空白页
          if (leftHeight > 841.89) {
            pdf.addPage();
          }
        }
      }
      pdf.save('运行报告.pdf');
    });
  }
  return (
    <div className={style.content}>


  <Leftbox>
<Titlelayout title='运行报告' bordered={'n'} style={{flex: 'auto'}} pv="0px" > 
                 <Form className="content" form={form} initialValues={{type: 2, date: moment()}}>
                   <Item name="type" noStyle>
                   <RadioGroup  options={[{
                     label: '月度报告',
                     value: 2
                   }, {
                     label: '年度报告',
                     value: 1
                   }]}   value={radioValue}
                   optionType="button"
                   buttonStyle="solid"
                   onChange={changetype}
                   />
                   </Item>
                   <Item name="date" noStyle>
                    <DatePicker picker={picker} allowClear={false}    />
                   </Item>
                       <Divider   style={{  margin: '0px'}} />
                      
                  </Form>
                  <div className="btns">
                         <CustButton wh="192px" src="createrpt" onClick={createReport}>生成报告</CustButton>
                         <CustButton wh="192px" src="print" onClick={printReport}>打印报告</CustButton>
                         <CustButton wh="192px" src="export" onClick={downloadReport}>导出报告</CustButton>
                  </div>
                    
                   
               </Titlelayout>      

               </Leftbox>


      {/* <div className={style.selectDiv}>
      
        <div className={style.item}>
          <div className={style.itemTitle}>报告类型</div>
          <Radio.Group options={options} value={radioValue} optionType='button' onChange={changeType} buttonStyle="solid"></Radio.Group>
        </div>
        <div className={style.item}>
          <div className={style.itemTitle}>日期范围</div>
          <DatePicker style={{ width: 324 }} onChange={changeDate} picker={picker} ></DatePicker>
        </div>
        <div className={style.button} onClick={createReport}>
          <img src={searchFile} className={style.searchFile}></img>
          <span>生成报告</span>
        </div>
        <div className={style.buttonR} onClick={printReport}>
          <img src={printFile} className={style.searchFile}></img>
          <span>打印报告</span>
        </div>
        <div className={style.buttonR} onClick={downloadReport}>
          <img src={downFile} className={style.searchFile} style={{ zIndex: 1 }}></img>
          <span>导出报告</span>
        </div>
      </div> */}
       <PageList   reportData={reportData}></PageList> 

    </div>
  )
}
