import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open4_1 from './imgs/p4/4-1_open.svg'
import close4_1 from './imgs/p4/4-1_close.svg'
import open4_2 from './imgs/p4/4-2_open.svg'
import close4_2 from './imgs/p4/4-2_close.svg'

import { DiskChart } from "@api/api.js";

const {QueryDeviceDataAll} =DiskChart

export default React.memo((props) => {

    const state = useReactive({
        showData: false,
        showItem: props.showItem ? true : false,
        onOpen: true,
        status: 'close',
        Ia: '0.00',
        Ib: '0.00',
        Ic: '0.00',
        name: '回路',
        Isfeeder: false,
    })

    const DiaBox = styled.div`
        display: flex;
        /* padding: 32px;
        padding-right: 48px;
        min-height: 800px; */
        /* min-height: 824px; */
        padding-right: 84px;
        margin-right: 32px;
        position: relative;
        .click_box{
            width: 48px;
            height: 144px;
            background-color: transparent;
            position: absolute;
            left: 42px;
            top: 152px;
            cursor: pointer;
        }
        .data_box{
            width: 112px;
            border: 1px solid rgba(0, 153, 51, 1);
            background-color: #000;
            border-radius: 4px;
            position: absolute;
            left: 100px;
            top: 144px;
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
        .item_box{
                position: absolute;
                width: 241px;
                height: 64px;
                left: 67px;
                top: 52px;
                background-color: #fff;
                border-bottom: 2px solid #333;
                z-index: 10;
            }
    `

    const onOpenStyle = {
        width: 124,
        height: 673,
        marginTop: 50
    }

        const getSingleData = () => {
            QueryDeviceDataAll(props.sn).then(res => {
                if(res && res.response.code == 0 && Array.isArray(res.response.data) && res.response.data.length >0){
                    let deviceData = res.response.data
                    deviceData.map(item => {
                        if (item.name == 'DigitalInstatus1' && item.value == "1") {
                            state.status = 'close'
                        }
                        if (item.name == 'DigitalInstatus2' && item.value == "1") {
                            state.status = 'open'
                        }
                        if (item.name == 'DigitalInstatus3' && item.value == "1") {
                            state.status = 'error'
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
    
            }, 15000)
            return () => {
                clearInterval(timer)
            }
        },[])

    // useEffect(() => {
    //     // state.name = props.lineName
    //     if (props.deviceData && props.deviceData.length > 0) {
    //         props.deviceData.map(item => {
    //             if (item.DigitalInstatus1 == 1) {
    //                 state.status = 'close'
    //             }
    //             if (item.DigitalInstatus2 == 1) {
    //                 state.status = 'open'
    //             }
    //             if (item.DigitalInstatus3 == 1) {
    //                 state.status = 'error'
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
            {
                props.lineName == '回路9' ? 
                    <img src={state.status == 'open' ? open4_2 : state.status == 'close' ? close4_2 : null} style={onOpenStyle}></img> : 
                    <img src={state.status == 'open' ? open4_1 : state.status == 'close' ? close4_1 : null} style={onOpenStyle}></img>
            }
            {
                state.showItem ? <div className='item_box'></div> : null
            }
            <div className='data_box' >
                <div className='data_box_title'>{props.lineName}</div>
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