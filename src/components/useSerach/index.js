import React from "react";
import { Form, Select, Button, AutoComplete } from "antd";
import style from "./style.module.less";
export default function useSerach() {
  const { Item } = Form;
  const { Option } = Select;
  return (
    <Form layout="inline" className={style.serachform}>
      <Item label="园区选择">
        <Select style={{ width: "320px" }}>
          <Option value="1">正泰园区</Option>
        </Select>
      </Item>
      <Item label="建筑物">
        <Select style={{ width: "235px" }}>
          <Option value="1">1号楼</Option>
        </Select>
      </Item>
      <Item label="楼层" style={{width: '174px'}}>
        <Select>
        <Option value="1">7楼</Option>
        </Select>
      </Item>
      <Item label="类型">
        <Select style={{width: '174px'}}>
          <Option value={1}>电</Option>
        </Select>
      </Item>
      <Item label="状态">
        <Select style={{width: '174px'}}>
          <Option value="1">正常</Option>
        </Select>
      </Item>
      <Item style={{marginLeft: 'auto', marginRight: '0px'}}>
        <Button>列表模式</Button>
      </Item>
    </Form>
  );
}
