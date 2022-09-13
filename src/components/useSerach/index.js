import React, {useState, useContext, useMemo} from "react";

import { Form, Select, Button, AutoComplete } from "antd";

import style from "./style.module.less";
import {onAreaParams, onDisplay, formInstance, selectSerach} from '@redux/params'
import CustContext from "../content";
export default function useSerach(props) {
  const {form, search, setDisplay, display, names=['RegioId', 'BuildingId', 'FloorId', 'Type', 'State']} = useContext(CustContext) 
 
  const { type, changeType, submit, reset } = search || {};
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
  
    <Form layout="inline" className={style.serachform} form={form} initialValues={{initialValues}} >
      <Item label="园区选择" name='RegionId'>
        <Select style={{ width: "320px" }} onChange={submit} allowClear>
          <Option value={1}>正泰园区</Option>
        </Select>
      </Item>
      <Item label="建筑物" name='BuildingId'>
        <Select style={{ width: "235px" }}>
          <Option value={2}>1号楼</Option>
        </Select>
      </Item>
      { names.includes('FloorId') ? (<Item label="楼层" style={{width: '174px'}} name='FloorId' >
        <Select onChange={submit} allowClear>
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
      {
      display!==undefined ? 
      (<Item style={{marginLeft: 'auto', marginRight: '0px'}}>
          <Button  onClick={() => setDisplay(s => !s)}>{display ? '列表模式' : '表格模式'}</Button>
      </Item>)
      : null
      }
    </Form>
  
    
  );
}
