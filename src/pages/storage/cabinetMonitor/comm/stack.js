import React from 'react'
import {Typography} from 'antd'
import {Stacksty} from '../style'
import imgurl from '../imgs'
const state ={
    0: "静置",
    1: "放电",
    2: "充电",
}
export default function Index({data}) {
  return (
    <Stacksty soc={data.soc} soh={data.soh}>
        <img src={imgurl['line']} className='line'></img>
        <div className="detail">
            <Typography.Paragraph className='title' ellipsis={{tooltip: data.name}}>{data.name}</Typography.Paragraph>
            <div className="state">
                  <div className="label item">
                  当前状态
                  </div>
                  <div className="value item">{state[data.chargeState]}</div>
            </div>
            <div className='progress'>
                <div className="soc">SOC {data.soc}‰</div>
                <div className="soh">SOH {data.soh}‰</div>
            </div>
            <div className='voltage'>
                    <div className="labelv">电压高值</div>
                    <div className="labelv">电压低值</div>
                    <div className="valuev">{data?.maxV}(V)</div>
                    <div className="valuev">{data?.minV}(V)</div>
            </div>
            <div className='voltage'>
                    <div className="labelv">温度高值</div>
                    <div className="labelv">温度低值</div>
                    <div className="valuev">{data?.maxTemp}(℃)</div>
                    <div className="valuev">{data?.minTemp}(℃)</div>
            </div>
        </div>
    </Stacksty>
  )
}
