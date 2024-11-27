import React, { useEffect, useState } from "react";
import {useTranslation} from "react-i18next"
import style from './style.module.less'
import { Table, Input, message, Select, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import {CustButton} from '@com/useButton'
export default function index (props) {
    const {t} = useTranslation(["button"])
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
    const [subData, setSubData] = useState([])
    const [subCopy, setSubCopy] = useState([])
    const [unknownData, setUnknownData] = useState([])
    const [unknownCopy, setUnknownCopy] = useState([])
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
     //   console.log(newSelectedRowKeys)
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

            console.log(selectedRowKeys)
            selectedRowKeys.forEach(id => {
               let idx = arr.findIndex(a => a.id == id);
               if(idx >-1) {
                 let item = arr.splice(idx, 1);
                 copyArr.splice(idx,1)
                 arr2.push(...item)
               }
            })

           /*  for(let i =0;i< arr.length;i++){
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
            } */
            console.log(arr2);
          //  setSubData(subData.concat(arr2));
           // setSubCopy(subCopy.concat(arr2));
            setSubData([...arr2, ...subData])
            setSubCopy([...arr2, ...subCopy])
            setUnknownData([...arr]);
            setUnknownCopy([...copyArr]);
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
            console.log(selectedSubKeys)
            selectedSubKeys.forEach(id => {
                let idx = arr.findIndex(a => a.id == id);
                if(idx >-1) {
                  let item = arr.splice(idx, 1);
                  copyArr.splice(idx,1)
                  arr2.push(...item)
                }
             })
           /*  for(let i =0;i< arr.length;i++){
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
            } */
          //  setUnknownData(unknownData.concat(arr2));
          //  setUnknownCopy(unknownCopy.concat(arr2));
          setUnknownData([...arr2, ...unknownData]);
         setUnknownCopy([...arr2, ...unknownCopy]);
            setSubData([...arr])
            setSubCopy([...copyArr])
           setSelectedSubKeys([])
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

    return (
        <div className={style.transferContent}>
            {contextHolder}
            <div className={style.leftTable}>
                <div className={style.otherSubTable}>
                    <div className={style.publicTitle}>{props.transferTitle.subTitle}</div>
                    <div className={style.searchInput}>
                        <span style={{marginRight: 16}}>设备搜索</span>
                        <Search placeholder="请输入设备编号/安装地址" style={{width: 256}} enterButton onSearch={onSearchSub}></Search>
                    </div>
                    <div>
                        <Table bordered dataSource={subData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{y:500}} rowSelection={subSelection}></Table>
                    </div>
                </div>
            </div>
            <div className={style.actions}>
                <Space size={16}>
                   <CustButton icon={<LeftOutlined />} style={{height:"46px", width: "68px"}} onClick={unknownToSub}></CustButton>
                    <CustButton icon={<RightOutlined />} style={{height:"46px", width: "68px"}} onClick={subToUnknown}></CustButton>                 
                </Space>
                <Space size={16} direction="vertical">
                <CustButton onClick={handleSave} style={{height:"46px", width: "100%"}} >{t("button:save")}</CustButton>                  
                    <CustButton  type="default" style={{height:"46px", width: "100%"}} onClick={ ()=> handleClose()}>{t("button:cancel")}</CustButton>
                </Space>
            </div>
            <div className={style.rightTable}>
                <div className={style.publicTitle}>{props.transferTitle.unknownTitle}</div>
                <div className={style.searchInput}>
                    <span>设备类型</span>
                    <Select
                        size="middle"
                        defaultValue={0}
                        style={{ marginLeft: 16, width: '112px'}}
                        onChange={changeType}
                    >   
                        <Select.Option  value={0}>全部类型</Select.Option>
                        <Select.Option  value={1}>电表</Select.Option>
                        <Select.Option  value={2}>水表</Select.Option>
                        <Select.Option  value={3}>燃气表</Select.Option>
                        <Select.Option  value={12}>断路器</Select.Option>
                    </Select>
                    <div style={{ width:0, height: 32, margin: '0 32px', borderLeft:'1px dashed #ddd' }}></div>
                    <span style={{marginRight: 16}}>设备搜索</span>
                    <Search placeholder="请输入设备编号/安装地址" style={{width: 256}} enterButton onSearch={onSearchUnknown}></Search>
                </div>
                <div>
                    <Table bordered dataSource={unknownData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{y:500}} rowSelection={rowSelection}></Table>
                </div>
            </div>
        </div>
    )
}