import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open4_1 from './imgs/p4/4-1_open.svg'
import close4_1 from './imgs/p4/4-1_close.svg'

export default function Index(props) {

    const state = useReactive({
        showData: false,
        showItem: props.showItem ? true : false
    })

    const DiaBox = styled.div`
        display: flex;
        margin-right: 32px;
        position: relative;
        .item_box{
            position: absolute;
            width: 156px;
            height: 64px;
            left: 67px;
            top: 30px;
            background-color: #fff;
            border-bottom: 2px solid #333;
            z-index: 10;
        }
        .data_box{
            width: 48px;
            height: 144px;
            background-color: transparent;
            position: absolute;
            left: 96px;
            top: 120px;
            color: #237ae4;
            line-height: 32px;
            .data_title{
                font-size: 16px;
                font-weight: 700;
            }
            .data_value{
                font-size: 14px;
            }
        }
    `


    return (
        <DiaBox>
            <img src={open4_1} style={{ width: 124, height: 673, marginTop: 26 }}></img>
            {
                state.showItem ? <div className='item_box'></div> : null
            }

            <div className='data_box'>
                <div className='data_title'>耗电量</div>
                <div className='data_value'>1000.00kWh</div>
                <div className='data_title'>占比</div>
                <div className='data_value'>0.00%</div>
            </div>
        </DiaBox>
    )
}