import React, {useState, useContext, useMemo, useEffect} from "react";

import { Form, Select, Button, Dropdown, Space, Divider} from "antd";
import styled from "styled-components";
import style from "./style.module.less";
import {onAreaParams, onDisplay, formInstance, selectSerach} from '@redux/params'
import {useReactToPrint} from 'react-to-print'
import CustContext from "../content";
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
   &&{
    .ant-form-item {
        margin: 0px;
    }
   } 
`
export default function useSerach(props) {
  const {form, search, setDisplay, display, data, print, printOption={}, printContent, onDownload, names=['RegioId', 'BuildingId', 'FloorId', 'Type', 'State']} = useContext(CustContext) 
  const { type, changeType, submit =()=>{}, reset=() => {} } = search || {};
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
   
  const handlePrint = useReactToPrint({
    content: () => printContent,
    ...printOption, // 打印选项
  })
  const onHandlePrint = (e) => {
    const {key} = e
    if (key == 1)  {
      handlePrint();
    }
  }
  const { Item } = Form;
  const { Option } = Select;
  const initialValues = useMemo(() => {
    let items = {}
    for(let key of names) {
      items[key] = null
    }
    return items
  }, [names])  
  return (  
  
    <Cform layout="inline" className={style.serachform} form={form} initialValues={{initialValues}} >
      <Space size={16}>
      <Item label="园区选择" name='RegionId'>
        <Select style={{ width: "320px" }} onChange={submit} allowClear>
          <Option value={1}>正泰园区</Option>
        </Select>
      </Item>
      {
        names.includes('BuildingId')  && <Cdivider dashed type="vertical" />
      }
      {
        <Item label="" name='BuildingId'>
        <Select style={{ width: "235px" }}>
          <Option value={0}>全部建筑物</Option>
          <Option value={2}>1号楼</Option>
        </Select>
        </Item>
       
      }
     
      { names.includes('FloorId') ? (
      <Item label="" style={{width: '174px'}} name='FloorId' >
        <Select onChange={submit} allowClear>
        <Option value={0}>全部楼层</Option>
        <Option value={3}>7楼</Option>
        </Select>
      </Item>)
      : null
      }
       {
        names.includes('apply')  && <Cdivider dashed type="vertical" />
      }
      { names.includes('apply') ? (
        <Item label="" style={{width: '174px'}} name='apply' >
        <Select onChange={submit} allowClear>
        <Option value={0}>全部应用</Option>
        <Option value={3}>7楼</Option>
        </Select>
      </Item>)
      : null
      }
      {
         names.includes('Type') ?
        (<Item label="类型" name='Type'>
        <Select style={{width: '174px'}}>
          <Option value={4}>电</Option>
        </Select>
        </Item>)
        : null
      }
      {
       names.includes('State') ? 
       (<Item label="状态" name='State'>
        <Select style={{width: '174px'}}>
          <Option value={5}>正常</Option>
        </Select>
      </Item>)

      : null
      }
      </Space>
      <Space size={16} style={{marginLeft: 'auto', marginRight: '0px'}}> 
      {
       
       data!==undefined ? 
       (<Item>
           <Button  onClick={() => onDownload()}>数据导出</Button>
       </Item>)
       : null
      
       }
       {
       
       print!==undefined ? 
       (<Item>
          <Dropdown.Button  menu={{items: btns, onClick: onHandlePrint}}>打印</Dropdown.Button>
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
      
      </Space>
    </Cform>
  
    
  );
}
