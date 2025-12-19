import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import styled, {css} from "styled-components";
 
import { useSelector } from 'react-redux'
import { Table, Input, message, Select, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import { CustButton } from '@com/useButton'
import { Monitoring } from '@api/api.js'
import {GlobalStyle} from "@com/comstyled"
import { 
    adaptation 
  } from "@redux/systemconfig.js";
const sty= css`
padding: 16px;
 .actions {
    padding: 0 16px;
 }
`
const Mainbox = styled.div`
&& {
    width:  calc(100% - 200px);
    height:  calc(100% - 84px);
    background-color: #003366;
    padding: 32px;
    display: flex;
    position: absolute;
    top:64px;
    left:200px;
   // transform: translateX(200px);
    z-index: 1000; 
    .publicTitle{
    height: 32px;
    padding-left: 16px;
    margin-bottom: 16px;
    line-height: 32px;
    font-size: 14px;
    color: #333;
    border-left: 4px solid var(--ant-primary-color);
}
.searchInput{
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}
    .otherSubTable{
    flex: 1 1 692px;
 //   height: 696px;
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
    margin-bottom: 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .actions{
    padding: 0 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: stretch;
    .firstButton{
        margin-top: 64px;
    }
    .secondButton{
        margin-top: 182px;
        display: flex;
        justify-content: space-between;
    }
    .leftButton{
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
        &:hover{
            background-color: rgba(64, 158, 255, 1);
        }
    }
    .rightButton{
        display: inline-block;
        width: 68px;
        height: 46px;
        margin-left:10px;
        background-color: var(--ant-primary-color);
        border-radius: 4px;
        cursor: pointer;
        color: #fff;
        font-size: 20px;
        line-height: 46px;
        text-align: center;
        &:hover{
            background-color: rgba(64, 158, 255, 1);
        }
    }
    .finalButton{
        margin-top: 180px;
        .saveButton{
            width: 146px;
            height: 40px;
            background-color: var(--ant-primary-color);
            border-radius: 4px;
            cursor: pointer;
            color: #fff;
            font-size: 14px;
            line-height: 40px;
            text-align: center;
            &:hover{
                background-color: rgba(64, 158, 255, 1);
            } 
        }
        .closeButton{
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
            &:hover{
                opacity: 0.5;
            } 
        }
    }
  }
  .rightTable{
     flex: 1 1 714px;
  //  height: 696px;
    border-radius: 2px;
    padding: 16px;
    background-color: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
    .tablebox{ 
        height: inherit;
        overflow: auto;
    }
}
${props => props.theme.laptop ? sty : null}
}

`
const { ComparativeAnalysis: { AllDeviceStyle, QueryCompareDevice } } = Monitoring
export default function index(props) {
    
    const projectId = useSelector(state => state.system.menus.projectId)
    const {laptop} = useSelector(adaptation)
    const { t } = useTranslation(["button"])
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
    const [subData, setSubData] = useState([])
    const [subCopy, setSubCopy] = useState([])
    const [unknownData, setUnknownData] = useState([])
    const [unknownCopy, setUnknownCopy] = useState([])
    useEffect(() => {
        let subArr = cloneDeep(props.subTable)
        setSubData(subArr)
        setSubCopy(subArr)
        let unknownArr = cloneDeep(props.unknownTable)
        setUnknownData(unknownArr)
        setUnknownCopy(unknownArr)
        setType(0)
        setSearchUnknown('')
    }, [props])

    const [devices, setDevies] = useState([])
    const getType = async () => { // 获取设备类型

        try {
            let { success, data } = await AllDeviceStyle(projectId);
            if (success && Array.isArray(data)) {
                setDevies([{
                    deviceStyle: 0, name: '全部类型',
                }, ...data]);
            } else {
                setDevies([]);
            }
        } catch (error) {
            setDevies([]);
        }
    }
    const getDevices = async () => {

        console.log(projectId, type, subData);
        const resp = await QueryCompareDevice(projectId, type, searchUnknown)
        if (resp.success && Array.isArray(resp.data)) {
            setUnknownData(resp.data)
        }



    }
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
        if (selectedRowKeys.length == 0) {
            messageApi.open({
                type: 'warning',
                content: '请至少选择一个设备！',
            })
            return;
        } else {
            let arr = [...unknownData];
            let arr2 = [];
            let copyArr = [...unknownCopy];

            console.log(selectedRowKeys)
            selectedRowKeys.forEach(id => {
                let idx = arr.findIndex(a => a.id == id);
                if (idx > -1) {
                    let item = arr.splice(idx, 1);
                    copyArr.splice(idx, 1)
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
        if (selectedSubKeys.length == 0) {
            messageApi.open({
                type: 'warning',
                content: '请先选择设备！',
            })
            return;
        } else {
            let arr = [...subData];
            let arr2 = [];
            let copyArr = [...subCopy]
            console.log(selectedSubKeys)
            selectedSubKeys.forEach(id => {
                let idx = arr.findIndex(a => a.id == id);
                if (idx > -1) {
                    let item = arr.splice(idx, 1);
                    copyArr.splice(idx, 1)
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
        setSearchknown('')
        setSearchUnknown('')
    }
    const messageContent = (type, content) => {
        messageApi.open({
            type,
            content,
        });
    };
    const handleSave = () => {
        console.log(subData);
        if (subData.length < 2) return messageApi.open({
            type: 'warning',
            content: '请至少选择两个设备进行对比分析！',
        })
       const sns =  subData.map(item=>item.sn)

       if( new Set(sns).size !== sns.length){
        return messageApi.open({
            type: 'warning',
            content: '设备编号相同，请重选！',
        })
       }
        props.saveValue({
            subData,
            unknownCopy,
        })
        props.closeValue('close');
        setSearchknown('')
        setSearchUnknown('')
        // props.subTable = subData
    }
    let tag = columns[0].key;
    const [searchknown, setSearchknown] = useState('')

    const onSearchSub = (value) => {
        let arr = [];
        if (value == '') {
            setSubData([...subCopy]);
        } else {
            subCopy.map(item => {
                if (item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1) {
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
        if (value == '') {
            // setUnknownData([...unknownCopy]);
            if (type == 0) {
                setUnknownData([...unknownCopy]);
            } else {
                unknownCopy.map(item => {
                    if (item.meterType == type) {
                        arr.push(item)
                    }
                })
                setUnknownData([...arr]);
            }
        } else {
            unknownCopy.map(item => {
                if (item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1) {
                    if (type == 0) {
                        arr.push(item)
                    } else if (type != 0 && item.meterType == type) {
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
        if (value == 0) {
            if (searchUnknown == '') {
                setUnknownData([...unknownCopy]);
            } else {
                unknownCopy.map(item => {
                    if (item[tag].indexOf(searchUnknown) != -1 || item.address.indexOf(searchUnknown) != -1) {
                        arr.push(item)
                    }
                })
                setUnknownData([...arr]);
            }
        } else {
            unknownCopy.map(item => {
                if (item.meterType == value) {
                    if (searchUnknown == '') {
                        arr.push(item)
                    } else if (searchUnknown != '' && (item[tag].indexOf(searchUnknown) != -1 || item.address.indexOf(searchUnknown) != -1)) {
                        arr.push(item)
                    }
                }
            })
            setUnknownData([...arr]);
        }
    }

    useEffect(() => {
        getType();
    }, [])
    useEffect(() => {
        getDevices()
    }, [type, searchUnknown])
    const btsty =laptop ? {
        height: "32px",
        width: "48px",
    }: { height: "46px", width: "68px" }
    const htsty =laptop ? {
       height: "32px"
    }: {
        height: "46px"
    }
    return (
        <Mainbox >
            {contextHolder}
            
                <div className="otherSubTable">
                    <div className="publicTitle">{props.transferTitle.subTitle}</div>
                    <div className="searchInput">
                        <span style={{ marginRight: 16 }}>设备搜索</span>
                        <Search placeholder="请输入设备编号/安装地址" value={searchknown} onChange={(e) => setSearchknown(e.target.value)}
                         style={{ width: 256 }} enterButton onSearch={onSearchSub}></Search>
                    </div>
                     
                        <Table style={{overflow: "auto"}} bordered dataSource={subData} columns={columns} size='middle' rowKey='id' pagination={false}   rowSelection={subSelection}></Table>
                     
                </div>
             
            <div className="actions">
                <Space size={16}>
                    <CustButton icon={<LeftOutlined />} style={btsty} onClick={unknownToSub}></CustButton>
                    <CustButton icon={<RightOutlined />} style={btsty} onClick={subToUnknown}></CustButton>
                </Space>
                <Space size={16} direction="vertical">
                    <CustButton onClick={handleSave} style={{  ...htsty, width: "100%" }} >{t("button:save")}</CustButton>
                    <CustButton type="default" style={{ ...htsty, width: "100%" }} onClick={() => handleClose()}>{t("button:cancel")}</CustButton>
                </Space>
            </div>
            <div className="rightTable">
                <div className="publicTitle">{props.transferTitle.unknownTitle}</div>
                <div className="searchInput">
                    <span>设备类型</span>
                    <GlobalStyle />
                    <Select
                        size="middle"
                        defaultValue={0}
                        style={{ marginLeft: 16, width: '112px' }}
                        onChange={changeType}
                        options={devices}
                        fieldNames={{ label: "name", value: "deviceStyle" }}
                    >
                        {/* <Select.Option value={0}>全部类型</Select.Option>
                        <Select.Option value={1}>电表</Select.Option>
                        <Select.Option value={2}>水表</Select.Option>
                        <Select.Option value={3}>燃气表</Select.Option> */}
                    </Select>
                   {laptop ? null :  <div style={{ width: 0, height: 32, margin: '0 32px', borderLeft: '1px dashed #ddd' }}></div>}
                    <span style={{ marginRight: 16 }}>设备搜索</span>
                    <Search placeholder="请输入设备编号/安装地址" value={searchUnknown} onChange={(e) => setSearchUnknown(e.target.value)}
                     style={{ width: laptop ? 160 : 256 }} enterButton onSearch={onSearchUnknown}></Search>
                </div>
                
                    <Table style={{overflow: "auto"}} bordered dataSource={unknownData} columns={columns} size='middle' rowKey='id' pagination={false}    rowSelection={rowSelection}></Table>
                 
            </div>
        </Mainbox>
    )
}