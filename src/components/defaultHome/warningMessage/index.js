import React, {useRef, useEffect} from 'react'
import {Image, Timeline} from 'antd'
import {useSelector} from 'react-redux'
import {selectCurProject} from '@redux/user.js'
import Titlelayout from '@com/titlelayout';
import styled from 'styled-components';

const Timelinebox = styled(Timeline)`
 min-height: 142px;
   padding-top: 16px;
  .ant-timeline-item {
    padding-bottom: 8px;
  }
  .ant-timeline-item-content{
    min-height:auto
  }
  .title {
    color:#1e1e1e;
  }
  .content {
    font-size: 12px;
    color:#6b6b6b;
  }
`

const fs = {
  hv: '24px',
  fc: '#333'
}


export default function DefaultHome(){
  const curProject = useSelector(selectCurProject)
  
  return (
         <Titlelayout title={'最新告警'} {...fs}>
         <Timelinebox>
          <Timeline.Item>
              <div>
                <p className='title'>13:48:55  设备过温</p>
                <p className='content'>正泰物联滨江园区-研发1号楼-12层-401    SN 102362256232</p>
              </div>
          </Timeline.Item>
          <Timeline.Item>
              <div>
                <p className='title'>13:20:23  设备过温</p>
                <p className='content'>正泰物联滨江园区-研发1号楼-12层-403    SN 102362256238</p>
              </div>
          </Timeline.Item>
          <Timeline.Item>
              <div>
                <p className='title'>13:20:23  设备过流</p>
              </div>
          </Timeline.Item>         
        </Timelinebox>
           
         </Titlelayout>
  )
}
