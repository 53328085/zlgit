import React, {useState, useContext, useMemo, useEffect, useRef} from "react";

import { Form, Select, Button, Dropdown, Space, Divider,} from "antd";
import styled from "styled-components";
import style from "./style.module.less";
import {useSelector} from 'react-redux'
import {levelDefaultLabel, selectOneLevelDefaultId, selectOneLevel} from '@redux/systemconfig.js'
import {onAreaParams, onDisplay, formInstance, selectSerach} from '@redux/params'
import {useReactToPrint} from 'react-to-print'
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
export default function useSerach(props) {
  const {handler, form: forms, search, custview, setDisplay, display, data, print, printOption={}, printContent, PrintAllContent, onDownload,} = useContext(CustContext) || {}
  //const {printArea, setPrintArea} = useState()
  
  const [form] =forms ? [forms] : Form.useForm()
  const varlabel = useSelector(levelDefaultLabel) 
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId)
  const levelone = useSelector(selectOneLevel)
  const allData = useRef();
  const onChange = (e) => {
     console.log(e)
     if (typeof handler == 'function') {       
        handler(e)
     }
  }
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
  const { Item } = Form;

 
  return (  
  
    <Cform layout="inline" className={style.serachform} form={form} initialValues={{area: oneLevelDefaultId}} >
      
      <Item label={varlabel} name='area'>
        <Select style={{ width: "200px" }} onChange={onChange} allowClear options={levelone} fieldNames={{label: 'name', value: 'id', options: 'options'}}>
         
        </Select>
      </Item>
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
