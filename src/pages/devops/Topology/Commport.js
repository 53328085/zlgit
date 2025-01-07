import React, {useEffect, useState, useRef, useMemo} from 'react'
import {message, Empty, Spin, Typography,Pagination} from 'antd'
import {EnergyFlowRuntime,Monitoring} from "@api/api"
import {useAntdTable} from 'ahooks'
import {Cspin} from "@com/comstyled"
import { Link } from "react-router-dom";
import {Button} from 'antd'
 import styled from 'styled-components'
 import Icard from './card'
 import {isObject} from '@com/usehandler'
 import category from './icon/category.png'
const {QueryTopologyDeviceState, OverviewFromGateway} = EnergyFlowRuntime
const {
  RuntimeDevice: {
    CategoryImages,
  }
} = Monitoring;
const {Text} = Typography
const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 16px;
  color: #515151;
  .up {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .upLeft {
        height: 30px;
        border: 1px solid #d7d7d7;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content:  space-between;
        width: 272px;
        padding: 0 15px;
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
    grid-template-rows: 112px 32px 1fr; 
    justify-items: center;
    grid-template-columns: 1fr;
    .downUp {
        height: 112px;
        background-color: #686569;
        color: #fff;
        display: grid;
        grid-template-rows: 24px 1fr;
        row-gap: 6px;
        padding: 6px 16px 20px 16px;
        align-content: center;
        width: ${props=> props.theme.laptop ? "80%" : "1202px"};
        overflow-x: auto;
        span {
            text-align: center;
        }
        .items {
            display: grid;
            grid-template-columns: ${props => `repeat(${props.len}, 56px)` };
            grid-auto-rows: 56px;
            column-gap: 8px;
           // width: 1170px;
            overflow-x: auto;
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
                background-color: ${props => props.theme.primaryColor};
                color: #fff;
            }
            .item.active::after {
              content: '';
            }
        }
    }
    .spin{
      width:100%
    }
    .arrow {
      display: grid;
            grid-template-columns: ${props => `repeat(${props.len}, 56px)` };
            grid-auto-rows: 32px;
            column-gap: 8px;
            width: ${props=> props.theme.laptop ? "80%" : "1202px"};
            padding: 0 16px;
            overflow-x: auto;
            overflow-y: hidden;
      .arrowitem {
         display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        overflow: hidden;
        transform: scaleY(1.3);
        color: ${props => props.theme.primaryColor};
        visibility: hidden
      }
      .arrowitem.show {
        visibility: visible;
      }
    }
    .empty {
      border: 1px solid ${props => props.theme.primaryColor};
      border-radius: 8px;
      background-color: #f2f2f2;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      width:100%;
    //  width: 1688px;
      height: 528px;
    
      overflow-y: auto;
    }
    .downcenter {  // 538,152
        position: relative;
        border: 1px solid ${props => props.theme.primaryColor};
        border-radius: 8px;
        background-color: #f2f2f2;
       // display: flex;
      //  flex-wrap: wrap;
        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(428px,1fr));
        grid-auto-rows:152px;
        gap:16px;
        height: 568px;
      //  width: 1680px;
        width:100%;
        padding: 16px;
        align-content: flex-start;
      /*   display: grid;
        grid-template-columns: repeat(5, 538px);
        grid-auto-rows: 152px;
        gap: 24px 32px;
        padding: 16px 32px;
        justify-content: center;
        height: 528px;
        width: 1465px; */
        overflow-y: auto;
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
        .ant-typography-ellipsis-single-line {
          color:#fff; 
          padding-left: 28px;
          width: 216px;
        }
        .state {
           height: 24px;
           width: 24px;
           border-radius: 100%;
           align-self: flex-start;
           margin-right: auto;
           position: absolute;
           left: 12px;
           top: 12px;
        }
        .state.s {
          background-color: #090;
        }
        .state.r {
                background-color:#f30 ;
            }
        .state.b {
                background-color: #e4e4e4;
            }
      }
    }
  }
