import React, {useState, useContext, useMemo, useEffect, useRef} from "react";

import { Form, Select, Button, Dropdown, Space, Divider,} from "antd";
import styled from "styled-components";
import style from "./style.module.less";
import {useSelector, useDispatch} from 'react-redux'
import {levelDefaultLabel,selectProjectId, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel} from '@redux/systemconfig.js'
import {onAreaParams, onDisplay, formInstance, selectSerach} from '@redux/params'
import {useReactToPrint} from 'react-to-print'
import {SiteManagerDesigner} from '@api/api'

import CustContext from "../content";
import {PrintButton,
   SaveButton, 
  SerachButton,
  RefreshButton, 
  NewButton, 
  ChangeButton, 
  UnbindingButton,
  ImportButton,
  ExportButton,
  AllExportButton,
  AccountButton,
  ConfigButton,
  OpenButton,
  CloseButton,
  DelButton,
  WegButton,
  CustButton,
} from '../useButton'
// https://geoapi.qweather.com/v2/city/lookup?location=beij&key=你的KEY
const Cdivider = styled(Divider)`
&& {
  margin: 0px;
  height: 32px;
}
 
`
const Cform = styled(Form)`
    background: #fff;
    padding: 7px 16px;
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
    height: max-content;
    display: flex;
   &&{
    .ant-form-item {
        margin: 0px;
    }
   } 
`

 

const { Item } = Form;

export default function useSerach(props) {
  const {handler, sitehandler, form: forms, search, isSite=false, custview, initialValue, setDisplay, display, data, print, printOption={}, printContent, PrintAllContent, onDownload,} = useContext(CustContext) || {}
  //const {printArea, setPrintArea} = useState()
  const dispatch = useDispatch()
  const [form] =forms ? [forms] : Form.useForm()
  const projectId = useSelector(selectProjectId)
  const varlabel = useSelector(levelDefaultLabel) 
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)
  let [AreaID, setAreaid] = useState(oneLevelDefaultId)
  const levelone = useSelector(selectOneLevel)
  const allData = useRef();
  const [options, setOptions] = useState([])

  const onChange = (e, option) => {
    dispatch(setCurrentlevel(option))
    setAreaid(e)
    if (typeof handler == 'function') {       
       handler(e)
    }
 }
 const sitechange = (e,options) => {
   
    if (typeof sitehandler == 'function') {
      sitehandler(options)
    }
     
 }
  const site = <Space size={32}>
  <Divider style={{margin: '0px', marginLeft: '32px', height: '32px'}} type="vertical" />
  <Item name="stationName" noStyle >
       <Select options={options} fieldNames={{label: 'name', value: 'name'}} style={{width: '264px'}} onChange={sitechange}></Select>  
  </Item>
</Space>

 
  const btns = [
    {
      key: 1,
      label: '打印当前页'
    },
    {
      key: 2,
      label: '打印全部数据'
    }
  ]
  let PrintArea = null
  const handlePrint = useReactToPrint({
    content: () =>  PrintArea ?? (() => <div></div>),
    onAfterPrint: () => PrintArea = null,
 //   copyStyles: false, // 打印隐藏的表格
    ...printOption, // 打印选项
  })
  const onHandlePrint = async (key) => {
    //const {key} = e
     if (key == 1) PrintArea = printContent() ;
     if (key== 2 ) {
      let Comp = await PrintAllContent();
     
     //  document.body.appendChild(Comp)
      PrintArea = Comp();
      console.dir(PrintArea);
     }
     handlePrint();
  }

  const getopti = async() => {
    try {
     let {success, data} = await  SiteManagerDesigner.FindSiteList(projectId, AreaID)
     if(success&& Array.isArray(data) && data.length > 0) {
       setOptions([...data])     
       form.setFieldsValue({
        stationName: data[0].name
       })
       sitehandler &&  sitehandler(data[0])
     }else {
      setOptions([])    
      form.setFieldsValue({
        stationName: ''
       })
       sitehandler && sitehandler({})
     }
    } catch (error) {
      console.log(error)
    }
   
  }
  useEffect(() => {
      if(projectId && AreaID && isSite) {
        getopti()
      }    
  
  }, [projectId, AreaID, isSite])
 
  return (  
  
    <Cform layout="inline" className={style.serachform} form={form} initialValues={{area: oneLevelDefaultId, ...initialValue}} >
      
      <Item label={varlabel} name='area'>
        <Select style={{ width: "200px" }} onChange={onChange} options={levelone} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
        </Select>
      </Item>
      {isSite && site}

        {
           custview
        }
     {/*  <Space size={16} style={{marginLeft: 'auto', marginRight: '0px'}}>  */}
      {/*  RefreshButton, 
  NewButton, 
  ChangeButton, 
  UnbindingButton,
  ImportButton,
  ExportButton,
  AllExportButton */}
     {/*  <SaveButton/> */}
    {/*   <CustButton type="save">保存</CustButton>
      <CustButton type="serach">查询</CustButton> */}
      {/*  <SerachButton />
       <ChangeButton />
       <UnbindingButton/>
       <ImportButton />
       
       <AllExportButton/>
       <AccountButton/>
       <RefreshButton/>
       <NewButton/>
       <ConfigButton/>
       <OpenButton/>
       <CloseButton/> */}
    {/*    <CloseButton disabled />
       <DelButton/>
       <DelButton disabled />
       <WegButton weg="water">水</WegButton>
       <WegButton weg="electric">电</WegButton>
       <WegButton weg="gas">气</WegButton>
       <WegButton weg="other">其他</WegButton>
       <WegButton weg="trend" other="true" >趋势</WegButton>
       <WegButton weg="report" other="true" >报表</WegButton> */}
      {/* {
       
       data!==undefined ? 
       (<Item>
            <ExportButton  onClick={() => onDownload()} />
         
       </Item>)
       : null
      
       }
       {
       
       print!==undefined ? 
       (<Item>
           <PrintButton print={onHandlePrint}></PrintButton>
       
       </Item>)
       : null
      
       }
      {
       
      display!==undefined ? 
      (<Item>
          <Button  onClick={() => setDisplay(s => !s)}>{display ? '列表模式' : '表格模式'}</Button>
      </Item>)
      : null
     
      }
      
      </Space> */}
    </Cform>
  
    
  );
}
