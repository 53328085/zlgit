import React, { useState, useEffect, useCallback } from 'react'
import { useReactive } from "ahooks";
import { Spin } from 'antd';

import Incoming from './incoming.js'
import Filtering from './filtering.js'
import FeederLine from './feederLine.js'
import LoopLine from './loopLine.js'

import open1_1 from './imgs/p1/1-1_open.svg'
import close1_1 from './imgs/p1/1-1_close.svg'
import open1_2 from './imgs/p1/1-2_open.svg'
import close1_2 from './imgs/p1/1-2_close.svg'
import open1_3 from './imgs/p1/1-3_open.svg'
import close1_3 from './imgs/p1/1-3_close.svg'

import { DiskChart } from "@api/api.js";

import mqtt from 'mqtt'

const { QueryDevicesDataAll, QueryMqtt, GetHMIHeart } = DiskChart


import styled from "styled-components";


export default function Index() {
    const state = useReactive({
        showOpen: true,
        loading: true,
        guid: '',
        timer: null,
        onOpen1_1: true,
        status1_1: 'normal',
        Ia1_1: '0.00',
        Ib1_1: '0.00',
        Ic1_1: '0.00',
        incoming: [],
        filtering: [],
        feederLine1: [],
        feederLine2: [],
        feederLine3: [],
        loopLine1: [],
        loopLine2: [],
        loopLine3: [],
        loopLine4: [],
        loopLine5: [],
        loopLine6: [],
        loopLine7: [],
        loopLine8: [],
        loopLine9: [],
    })

    const sns = [
        "NA5202522401",
        "NXW202522201",
        "NA5202522402",
        "NA5202522403",
        "NA5202522404",
        "NTCJ20012241",
        "NTCJ20012242",
        "NTCJ20012243",
        "NTCJ20012244",
        "NTCJ00122401",
        "NTCJ00122402",
        "NTCJ00122403",
        "NTCJ00122404",
        "PD6662555504",
    ]

    const ContentBox = styled.div`
        min-width: 260px;
        background-color: #fff;
        border-right: 1px dashed #aaa;
        /* margin-right: 16px; */
        .box_title{
            width: 100%;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            /* background-color: ${props => props.theme.primaryColor}; */
            background-color: #039;
            font-size: 24px;
            color: #fff;
        }
        .nameItem{
            margin-top: 16px;
            width: 100%;
            display: flex;
            align-items: center;
            .item{
                margin-left: 51px;
                margin-right: 19px;
                width: 85px;
                height: 25px;
                border: 1px solid #237ae4;
                background-color: #ecf5ff;
                color: #237ae4;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
            }
        }
        .dia_box{
            display: flex;
            /* align-items: flex-end; */
            padding: 32px;
            padding-right: 48px;
            min-height: 824px;
            position: relative;
            
        }
    `

    const MainLine = styled.div`
        position: absolute;
        left: 32px;
        top: 122px;
        width: calc(3910px - 64px);
        border-top: 4px solid #000;
        z-index: 1;
    `
    const MainDashedLine = styled.div`
        position: absolute;
        left: 32px;
        top: 106px;
        width: calc(3910px - 64px);
        border-top: 4px dashed #000;
        z-index: 1;
    `
    const BottomDashedLine = styled.div`
        position: absolute;
        left: 32px;
        bottom: 16px;
        width: calc(3910px - 64px);
        border-top: 4px dashed #000;
        z-index: 1;
    `

    const DiaBox = styled.div`
    display: flex;
    padding: 32px;
    padding-right: 48px;
    min-height: 824px;
    position: relative;
    .click_box{
        width: 48px;
        height: 144px;
        background-color: transparent;
        position: absolute;
        left: 224px;
        top: 152px;
        cursor: pointer;
    }
    .click_box_2{
        width: 48px;
        height: 96px;
        background-color: transparent;
        position: absolute;
        left: 110px;
        bottom: 222px;
        cursor: pointer;
    }
    .click_box_3{
        width: 48px;
        height: 96px;
        background-color: transparent;
        position: absolute;
        left: 338px;
        bottom: 222px;
        cursor: pointer;
    }
    .data_box{
        width: 112px;
        /* height: 148px; */
        border: 1px solid rgba(0, 153, 51, 1);
        background-color: #000;
        border-radius: 4px;
        position: absolute;
        left: 290px;
        top: 180px;
        font-size: 14px;
    .data_box_title{
        display: flex;
        width: 100%;
        height: 24px;
        align-items: center;
        background-color: #00c;
        color: #fff;
        justify-content: center;
    }
    .data_box_item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 8px;
        border-bottom: 1px dashed #0f3;
        font-size: 16px;
        color: #0f3;
        height: 36px;
    }
}
`

    const onOpenStyle = {
        width: 232,
        height: 672,
        marginTop: 50,
        marginLeft: '-14px'
    }

    const getAllData = () => {
        QueryDevicesDataAll(sns).then(res => {
            // state.loading = false
            res.map((item, index) => {
                if (item.devSn == 'NA5202522401' && item.response.code == 0) {
                    state.incoming = item.response.data
                }
                if (item.devSn == 'NXW202522201' && item.response.code == 0) {
                    state.filtering = item.response.data
                }
                if (item.devSn == 'NA5202522402' && item.response.code == 0) {
                    state.feederLine1 = item.response.data
                }
                if (item.devSn == 'NA5202522403' && item.response.code == 0) {
                    state.feederLine2 = item.response.data
                }
                if (item.devSn == 'NA5202522404' && item.response.code == 0) {
                    state.feederLine3 = item.response.data
                }
                if (item.devSn == 'NTCJ20012241' && item.response.code == 0) {
                    state.loopLine1 = item.response.data
                }
                if (item.devSn == 'NTCJ20012242' && item.response.code == 0) {
                    state.loopLine2 = item.response.data
                }
                if (item.devSn == 'NTCJ20012243' && item.response.code == 0) {
                    state.loopLine3 = item.response.data
                }
                if (item.devSn == 'NTCJ20012244' && item.response.code == 0) {
                    state.loopLine4 = item.response.data
                }
                if (item.devSn == 'NTCJ00122401' && item.response.code == 0) {
                    state.loopLine5 = item.response.data
                }
                if (item.devSn == 'NTCJ00122402' && item.response.code == 0) {
                    state.loopLine6 = item.response.data
                }
                if (item.devSn == 'NTCJ00122403' && item.response.code == 0) {
                    state.loopLine7 = item.response.data
                }
                if (item.devSn == 'NTCJ00122404' && item.response.code == 0) {
                    state.loopLine8 = item.response.data
                }
                if (item.devSn == 'PD6662555504' && item.response.code == 0) {
                    state.loopLine9 = item.response.data
                }
            })
        })
    }
    const S4 = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    // const guid = () => {
    //     return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    // }



    const getMqtt = (server, topic) => {
        let options = {
            clientId:
                "HMI_" + state.guid,
            username: "",
            password: "",
        }
        state.client = mqtt.connect('ws://101.133.168.242:9211/wshmi', options)
        state.client.on("connect", e => {
            state.client.subscribe(
                "ws/hmi/runtime",
                { qos: 0 },
                (error) => {
                    if (!error) {
                        console.log("订阅成功");
                        getHeart();
                    } else {
                        console.log("订阅失败");
                    }
                }
            )
        })

        // 接收消息处理
        state.client.on("message", (topic, message) => {
            // console.log('接所消息')
            let mqttData = JSON.parse(message.toString());
            console.log('接所消息', mqttData)
            if (mqttData.SN && mqttData.SN == 'NA5202522401') {
                state.incoming = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NXW202522201') {
                state.filtering = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NA5202522402') {
                state.feederLine1 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NA5202522403') {
                state.feederLine2 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NA5202522404') {
                state.feederLine3 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ20012241') {
                state.loopLine1 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ20012242') {
                state.loopLine2 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ20012243') {
                state.loopLine3 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ20012244') {
                state.loopLine4 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ00122401') {
                state.loopLine5 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ00122402') {
                state.loopLine6 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ00122403') {
                state.loopLine7 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'NTCJ00122404') {
                state.loopLine8 = mqttData.Points
            }
            if (mqttData.SN && mqttData.SN == 'PD6662555504') {
                state.loopLine9 = mqttData.Points
            }
        });
        // 断开发起重连
        state.client.on("reconnect", (error) => {
            console.log("正在重连:", error);
        });
        // 链接异常处理
        state.client.on("error", (error) => {
            console.log("连接失败:", error);
        });
    }

    const getHeart = () => {
        let params = {
            clientId: "HMI_" + state.guid,
            devSns: sns
        }
        GetHMIHeart(params).then(res => {
            if (res.success) {
                state.timer = setTimeout(() => {
                    getHeart()
                }, 120000)
            }
        })
    }

    useEffect(() => {
        state.guid = S4()
        // getAllData()
        // QueryMqtt().then(res => {
        //     if (res.success) {
        //         // setTimeout(() => {
        //             getMqtt(res.data.mqttServer, res.data.topic)
        //         // }, 2000)
        //     }
        // })

        // getMqtt()
    }, [])

    useEffect(() => {
        return () => {
            // window.clearTimeout(state.timer)
            (typeof state?.client?.end == "function") && state?.client?.end();
        }
    }, [])

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', overflowX: 'auto' }}>
            <MainLine></MainLine>
            <MainDashedLine></MainDashedLine>
            <BottomDashedLine></BottomDashedLine>
            <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', width: 3910 }}>
                <ContentBox>
                    <div className='box_title' style={{ backgroundColor: '#000', borderRight: '1px solid rgba(0, 153, 204, 1)' }}>
                        <span>P1</span>
                    </div>
                    <Incoming  key={'NA5202522401'} sn={'NA5202522401'} deviceData={state.incoming}></Incoming>
                    {/* <DiaBox>
                        <img src={ close1_2} style={{ width: 114, height: 258, marginTop: 464 }}></img>
                        {
                            state.status1_1 == 'normal' && state.onOpen1_1 == false ? <img src={close1_1} style={onOpenStyle}></img> : null
                        }
                        {
                            state.status1_1 == 'normal' && state.onOpen1_1 == true ? <img src={open1_1} style={onOpenStyle}></img> : null
                        }

                        <img src={close1_3} style={{ width: 120, height: 274, marginTop: 464, marginLeft: '-60px' }}></img>
                        <div className='data_box'>
                            <div className='data_box_title'>进线柜</div>
                            <div className='data_box_item' style={{ color: '#ff0' }}>
                                <span>Ia</span>
                                <div>
                                    <span>{state.Ia1_1} </span>
                                    <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                                </div>

                            </div>
                            <div className='data_box_item' style={{ color: '#0f0' }}>
                                <span>Ib</span>
                                <div>
                                    <span>{state.Ib1_1} </span>
                                    <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                                </div>

                            </div>
                            <div className='data_box_item' style={{ borderBottom: 'none', color: '#f00' }}>
                                <span>Ic</span>
                                <div>
                                    <span>{state.Ic1_1} </span>
                                    <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                                </div>
                            </div>
                        </div>
                    </DiaBox> */}
                </ContentBox>
                <ContentBox>
                    <div className='box_title' style={{ backgroundColor: '#333', borderRight: '1px solid rgba(0, 153, 204, 1)' }}>
                        <span>P2</span>
                    </div>
                    <Filtering key={'NXW202522201'} sn={'NXW202522201'} deviceData={state.filtering}></Filtering>
                </ContentBox>
                <ContentBox>
                    <div className='box_title' style={{ backgroundColor: '#000', borderRight: '1px solid rgba(0, 153, 204, 1)' }}>
                        <span>P3</span>
                    </div>
                    <div className='dia_box'>
                        <FeederLine lineName={`馈线1`} key={'NA5202522402'} sn={'NA5202522402'} deviceData={state.feederLine1}></FeederLine>
                        <FeederLine lineName={'馈线2'} key={'NA5202522403'} sn={'NA5202522403'} deviceData={state.feederLine2}></FeederLine>
                        <FeederLine lineName={'馈线3'} key={'NA5202522404'} sn={'NA5202522404'} deviceData={state.feederLine3}></FeederLine>
                    </div>
                </ContentBox>
                <ContentBox>
                    <div className='box_title' style={{ backgroundColor: '#333' }}>
                        <span>P4</span>
                    </div>
                    <div className='dia_box'>

                        <LoopLine showItem lineName={'回路1'} key={'NTCJ20012241'} sn={'NTCJ20012241'} deviceData={state.loopLine1}></LoopLine>
                        <LoopLine lineName={'回路2'} key={'NTCJ20012242'} sn={'NTCJ20012242'} deviceData={state.loopLine2}></LoopLine>
                        <LoopLine showItem lineName={'回路3'} key={'NTCJ20012243'} sn={'NTCJ20012243'} deviceData={state.loopLine3}></LoopLine>
                        <LoopLine lineName={'回路4'} key={'NTCJ20012244'} sn={'NTCJ20012244'} deviceData={state.loopLine4}></LoopLine>
                        <LoopLine lineName={'回路5'} key={'NTCJ00122401'} sn={'NTCJ00122401'} deviceData={state.loopLine5}></LoopLine>
                        <LoopLine lineName={'回路6'} key={'NTCJ00122402'} sn={'NTCJ00122402'} deviceData={state.loopLine6}></LoopLine>
                        <LoopLine lineName={'回路7'} key={'NTCJ00122403'} sn={'NTCJ00122403'} deviceData={state.loopLine7}></LoopLine>
                        <LoopLine lineName={'回路8'} key={'NTCJ00122404'} sn={'NTCJ00122404'} deviceData={state.loopLine8}></LoopLine>
                        <LoopLine lineName={'回路9'} key={'PD6662555504'} sn={'PD6662555504'} deviceData={state.loopLine9}></LoopLine>
                    </div>
                </ContentBox>
            </div>
        </div>
    )
}