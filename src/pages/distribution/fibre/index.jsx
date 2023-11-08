import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message, Input, Timeline } from 'antd'
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import UseHead from '../usehead'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import time from './time.png'
const WrapDiv = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1336px 323px;
  grid-template-rows: 352px 432px;
  grid-template-areas:
  "a c"
  "b c";
  .griditem{
    background-color: #fff;
    border: 1px solid RGB(215,215,215);
    border-radius: 4px;
    padding: 12px;

  }
  .griditem1{
    grid-area: a;
    .fiberarea{
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(10,116px);
      grid-template-rows: repeat(4,56px);
      margin:16px 0;
      .box{
        background-color: #00cc33;
        color: #fff;
        border: 1px solid #009900;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        padding: 4px 0;
        cursor: pointer;
      }
      .active{
        animation: activecss .8s linear infinite;
        border: 1px solid #cc0000;
      }
    }
    @keyframes activecss {
      0%{
        background-color: #ff6666;
      }
      100%{
        background-color:#ff9494; 
      }
    }
  }
  .griditem2{
    grid-area: b;
    .head{
      display: flex;
      justify-content: space-between;
      .headtime{
        display: flex;
        align-items: center;
        
      }
      .time{
          width: 96px;
          justify-content: space-around;
        }
    }
    .content{
      margin: 16px 0;
      .status{
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      padding: 16px 12px;
      width: 192px;
      height: 352px;
      .ant-form-item{
        margin-bottom: 8px;
      }
      .statusitem{
          .sitem{
            display: flex;
            margin-top: 16px;
            .circle{
              width: 20px;
              height: 20px;
              background-color: #00cc33;
              border:1px solid #00a633;
              border-radius: 50%;
              margin-right: 16px;
            }
          }
      }
    }
    } 
  }
  .griditem3{
    grid-area: c;
    .warn{
      display: flex;
      justify-content: space-between;
      .warntext{
        color: #237ae4
      }
    }
    .timeline{
      margin-top: 32px;
      .title {
          color:#1e1e1e;
          margin-top:-4px;
          display: flex;
          justify-content: space-between;
        }
        p{
          line-height: 30px;
        }
    }
    
  }
  
`
export default function index() {
  const [active, setActive] = useState(0)
  const [areanum, setAreaNum] = useState(Array(35).fill({ name: '通道1', remark: '01分区' }))
  const chartRef = useRef()
  const { Item } = Form
  const chooseBox = (i) => {
    setActive(i)
  }
  const [level, setLevel] = useState(1)
  return (
    <div>
      <UseHead />
      <WrapDiv>
        <div className='griditem griditem1'>
          <BlueColumn name="光纤测温分区" />
          <div className='fiberarea'>
            {
              areanum.map(
                (it, i) => (
                  <div className={active === i ? 'active box' : 'box'} key={i} onClick={() => { chooseBox(i) }}>
                    <div>{it.name}</div>
                    <div>{it.remark}</div>
                  </div>
                )
              )
            }
          </div>
        </div>
        <div className='griditem griditem2'>
          <div className='head'>
            <BlueColumn name="通道1 01分区" />
            <div className='headtime'>
              <span className='headtime time'><img src={time} alt="" /> 更新时间： </span>
              <span>2023-10-31  16:25:11</span>
            </div>
          </div>
          <div className='content'>
            <div className='status'>
              <h5>分区状态</h5>
              <div className='statusitem'>
                <div className='sitem'>
                  <div className='circle'></div>
                  <span>温度过高</span>
                </div>
                <div className='sitem'>
                  <div className='circle'></div>
                  <span>速率正常</span>
                </div>
                <div className='sitem'>
                  <div className='circle'></div>
                  <span>温差正常</span>
                </div>
              </div>
              <Divider dashed style={{ borderColor: "#999", margin: "16px 0" }}></Divider>
              <Form>
                <Item >分区报警阀值</Item>
                <Item label="上线温度" >
                  <Input size='small'></Input>
                </Item>
                <Item label="温差范围" >
                  <Input size='small'></Input>
                </Item>
                <Item label="上升速率" >
                  <Input size='small'></Input>
                </Item>
              </Form>
            </div>
            <div className='chart' ref={chartRef}></div>
          </div>
        </div>
        <div className='griditem griditem3'>
          <div className='warn'>
            <BlueColumn name="报警信息" />
            <div className='warntext'>
              查看详细
            </div>
          </div>
          <Timeline className='timeline'>
            <Timeline.Item dot={<div
              style={{
                borderRadius: '50%', width: 16, height: 16, border: '1px solid',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderColor: level === 1 ? 'rgb(255,112,112)' : level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)'
              }}>
              <div style={{ borderRadius: '50%', width: 10, height: 10, background: level === 1 ? 'rgb(255,112,112)' : level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)' }}>
              </div >
            </div>}>
              <div>
                <p className='title'>
                  <span>2023-10-19  13:00:00</span>
                  <span>光缆故障</span>
                </p>
                <p>光缆断</p>
                <p className='content'>分区01   4050米</p>
              </div>
            </Timeline.Item>
            <Timeline.Item dot={<div
              style={{
                borderRadius: '50%', width: 16, height: 16, border: '1px solid',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderColor: level === 1 ? 'rgb(255,112,112)' : level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)'
              }}>
              <div style={{ borderRadius: '50%', width: 10, height: 10, background: level === 1 ? 'rgb(255,112,112)' : level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)' }}>
              </div >
            </div>}>
              <div>
                <p className='title'>
                  <span>2023-10-19  13:00:00</span>
                  <span>光缆故障</span>
                </p>
                <p>光缆断</p>
                <p className='content'>分区01   4050米</p>
              </div>
            </Timeline.Item>
          </Timeline>
        </div>
      </WrapDiv>
    </div>
  )
}
