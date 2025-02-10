import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import styled from "styled-components";
import open4_2 from './imgs/p4/4-2_open.svg'
import close4_2 from './imgs/p4/4-2_close.svg'

export default function Index() {

    const state = useReactive({
        showData: false
    })

    const DiaBox = styled.div`
        display: flex;
        /* padding: 32px;
        padding-right: 48px;
        min-height: 800px; */
        margin-right: 32px;
        position: relative;
        .data_box{
            width: 48px;
            height: 144px;
            background-color: transparent;
            position: absolute;
            left: 84px;
            top: 120px;
            cursor: pointer;
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
            <img src={open4_2} style={{ width: 124, height: 673, marginTop: 26 }}></img>
            <div className='data_box'>
                <div className='data_title'>耗电量</div>
                <div className='data_value'>1000.00kWh</div>
                <div className='data_title'>占比</div>
                <div className='data_value'>0.00%</div>
            </div>
        </DiaBox>
    )
}