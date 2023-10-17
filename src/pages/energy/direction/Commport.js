import React, {useEffect, useState, useRef} from 'react'
import {message} from 'antd'
import {EnergyFlowRuntime} from "@api/api"
import {Button} from 'antd'
 import styled from 'styled-components'
const {QueryTopologyDeviceState} = EnergyFlowRuntime
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 16px;
  color: #515151;
  .up {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .upLeft {
        height: 30px;
        border: 1px solid #d7d7d7;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content:  space-between;
        width: 272px;
        padding: 0 10px;
        .dotto {
            display: flex;
            align-items: center;
            height: 30px;
            b {
                height: 16px;
                width: 16px;
                display: inline-block;
                border-radius: 100%;
            }
            b.g {
                background-color: #090;
            }
            b.r {
                background-color:#f30 ;
            }
            b.b {
                background-color: #e4e4e4;
            }
        }
    }
  }
  .down {
    display: grid;
    grid-template-rows: 112px 1fr;
    row-gap: 32px;
    align-content: center;
    .downUp {
        height: 112px;
        background-color: #686569;
        color: #fff;
        display: grid;
        grid-template-rows: 24px 1fr;
        row-gap: 6px;
        padding: 6px 16px;
        align-content: center;
     
        .items {
            display: grid;
            grid-template-columns: repeat(16, 56px);
            grid-auto-rows: 56px;
            column-gap: 8px;
            .item {
                height: 56px;
                width: 56px;
                background-color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #fff;
                color: #515151;
                font-size: 20px;
                cursor: pointer;
            }
            .item.active {
                background-color: #237ae4;
                color: #fff;
            }
        }
    }
    .downcenter {
        border: 1px solid #237ae4;
        border-radius: 8px;
        background-color: #f2f2f2;
        display: grid;
        grid-template-columns: repeat(5, 248px);
        grid-auto-rows: 48px;
        gap: 24px 64px;
        padding: 16px 64px;
        justify-content: center;
        .address {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        width: 240px;
        background-color: #282828;
        color: #fff;
        border-radius: 24px;
        padding: 4px 12px;
        position: relative;
        .state {
           height: 24px;
           width: 24px;
           border-radius: 100%;
           align-self: flex-start;
           background-color: #090;
           margin-right: auto;
           position: absolute;
           left: 12px;
           top: 12px;
        }
        .state.s{
            
        }
      }
    }
  }
`
export default function Commport({projectId,gateway:{gatewayId, name}, ids, back}) {
 console.log('render')
  //const [active, setActive] = useState(ids[0])
  const active = useRef(ids[0])
  const [datas, setData] = useState([])
  const getData = async (commport) => {
    try {
        let {success, data} = await  QueryTopologyDeviceState({projectId, gatewayId, commport})
        if(success && Array.isArray(data)) {
            setData([...data])
        }else {
            setData([])
        }
    } catch (e) {
        
    }
  }
  const detail = (id) => {
    active.current = id
    getData(id)
  }
  useEffect(() => {
    if(ids.length< 1) {
      return  message.warning("没有通道")
    }
    getData(ids[0])

  }, [ids, projectId])
  return (
    <Mainbox>
        <div className='up'>
            <div className='upLeft'>
                <div className='dotto'><b className='g'></b>&nbsp;正常</div>
                <div className='dotto'><b className='r'></b>&nbsp;正常</div>
                <div className='dotto'><b  className='b'></b>&nbsp;正常</div>
           </div>
           <Button type="primary" onClick={() => back(true)}>返回</Button>
        </div>
       <div className='down'>
         <div className='downUp'>
            <span>{name}</span>
            <div className='items'>
            {ids.map((i, index)=> <div className={active.current == i ? "item active" : "item"}  onClick={() => detail(i)} key={i}>{index + 1}</div>)}
            </div>
         </div>
         <div className='downcenter'>
              {datas.map(d => 
              (<div className='address' key={d.sn}>
                 <div className='state'></div>
                 <span>{d.address}</span>
              </div>) )}
         </div>
       </div>
    </Mainbox>
  )
}
