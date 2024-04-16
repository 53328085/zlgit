import React, {useCallback} from "react";
import styled from "styled-components";
import { Button, Dropdown, Menu, Upload, Typography } from "antd";
import {CaretDownFilled, CloseOutlined} from '@ant-design/icons'
 
import i18 from '../../i18n'
import icon from "./icon";
const {Link} = Typography
const Custbtn = styled(Button).attrs((props) => ({
  type: props.type || "primary",
}))`
  && {
    width: ${props => props.wh || '96px'};
    height: 32px;  
    border-radius: 2px; 
    padding: 8px;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    height: ${props => props.imgh || '16px'}; 
    margin-right: 8px;
  }
`;
Custbtn.defaultProps={
  wh: '96px'
}
const Deltbtn = styled(Button)`
  && {
    width: 96px;
    height: 32px;
    background: #F5212D;
    border-color: #F5212D;
    border-radius: 2px;
    color: #fff;
    padding: 8px;
    text-align: left;
    display: flex;
    align-items: center;
  }
  &&:hover {
    background-color: #F74D57;
    border-color: #F74D57;
    color: #fff;
  }
  &&:active,
  &&:focus {
    background-color: #C41A24;
    border-color: #C41A24;
    color: #fff;
  }
  &&[disabled] {
    background-color: #C8C9CC;
    border-color: #C8C9CC;
  }
  img {
    height: 16px;
    margin-right: 8px;
  }
`;
const Wegbtn = styled(Button)`
  && {
    width: 96px;
    height: 32px;   
    background-image: url(${props => icon[props.weg]});
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: 8px;
    border-color: #AEAEAE;
    border-radius: 2px;
    color: #AEAEAE;
    padding: 8px 8px 8px 32px;
    text-align: left;
    display: flex;
    align-items: center;
    
  }

  &&:hover:not([other]) {       
    background-image: url(${props => icon[`${props.weg}h`]});
    border-color: #237AE4;
    color: #237AE4;
  }

  &&:active,
  &&:focus {
    background-color: #237AE4;
    background-image: url(${props => icon[`${props.weg}s`]});
    border-color: #237AE4;
    color: #fff;
  }
  &&[disabled] {
    background-color: #C8C9CC;
    border-color: #C8C9CC;
  }
  img {
    height: 16px;
    margin-right: 8px;
  }
`;
const Cmenu = styled(Menu)`
  padding: 0;
  border-radius: 0;
`
const CmenuItem = styled(Menu.Item)`
 // padding: 8px;
  background-color: #f2f2f2;
  color:#666;
  height: 32px;
  padding-left: 32px;
  background-image: url(${props => icon[props.type]});
  background-size: 16px;
  background-position: 8px;
  background-repeat: no-repeat;
  &&>span {
     display: flex;
     align-items: center;
     height: 32px; 
     
  }
&&:hover{
  background-color: #237AE4;
  color:#fff;
  background-image: url(${props => icon[`${props.type}h`]});
}
`

const Menus = (print) => {
  return (
  <Cmenu>
    <CmenuItem key="prints" type="prints" onClick={() => print(1)}  > 
        单页打印
    </CmenuItem>
    <CmenuItem key="printa" type="printa" onClick={() =>  print(2)} > 
        全部打印 
    </CmenuItem>
  </Cmenu>
)}
export function CustButton(props) { // 通用方式
  let {src, ...other} = props 
  return (
    <Custbtn {...other}>
     {src ? <img src={icon[src]} width={props.width} /> : null}
      {props.children}
    </Custbtn>
  )
}

export function SaveButton(props) {
  const {isicon=true} = props
  return (
    <Custbtn {...props}>
      {isicon && <img src={icon.save} />}
      {i18.t('save', {ns: "button"})}
    </Custbtn>
  );
}
export function SerachButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.serach} />
      {i18.t('search', {ns: "button"})}
    </Custbtn>
  );
}
export function RefreshButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.refresh} />
      {i18.t('refresh', {ns: "button"})}
    </Custbtn>
  );
}
export function NewButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.new} />
      {i18.t('new', {ns: "button"})}
    </Custbtn>
  );
}
export function ChangeButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.change} />
      {i18.t('change', {ns: "button"})}
    </Custbtn>
  );
}
export function UnbindingButton() {
  return (
    <Custbtn>
      <img src={icon.unbinding} />
      {i18.t('unbind', {ns: "button"})}
    </Custbtn>
  );
}
export function ImportButton() {
  return (
    <Custbtn>
      <img src={icon.import} />
      {i18.t('import', {ns: "button"})}
    </Custbtn>
  );
}
export function ExportButton(props) {  
  return (
    <Custbtn {...props}>
      <img src={icon.export}  />
      {i18.t('export', {ns: "button"})}
    </Custbtn>
  );
}
export function AllExportButton() {
  return (
    <Custbtn wh="auto">
      <img src={icon.export} />
      {i18.t('batchImport', {ns: "button"})}
    </Custbtn>
  );
}
export function PrintButton(props) {
  return (
    <Dropdown overlay={Menus(props.print)}>
      <Custbtn>
        <img src={icon.print} />
        {i18.t('print', {ns: "button"})}
        <CaretDownFilled/>
      </Custbtn>
    </Dropdown> 
  );
}

export function ExportExcel({tb, ...other}) {
  
 const onClick =useCallback(({key}) => {
      
     if (key == '1') {
      tb.current.download()
     }else if(key == '2') {
      tb.current.downloadAll()
     }
  }, [tb])
  const items = [
    {
      key: '1',
      label:   <Link> {i18.t('exportCurPage', {ns: "button"})}</Link>,
      
         
    },
    {
      key: '2',
      label: <Link> {i18.t('exportAll', {ns: "button"})}</Link>,
    
    },
  ]
  return (
    <Dropdown menu={{items, onClick}} {...other}>
        <Custbtn >
      <img src={icon.export}  />
      {i18.t('export', {ns: "button"})}
    </Custbtn>
    </Dropdown> 
  );
}

export function AccountButton() {
  return (
    <Custbtn>
      <img src={icon.account} />
      {i18.t('openAccount', {ns: "button"})}
    </Custbtn>
  );
}
export function ConfigButton() {
  return (
    <Custbtn>
      <img src={icon.config} />
      {i18.t('configure', {ns: "button"})}
    </Custbtn>
  );
}
export function OpenButton() {
  return (
    <Custbtn>
      <img src={icon.open} />
      {i18.t('openAll', {ns: "button"})}
    </Custbtn>
  );
}
export function CloseButton(props) {
  return (
    <Custbtn {...props}>
      <img src={icon.close} />
      {i18.t('closeAll', {ns: "button"})}
    </Custbtn>
  );
}
export function DelButton(props) {
  return (
    <Deltbtn {...props}>
      <CloseOutlined style={{fontSize: '16px'}} />
      {i18.t('delete', {ns: "button"})}
    </Deltbtn>
  );
}

export function WegButton(props) {
  return (
    <Wegbtn {...props}> 
       {props.children}
    </Wegbtn>
  );
}
