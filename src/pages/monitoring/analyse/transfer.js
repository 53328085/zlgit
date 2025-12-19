import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import style from './style.module.less'
import styled, {css} from "styled-components";
import { useSelector } from 'react-redux'
import { Table, Input, message, Select, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import { CustButton } from '@com/useButton'
import { Monitoring } from '@api/api.js'
import {
    adaptation
  } from "@redux/systemconfig.js";
const { ComparativeAnalysis: { AllDeviceStyle, QueryCompareDevice } } = Monitoring
import {  i18t, i18warning, CustButtonT} from "@com/useButton"
import {GlobalStyle} from "@com/comstyled"
const sty = css`
 justify-content: flex-start;
 row-gap: 32px;
 padding-top: 32px;
`
const TransferContent = styled.div`
&&{
    width: calc(100% - 200px);
   // width: 1680px;
    //height:100%;
    background-color: #003366;
    padding: 32px;
    display: flex;
    position: absolute;
   // top:50%;
    transform: translate(200px, 64px);
    min-height: calc(100% - 64px);
    overflow: auto;
    display: flex;
    .otherSubTable{
     flex: 1 1 692px;
  //  height: 696px;
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
    margin-bottom: 32px;
}
    .publicTitle{
    height: 32px;
    padding-left: 16px;
    margin-bottom: 16px;
    line-height: 32px;
    font-size: 15px;
    color: #333;
    position: relative;
    display: flex;
    align-items: center;
  
   // border-left: 4px solid var(--ant-primary-color);
}
.searchInput{
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}


.actions{
    padding: ${props=> props.laptop ? "0 16px" : "32px"};
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: stretch;
 
   .arrow{
    height: 46px;
     width: ${props=> props.laptop ? "38px" : "68px"};
   }

   ${props => props.laptop ? sty : null};
   
}
.rightTable{
    flex: 1 1 714px;
 //   height: 696px;
    border-radius: 2px;
    padding: 16px;
    background-color: #fff;
}
}
 








`


export default function index(props) {
    const {laptop} = useSelector(adaptation)
    const projectId = useSelector(state => state.system.menus.projectId)
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
                    deviceStyle: 0, name: i18t("comm","All",{text: "类型"}),
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
                content: i18t("monitor","info1") // '请至少选择一个设备！',
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
                content: i18t("monitor","compare") // '请先选择设备！',
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
    }
    const messageContent = (type, content) => {
        messageApi.open({
            type,
            content,
        });
    };
    const handleSave = () => {
        console.log(subData.length);
        if (subData.length < 2) return messageApi.open({
            type: 'warning',
            content:  i18t("monitor","info1") // '请至少选择两个设备进行对比分析！',
        })

        props.saveValue({
            subData,
            unknownCopy,
        })
        props.closeValue('close');
        // props.subTable = subData
    }
    let tag = columns[0].key;

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
    return (
        <TransferContent laptop={laptop}>
            {contextHolder}
          
                <div className="otherSubTable">
                    <div className="publicTitle title-line-zl">{props.transferTitle.subTitle}</div>
                    <div className="searchInput">
                        <div style={{ marginRight: laptop ? 8 : 16 }}>{i18t("comm","Query",{text:"设备"})}</div>
                        <Search placeholder={i18t("comm","placeholder", {text:"设备编号/安装地址"})}  enterButton onSearch={onSearchSub} style={{width: "256px"}}></Search>
                    </div>
                    <div>
                        <Table bordered dataSource={subData} columns={columns} size={laptop ? "small" : "middle"} rowKey='id' pagination={false} scroll={{ y: 500 }} rowSelection={subSelection}></Table>
                    </div>
                </div>
          
            <div className="actions">
                <Space size={16}>
                    <CustButton icon={<LeftOutlined />}  className="arrow" onClick={unknownToSub}></CustButton>
                    <CustButton icon={<RightOutlined />} className="arrow" onClick={subToUnknown}></CustButton>
                </Space>
                <Space size={16} direction="vertical">
                    <CustButton onClick={handleSave} style={{ height: "46px", width: "100%" }} >{t("button:save")}</CustButton>
                    <CustButton type="default" style={{ height: "46px", width: "100%" }} onClick={() => handleClose()}>{t("button:cancel")}</CustButton>
                </Space>
            </div>
            <div className="rightTable">
                <div className="publicTitle title-line-zl">{props.transferTitle.unknownTitle}</div>
                <div className="searchInput">
                    <span>{i18t("comm","type",{text: "设备"})}</span>
                    <GlobalStyle />
                    <Select
                        size="middle"
                        defaultValue={0}
                        style={{ marginLeft: laptop ? 8 : 16, width: '112px' }}
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
                    <div style={{ marginRight: laptop ? 8 : 16 }}>{i18t("comm","Query",{text:"设备"})}</div>
                    <Search placeholder={i18t("comm","placeholder", {text:"设备编号/安装地址"})}   enterButton onSearch={onSearchUnknown} style={{ width: laptop ? "180px" :"256px"}}></Search>
                </div>
                <div>
                    <Table bordered dataSource={unknownData} columns={columns} size={laptop ? "small" : "middle"} rowKey='id' pagination={false} scroll={{ y: 500 }} rowSelection={rowSelection}></Table>
                </div>
            </div>
        </TransferContent>
    )
}