`
 /*  b.g {
                background-color: #090;
            }
            b.r {
                background-color:#f30 ;
            }
            b.b {
                background-color: #e4e4e4;
            } */

export default function Commport({projectId,gateway:{gatewayId, name}, device={}, back}) {
  
  const {children: ids, com} = device
 
  const [datas, setData] = useState([])
  const isdatas = datas?.length >0
   
  const [acindex, setIndex] = useState(ids[0])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

 const getGatewayImages =async (projectId,group, details) => {
  //网关图片
   try {
    let {data, success} = await CategoryImages({ projectId, group}) 
    if(success && Array.isArray(data) && data.length > 0) {
      details.forEach(d => {
            let {category} = d;
            let bg = data.find(i => i.category == category)?.imageBase64;
            if(bg) {
              d.bg = bg;
            }
         })
    } 
    setData(details)
   } catch (error) {
     return error
   }
  
};
 
  const getData = async (commport, pageNum=1) => {
    try {
      //  let {success, data} = await  QueryTopologyDeviceState({projectId, gatewayId, commport})
      setLoading(true)
      let {success, data, total} = await  OverviewFromGateway({projectId, gatewayId, commport, pageNum, pageSize: 9})
      
        if(Number.isInteger(total)) {
          setTotal(total)
        }
        if(success && isObject(data)) {
          let {categories, details} = data
        //  Array.isArray(details) ?  setData([...details]) : setData([])
          if(Array.isArray(details) && details.length > 0) {
            if(Array.isArray(categories) && categories.length > 0 ) {
              try {
                await getGatewayImages(projectId, categories, details)

              } catch (error) {
                
              }
             
          
           }else {
              setData(details)
           }
           setLoading(false)
        } else {
          setLoading(false)
          setData([])
        }
      
        }else {
          setLoading(false)
            setData([])
        }
      
    } catch (e) {
      setLoading(false)
    }
    
  }
 
  const detail = (id, index) => {
     setLoading(true)
    setIndex(id)
  
    getData(id)
  }
  const onChange =(page)=> {
    getData(acindex, page)
  }
  useEffect(() => {
    if(ids.length< 1) {
      return  message.warning("没有通道")
    }
    getData(ids[0])

  }, [device, projectId])

  /* /// 1 离线（2,3以外的状态）
        /// 2 在线
        /// 3 告警 */
  return (
    <Mainbox len={com}>
        <div className='up'>
           {/*  <div className='upLeft'>
                <div className='dotto'><b className='g'></b>&nbsp;正常</div>
                <div className='dotto'><b className='r'></b>&nbsp;告警</div>
                <div className='dotto'><b  className='b'></b>&nbsp;离线</div>
           </div> */}
           <Button type="primary" onClick={() => back(true)}>返回</Button>
        </div>
       <div className='down'>
         <div className='downUp'>
            <span>{name}</span>
            <div className='items'>

              { Array.from({length: com}, (v, i) => <div className={acindex == (i+1) ? "item active" : "item"}  onClick={() => detail(i+1, i)} key={i}>{i+1}</div>)}
         
            </div>
         </div>
         <div className='arrow'>
            {Array.from({length: com}, (v, i) => <span className={acindex ==(i+1)?  'arrowitem show' : 'arrowitem' }>&#8593;</span>)}
         </div>
         <Cspin spinning={loading} delay={300} className="spin"> 

        <div className={isdatas ? 'downcenter' : 'empty'}>
              {isdatas > 0 ? <>
              {datas.map((item, index) =>  <Link
                        to={`/deviceDetail?sn=${encodeURIComponent(item.sn)}&deviceStyle=${encodeURIComponent(item.deviceStyle)}`}
                        target="_blank"
                        key={item.sn}
                      >
                        <Icard
                          img={item.bg || category }
                          title={item.name}
                          deviceStyle={item.deviceStyle}
                          value={item.address}
                          state={item.state}
                          fields={item.fields}
                          lastSampleTime={item.lastSampleTime}
                          category={item.sn}
                        />
                      </Link>)
                      } <Pagination total={total} pageSize={9} hideOnSinglePage style={{position: "absolute", bottom: "16px", right: '16px'}} onChange={onChange}  /> </>: <Empty />}
                      
         </div>
         </Cspin>
       </div>
    </Mainbox>
  )
}
