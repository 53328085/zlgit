import React, { useState, useEffect } from 'react'
import { useReactive } from "ahooks";

import { DatePicker, Select, Button, message } from "antd";
import moment from "moment";
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)


import Incoming from './incoming.js'
import Filtering from './filtering.js'
import FeederLine from './feederLine.js'
import LoopLine from './loopLine.js'


import styled from "styled-components";


export default function Index() {
    const now = new Date();

    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);

    const defaultDay = `${year}-${month}-${day}`
    const defaultMonth = `${year}-${month}`

    const state = useReactive({
        dateType: 'day',
        startTime: '',
        endTime: '',
    })

    const { RangePicker } = DatePicker;

    const changeTime = val => {
        state.dateType = val
        if (val == 'day' || val == 'custom') {
            state.startTime = defaultDay
            state.endTime = defaultDay
        }
        if (val == 'month') {
            state.startTime = defaultMonth
            state.endTime = defaultMonth
        }
        if (val == 'year') {
            state.startTime = year.toString()
            state.endTime = year.toString()
        }
    }

    const changeDateDay = (date, dateString) => {
        console.log(date, dateString)
        if (!dateString) return;
        if (state.dateType != 'custom') {
            state.startTime = dateString
            state.endTime = dateString
        } else {
            state.startTime = dateString[0]
            state.endTime = dateString[1]
        }
    }

    const searchData = () => { 
        let params = {
            sn: '',
            point:'',
            start:'',
            end:'',
        }
        params.start = state.startTime + ' 00:00:00'
        params.end = state.endTime + ' 23:59:59'
    }

    const HeaderTitle = styled.div`
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-left: 4px solid #237ae4;
        padding: 0 16px;
        color: #515151;
        font-size: 14px;
        margin-bottom: 16px;
        width: 100%;
        .headerForm{
            display: flex;
            align-items: center;
        }
    `
    const ContentBox = styled.div`
        min-width: 260px;
        background-color: #fff;
        margin-right: 16px;
        .box_title{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${props => props.theme.primaryColor};
            font-size: 20px;
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
            min-height: 800px;
            position: relative;
            
        }
    `

    const MainLine = styled.div`
        position: absolute;
        left: 32px;
        top: 140px;
        width: calc(100% - 64px);
        border-top: 4px solid #000;
    `
    const MainDashedLine = styled.div`
        position: absolute;
        left: 32px;
        top: 124px;
        width: calc(100% - 64px);
        border-top: 4px dashed #000;
    `
    const BottomDashedLine = styled.div`
        position: absolute;
        left: 32px;
        bottom: 16px;
        width: calc(100% - 64px);
        border-top: 4px dashed #000;
    `
    useEffect(() => {
        state.startTime = defaultDay
        state.endTime = defaultDay
    }, [])

    return (
        <div>
            <HeaderTitle>
                <span>能耗监控</span>
                <div className='headerForm'>
                    <span style={{ marginRight: 16 }}>时间查询</span>
                    <Select defaultValue={state.dateType} style={{ width: 96, marginRight: 16 }} onChange={changeTime}
                        options={[
                            { value: 'day', label: '日', },
                            { value: 'month', label: '月', },
                            { value: 'year', label: '年' },
                            { value: 'custom', label: '自定义' },
                        ]}
                    />
                    {
                        state.dateType == 'day' ? <DatePicker style={{ width: 280 }} picker="date" onChange={changeDateDay} defaultValue={dayjs(state.startTime, 'YYYY-MM-DD')} format={'YYYY-MM-DD'}></DatePicker> : null
                    }
                    {
                        state.dateType == 'month' ? <DatePicker style={{ width: 280 }} picker="month" onChange={changeDateDay} defaultValue={dayjs(state.startTime, 'YYYY-MM')} format={'YYYY-MM'}></DatePicker> : null
                    }
                    {
                        state.dateType == 'year' ? <DatePicker style={{ width: 280 }} picker="year" onChange={changeDateDay} defaultValue={dayjs(state.startTime, 'YYYY-MM')} format={'YYYY'}></DatePicker> : null
                    }
                    {
                        state.dateType == 'custom' ? <RangePicker style={{ width: 280 }} onChange={changeDateDay} defaultValue={[dayjs(state.startTime, 'YYYY-MM-DD'), dayjs(state.endTime, 'YYYY-MM-DD')]} format={'YYYY-MM-DD'}></RangePicker> : null
                    }
                    <Button type="primary" style={{ marginLeft: 32, width: 96 }} onClick={() => searchData}>查询</Button>
                </div>


            </HeaderTitle>
            <div style={{ width: '1688px', overflowX: 'scroll' }}>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '2950px' }}>
                    <MainLine></MainLine>
                    <MainDashedLine></MainDashedLine>
                    <BottomDashedLine></BottomDashedLine>
                    <ContentBox>
                        <div className='box_title'>
                            <span>P1 进线柜</span>
                        </div>
                        <div className='nameItem'>
                            <div className='item'>进线回路</div>
                        </div>
                        <Incoming></Incoming>
                    </ContentBox>
                    <ContentBox>
                        <div className='box_title'>
                            <span>P2 有源滤波柜</span>
                        </div>
                        <div className='nameItem'>
                            <div className='item'>滤波回路</div>
                        </div>
                        <Filtering></Filtering>
                    </ContentBox>
                    <ContentBox>
                        <div className='box_title'>
                            <span>P3 馈线柜</span>
                        </div>
                        <div className='nameItem'>
                            <div className='item'>馈线回路1</div>
                            <div className='item'>馈线回路2</div>
                            <div className='item'>馈线回路3</div>
                        </div>
                        <div className='dia_box'>
                            <FeederLine></FeederLine>
                            <FeederLine></FeederLine>
                            <FeederLine></FeederLine>
                        </div>

                    </ContentBox>
                    <ContentBox>
                        <div className='box_title'>
                            <span>P4 出线柜</span>
                        </div>
                        <div className='nameItem'>
                            <div className='item'>出线回路1</div>
                            <div className='item'>出线回路2</div>
                            <div className='item'>出线回路3</div>
                            <div className='item'>出线回路4</div>
                            <div className='item'>出线回路5</div>
                            <div className='item'>出线回路6</div>
                            <div className='item'>出线回路7</div>
                            <div className='item'>出线回路8</div>
                            <div className='item'>出线回路9</div>
                        </div>
                        <div className='dia_box'>

                            <LoopLine showItem></LoopLine>
                            <LoopLine ></LoopLine>
                            <LoopLine showItem></LoopLine>
                            <LoopLine></LoopLine>
                            <LoopLine></LoopLine>
                            <LoopLine></LoopLine>
                            <LoopLine></LoopLine>
                            <LoopLine></LoopLine>
                            <FeederLine></FeederLine>
                        </div>
                    </ContentBox>
                </div>
            </div>
        </div>
    )
}