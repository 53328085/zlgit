import { useReactive } from "ahooks";
import React, { useEffect } from "react";
import styled from "styled-components";
import device from './imgs/device.png'
import twoCircle from './imgs/twoCircle.png'
import batteryStack from './imgs/batteryStack.png'
import batteryStackHover from './imgs/batteryStackHover.png'
import { StorageMonitorRuntime } from '@api/api.js'
import { message } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import style from './style.module.less'

export default function Index(props) {
    console.log(props.headerValues)
    const { queryContainersStacks } = StorageMonitorRuntime
    const state = useReactive({
        name: '',
        projectId: 0,
        areaId: 0,
        siteId: 0,
        activeTab: 0,
        containerList: [],
        batteryStackInfo: [],
        count: 0
    })

    const BatteryItems = styled.div`
    
            position: relative;
            width: 256px;
            height: 505px;
            margin-right: 119px;
            background-image: url(${batteryStack});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            cursor: pointer;
            &:hover{
                background-image: url(${batteryStackHover});
            }
            .dataItem{
                position: absolute;
                width: 256px;
                height: 349px;
                left: 0;
                bottom: 0;
                font-size: 14px;
                color: #a1a1a1;
                padding: 16px;
                .itemName{
                    height: 14px;
                    line-height: 14px;
                    text-align: center;
                    margin: 16px 0;
                }
                .divider{
                    margin: 12px 0;
                    width: 100%;
                    height: 0;
                    border-top: 1px dashed #fff;
                }
            }
        
    `

    const LeftButton = styled(CaretLeftOutlined)`
        font-size: 84px;
        position: absolute;
        left: -12px;
        top: 240px;
        color: #3c3c62;
        cursor: pointer;
        z-index: 1000;
        &:hover{
            color: #f2f2f2;
        }
    `
    const RightButton = styled(CaretRightOutlined)`
        font-size: 84px;
        position: absolute;
        right: -12px;
        top: 240px;
        color: #3c3c62;
        cursor: pointer;
        &:hover{
            color: #f2f2f2;
        }
        z-index: 1000;
    `


    const ContainerItem = (props) => {
        return <div className={`containerItem ${state.activeTab == props.tabValue ? 'activeItem' : ''}`} onClick={() => showActiveTab(props)}>
            <span className="itemName">{props.data.containerName}</span>
            <img src={device} className="itemImg"></img>
            <img src={twoCircle} className="shortLine"></img>
        </div>
    }

    const Progress = props => {
        let value = props.value
        let length = 0
        if (value == '' || value == '/') {
            length = 0
        } else {
            length = value / 10
        }
        return (
            <div style={{ position: 'relative', marginBottom: 16, width: 224, height: 24, background: '#2b2b2b', border: "1px solid rgb(153, 153, 153)", borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', zIndex: 0, left: -1, top: -1, width: length + '%', height: 24, background: props.color, border: "1px solid rgb(228, 228, 228)", borderRadius: 2, borderRight: 'none' }}></div>
                <span style={{ zIndex: 1, color: '#fff' }}>{props.title + '    ' + props.value + '‰'}</span>
            </div>
        )
    }

    const NormalValue = props => {
        return (
            <div style={{ width: 224, border: '1px solid #d7d7d7', borderRadius: 2, marginBottom: 12, color: '#fff' }}>
                <div style={{ width: '100%', height: 24, lineHeight: '24px', backgroundColor: '#237ae4', borderBottom: '1px solid #d7d7d7' }}>
                    <span style={{ display: "inline-block", width: 111, textAlign: 'center' }}>{props.title[0]}</span>
                    <span style={{ display: "inline-block", width: 111, textAlign: 'center' }}>{props.title[1]}</span>
                </div>
                <div style={{ width: '100%', height: 24, lineHeight: '24px' }}>
                    <span style={{ display: "inline-block", width: 111, textAlign: 'center' }}>{props.value[0]}</span>
                    <span style={{ display: "inline-block", width: 111, textAlign: 'center' }}>{props.value[1]}</span>
                </div>
            </div>
        )
    }

    const BatteryStackItem = (props) => {
        return <BatteryItems onClick={()=> toMainPage(props.data)}>
            <div className="dataItem">
                <div className="itemName">{props.data.name}</div>
                <div style={{ width: 224, border: '1px solid #d7d7d7', borderRadius: 2, marginBottom: 16, color: '#fff' }}>
                    <div style={{ width: '100%', height: 24, lineHeight: '24px', backgroundColor: '#237ae4', borderBottom: '1px solid #d7d7d7', textAlign: 'center' }}>
                        <span>充放电状态</span>
                    </div>
                    <div style={{ width: '100%', height: 24, lineHeight: '24px', textAlign: 'center' }}>
                        <span>{props.data.chargeState}</span>
                    </div>
                </div>
                <Progress title={'SOC'} value={props.data.soc} color={'#060'}></Progress>
                <Progress title={'SOH'} value={props.data.soh} color={'#06f'}></Progress>
                <div className="divider"></div>
                <NormalValue title={['电压高值', '电压低值']} value={[props.data.maxV + '(V)', props.data.minV + '(V)']}></NormalValue>
                <NormalValue title={['温度高值', '温度低值']} value={[props.data.maxTemp + '(℃)', props.data.minTemp + '(℃)']}></NormalValue>
            </div>
        </BatteryItems>
    }

    const showActiveTab = item => {
        if (state.activeTab == item.tabValue) return;
        state.activeTab = item.tabValue
        state.count = 0;
        if (item.data.batteryStackInfo.length == 0) {
            message.warning('所选储能柜不存在电池堆')
        }
        state.batteryStackInfo = item.data.batteryStackInfo
    }

    const toMainPage = item => {
        props.getshowTab({
            pageName:'mainPage',
            batteryStack:item,
        })
    }

    const getContainers = () => {
        queryContainersStacks(state.projectId, state.areaId, state.siteId).then(res => {
            let { success, data } = res
            if (success) {
                if (data && data.length > 0) {
                    state.containerList = data
                    state.activeTab = 0
                    state.batteryStackInfo = data[0].batteryStackInfo
                } else {
                    state.containerList = []
                    state.activeTab = 0
                    state.batteryStackInfo = []
                    message.warning('当前站点不存在储能柜!')
                }
            } else {
                message.error(res.errMsg)
            }
        })
    }

    const preData = () => {
        if ((state.count) <= 0) return;
        state.count -= 1
    }
    const nextData = () => {
        if ((state.count + 4) >= state.batteryStackInfo.length) return;
        state.count += 1
    }


    useEffect(() => {
        if (props.headerValues) {
            state.name = props.headerValues.name
            state.projectId = props.headerValues.projectId
            state.areaId = props.headerValues.areaId
            state.siteId = props.headerValues.siteId
            getContainers()
        }
    }, [props.headerValues])
    return (
        <div className={style.main_box}>
            <div className="headerTitle">{state.name}</div>
            <div className="containerList">
                {
                    state.containerList.map((item, index) => {
                        return <ContainerItem key={index} tabValue={index} data={item}></ContainerItem>
                    })
                }
            </div>
            <div className="largeLine"></div>
            <div className={style.batterStack}>
                <LeftButton onClick={() => preData()}></LeftButton>
                <RightButton onClick={() => nextData()}></RightButton>
                <div className={style.transLate} style={{ width: (parseInt(state.batteryStackInfo.length / 4) + 1) * 100 + '%', left: (-(state.count * (119 + 256)) + 118) }}>
                    {
                        state.batteryStackInfo.map((item, index) => {
                            return <BatteryStackItem key={index} data={item}></BatteryStackItem>
                        })
                    }
                </div>
            </div>
        </div>
    )
}