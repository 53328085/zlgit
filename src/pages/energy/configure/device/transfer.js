import React, { useEffect, useState } from "react";
import {useTranslation} from "react-i18next"
import styled, {css} from "styled-components";
import style from './style.module.less'
import { Table, Input, message, Select, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import {SaveButton, CustButton, CancelButton} from '@com/useButton'
import { adaptation } from "@redux/systemconfig";
import { useSelector } from "react-redux";
import UsetTable from "@com/useTable";
const csssty = css`
  .transferContent {
    padding: 16px;
  }
  .leftTable {
    row-gap: 16px;
  }
  .actions {
    margin: 0px 8px;
    .finalButton {
      row-gap: 8px;
    }
  }
`;
const Mainbox = styled.div`
   &&{
   
    height: inherit;
    background-color: #003366;
    padding: 32px;
    display: flex;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translate(200px, -50%);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr;
    width: calc(100% - 200px);
 
   
  .leftTable {
    height: inherit;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
  }

  .subTable {
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
     display: flex;
     flex-direction: column;
     row-gap: 16px;
    flex: 1;
  }

  .otherSubTable {
    flex: 1;
    padding: 16px 16px 0 16px;
    background-color: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  .mainContent {
    flex: 1;
    position: relative;
    overflow: auto;
  }

  .actions {
    margin: 0 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .firstButton {
      // margin-top: 64px;
      display: flex;
      justify-content: space-between;
    }

    .secondButton {
      //  margin-top: 182px;
      display: flex;
      justify-content: space-between;
    }

    .leftButton {
      display: inline-block;
      width: 68px;
      height: 46px;
      background-color: var(--ant-primary-color);
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      line-height: 46px;
      text-align: center;

      &:hover {
        background-color: rgba(64, 158, 255, 1);
      }
    }

    .rightButton {
      display: inline-block;
      width: 68px;
      height: 46px;
      margin-left: 10px;
      background-color: var(--ant-primary-color);
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      line-height: 46px;
      text-align: center;

      &:hover {
        background-color: rgba(64, 158, 255, 1);
      }
    }

    .finalButton {
      // margin-top: 180px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      .saveButton {
        width: 146px;
        height: 40px;
        background-color: var(--ant-primary-color);
        border-radius: 4px;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        text-align: center;

        &:hover {
          background-color: rgba(64, 158, 255, 1);
        }
      }

      .closeButton {
        margin-top: 16px;
        width: 146px;
        height: 40px;
        background-color: #fff;
        border-radius: 4px;
        cursor: pointer;
        color: #212121;
        font-size: 14px;
        line-height: 40px;
        text-align: center;

        &:hover {
          opacity: 0.5;
        }
      }
    }
  }

  .rightTable {
    //  width: 714px;
    //  height: 696px;
    border-radius: 2px;
    padding: 16px 16px 0 16px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }
  .rightTable,
  .leftTable {
    .publicTitle {
      height: 32px;
      padding-left: 16px;
      line-height: 32px;
      font-size: 14px;
      color: #333;
      border-left: 4px solid var(--ant-primary-color);
    }
    .searchInput {
      display: flex;
      align-items: center;
      height: 32px;
    }
    .mainTable {
      padding: 16px;
      background-color: #fff;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      flex: 1;
      
    }
    .tbwrap {
        position: absolute;
        width: 100%; 
      }
  }

  ${(props) => (props.theme.laptop ? csssty : null)}
}
`;
export default function index (props) {
    const {t} = useTranslation(["button"])
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
    const [subData, setSubData] = useState([])
    const [subCopy, setSubCopy] = useState([])
    const [unknownData, setUnknownData] = useState([])
    const [unknownCopy, setUnknownCopy] = useState([])
    const {laptop} = useSelector(adaptation)
    useEffect(()=>{
        let subArr = cloneDeep(props.subTable)
        let unknownArr = cloneDeep(props.unknownTable)
        setSubData(subArr)
        setSubCopy(subArr)
        setUnknownData(unknownArr)
        setUnknownCopy(unknownArr)
        setType(0)
    },[props])

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const unknownToSub = () => {
        if( selectedRowKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请至少选择一个设备！',
            })
            return;
        }else{
            let arr = [...unknownData];
            let arr2 = [];
            let copyArr = [...unknownCopy];
            for(let i =0;i< arr.length;i++){
                for(let j = 0;j<selectedRowKeys.length;j++){
                    if(arr[i].id == selectedRowKeys[j]){
                        for(let x = 0;x< copyArr.length;x++){
                            if(arr[i].id == copyArr[x].id){
                                copyArr.splice(x, 1)
                            }
                        }
                        arr2.push(arr[i])
                        arr.splice(i,1)
                        
                    }
                }
            }
            setSubData(subData.concat(arr2));
            setSubCopy(subCopy.concat(arr2));
            setUnknownData(arr);
            setUnknownCopy(copyArr);
            setSelectedRowKeys([])
        }
    }

    const [selectedSubKeys, setSelectedSubKeys] = useState([]);
    const onSelectSub = (newSelectedRowKeys) => {
        setSelectedSubKeys(newSelectedRowKeys);
    };
    const subSelection = {
        selectedSubKeys,
        onChange: onSelectSub,
    };
    const subToUnknown = () => {
        if( selectedSubKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请先选择设备！',
            })
            return;
        }else{
            let arr = [...subData];
            let arr2 = [];
            let copyArr = [...subCopy]
            for(let i =0;i< arr.length;i++){
                for(let j = 0;j<selectedSubKeys.length;j++){
                    if(arr[i].id == selectedSubKeys[j]){
                        for(let x = 0;x< copyArr.length;x++){
                            console.log(copyArr[x])
                            if(arr[i].id == copyArr[x].id){
                                copyArr.splice(x, 1)
                            }
                        }
                        arr2.push(arr[i])
                        arr.splice(i,1)
                    }
                }
            }
            setUnknownData(unknownData.concat(arr2));
            setUnknownCopy(unknownCopy.concat(arr2));
            setSubData(arr)
            setSubCopy(copyArr)
            // setSelectedSubKeys([])
        }
    }

    const handleClose = () => {
        props.closeValue('close');
    }
    const handleSave = () => {
        props.saveValue({
            subData,
            unknownData,
        })
    }
    let tag = columns[0].key;

    const onSearchSub = (value) => {
        let arr = [];
        if(value == '') {
            setSubData([...subCopy]);
        }else{
            subCopy.map(item => {
                if(item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1){
                    arr.push(item)
                }
            })
            setSubData([...arr]);
        }
    }
    const [searchUnknown, setSearchUnknown] = useState('')
    const onSearchUnknown = (value) => {
        let arr = [];
        setSearchUnknown(value)
        if(value == '') {
            // setUnknownData([...unknownCopy]);
            if(type == 0){
                setUnknownData([...unknownCopy]);
            }else{
                unknownCopy.map(item => {
                    if(item.meterType == type){
                        arr.push(item)
                    }
                })
                setUnknownData([...arr]);
            }
        }else{
            unknownCopy.map(item => {
                if(item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1){
                    if(type == 0){
                        arr.push(item)
                    }else if(type != 0 && item.meterType == type){
                        arr.push(item)
                    }
                }
            })
            setUnknownData([...arr]);
        }
    }

    const [type, setType] = useState(0)
    const changeType = (value) => {
        setType(value)
        let arr = [];
        if(value == 0) {
            if(searchUnknown == ''){
                setUnknownData([...unknownCopy]);
            }else{
                unknownCopy.map(item => {
                    if(item[tag].indexOf(searchUnknown) != -1 || item.address.indexOf(searchUnknown) != -1){
                        arr.push(item)
                    }
                })
                setUnknownData([...arr]);
            }
        }else{
            unknownCopy.map(item => {
                if(item.meterType == value){
                    if(searchUnknown == ''){
                        arr.push(item)
                    }else if(searchUnknown != '' && (item[tag].indexOf(searchUnknown) != -1 || item.address.indexOf(searchUnknown) != -1)){
                        arr.push(item)
                    }
                }
            })
            setUnknownData([...arr]);
        }
    }
    const btnsty = laptop
    ? {
        height: "32px",
        width: "55px",
      }
    : {
        height: "46px",
        width: "68px",
      };
  const savesty = laptop
    ? {
        height: "34px",
        width: "120px",
      }
    : {
        height: "46px",
        width: "146px",
      };
    return (
        <Mainbox>
            {contextHolder}
            <div className="leftTable">
                <div className="otherSubTable">
                    <div className="publicTitle">{props.transferTitle.subTitle}</div>
                    <div className="searchInput">
                        <span style={{marginRight: 16}}>设备搜索</span>
                        <Search placeholder="请输入设备编号/安装地址" style={{width: 256}} enterButton onSearch={onSearchSub}></Search>
                    </div>
                    <div className="mainContent">
                        <div className="tbwrap">
                        <UsetTable  dataSource={subData} columns={columns}   rowKey='id' pagination={false} scroll={{y:500}} rowSelection={subSelection}></UsetTable>
                        </div>
                       
                    </div>
                </div>
            </div>
            <div className="actions">

                <Space>
                    <CustButton icon={<LeftOutlined />} onClick={() => unknownToSub() } style={btnsty} />
                    <CustButton icon={<RightOutlined />} onClick={() => subToUnknown() } style={btnsty} />
                </Space>
                <Space direction="vertical" >
                    <SaveButton isicon={false} onClick={ ()=> handleSave()}  style={savesty} /> 
                    <CancelButton type="default" onClick={ ()=> handleClose()} style={savesty} /> 
                </Space>
            </div>
            <div className="rightTable">
                <div className="publicTitle">{props.transferTitle.unknownTitle}</div>
                <div className="searchInput">
                    <span>设备类型</span>
                    <Select 
                        defaultValue={0}
                        style={{ marginLeft: laptop ? "8px" : "16px", width: '112px'}}
                        onChange={changeType}
                    >   
                        <Select.Option  value={0}>全部类型</Select.Option>
                        <Select.Option  value={1}>电表</Select.Option>
                        <Select.Option  value={2}>水表</Select.Option>
                        <Select.Option  value={3}>燃气表</Select.Option>
                    </Select>
                   {
                    laptop ? null :  <div style={{ width:0, height: 32, margin: '0 32px', borderLeft:'1px dashed #ddd' }}></div>
                   }
                    <span style={{marginRight: laptop ? "8px" : "16px"}} >设备搜索</span>
                    <Search placeholder="请输入设备编号/安装地址" style={{width: laptop ? 160 :256}} enterButton onSearch={onSearchUnknown}></Search>
                </div>
                <div className="mainContent">
                    <div className="tbwrap">
                    <UsetTable  dataSource={unknownData} columns={columns}   rowKey='id' pagination={false}   rowSelection={rowSelection}></UsetTable>
                    </div>
                </div>
            </div>
        </Mainbox>
    )
}