import React from 'react'
import {Typography} from 'antd'
import {Stacksty} from '../style'
import imgurl from '../imgs'
import { useNavigate} from 'react-router-dom'
export default function Index({data}) {
  const navigate = useNavigate()
  const toPage = (key, label,params) => {
    navigate(`/index/runtimeStorage/${key}`, {
      state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key ,params }
    })
  }
  return (
    <Stacksty soc={data.soc} soh={data.soh} onClick={()=>toPage('bMSMonitor', 'BMS监控', data)}>
        <img src={imgurl['line']} className='line'></img>
        <div className="detail">
            <Typography.Paragraph className='title' ellipsis={{tooltip: data.name}}>{data.name}</Typography.Paragraph>
            <div className="state">
                  <div className="label item">
                  当前状态
                  </div>
                  <div className="value item">{data.chargeState}</div>
            </div>
            <div className='progress'>
                <div className="soc">SOC {data.soc}</div>
                <div className="soh">SOH {data.soh}</div>
            </div>
            <div className='voltage'>
                    <div className="labelv">电压高值</div>
                    <div className="labelv">电压低值</div>
                    <div className="valuev">{data?.maxV}</div>
                    <div className="valuev">{data?.minV}</div>
            </div>
            <div className='voltage'>
                    <div className="labelv">温度高值</div>
                    <div className="labelv">温度低值</div>
                    <div className="valuev">{data?.maxTemp}</div>
                    <div className="valuev">{data?.minTemp}</div>
            </div>
        </div>
    </Stacksty>
  )
}
