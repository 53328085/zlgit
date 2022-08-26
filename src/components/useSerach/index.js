import React, {useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import { Form, Select, Button, AutoComplete } from "antd";
import style from "./style.module.less";
import {onAreaParams, onDisplay, formInstance, selectSerach} from '@redux/params'
export default function useSerach(props) {
  const dispatch = useDispatch()
  const search = props.search 
 
 const form = props.form || {};

  const { type, changeType, submit, reset } = search;
  let [init, setInit] = useState(false)  
  const { Item } = Form;
  const { Option } = Select;
  const changemodel = () => {
    setInit(init => !init)
    dispatch(onDisplay(init))
  }
  return (  
  
    <Form layout="inline" className={style.serachform} form={form} initialValues={{
      RegionId: null,
      BuildingId: null,
      FloorId: null,
      Type: null,
      State: null
    }} >
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
      <Item label="楼层" style={{width: '174px'}} name='FloorId' >
        <Select onChange={submit} allowClear>
        <Option value={3}>7楼</Option>
        </Select>
      </Item>
      <Item label="类型" name='Type'>
        <Select style={{width: '174px'}}>
          <Option value={4}>电</Option>
        </Select>
      </Item>
      <Item label="状态" name='State'>
        <Select style={{width: '174px'}}>
          <Option value={5}>正常</Option>
        </Select>
      </Item>
      <Item style={{marginLeft: 'auto', marginRight: '0px'}}>
          <Button  onClick={() => changemodel()}>{init ? '列表模式' : '表格模式'}</Button>
      </Item>
    </Form>
  
    
  );
}
