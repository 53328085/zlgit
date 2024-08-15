import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
 
import { Button, DatePicker, message, Space, Empty } from 'antd'
import {useOutletContext} from 'react-router-dom'
import Pagecount from '@com/pagecontent'
import Titlelayout from '@com/titlelayout'
import ItemCard from './itemCard'

import { selectcurlRommid } from "@redux/systemconfig";
import styled from 'styled-components'
 
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import Chart from './Chart'
 
import { isObject } from "@com/usehandler"
 

const Mainbox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  
  .chart {
    display: flex;
    flex:1;
  }
`
const Cardlist = styled.div`
   display: grid;
   grid-template-columns: repeat(5,313px);
   gap:16px;
   padding-top: 16px ;
  grid-auto-rows: 120px ;
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
            {(Array.isArray(door) && door?.length > 0) ? door?.map(d => <ItemCard bgcolor="#cee3a6" value={d.value} title={d.name} img="door" key={d.anme + d.value} />) : null}
            {(Array.isArray(fire) && fire.length > 0) ? fire?.map(d => <ItemCard bgcolor="#f8dadf" value={d.value} title={d.name} img="fire" />) : null}
            {Array.isArray(ht) && ht?.map(d => <ItemCard bgcolor="#d3e4f5" tValue={d.tValue} hValue={d.hValue} title={d.name} ht="ht" img="temperature" />)}
            {Array.isArray(noise) && noise?.map(d => <ItemCard bgcolor="#e2edbc" value={d.value} title={d.name} img="nosie" />)}
            {Array.isArray(smoke) && smoke?.map(d => <ItemCard bgcolor="#fee6b4" value={d.value} title={d.name} img="smook" />)}
            {Array.isArray(sF6) && sF6?.map(d => <ItemCard  value={d.value} title={d.name} img="smook" />)}
            {Array.isArray(water) && water?.map(d => <ItemCard bgcolor="#bcddb0" value={d.value} title={d.name} img="water" />)}          
          </Cardlist>

        </Titlelayout>
        {Array.isArray(htdata) && htdata.map(ht => <Chart data={ht} EnvironmentTrend={EnvironmentTrend} />)}

       
      </Mainbox>
    </Pagecount>
  )
}
