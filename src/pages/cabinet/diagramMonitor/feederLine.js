import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open4_2 from './imgs/p4/4-2_open.svg'
import close4_2 from './imgs/p4/4-2_close.svg'

export default function Index(props) {

    const state = useReactive({
        showData: false,
        onOpen: false,
        status: 'normal',
        Ia: '0.00',
        Ib: '0.00',
        Ic: '0.00',
        name: '馈线',
    })

    const DiaBox = styled.div`
        display: flex;
        /* padding: 32px;
        padding-right: 48px;
        min-height: 800px; */
        padding-right: 84px;
        margin-right: 32px;
        position: relative;
        .click_box{
            width: 48px;
            height: 144px;
            background-color: transparent;
            position: absolute;
            left: 32px;
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
    `

    const onOpenStyle = {
        width: 124, 
        height: 673, 
        marginTop: 50
    }

    useEffect(() => {
        state.name = props.lineName
        console.log(props)
        if (props.deviceData.length > 0) {
            props.deviceData.map(item => {
                if (item.name == 'BrokerStatus') {
                    if (item.value == 0) {
                        state.status = 'normal'
                        state.onOpen = true
                    }
                    if (item.value == 16) {
                        state.status = 'error'
                        state.onOpen = true
                    }
                    if (item.value == 32) {
                        state.status = 'normal'
                        state.onOpen = false
                    }
                    if (item.value == 48) {
                        state.status = 'error'
                        state.onOpen = false
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
    }, [props])

    return (
        <DiaBox>
            {/* <img src={state.status == 'open' ? open4_2 : state.status == 'close' ? close4_2 : open4_2} style={{ width: 124, height: 673, marginTop: 50 }}></img> */}

            {
                state.status == 'normal' && state.onOpen == false ? <img src={close4_2} style={onOpenStyle}></img> : null
            }
            {
                state.status == 'normal' && state.onOpen == true ? <img src={open4_2} style={onOpenStyle}></img> : null
            }

            <div className='data_box'>
                <div className='data_box_title'>{state.name}</div>
                <div className='data_box_item'>
                    <span>Ia</span>
                    <div>
                        <span>{state.Ia} </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>

                </div>
                <div className='data_box_item'>
                    <span>Ib</span>
                    <div>
                        <span>{state.Ib} </span>
                        <span className='unit' style={{ fontSize: 12 }}>(A)</span>
                    </div>

                </div>
                <div className='data_box_item' style={{ borderBottom: 'none' }}>
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