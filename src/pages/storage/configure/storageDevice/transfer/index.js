import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { Table, Input, message, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import { useReactive } from "ahooks";
import  {CustButtonT, CustButton} from "@com/useButton"
import styled, {css} from "styled-components";
import {adaptation} from '@redux/systemconfig'
import UsetTable from "@com/useTable";
const csssty = css`
     grid-template-columns: 1fr 164px 1fr;
    padding: 16px;
    width: 100%;
    left: 0;
   
  .actions { 
     padding: 0 16px;
   
  }
  .leftTable{
    row-gap: 8px;
  }
  .mainTable{
    padding: 0;
  }
  .publicTitle{
    height: 24px;
    line-height: 24px;
  }
`;
const Mainbox = styled.div`
 
 background-color: #003366;
  padding: 16px 32px;
  justify-content: space-between;
  position: absolute;
  top: 0px;
  left: 200px;
  display: grid;
  grid-template-columns: 1fr 232px 1fr;
  grid-template-rows: 1fr;
  width:calc(100% - 200px) ;
 height: 100%;
overflow: auto;
 
.publicTitle{
    height: 32px;
    padding-left: 16px;
    margin-bottom: 16px;
    line-height: 32px;
    font-size: 14px;
    color: #333;
    border-left: 4px solid ${props=> props.theme.primaryColor};
}
.mainTable{
    
    padding: 16px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 2px;
    // margin-bottom: 16px;
    display: flex;
    flex-direction: column;
   
}
.subTable{
   
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
    margin-bottom: 32px;
}
.otherSubTable{
     
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
    margin-bottom: 32px;
}
.searchInput{
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}
.actions{
    padding: 0 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    row-gap: 8px;
    .ops {
      padding-top: ${props=>props.theme.laptop ? "40px": "48px"};
     flex:1;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
    }
}
.leftTable{
    display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1fr;
  row-gap: 16px;
    border-radius: 2px;
    padding: 16px;
    background-color: #fff;
}
.rightTable{
    
    border-radius: 2px;
    padding: 16px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}
.outwrap {
    flex: 1;
    position: relative;
    overflow: auto;
  }
  .tbwrap {
        position: absolute;
        width: 100%; 
      }
      .btns {
    display: flex;
    justify-content: space-between;
  }
  .saves {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }
 
${props => props.theme.laptop ? csssty : null}
`
export default function index (props) {
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
    const {laptop} = useSelector(adaptation)
    const [mainData, setMainData] = useState([])
    const state = useReactive({
        loadData:[],
        gridData:[]
    })
    const [unknownData, setUnknownData] = useState([])
    const [unknownCopy, setUnknownCopy] = useState([])
    useEffect(()=>{
        let mainArr = cloneDeep(props.mainTable)
        let unknownArr = cloneDeep(props.unknownTable)
        
        setMainData(mainArr)
        state.loadData = cloneDeep(props.loadTable)
        state.gridData = cloneDeep(props.gridTable)

        setUnknownData(unknownArr)
        setUnknownCopy(unknownArr)
    },[props])

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const unknownToMain = () => {
        if(mainData.length == 1) {
            messageApi.open({
                type: 'warning',
                content:'当前线路已有总表！',
            })
            return;
        }else if( selectedRowKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请至少选择一个设备！',
            })
            return;
        }else if(selectedRowKeys.length > 1 ) {
            messageApi.open({
                type: 'warning',
                content:'线路总表只能有一个设备！',
            })
            return;
        }else{
            let arr = [...unknownData];
            let arr2 = [];
            for(let i =0;i< arr.length;i++){
                for(let j = 0;j<selectedRowKeys.length;j++){
                    if(arr[i].sn == selectedRowKeys[j]){
                        arr2.push(arr[i])
                        arr.splice(i,1)
                    }
                }
            }
            setMainData(mainData.concat(arr2));
            setUnknownData(arr);
            setSelectedRowKeys([])
        }
        
    }

    const unknownToLoad = () => {
        if(state.loadData.length == 1) {
            messageApi.open({
                type: 'warning',
                content:'当前线路已有负载总表！',
            })
            return;
        }else if( selectedRowKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请至少选择一个设备！',
            })
            return;
        }else if(selectedRowKeys.length > 1 ) {
            messageApi.open({
                type: 'warning',
                content:'负载总表只能有一个设备！',
            })
            return;
        }else{
            let arr = [...unknownData];
            let arr2 = [];
            for(let i =0;i< arr.length;i++){
                for(let j = 0;j<selectedRowKeys.length;j++){
                    if(arr[i].sn == selectedRowKeys[j]){
                        arr2.push(arr[i])
                        arr.splice(i,1)
                    }
                }
            }
            state.loadData = state.loadData.concat(arr2)
            setUnknownData(arr);
            setSelectedRowKeys([])
        }
        
    }

    const unknownToGrid = () => {
        if(state.gridData.length == 1) {
            messageApi.open({
                type: 'warning',
                content:'当前线路已有并网总表！',
            })
            return;
        }else if( selectedRowKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请至少选择一个设备！',
            })
            return;
        }else if(selectedRowKeys.length > 1 ) {
            messageApi.open({
                type: 'warning',
                content:'并网总表只能有一个设备！',
            })
            return;
        }else{
            let arr = [...unknownData];
            let arr2 = [];
            for(let i =0;i< arr.length;i++){
                for(let j = 0;j<selectedRowKeys.length;j++){
                    if(arr[i].sn == selectedRowKeys[j]){
                        arr2.push(arr[i])
                        arr.splice(i,1)
                    }
                }
            }
            state.gridData = state.gridData.concat(arr2)
            setUnknownData(arr);
            setSelectedRowKeys([])
        }
        
    }



    //总表->未知
    const [selectedMainKeys, setSelectedMainKeys] = useState([]);
    const onSelectMain = (newSelectedRowKeys) => {
        setSelectedMainKeys(newSelectedRowKeys);
    };
    const mainSelection = {
        selectedMainKeys,
        onChange: onSelectMain,
    };
    const MainToUnknown = () => {
        if( selectedMainKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请先选择设备！',
            })
            return;
        }else{
            setUnknownData(unknownData.concat(mainData))
            setMainData([]);
            setSelectedMainKeys([]);
        }
    }
    

    //负载总表->未知
    const [selectedLoadKeys, setSelectedLoadKeys] = useState([]);
    const onSelectLoad = (newSelectedRowKeys) => {
        setSelectedLoadKeys(newSelectedRowKeys);
    };
    const loadSelection = {
        selectedLoadKeys,
        onChange: onSelectLoad,
    };
    const LoadToUnknown = () => {
        if( selectedLoadKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请先选择设备！',
            })
            return;
        }else{
            setUnknownData(unknownData.concat(state.loadData))
            state.loadData = []
            setSelectedLoadKeys([]);
        }
    }

    //并网总表->未知
    const [selectedGridKeys, setSelectedGridKeys] = useState([]);
    const onSelectGrid = (newSelectedRowKeys) => {
        setSelectedGridKeys(newSelectedRowKeys);
    };
    const gridSelection = {
        selectedGridKeys,
        onChange: onSelectGrid,
    };
    const GridToUnknown = () => {
        if( selectedGridKeys.length == 0 ){
            messageApi.open({
                type: 'warning',
                content:'请先选择设备！',
            })
            return;
        }else{
            setUnknownData(unknownData.concat(state.gridData))
            state.gridData = []
            setSelectedGridKeys([]);
        }
    }

    const handleClose = () => {
        props.closeValue('close');
    }
    const handleSave = () => {
        props.saveValue({
            mainData,
            loadData:state.loadData,
            gridData: state.gridData,
            unknownData,
        })
    }
    let tag = columns[0].key;


    const onSearchUnknown = (value) => {
        let arr = [];
        setSelectedRowKeys([])
        if(value == '') {
            setUnknownData([...unknownCopy]);
        }else{
            unknownCopy.map(item => {
                if(item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1){
                    arr.push(item)
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
        width: "100%",
      }
    : {
        height: "46px",
        width: "100%",
      };
    return (
        <Mainbox>
            {contextHolder}
            <div className="leftTable">
                <div className="mainTable">
                    <div className="publicTitle">{props.transferTitle.mainTitle}</div>
                    <div className="outwrap">
                    <div className="tbwrap"> 
                        <UsetTable bordered dataSource={mainData} columns={columns}   rowKey='sn' pagination={false} rowSelection ={mainSelection} ></UsetTable>
                    </div>
                    </div>
                </div>
                <div className="mainTable">
                    <div className="publicTitle">{props.transferTitle.loadTitle}</div>
                    <div className="outwrap">
                    <div className="tbwrap"> 
                        <UsetTable bordered dataSource={state.loadData} columns={columns}   rowKey='sn' pagination={false} rowSelection ={loadSelection} ></UsetTable>
                    </div>
                    </div>
                </div>
                <div className="mainTable">
                    <div className="publicTitle">{props.transferTitle.gridTitle}</div>
                    <div className="outwrap">
                    <div className="tbwrap"> 
                        <UsetTable bordered dataSource={state.gridData} columns={columns}   rowKey='sn' pagination={false} rowSelection ={gridSelection} ></UsetTable>
                    </div>
                    </div>
                </div>
            </div>
            <div className="actions">
                <div className="ops"> 
                <div className="btns">
                   <CustButton icon={<LeftOutlined />} style={btnsty} onClick={unknownToMain}></CustButton>
                    <CustButton icon={<RightOutlined />} style={btnsty} onClick={MainToUnknown}></CustButton>                 
                </div>
                <div className="btns">
                   <CustButton icon={<LeftOutlined />} style={btnsty} onClick={unknownToLoad}></CustButton>
                    <CustButton icon={<RightOutlined />} style={btnsty} onClick={LoadToUnknown}></CustButton>                 
                </div>
                <div className="btns">
                   <CustButton icon={<LeftOutlined />} style={btnsty} onClick={unknownToGrid}></CustButton>
                    <CustButton icon={<RightOutlined />} style={btnsty} onClick={GridToUnknown}></CustButton>                 
                </div>
                </div>
                <div className="saves">
                <CustButtonT onClick={handleSave} style={savesty} text="save" />                 
                    <CustButtonT  type="default" style={savesty} onClick={ ()=> handleClose()} text="cancel" />
                </div>

                {/* <div className={style.firstButton}>
                    <span className={style.leftButton} onClick={()=>unknownToMain()}>
                        <LeftOutlined />
                    </span>
                    <span className={style.rightButton} onClick={()=>MainToUnknown()}>
                        <RightOutlined />
                    </span>
                </div>
                <div className={style.firstButton}>
                    <span className={style.leftButton} onClick={()=>unknownToLoad()}>
                        <LeftOutlined />
                    </span>
                    <span className={style.rightButton} onClick={()=>LoadToUnknown()}>
                        <RightOutlined />
                    </span>
                </div>
                <div className={style.firstButton}>
                    <span className={style.leftButton} onClick={()=>unknownToGrid()}>
                        <LeftOutlined />
                    </span>
                    <span className={style.rightButton} onClick={()=>GridToUnknown()}>
                        <RightOutlined />
                    </span>
                </div>
                <div className={style.finalButton}>
                    <div className={style.saveButton} onClick={ ()=> handleSave()}>保存</div>
                    <div className={style.closeButton} onClick={ ()=> handleClose()}>关闭</div>
                </div> */}
            </div>
            <div className="rightTable">
                <div className="publicTitle">{props.transferTitle.unknownTitle}</div>
                <div className="searchInput">
                    <div style={{marginRight: 16}}>设备搜索</div>
                    <Search placeholder="请输入设备编号/安装地址" style={{width: 256}} enterButton onSearch={onSearchUnknown}></Search>
                </div>
               
                <div className="outwrap">
                <div className="tbwrap"> 
                    <UsetTable bordered dataSource={unknownData} columns={columns}   rowKey='sn' pagination={false}   rowSelection={rowSelection}></UsetTable>
                </div>
                </div>
                
            </div>
        </Mainbox>
    )
}