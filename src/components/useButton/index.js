import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import {CaretDownFilled} from '@ant-design/icons'
import icon from "./icon";
const Custbtn = styled(Button)`
  && {
    width: 96px;
    height: 32px;
    background: #237ae4;
    border-color: #237ae4;
    border-radius: 2px;
    color: #fff;
    padding: 8px;
    text-align: left;
    display: flex;
    align-items: center;
  }
  &&:hover {
    background-color: #4f95ea;
    border-color: #4f95ea;
    color: #fff;
  }
  &&:active,
  &&:focus {
    background-color: #1c62b7;
    border-color: #1c62b7;
    color: #fff;
  }
  img {
    margin-right: 8px;
  }
`;

export function PrintButton() {
  return (
    <Custbtn>
      <img src={icon.print} />
      打印
      <CaretDownFilled/>
    </Custbtn>
  );
}
export function SaveButton() {
  return (
    <Custbtn>
      <img src={icon.save} />
      保存
    </Custbtn>
  );
}
export function SerachButton() {
  return (
    <Custbtn>
      <img src={icon.serach} />
      查询
    </Custbtn>
  );
}
export function RefreshButton() {
  return (
    <Custbtn>
      <img src={icon.refresh} />
      刷新
    </Custbtn>
  );
}
export function NewButton() {
  return (
    <Custbtn>
      <img src={icon.new} />
      新增
    </Custbtn>
  );
}

export function UnbindingButton() {
  return (
    <Custbtn>
      <img src={icon.unbinding} />
      解绑
    </Custbtn>
  );
}
export function ImportButton() {
  return (
    <Custbtn>
      <img src={icon.import} />
      导入
    </Custbtn>
  );
}
export function ExportButton() {
  return (
    <Custbtn>
      <img src={icon.export} />
      导出
    </Custbtn>
  );
}
export function AllExportButton() {
  return (
    <Custbtn>
      <img src={icon.export} />
      批量导入
    </Custbtn>
  );
}
