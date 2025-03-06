import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";
import { useSelector, useDispatch } from "react-redux";
import { themeColor } from "@redux/systemconfig";

import styled from "styled-components";
import open1_1 from './imgs/p1/1-1_open.svg'
import close1_1 from './imgs/p1/1-1_close.svg'
import open1_2 from './imgs/p1/1-2_open.svg'
import close1_2 from './imgs/p1/1-2_close.svg'
import open1_3 from './imgs/p1/1-3_open.svg'
import close1_3 from './imgs/p1/1-3_close.svg'

import { DiskChart } from "@api/api.js";

const {QueryDeviceDataAll} =DiskChart


export default React.memo((props) => {
    const { menusbgcolorR, startColor, endColor, startOpacity, endOpacity } = useSelector(themeColor)
    const state = useReactive({
        showData: true,
        onOpen: true,
        status: 'normal',
        onOpen1_2: false,
        onOpen1_3: false,
        Ia: '0.00',
        Ib: '0.00',
        Ic: '0.00',
    })

    const DiaBox = styled.div`
        display: flex;
        padding: 32px;
        padding-right: 48px;
        min-height: 824px;
        position: relative;
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

    const getSingleData = () => {
            QueryDeviceDataAll(props.sn).then(res => {
                if(res && res.response.code == 0 && Array.isArray(res.response.data) && res.response.data.length >0){
                    let deviceData = res.response.data
                    deviceData.map(item => {
                        if (item.name == 'BrokerStatus') {
                            if (item.value == 0) {
                                state.status = 'normal'
                                state.onOpen = false
                            }
                            if (item.value == 16) {
                                state.status = 'error'
                                state.onOpen = false
                            }
                            if (item.value == 32) {
                                state.status = 'normal'
                                state.onOpen = true
                            }
                            if (item.value == 48) {
                                state.status = 'error'
                                state.onOpen = true
                            }
                        }
                        if (item.name == 'Ia') {
                            state.Ia = item.value
                        }
                        if (item.name == 'Ib') {
                            state.Ib = item.value
                        }
                        if (item.name == 'Ic') {
                            state.Ic = item.value
                        }
                    })
                }
            })
        }
    
        useEffect(() => {
            getSingleData()
            const timer = setInterval(() => {
                getSingleData()
    
            }, 30000)
            return () => {
                clearInterval(timer)
            }
        },[])
    

    // useEffect(() => {
    //     if (props.deviceData && props.deviceData.length > 0) {
    //         props.deviceData.map(item => {
    //             if (item.name == 'BrokerStatus') {
    //                 if(item.value == 0){
    //                     state.status = 'normal'
    //                     state.onOpen = false
    //                 }
    //                 if(item.value == 16){
    //                     state.status = 'error'
    //                     state.onOpen = false
    //                 }
    //                 if(item.value == 32){
    //                     state.status = 'normal'
    //                     state.onOpen = true
    //                 }
    //                 if(item.value == 48){
    //                     state.status = 'error'
    //                     state.onOpen = true
    //                 }
    //             }
    //             if (item.name == 'Ia') {
    //                 state.Ia = item.value
    //             }
    //             if (item.name == 'Ib') {
    //                 state.Ib = item.value
    //             }
    //             if (item.name == 'Ic') {
    //                 state.Ic = item.value
    //             }
    //         })
    //     }
    // }, [])

    return (
        <DiaBox>
            <img src={close1_2} style={{ width: 114, height: 258, marginTop: 464 }}></img>
            {
                state.status == 'normal' && state.onOpen == false ? <img src={close1_1} style={onOpenStyle}></img> : null
            }
            {
                state.status == 'normal' && state.onOpen == true ? <img src={open1_1} style={onOpenStyle}></img> : null
            }

            <img src={close1_3} style={{ width: 120, height: 274, marginTop: 464, marginLeft: '-60px' }}></img>
            <div className='data_box'>
                <div className='data_box_title'>进线柜</div>
                <div className='data_box_item' style={{color:'#ff0'}}>
                    <span>Ia</span>
                    <div>
                        <span>{state.Ia} </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>

                </div>
                <div className='data_box_item' style={{color:'#0f0'}}>
                    <span>Ib</span>
                    <div>
                        <span>{state.Ib} </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>

                </div>
                <div className='data_box_item' style={{ borderBottom: 'none', color:'#f00' }}>
                    <span>Ic</span>
                    <div>
                        <span>{state.Ic} </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>
                </div>
            </div>
        </DiaBox>
    )
})