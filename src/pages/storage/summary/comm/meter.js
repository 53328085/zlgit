import React from 'react'
import imgurl from '../imgs'
import { Button, Typography } from 'antd'
export default function Index({index, datas}) {
  return (
         <div className="meters"> 
           
          <div className="meter">
            <div className="upm">
              <Button type="primary">储能总表{index+1}</Button>
              <div className="eimgbox">
                <img src={imgurl["meter"]} className='eimg'></img>
              </div>
            </div>
            <div className="upm">
              <Button type="primary">{datas?.name}</Button>
              <div className="simgbox">
                <Typography.Link onClick={() => toPage("cabinetMonitor", "储能柜监控")}><img src={imgurl["cabinet"]} className='eimg'></img></Typography.Link>
              </div>
            </div>

          </div>
          <div className='digital'>
           
              <div className="item">
              <span>A相电压</span><span>{datas?.ua}(V)</span>
            </div>
            <div className="item">
              <span>B相电压</span><span>{datas?.ub}(V)</span>
            </div>
            <div className="item">
              <span>C相电压</span><span>{datas?.uc}(V)</span>
            </div>
            <div className="item"><span>A相电流</span><span>{datas?.ia}(A)</span></div>
            <div className="item"><span>B相电流</span><span>{datas?.ib}(A)</span></div>
            <div className="item"><span>C相电流</span><span>{datas?.ic}(A)</span></div>
            <div className="item"><span>功率</span><span>{datas?.p}(kW)</span></div>


          </div>
          </div>
  )
}

