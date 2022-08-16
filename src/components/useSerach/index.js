import React, {useState} from "react";
import {useDispatch} from 'react-redux'
import { Form, Select, Button, AutoComplete } from "antd";
import style from "./style.module.less";
import {onAreaParams, onModel} from '@redux/params'
export default function useSerach() {
 
  let [init, setInit] = useState(false)
  const dispatch = useDispatch()
  const { Item } = Form;
  const { Option } = Select;
  const changemodel = () => {
    setInit(init => !init)
    dispatch(onModel(init))
  }
  const onFieldsChange = (_, allFields) => {
     let fields =   {} 
     allFields.forEach(f => {
        fields[f.name[0]] = f.value || ''
     });
     dispatch(onAreaParams({areaParams: fields}))
  }
  return (    
    <Form layout="inline" className={style.serachform} onFieldsChange={onFieldsChange}>
      <Item label="园区选择" name='RegionId'>
        <Select style={{ width: "320px" }}>
          <Option value={1}>正泰园区</Option>
        </Select>
      </Item>
      <Item label="建筑物" name='BuildingId'>
        <Select style={{ width: "235px" }}>
          <Option value={2}>1号楼</Option>
        </Select>
      </Item>
      <Item label="楼层" style={{width: '174px'}} name='FloorId'>
        <Select>
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
        <Button onClick={() => changemodel()}>{init ? '列表模式' : '表格模式'}</Button>
      </Item>
    </Form>
  );
}
