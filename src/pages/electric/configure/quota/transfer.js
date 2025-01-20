import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import style from './style.module.less'
import styled, {css} from "styled-components";
import { useSelector } from 'react-redux'
import { Table, Input, message, Select, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { cloneDeep } from "lodash";
import { CustButton } from '@com/useButton'
import { AlarmManagement, Monitoring } from "@api/api.js";
import {adaptation} from '@redux/systemconfig'
import UsetTable from "@com/useTable";
const csssty = css`
    grid-template-columns: minmax(auto, 2fr) minmax(max-content, 1fr);
    padding: 16px;
    width: 100%;
    left: 0;
  .left {
    row-gap: 8px;
  }
  .actions {
    flex: 0 0 160px;
     
   
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
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  width:calc(100% - 200px) ;
 height: 100%;
overflow: auto;
.left {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: 1fr;
  row-gap: 16px;
  
  .flex{
        display: flex;
        align-items: center;
    }
  // flex-direction: column;
  
}

.publicTitle {
  height: 25px;
  padding-left: 16px;
  margin-bottom: 10px;
  line-height: 25px;
  font-size: 14px;
  color: #333;
  border-left: 4px solid var(--ant-primary-color);
}

.mainTable {
 
  padding: 16px;
  background-color: #fff;
  border-radius: 2px;
  margin-bottom: 32px;
}

.subTable {
 
  padding: 16px;
  background-color: #fff;
  border-radius: 2px;
  margin-bottom: 32px;
}

.otherSubTable {
  flex:1;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.searchInput {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.actions {
   flex: 0 0 208px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
  row-gap: 8px;
  .tip {
    color: #fff;
    text-align: center;
  }
  .btns {
    display: flex;
    justify-content: space-evenly;
  }
 
}

.right {
  display: flex;
  flex-direction: column;

  .btn {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-top: 16px;
  }
}

.rightTable {
 
  border-radius: 2px;
  padding: 16px;
  background-color: #fff;
  flex: 1;
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
${props => props.theme.laptop ? csssty : null}
`
export default function index(props) {
     
    const { SetAlarmValveDevice } = AlarmManagement;
    const { ComparativeAnalysis: { AllDeviceStyle } } = Monitoring
    const projectId = useSelector(state => state.system.menus.projectId)
    const {laptop} = useSelector(adaptation)
    const { t } = useTranslation(["button"])
    const [messageApi, contextHolder] = message.useMessage();
    const { Search } = Input
    const columns = props.columns
    const [alarmOpenData, setAlarmOpenData] = useState([])
    const [leftSelectCopy1, setleftSelectCopy1] = useState([])
    const [alarmCloseData, setAlarmloseData] = useState([])
    const [leftSelectCopy2, setleftSelectCopy2] = useState([])
    const [noalarmOpenData, setNoalarmOpenData] = useState([])
    const [leftSelectCopy3, setleftSelectCopy3] = useState([])
    const [noalarmloseData, setNoalarmloseData] = useState([])
    const [leftSelectCopy4, setleftSelectCopy4] = useState([])
    const [unknownData, setUnknownData] = useState(props.unknownTable)
    const [unknownCopy, setUnknownCopy] = useState(props.unknownTable)
    useEffect(() => {
        setType(0)
        setSearchUnknown('')
        setAlarmOpenData(props.alarmOpenTable)
        setAlarmloseData(props.alarmCloseTable)
        setNoalarmOpenData(props.noalarmOpenTable)
        setNoalarmloseData(props.noalarmCloseTable)
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
    const [selectedRightKeys, setSelectedRightKeys] = useState([]);
    const [selectedLeft1, setSelectedLeft1] = useState([]);
    const [selectedLeft2, setSelectedLeft2] = useState([]);
    const [selectedLeft3, setSelectedLeft3] = useState([]);
    const [selectedLeft4, setSelectedLeft4] = useState([]);
    const onRight = (keys) => {
        setSelectedRightKeys(keys);
    };
    const onleftSelect1 = (keys) => {
        setSelectedLeft1(keys);
    };
    const onleftSelect2 = (keys) => {
        setSelectedLeft2(keys);
    };

    const onleftSelect3 = (keys) => {
        setSelectedLeft3(keys);
    };

    const onleftSelect4 = (keys) => {
        setSelectedLeft4(keys);
    };
    const rightKeys = {
        selectedRowKeys: selectedRightKeys,
        onChange: onRight,
    };

    const leftOpenKeys = {
        selectedRowKeys: selectedLeft1,
        onChange: onleftSelect1,
    };
    const leftCloseKeys = {
        selectedRowKeys: selectedLeft2,
        onChange: onleftSelect2,
    };
    const leftNoOpenKeys = {
        selectedRowKeys: selectedLeft3,
        onChange: onleftSelect3,
    };
    const leftNoCloseKeys = {
        selectedRowKeys: selectedLeft4,
        onChange: onleftSelect4,
    };
    const unknownToSub = (seleced) => {
        if (selectedRightKeys.length == 0) {
            messageApi.open({
                type: 'warning',
                content: '请至少选择一个设备！',
            })
            return;
        } else {
            let arr = [...unknownData];
            let arr2 = [];
            let copyArr = [...unknownCopy];
            console.log(selectedRightKeys)
            selectedRightKeys.forEach(id => {
                let idx = arr.findIndex(a => a.id == id);
                if (idx > -1) {
                    let item = arr.splice(idx, 1);
                    copyArr.splice(idx, 1)
                    arr2.push(...item)
                }
            })
            console.log(arr2, alarmOpenData);
            if (seleced == 1) {
                let list1 = arr2.filter((item) => {
                    return !alarmOpenData.some((ele) => ele.id === item.id);
                });
                let list2 = list1.filter((item) => {
                    return !alarmCloseData.some((ele) => ele.id === item.id);
                });
                console.log(list1, list2)
                setAlarmOpenData([...alarmOpenData, ...list2])
                setleftSelectCopy1([...leftSelectCopy1, ...list2])
            } else if (seleced == 2) {
                let list1 = arr2.filter((item) => {
                    return !alarmOpenData.some((ele) => ele.id === item.id);
                });
                let list2 = list1.filter((item) => {
                    return !alarmCloseData.some((ele) => ele.id === item.id);
                });
                setAlarmloseData([...alarmCloseData, ...list2])
                setleftSelectCopy2([...leftSelectCopy2, ...list2])
            } else if (seleced == 3) {
                let list1 = arr2.filter((item) => {
                    return !noalarmOpenData.some((ele) => ele.id === item.id);
                });
                let list2 = list1.filter((item) => {
                    return !noalarmloseData.some((ele) => ele.id === item.id);
                });
                setNoalarmOpenData([...noalarmOpenData, ...list2])
                setleftSelectCopy3([...leftSelectCopy3, ...list2])
            } else if (seleced == 4) {
                let list1 = arr2.filter((item) => {
                    return !noalarmOpenData.some((ele) => ele.id === item.id);
                });
                let list2 = list1.filter((item) => {
                    return !noalarmloseData.some((ele) => ele.id === item.id);
                });
                setNoalarmloseData([...noalarmloseData, ...list2])
                setleftSelectCopy4([...leftSelectCopy4, ...list2])
            }
            // setUnknownCopy([...copyArr]);
        }
    }
    const subToUnknown = (seleced) => {
        if (seleced == 1) {
            if (selectedLeft1.length == 0) {
                messageApi.open({
                    type: 'warning',
                    content: '请至少选择一个设备！',
                })
                return;
            } else {
                let arr = [...alarmOpenData];
                let arr2 = [];
                let copyArr = [...leftSelectCopy1]
                console.log(selectedLeft1)
                selectedLeft1.forEach(id => {
                    let idx = arr.findIndex(a => a.id == id);
                    if (idx > -1) {
                        let item = arr.splice(idx, 1);
                        copyArr.splice(idx, 1)
                        arr2.push(...item)
                    }
                })
                setAlarmOpenData([...arr])
                setleftSelectCopy1([...copyArr])
            }
        } else if (seleced == 2) {
            if (selectedLeft2.length == 0) {
                messageApi.open({
                    type: 'warning',
                    content: '请至少选择一个设备！',
                })
                return;
            } else {
                let arr = [...alarmCloseData];
                let arr2 = [];
                let copyArr = [...leftSelectCopy2]
                selectedLeft2.forEach(id => {
                    let idx = arr.findIndex(a => a.id == id);
                    if (idx > -1) {
                        let item = arr.splice(idx, 1);
                        copyArr.splice(idx, 1)
                        arr2.push(...item)
                    }
                })
                setAlarmloseData([...arr])
                setleftSelectCopy2([...copyArr])
            }

        } else if (seleced == 3) {
            if (selectedLeft3.length == 0) {
                messageApi.open({
                    type: 'warning',
                    content: '请至少选择一个设备！',
                })
                return;
            } else {
                let arr = [...noalarmOpenData];
                let arr2 = [];
                let copyArr = [...leftSelectCopy3]
                console.log(selectedLeft3)
                selectedLeft3.forEach(id => {
                    let idx = arr.findIndex(a => a.id == id);
                    if (idx > -1) {
                        let item = arr.splice(idx, 1);
                        copyArr.splice(idx, 1)
                        arr2.push(...item)
                    }
                })
                setNoalarmOpenData([...arr])
                setleftSelectCopy3([...copyArr])
            }
        } else if (seleced == 4) {
            if (selectedLeft4.length == 0) {
                messageApi.open({
                    type: 'warning',
                    content: '请至少选择一个设备！',
                })
                return;
            } else {
                let arr = [...noalarmloseData];
                let arr2 = [];
                let copyArr = [...leftSelectCopy4]
                console.log(selectedLeft4)
                selectedLeft4.forEach(id => {
                    let idx = arr.findIndex(a => a.id == id);
                    if (idx > -1) {
                        let item = arr.splice(idx, 1);
                        copyArr.splice(idx, 1)
                        arr2.push(...item)
                    }
                })
                setNoalarmloseData([...arr])
                setleftSelectCopy4([...copyArr])
            }
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
    const handleSave = async () => {
        let ItemValveDtos = []
        alarmOpenData.map((item1) => {
            return ItemValveDtos.push({
                AlarmState: 1,
                ValveDeviceSn: item1.sn,
                ValveState: 1,
            });
        });
        alarmCloseData.map((item1) => {
            return ItemValveDtos.push({
                AlarmState: 1,
                ValveDeviceSn: item1.sn,
                ValveState: 2,
            });
        });
        noalarmOpenData.map((item1) => {
            return ItemValveDtos.push({
                AlarmState: 2,
                ValveDeviceSn: item1.sn,
                ValveState: 1,
            });
        });
        noalarmloseData.map((item1) => {
            return ItemValveDtos.push({
                AlarmState: 2,
                ValveDeviceSn: item1.sn,
                ValveState: 2,
            });
        });
        let params = {
            projectId: projectId,
            AlarmId: props.planItemId,
            ItemValveDtos: ItemValveDtos,
        }
        console.log(params)
        // return
        const res = await SetAlarmValveDevice(params)
        if (res.success) {

            setSelectedLeft1([])
            setSelectedLeft2([])
            setSelectedLeft3([])
            setSelectedLeft4([])
            setSelectedRightKeys([])
            message.success("告警关联设备成功")
        }
    }
    let tag = columns[0].key;
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
        console.log(value, unknownData)
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
    useEffect(() => {
        getType();
    }, [])
    useEffect(() => {
        // getDevices()
    }, [type, searchUnknown])
    
    const btnsty = laptop
    ? {
        height: "32px",
        width: "55px",
      }
    : {
        height: "46px",
        width: "68px",
      };
    return (
        <Mainbox>
            {contextHolder}
            <div className="left">
               
                    <div className="flex">
                        <div className="otherSubTable">
                            <div className="publicTitle">{props.transferTitle.alarmOpenTitle}</div>
                            <div className="outwrap">
                                <div className="tbwrap"> 
                                  <UsetTable bordered dataSource={alarmOpenData} columns={columns}   rowKey='id' pagination={false}  rowSelection={leftOpenKeys}></UsetTable>
                                 </div>
                            </div>
                        </div>

                        <div className="actions">
                            <span className="tip">选择设备</span>
                            <div className="btns">
                                <CustButton icon={<LeftOutlined />} style={btnsty} onClick={() => unknownToSub(1)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={btnsty} onClick={() => subToUnknown(1)}></CustButton>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="otherSubTable">
                            <div className="publicTitle">{props.transferTitle.alarmCloseTitle}</div>
                            <div className="outwrap">
                                <div className="tbwrap"> 
                                <UsetTable bordered dataSource={alarmCloseData} columns={columns}   rowKey='id' pagination={false}   rowSelection={leftCloseKeys}></UsetTable>
                              </div>
                            </div>
                        </div>
                        <div className="actions">
                            <span className="tip">选择设备</span>
                            <div className="btns">
                                <CustButton icon={<LeftOutlined />} style={btnsty} onClick={() => unknownToSub(2)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={btnsty} onClick={() => subToUnknown(2)}></CustButton>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="otherSubTable">
                            <div className="publicTitle">{props.transferTitle.noalarmOpenTitle}</div>
                            <div className="outwrap">
                                <div className="tbwrap"> 
                                <UsetTable bordered dataSource={noalarmOpenData} columns={columns}   rowKey='id' pagination={false}   rowSelection={leftNoOpenKeys}></UsetTable>
                               </div>
                            </div>
                        </div>
                        <div className="actions">
                            <span className="tip">选择设备</span>
                            <div className="btns">
                                <CustButton icon={<LeftOutlined />} style={btnsty} onClick={() => unknownToSub(3)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={btnsty} onClick={() => subToUnknown(3)}></CustButton>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="otherSubTable">
                            <div className="publicTitle">{props.transferTitle.noalarmCloseTitle}</div>
                            <div className="outwrap">
                                <div className="tbwrap"> 
                                <UsetTable bordered dataSource={noalarmloseData} columns={columns}   rowKey='id' pagination={false}   rowSelection={leftNoCloseKeys}></UsetTable>
                            </div>
                            </div>
                        </div>
                        <div className="actions">
                            <span className="tip">选择设备</span>
                            <div className="btns">
                                <CustButton icon={<LeftOutlined />} style={btnsty} onClick={() => unknownToSub(4)}></CustButton>
                                <CustButton icon={<RightOutlined />} style={btnsty} onClick={() => subToUnknown(4)}></CustButton>
                            </div>
                        </div>
                     
                </div>
            </div>
            <div className="right">
                <div className="rightTable">
                    <div className="publicTitle">{props.transferTitle.unknownTitle}</div>
                    <div className="searchInput">
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
                      {laptop ? null : <div style={{ width: 0, height: 32, margin: '0 32px', borderLeft: '1px dashed #ddd' }}></div>}  
                        <span style={{ marginRight: 16 }}>设备搜索</span>
                        <Search placeholder="请输入设备编号/安装地址" style={{ width: laptop ? 220 : 256 }} enterButton onSearch={onSearchUnknown}></Search>
                    </div>
                    <div className="outwrap">
                                <div className="tbwrap"> 
                        <UsetTable bordered dataSource={unknownData} columns={columns}  rowKey='id' pagination={false}   rowSelection={rightKeys}></UsetTable>
                     </div>
                    </div>
                </div>

                <div className="btn">
                    <CustButton type="default" style={{ height: laptop ? "32px": "46px" }} onClick={() => handleClose()}>{t("button:cancel")}</CustButton>
                    <CustButton onClick={handleSave} style={{ height: laptop ? "32px" : "46px", marginLeft: "16px" }} >{t("button:save")}</CustButton></div>
            </div>
        </Mainbox>

    )
}