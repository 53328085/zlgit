import React, { useState } from 'react'
import {useRequest} from 'ahooks'
import {UserReportApi} from '@api/api.js'
import { useSelector, useStore, useDispatch } from 'react-redux'
import style from './style.module.less'
import { Select,Radio, DatePicker, Button } from 'antd'
import { ExportOutlined, PrinterOutlined } from '@ant-design/icons'
import PageList from './pageList'
import searchFile from './images/searchFile.png'
import logo from './images/logo.png'
import firstPage from './images/firstPage.png'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'



export default function Index() {
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const [defaultArea, setDefaultArea] = useState(areaList[0].id)
  let [areaId, setAreaId] = useState(1)
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
  const changeType = ({ target: { value } }) =>{
    setRadioValue(value);
  }

  const changeDate = (date, dateString) =>{
    console.log(date,dateString)
  }

  const [display, setdisplay] = useState(false);

  const [coverData, setcoverData] = useState({
    ProjectName:'',
    Address:'',
    Date:''
  });

  const createReport = () =>{
    setdisplay(true);
    setcoverData({
      ProjectName:'正泰物联',
      Address:'浙江省杭州市滨江区月明路560号',
      Date:new Date().toLocaleDateString()
    })
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
          <DatePicker style={{width:324}} onChange={changeDate} picker={radioValue}></DatePicker>
        </div>
        <div className={style.button} onClick={createReport}>
          <img src={searchFile} className={style.searchFile}></img>
          <span>生成报告</span>
        </div>
      </div>
      <div className={style.report}>
        <div className={style.firstPage}>
          <div className={style.header}>
            <img src={logo} className={style.logo}></img>
            <span>正泰智慧能源服务平台</span>
          </div>
          <div className={style.mainTitle}>运行监控报告</div>
          <div className={style.mainDetail}>
            <div className={style.detailItem}>项目名称: <span style={{marginLeft:18}}>{ coverData.ProjectName }</span></div>
            <div className={style.detailItem}>项目地址: <span style={{marginLeft:18}}>{ coverData.Address }</span></div>
            <div className={style.detailItem}>报告日期: <span style={{marginLeft:18}}>{ coverData.Date }</span></div>
          </div>
          <img src={firstPage} className={style.backgroundImg}></img>
        </div>
        {display ? <PageList></PageList> : null }
      </div>
      <Button icon={<ExportOutlined />}  style={{marginLeft:'auto',marginRight:16, width: 100}}>导出</Button>
      <Button icon={<PrinterOutlined />} style={{width:100}}>打印</Button>
    </div>
  )
}
