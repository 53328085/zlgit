import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
 
import { Button, DatePicker, message, Space, Empty } from 'antd'
import {useOutletContext} from 'react-router-dom'
import Pagecount from '@com/pagecontent'
import Titlelayout from '@com/titlelayout'
import ItemCard from './itemCard.jsx'

import { selectcurlRommid } from "@redux/systemconfig";
import styled from 'styled-components'
 
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import Chart from './Chart.jsx'
 
import { isObject } from "@com/usehandler"
 

const Mainbox = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows:321px repeat(2,297px);
  grid-gap:16px;
  
  .chart {
    display: flex;
    flex:1;
  }
`
const Cardlist = styled.div`
   display: grid;
   grid-template-columns: repeat(5,321px);
   gap:16px;
   padding-top: 16px ;
   grid-auto-rows: 117px ;
  & .card{
                width: 313px;
                height: 120px;
                padding: 16px;
                margin-right: 16px;
                color: #000;
                border: 1px solid rgb(215, 215,215);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow:2px  2px 2px rgba(0, 0, 0, 0.0784313725490196);
                //background: linear-gradient(180deg, rgba(0, 51, 204, 1) 0%, rgba(0, 51, 204, 1) 0%, rgba(51, 204, 255, 1) 100%, rgba(51, 204, 255, 1) 100%);;
             
            }
`

export default function Index() {
  const {dateval} = useOutletContext()

  const projectId = useSelector(state => state.system.menus.projectId)
  const roomId = useSelector(selectcurlRommid)
  const [htdata, setHtdata] = useState([])
  const [envi, setEnvi] = useState({})
 
  const {
    door,
    fire,
    ht,
    noise,
    smoke,
    sF6,
    water
  } = isObject(envi) ? envi : {};
  // const enviList = isObject(envi) ? Object.values(envi) : null
  const EnvironmentTrend = async () => {
    try {
      const day = dateval.format('YYYY MM DD 00:00:00')
      const { success, data, errMsg } = await DistributionRoomRuntime.EnvironmentTrend({ projectId, roomId, day })
      if (success && isObject(data)) {
        let { environmentVo = {}, htTrends = [] } = data
        setHtdata(htTrends)
        setEnvi(environmentVo)
      } else {
        setHtdata([])
        setEnvi({})
        if (!success) message.warning(errMsg)
      }
    } catch (error) {

    }

  }

  useEffect(() => {
    if (Number.isInteger(roomId) && Number.isInteger(projectId) && dateval) {
     
      EnvironmentTrend()
    }
  }, [roomId, projectId, dateval])
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
      <Titlelayout title="配电房环境监测" layout="flex" bordered="n">
          <Cardlist>
            <ItemCard bgcolor="#d3e4f5" tValue={20} hValue={30} title="环境温湿度-2#馈电1柜右侧" ht="ht" img="temperature" bdcolor="#458be4" />
            <ItemCard bgcolor="#d3e4f5" tValue={20} hValue={30} title="环境温湿度-2#馈电1柜右侧" ht="ht" img="temperature" bdcolor="#458be4" />
            <ItemCard bgcolor="#bcddb0" value="无水" title="水浸监测" img="water" bdcolor="#369a36"/>
            <ItemCard bgcolor="#fee6b4" value="无烟" title="烟感监测" img="smoke" bdcolor="#fea014"/>
            <ItemCard bgcolor="#f8dadf" value="无明火" title="明火监测" img="fire" bdcolor="#fe6e3e" />
            <ItemCard bgcolor="#e2edbc" value="56/72  bB" title="噪音监测" img="noise" bdcolor="#1cd070"/>
            <ItemCard bgcolor="#cee3a6" value="门关闭" title="门禁监控" img="door" bdcolor="#3d9c6a"/>
          </Cardlist>
        </Titlelayout>
        <Chart title="环境温湿度-1#馈电1柜右侧"/>
        <Chart title="环境温湿度-2#馈电2柜右侧"/>

    
        
      </Mainbox>
    </Pagecount>
  )
}
