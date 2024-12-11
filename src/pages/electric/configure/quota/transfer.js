import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import style from './style.module.less'
import { useSelector } from 'react-redux'
import { Table, Input, message, Select, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import { CustButton } from '@com/useButton'
import { Monitoring } from '@api/api.js'
const { ComparativeAnalysis: { AllDeviceStyle, QueryCompareDevice } } = Monitoring
export default function index(props) {
    console.log(props);
    const projectId = useSelector(state => state.system.menus.projectId)
    const { t } = useTranslation(["button"])
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
    const [alarmOpenData, setAlarmOpenData] = useState([])
    const [alarmOpenCopy, setAlarmOpenCopy] = useState([])
    const [alarmCloseData, setAlarmloseData] = useState([])
    const [alarmloseCopy, setAlarmloseCopy] = useState([])
    const [noalarmOpenData, setNoalarmOpenData] = useState([])
    const [noalarmOpenCopy, setNoalarmOpenCopy] = useState([])
    const [noalarmloseData, setNoalarmloseData] = useState([])
    const [noalarmloseCopy, setNoalarmloseCopy] = useState([])
    const [unknownData, setUnknownData] = useState([])
    const [unknownCopy, setUnknownCopy] = useState([])
    useEffect(() => {
        let subArr = cloneDeep(props.subTable)
        setAlarmOpenData(subArr)
        setAlarmOpenCopy(subArr)
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

        console.log(projectId, type, alarmOpenData);
        const resp = await QueryCompareDevice(projectId, type, searchUnknown)
        if (resp.success && Array.isArray(resp.data)) {
            setUnknownData(resp.data)
        }



    }
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // const [selectedSubKeys, setSelectedSubKeys] = useState([]);
    const [selectedLeftOpenKeys, setSelectedLeftOpenKeys] = useState([]);
    const [selectedLeftCloseKeys, setSelectedLeftCloseKeys] = useState([]);
    const [selectedNoLeftOpenKeys, setSelectedNoLeftOpenKeys] = useState([]);
    const [selectedNoLeftCloseKeys, setSelectedNoLeftCloseKeys] = useState([]);
    const onLeftSelect1 = (newSelectedRowKeys) => {
        setSelectedLeftOpenKeys(newSelectedRowKeys);
    };
    const onLeftSelect2 = (newSelectedRowKeys) => {
        setSelectedLeftCloseKeys(newSelectedRowKeys);
    };
    
    const onLeftSelect3 = (newSelectedRowKeys) => {
        setSelectedNoLeftOpenKeys(newSelectedRowKeys);
    };
    
    const onLeftSelect4 = (newSelectedRowKeys) => {
        setSelectedNoLeftCloseKeys(newSelectedRowKeys);
    };
    const onRight = (newSelectedRowKeys) => {
        //   console.log(newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rightKeys = {
        selectedRowKeys,
        onChange: onRight,
    };

    const leftOpenKeys = {
        selectedRowKeys: selectedLeftOpenKeys,
        onChange: onLeftSelect1,
    };
    const leftCloseKeys = {
        selectedRowKeys: selectedLeftCloseKeys,
        onChange: onLeftSelect2,
    };
    const leftNoOpenKeys = {
        selectedRowKeys: selectedNoLeftOpenKeys,
        onChange: onLeftSelect3,
    };
    const leftNoCloseKeys = {
        selectedRowKeys: selectedNoLeftCloseKeys,
        onChange: onLeftSelect4,
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
            //  setAlarmOpenData(alarmOpenData.concat(arr2));
            // setAlarmOpenCopy(alarmOpenCopy.concat(arr2));
            setAlarmOpenData([...arr2, ...alarmOpenData])
            setAlarmOpenCopy([...arr2, ...alarmOpenCopy])
            setUnknownData([...arr]);
            setUnknownCopy([...copyArr]);
            setSelectedRowKeys([])
        }
    }
    const subToUnknown = () => {
        if (selectedSubKeys.length == 0) {
            messageApi.open({
                type: 'warning',
                content: '请先选择设备！',
            })
            return;
        } else {
            let arr = [...alarmOpenData];
            let arr2 = [];
            let copyArr = [...alarmOpenCopy]
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
            setAlarmOpenData([...arr])
            setAlarmOpenCopy([...copyArr])
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
        console.log(alarmOpenData.length);
        if (alarmOpenData.length < 2) return messageApi.open({
            type: 'warning',
            content: '请至少选择两个设备进行对比分析！',
        })

        props.saveValue({
            alarmOpenData,
            unknownCopy,
        })
        props.closeValue('close');
        // props.subTable = alarmOpenData
    }
    let tag = columns[0].key;

    const onSearchSub = (value) => {
        let arr = [];
        if (value == '') {
            setAlarmOpenData([...alarmOpenCopy]);
        } else {
            alarmOpenCopy.map(item => {
                if (item[tag].indexOf(value) != -1 || item.address.indexOf(value) != -1) {
                    arr.push(item)
                }
            })
            setAlarmOpenData([...arr]);
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
                    if (item.deviceStyle == type) {
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
                    } else if (type != 0 && item.deviceStyle == type) {
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
                console.log(value)
                if (item.deviceStyle == value) {
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
    const toBottomLeft = (selected) => {

    }

    const toBottomRight = (selected) => {

    }
    useEffect(() => {
        getType();
    }, [])
    useEffect(() => {
        // getDevices()
    }, [type, searchUnknown])
    return (
        <div className={style.transferContent}>
            {contextHolder}
            <div className={style.left}>
                <div className={style.leftTable}>
                    <div className={style.left1}>
                        <div className={style.otherSubTable}>
                            <div className={style.publicTitle}>{props.transferTitle.alarmOpenTitle}</div>
                            <div>
                                <Table bordered dataSource={alarmOpenData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{ y: 90 }} rowSelection={leftOpenKeys}></Table>
                            </div>
                        </div>
                        <div className={style.actions}>
                            <Space size={16}>
                                <CustButton icon={<LeftOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomLeft(1)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomRight(1)}></CustButton>
                            </Space>
                        </div>
                    </div>
                    <div className={style.left2}>
                        <div className={style.otherSubTable}>
                            <div className={style.publicTitle}>{props.transferTitle.alarmCloseTitle}</div>
                            <div>
                                <Table bordered dataSource={alarmOpenData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{ y: 90 }} rowSelection={leftCloseKeys}></Table>
                            </div>
                        </div>
                        <div className={style.actions}>
                            <Space size={16}>
                                <CustButton icon={<LeftOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomLeft(2)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomRight(2)}></CustButton>
                            </Space>
                        </div>
                    </div>
                    <div className={style.left3}>
                        <div className={style.otherSubTable}>
                            <div className={style.publicTitle}>{props.transferTitle.noalarmOpenTitle}</div>
                            <div>
                                <Table bordered dataSource={alarmOpenData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{ y: 90 }} rowSelection={leftNoOpenKeys}></Table>
                            </div>
                        </div>
                        <div className={style.actions}>
                            <Space size={16}>
                                <CustButton icon={<LeftOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomLeft(3)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomRight(3)}></CustButton>
                            </Space>
                        </div>
                    </div>
                    <div className={style.left4}>
                        <div className={style.otherSubTable}>
                            <div className={style.publicTitle}>{props.transferTitle.noalarmCloseTitle}</div>
                            <div>
                                <Table bordered dataSource={alarmOpenData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{ y: 90 }} rowSelection={leftNoCloseKeys}></Table>
                            </div>
                        </div>
                        <div className={style.actions}>
                            <Space size={16}>
                                <CustButton icon={<LeftOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomLeft(4)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={{ height: "46px", width: "68px" }} onClick={toBottomRight(4)}></CustButton>
                            </Space>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.right}>
                <div className={style.rightTable}>
                    <div className={style.publicTitle}>{props.transferTitle.unknownTitle}</div>
                    <div className={style.searchInput}>
                        <span>设备类型</span>
                        <Select
                            size="middle"
                            defaultValue={0}
                            style={{ marginLeft: 16, width: '112px' }}
                            onChange={changeType}
                            options={devices}
                            fieldNames={{ label: "name", value: "deviceStyle" }}
                        >
                        </Select>
                        <div style={{ width: 0, height: 32, margin: '0 32px', borderLeft: '1px dashed #ddd' }}></div>
                        <span style={{ marginRight: 16 }}>设备搜索</span>
                        <Search placeholder="请输入设备编号/安装地址" style={{ width: 256 }} enterButton onSearch={onSearchUnknown}></Search>
                    </div>
                    <div>
                        <Table bordered dataSource={unknownData} columns={columns} size='middle' rowKey='id' pagination={false} scroll={{ y: 600 }} rowSelection={rightKeys}></Table>
                    </div>
                </div>

                <div className={style.btn}>
                    <CustButton onClick={handleSave} style={{ height: "46px" }} >{t("button:save")}</CustButton>
                    <CustButton type="default" style={{ height: "46px", marginLeft: "16px" }} onClick={() => handleClose()}>{t("button:cancel")}</CustButton>
                </div>
            </div>
        </div>

    )
}