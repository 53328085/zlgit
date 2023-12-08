import React, { useEffect, useState } from "react";
import style from './style.module.less'
import { Table, Input, message } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";

export default function index (props) {
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
    const type = props.type // 调用组件的父组件
    const [mainData, setMainData] = useState([])
    const [subData, setSubData] = useState([])
    const [subCopy, setSubCopy] = useState([])
    const [unknownData, setUnknownData] = useState([])
    const [unknownCopy, setUnknownCopy] = useState([])
    const [searchValue,setSearchValue] = useState("")
    useEffect(()=>{
        let mainArr = cloneDeep(props.mainTable)
        let subArr = cloneDeep(props.subTable)
        let unknownArr = cloneDeep(props.unknownTable)
    
        setMainData(mainArr)
        setSubData(subArr)
        setSubCopy(subArr)
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

    const unknownToSub = () => {
      if(subData.length>0 && type == "fiber"){  // fiber 光纤测温
            messageApi.open({
                type: 'warning',
                content:'光纤设备至多添加一个！',
            })
            return;
        } 
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
        console.log(newSelectedRowKeys)
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
            setSelectedSubKeys([])
        }
    }

    const handleClose = () => {
        setSearchValue("")
        props.closeValue('close');
        
    }
    const handleSave = () => {
        props.saveValue({
            mainData,
            subData,
            unknownData,
        })
    }
    let tag = columns[0].key;
    let keys = columns.map(c => c.key);
    console.log(keys)
    const onSearchSub = (value) => {
       
        let arr = [];
      
        setSelectedSubKeys([])
        if(value == '') {
            setSubData([...subCopy]);
        }else{
             
            subCopy.map(item => {
                let f = []
                for(let key of keys) {
                  f.push(item[key].indexOf(value) !=-1)
                }
                if(f.includes(true))  arr.push(item);  
                /* if(item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1){
                    arr.push(item)
                } */
            })
            setSubData([...arr]);
        }
    }

    const onSearchUnknown = (value) => {
        let arr = [];
        setSelectedRowKeys([])
        if(value == '') {
            setUnknownData([...unknownCopy]);
        }else{
            unknownCopy.map(item => {
                let f = []
                for(let key of keys) {
                  f.push(item[key].indexOf(value) !=-1)
                }
                if(f.includes(true))  arr.push(item);  
               /*  if(item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1){
                    arr.push(item)
                } */
            })
            setUnknownData([...arr]);
        }
    }

    return (
        <div className={style.transferContent}>
            {contextHolder}
            { props.transferTitle.mainTitle != '' ? 
            <div className={style.leftTable}>
                <div className={style.mainTable}>
                    <div className={style.publicTitle}>{props.transferTitle.mainTitle}</div>
                    <div className={style.mainContent}>
                        <Table bordered dataSource={mainData} columns={columns} size='middle' rowKey='id' pagination={false} rowSelection ={mainSelection} scroll={{y:50}}></Table>
                    </div>
                </div>
                <div className={style.subTable}>
                    <div className={style.publicTitle}>{props.transferTitle.subTitle}</div>
                    <div className={style.searchInput}>
                        <span style={{marginRight: 16}}>设备搜索</span>
                        <Search placeholder="请输入设备编号/安装地址" style={{width: 256}} enterButton onSearch={onSearchSub}></Search>
                    </div>
                    <div className={style.mainContent}>
                        <Table bordered dataSource={subData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{y:270}} rowSelection={subSelection}></Table>
                    </div>
                </div>
            </div> : 
            <div className={style.leftTable}>
                <div className={style.otherSubTable}>
                    <div className={style.publicTitle}>{props.transferTitle.subTitle}</div>
                    <div className={style.searchInput}>
                        <span style={{marginRight: 16}}>设备搜索</span>
                        <Search placeholder="请输入设备编号/安装地址" style={{width: 256}} enterButton onSearch={onSearchSub}></Search>
                    </div>
                    <div className={style.mainContent}>
                        <Table bordered dataSource={subData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{y:500}} rowSelection={subSelection}></Table>
                    </div>
                </div>
            </div>
            }
            <div className={style.actions}>
                { props.transferTitle.mainTitle != ''? 
                <div className={style.firstButton}>
                    <span className={style.leftButton} onClick={()=>unknownToMain()}>
                        <LeftOutlined />
                    </span>
                    <span className={style.rightButton} onClick={()=>MainToUnknown()}>
                        <RightOutlined />
                    </span>
                </div> : null }
                <div className={style.secondButton}>
                    <span className={style.leftButton} onClick={() => unknownToSub() }>
                        <LeftOutlined />
                    </span>
                    <span className={style.rightButton} onClick={() => subToUnknown() }>
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
                    <Search 
                    placeholder="请输入设备编号/安装地址" 
                    style={{width: 256}} 
                    enterButton 
                    onSearch={onSearchUnknown} 
                    value={searchValue}
                    onChange={(e)=>{setSearchValue(e.target.value)}}
                    ></Search>
                </div>
                <div className={style.mainContent}>
                    <Table bordered dataSource={unknownData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{y:500}} rowSelection={rowSelection}></Table>
                </div>
            </div>
        </div>
    )
}