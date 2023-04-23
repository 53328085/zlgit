import React, { useEffect, useState } from "react";
import style from './style.module.less'
import { Table, Input, message } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import { useReactive } from "ahooks";

export default function index (props) {
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
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
                    if(arr[i].id == selectedRowKeys[j]){
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
                    if(arr[i].id == selectedRowKeys[j]){
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
                    if(arr[i].id == selectedRowKeys[j]){
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

    return (
        <div className={style.transferContent}>
            {contextHolder}
            <div className={style.leftTable}>
                <div className={style.mainTable}>
                    <div className={style.publicTitle}>{props.transferTitle.mainTitle}</div>
                    <div className={style.mainContent}>
                        <Table bordered dataSource={mainData} columns={columns} size='middle' rowKey='id' pagination={false} rowSelection ={mainSelection} ></Table>
                    </div>
                </div>
                <div className={style.mainTable}>
                    <div className={style.publicTitle}>{props.transferTitle.loadTitle}</div>
                    <div className={style.mainContent}>
                        <Table bordered dataSource={state.loadData} columns={columns} size='middle' rowKey='id' pagination={false} rowSelection ={loadSelection} ></Table>
                    </div>
                </div>
                <div className={style.mainTable}>
                    <div className={style.publicTitle}>{props.transferTitle.gridTitle}</div>
                    <div className={style.mainContent}>
                        <Table bordered dataSource={state.gridData} columns={columns} size='middle' rowKey='id' pagination={false} rowSelection ={gridSelection} ></Table>
                    </div>
                </div>
            </div>
            <div className={style.actions}>
                <div className={style.firstButton}>
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
                </div>
            </div>
            <div className={style.rightTable}>
                <div className={style.publicTitle}>{props.transferTitle.unknownTitle}</div>
                <div className={style.searchInput}>
                    <span style={{marginRight: 16}}>设备搜索</span>
                    <Search placeholder="请输入设备编号/安装地址" style={{width: 256}} enterButton onSearch={onSearchUnknown}></Search>
                </div>
                <div className={style.mainContent}>
                    <Table bordered dataSource={unknownData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{y:500}} rowSelection={rowSelection}></Table>
                </div>
            </div>
        </div>
    )
}