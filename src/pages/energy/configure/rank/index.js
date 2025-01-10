import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components";
import { useSelector } from "react-redux";
import { CustButtonT, CustButton } from '@com/useButton'
import Cupload from "@com/useUpload.js"
import { selectProjectId,themeColor } from '@redux/systemconfig.js'
import { message, Switch, Input, InputNumber, Space, Divider, Button, Checkbox, Tag, Alert } from 'antd';
import { EnergyRankingDesign } from '@api/api.js'
import { Cspin } from "@com/comstyled"
import { isObject } from '@com/usehandler'
import UseTable from '@com/useTable'
import Titlelayout from '@com/titlelayout'
import Pagecount from '@com/pagecontent'
import { useSearchParams, useOutletContext } from 'react-router-dom'
const Main = styled.div`
  &&{
    
   flex:1;
   display: flex;
   flex-direction: row;
   column-gap: 16px;
   justify-content: space-between;
  }
`


export default function Index() {
    let { setCustview } = useOutletContext() || {}
    const {primaryColor} = useSelector(themeColor)
    const projectId = useSelector(selectProjectId)
    const tbcolumns = [
        {
            dataIndex: "name",
            title: "区域级别",
        },
        {
            dataIndex: "isEnabled",
            title: "是否显示",
            render: (_, record) => <Switch defaultChecked checked={record.isEnabled == 1 ? true : false} onChange={(checked) => onChange(record, checked)} />
        },
        {
            dataIndex: "rankCount",
            title: "排名数量显示(2~15)",
            render: (_, record) => <InputNumber min={2} max={15} step={1} value={record.rankCount} defaultValue={3} onChange={(value) => onChangeNum(record, value)} />
        },
        {
            dataIndex: "leaderboardCount",
            title: "排行榜数量显示(2~5)",
            render: (_, record, Index) => <InputNumber min={2} max={5} step={1} value={record.leaderboardCount} defaultValue={3} onChange={(value) => onChangeList(record, value)} />
        },
    ]
    const onChange = (record, checked) => {
        console.log(`switch to ${checked}`, record);
        const newTreeData = treeData.map(item => {
            if (record.id === item.id) {
                return { ...item, isEnabled: checked ? 1 : 0 };
            }
            return item;
        });

        // 更新状态
        setTreeData(newTreeData);
    }
    const onChangeNum = (record, value) => {
        console.log('changed', value, record);
        const newTreeData = treeData.map(item => {
            if (record.id === item.id) {
                return { ...item, rankCount: value };
            }
            return item;
        });

        // 更新状态
        setTreeData(newTreeData);
    };
    const onChangeList = (record, value) => {
        console.log('changed', value, record);
        const newTreeData = treeData.map(item => {
            if (record.id === item.id) {
                return { ...item, leaderboardCount: value };
            }
            return item;
        });

        // 更新状态
        setTreeData(newTreeData);
    };
    const [treeData, setTreeData] = useState([])
    const listcolumns = [
        {
            dataIndex: "rankCount",
            title: "排名数量显示(2~20)",
            render: (_, record) => <InputNumber min={2} max={20} step={1} defaultValue={3} value={record.rankCount} onChange={(value) => onChangeNumDevice(record, value)} />
        },
        {
            dataIndex: "leaderboardCount",
            title: "排行榜数量显示(2~5)",
            render: (_, record) => <InputNumber min={2} max={5} step={1} defaultValue={3} value={record.leaderboardCount} onChange={(value) => onChangeListDevice(record, value)} />
        },
    ]
    const onChangeNumDevice = (record, value) => {
        console.log('changed', value);
        const newListData = listData.map(item => {
            if (record.id === item.id) {
                return { ...item, rankCount: value };
            }
            return item;
        });

        // 更新状态
        setListData(newListData);
    };
    const onChangeListDevice = (record, value) => {
        console.log('changed', value);
        const newListData = listData.map(item => {
            if (record.id === item.id) {
                return { ...item, leaderboardCount: value };
            }
            return item;
        });

        // 更新状态
        setListData(newListData);
    };
    const [listData, setListData] = useState([])
    const saveEnergy = () => {
        const newTreeData = treeData.map(item => ({
            level: item.level,
            isEnabled: item.isEnabled,
            rankCount: item.rankCount,
            leaderboardCount: item.leaderboardCount
        }));
        EnergyRankingDesign.UpdateAreaLevelSetting(projectId, newTreeData).then(res => {
            if (res.success) {
                message.success('保存成功')
                getAreaList()
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const saveDevice = () => {
        EnergyRankingDesign.UpdateDeviceSetting(projectId, listData[0].rankCount, listData[0].leaderboardCount).then(res=>{
            if (res.success) {
                message.success('保存成功')
                getDeviceList()
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const getAreaList = () => {
        EnergyRankingDesign.QueryAllLevelSetting(projectId).then(res => {
            if (res.success) {
                setTreeData(res.data)
            } else {
                message.error(res.errMsg)
            }
        })
    }
    const getDeviceList = () => {
        EnergyRankingDesign.QueryDeviceSetting(projectId).then(res => {
            if (res.success) {
                let list = []
                list.push(res.data)
                setListData(list)
            } else {
                message.error(res.errMsg)
            }
        })
    }
    useEffect(() => {
        getAreaList()
        getDeviceList()
    }, [])
    const CustView = (
        <div style={{ width: '100%', height: '100%' }}>
            <p style={{ height: '32px', borderLeft: `4px solid ${primaryColor}`, paddingLeft: '16px', lineHeight: '32px' }}>排名设置</p>
        </div>
    )
    useEffect(() => {
        setCustview(CustView);
        return () => {
            setCustview(undefined)
        }
    }, [])
    return (
        <Pagecount pd="0px" bgcolor="transparent">
            <Main>
                <Titlelayout title='区域能耗排名设置' layout="flex" style={{flex: 1}} >
                    <div style={{ flex:1,   overflow: 'auto', marginTop: '16px' }}>
                        <UseTable columns={tbcolumns} dataSource={treeData}></UseTable>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}><Button type="primary" onClick={saveEnergy}>保存</Button></div>
                    </div>
                </Titlelayout>
                <Titlelayout title='设备能耗排名设置' layout="flex" style={{flex:1}} >
                    <div style={{flex:1,   overflow: 'auto', marginTop: '16px' }}>
                        <UseTable columns={listcolumns} dataSource={listData}></UseTable>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}><Button type="primary" onClick={saveDevice}>保存</Button></div>
                    </div>
                </Titlelayout>
            </Main>
        </Pagecount>
    )
}
