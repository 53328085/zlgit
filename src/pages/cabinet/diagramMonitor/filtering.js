import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open2_1 from './imgs/p2/2-1_open.svg'
import close2_1 from './imgs/p2/2-1_close.svg'

import { DiskChart } from "@api/api.js";

const {QueryDeviceDataAll} =DiskChart

export default function Index(props) {

    const state = useReactive({
        showData: false,
        onOpen: true,
        Ia: '0.00',
        Ib: '0.00',
        Ic: '0.00'
    })

    const DiaBox = styled.div`
        display: flex;
        padding: 32px;
        padding-right: 48px;
        min-height: 800px;
        position: relative;
        .click_box{
            width: 48px;
            height: 144px;
            background-color: transparent;
            position: absolute;
            left: 121px;
            top: 152px;
            cursor: pointer;
        }
        .data_box{
            width: 112px;
            /* height: 148px; */
            border: 1px solid rgba(0, 153, 51, 1);
            background-color: #000;
            border-radius: 4px;
            position: absolute;
            left: 170px;
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

    const getSingleData = () => {
            QueryDeviceDataAll(props.sn).then(res => {
                if(res && res.response.code == 0){
                    let deviceData = res.response.data
                    deviceData.map(item => {
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
            // getSingleData()
            // const timer = setInterval(() => {
            //     getSingleData()
    
            // }, 30000)
            // return () => {
            //     clearInterval(timer)
            // }
        },[])

    // useEffect(() => {
    //     if (props.deviceData.length > 0) {
    //         props.deviceData.map(item => {
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
    // }, [props])

    return (
        <DiaBox>
            <img src={close2_1} style={{ width: 315, height: 760, marginTop: 0 }}></img>
            <div className='data_box'>
                <div className='data_box_title'>有源滤波柜</div>
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
}