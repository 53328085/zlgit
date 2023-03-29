import React, { useState,useEffect,useRef } from 'react'
import {useRequest} from 'ahooks'
import {Monitoring} from '@api/api.js'
import { useSelector, useStore, useDispatch } from 'react-redux'
import style from './style.module.less'
import { Select,Radio, DatePicker, Button, message } from 'antd'
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
// import ReactToPrint from "react-to-print";
import printJs from 'print-js'


export default function Index() {
  const { RuntimeReport: { QueryReport } } = Monitoring
  // let componentRef = useRef();
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const [defaultArea, setDefaultArea] = useState(areaList[0]?areaList[0].id:undefined)
  let [areaId, setAreaId] = useState(defaultArea)
  const [queryData,setqueryData]=useState()
  const today = moment();
  const changeArea = (value) => {
    setAreaId(value);
  };
  const {Option} = Select
  const options = [{
    label:'月度报告',
    value:'month'
  },{
    label:'年度报告',
    value:'year'
  }]
  const [radioValue,setRadioValue] = useState('month');
  const [date,setdate] = useState();
  const changeType = ({ target: { value } }) =>{
    setRadioValue(value);
  }
  let params={
    projectId:projectId,
    areaId:areaId,
    type:radioValue=='month'?1:2,
    date:date
  }

const getData=()=>{
  QueryReport(params).then(res=>{
    let {success,data}=res
    if(success){
      setqueryData(data)
      setcoverData({
        ProjectName:data?.projectName,
        Address:data?.projectAddress,
        Date:new Date().toLocaleDateString()
      })
    }else{
      message.error(res.errMsg)
    }
  })
}
useEffect(() => {
  if(areaList.length == 0 || !areaList){
    message.error('当前项目尚未创建园区!')
    return;
  }
}, []);
  const changeDate = (date, dateString) =>{
    console.log(date,dateString)
    setdate(dateString)
  }

  const [display, setdisplay] = useState(false);

  const [coverData, setcoverData] = useState({
    ProjectName:'',
    Address:'',
    Date:''
  });

  const createReport = () =>{
    if(date){
      setdisplay(true);
    getData()
    setcoverData({
      ProjectName:queryData?.projectName,
      Address:queryData?.projectAddress,
      Date:new Date().toLocaleDateString()
    })
    }else{
      message.error('请选择日期范围！')
    }
  }
const printReport=()=>{
  let printDom = document.getElementById('contentPage');
  let wholeNodes = document.querySelectorAll(".pages")
  //打印的时候因为页面高度问题，需要改变margin-bottom的值
  for(let i = 0;i<wholeNodes.length;i++){
    if(i!==6){
      wholeNodes[i].classList.replace('pageMargin','printPageMargin')
    }
  }

  html2canvas(printDom,{
    height:printDom.scrollHeight,
    windowHeight: printDom.scrollHeight,
    allowTaint:true,
    scale: '2',//设置放大倍数
    dpi: '192',
    background: '#fff',
    // 开启跨域配置
    useCORS: true,//支持图片跨域
  }).then(canvas=>{
    let pageData = canvas.toDataURL('image/jpeg',1.0)
    printJS({
      printable:pageData,
      type:'image',
      style: '@page{size:auto;margin: 0cm 0cm 0cm 0cm;}' // 去除页眉页脚
    })
  })
  for(let i = 0;i<wholeNodes.length;i++){
    if(i!==6){
      wholeNodes[i].classList.replace('printPageMargin' , 'pageMargin')
    }
  }
}//打印报表
const downloadReport=()=>{
  //先生成图片再导出
  html2canvas(document.getElementById('contentPage'),{
    // 导出pdf清晰度
    allowTaint: true,
    taintTest: false,
    scale: '2',//设置放大倍数
    height: document.getElementById('contentPage').scrollHeight,
    windowHeight: document.getElementById('contentPage').scrollHeight,
    dpi: '192',
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
        leftHeight -= (pageHeight+20);
        //原来高度是841.89，因为页面之间有20的padding,还有多余的7是因为页面比A4的高多了一点
        position -= 869.89;
        // 避免添加空白页
        if (leftHeight > 841.89) {
          pdf.addPage();
        }
      }
    }
    pdf.save('客户报告.pdf');
  });
}
  return (
    <div className={style.content}>
      <div className={style.selectDiv}>
        <div className={style.item}>
        <div className={style.itemTitle}>{areaList[0]?.levelName || '园区'}选择</div>
        {/* <span style={{ marginLeft: "16px", marginRight: 16 }}>{areaList[0]?.levelName || '园区'}选择</span> */}
          <Select
              placeholder="请选择园区"
              style={{width: '324px'}}
              size="middle"
              key={defaultArea}
              defaultValue={defaultArea}
              onChange={changeArea}
            >
              {areaList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
        </div>
        <div className={style.item}>
          <div className={style.itemTitle}>报告类型</div>
          <Radio.Group options={options} value={radioValue} optionType='button' onChange={changeType} buttonStyle="solid"></Radio.Group>
        </div>
        <div className={style.item}>
          <div className={style.itemTitle}>日期范围</div>
          <DatePicker style={{width:324}} onChange={changeDate} picker={radioValue} ></DatePicker>
          {/* defaultValue={moment(today)} */}
        </div>
        <div className={style.button} onClick={createReport}>
          <img src={searchFile} className={style.searchFile}></img>
          <span>生成报告</span>
        </div>
        {/* <ReactToPrint
          trigger={() => <div className={style.buttonR} onClick={printReport}>
          <img src={printFile} className={style.searchFile}></img>
            <span>打印报告</span>
          </div>}
          content={() => componentRef}
        /> */}
        <div className={style.buttonR} onClick={printReport}>
          <img src={printFile} className={style.searchFile}></img>
            <span>打印报告</span>
          </div>
        <div className={style.buttonR} onClick={downloadReport}>
        <img src={downFile} className={style.searchFile} style={{zIndex:1}}></img>
          <span>导出报告</span>
        </div>
      </div>
      <div className={style.report} >
      {/*  ref={(el) => (componentRef = el)} */}
        <div className={style.firstPage} >
          <div className={style.header}>
            <img src={logo} className={style.logo}></img>
            <span>正泰综合能源服务平台</span>
          </div>
          <div className={style.mainTitle}>运行监控报告</div>
          <div className={style.mainDetail} >
            <div className={style.detailItem}>项目名称: <span style={{marginLeft:18}}>{ coverData.ProjectName }</span></div>
            <div className={style.detailItem}>项目地址: <span style={{marginLeft:18}}>{ coverData.Address }</span></div>
            <div className={style.detailItem}>报告日期: <span style={{marginLeft:18}}>{ coverData.Date }</span></div>
          </div>
          <img src={firstPage} className={style.backgroundImg}></img>
        </div>
        <div >{display ? <PageList   query={queryData}></PageList> : null }</div>
      </div>
      
    </div>
  )
}
