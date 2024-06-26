import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import style from './style.module.less'
import { Button, DatePicker, message, Space, Empty } from 'antd'

import Pagecount from '@com/pagecontent'
import Titlelayout from '@com/titlelayout'
import ItemCard from './itemCard'

import { selectcurlRommid } from "@redux/systemconfig";
import styled from 'styled-components'
import moment from 'moment';
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import Chart from './Chart'
import { drawEcharts } from "@com/useEcharts";
import { isObject } from "@com/usehandler"
import { MoneyCollectTwoTone } from '@ant-design/icons'

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
  const q = useSelector(state => state)
  console.log(q, "1111");
  const projectId = useSelector(state => state.system.menus.projectId)
  const roomId = useSelector(selectcurlRommid)
  const [htdata, setHtdata] = useState([])
  const [envi, setEnvi] = useState({})
  const timeflag = useSelector(state => state.system.environmentTime)
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
  const EnvironmentTrend = async (time = moment(timeflag)) => {
    try {
      const day = time.format('YYYY MM DD 00:00:00')
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
    if (Number.isInteger(roomId) && Number.isInteger(projectId) && timeflag) {
      console.log(roomId, projectId, timeflag);
      EnvironmentTrend()
    }
  }, [roomId, projectId, timeflag])
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        {Array.isArray(htdata) && htdata.map(ht => <Chart data={ht} EnvironmentTrend={EnvironmentTrend} />)}

        <Titlelayout title="配电房环境监测" layout="flex" bordered="n">

          <Cardlist>


            {(Array.isArray(door) && door?.length > 0) ? door?.map(d => <ItemCard value={d.value} title={d.name} img="door" key={d.anme + d.value} />) : null}
            {(Array.isArray(fire) && fire.length > 0) ? fire?.map(d => <ItemCard value={d.value} title={d.name} img="fire" />) : null}
            {Array.isArray(ht) && ht?.map(d => <ItemCard tValue={d.tValue} hValue={d.hValue} title={d.name} ht="ht" img="temperature" />)}
            {Array.isArray(noise) && noise?.map(d => <ItemCard value={d.value} title={d.name} img="nosie" />)}
            {Array.isArray(smoke) && smoke?.map(d => <ItemCard value={d.value} title={d.name} img="smook" />)}
            {Array.isArray(sF6) && sF6?.map(d => <ItemCard value={d.value} title={d.name} img="smook" />)}
            {Array.isArray(water) && water?.map(d => <ItemCard value={d.value} title={d.name} img="water" />)}
            {/*  <ItemCard title={'环境温度'} desc={envlist.temperature?'正常':'异常'} value={envlist.temperature} img="temperature"></ItemCard>
          <ItemCard title={'环境湿度'} desc={envlist.humidness?'正常':'异常'} value={envlist.humidness} img="humidness"></ItemCard>
          <ItemCard title={'水浸监测'} desc={envlist.water?'正常':'异常'} value={envlist.water} img="water"></ItemCard>
          <ItemCard title={'烟感监测'} desc={envlist.smoke?'正常':'异常'} value={envlist.smoke} img="smook"></ItemCard>
          <ItemCard title={'噪音监测'} desc={envlist.noise?'正常':'异常'} value={envlist.noise} img="nosie"></ItemCard>
          <ItemCard title={'明火监测'} desc={envlist.fire?'正常':'异常'} value={envlist.fire} img="fire"></ItemCard>
          <ItemCard title={'门禁监控'} desc={envlist.door?'正常':'异常'} value={envlist.door} img="door"></ItemCard> */}
          </Cardlist>

        </Titlelayout>
      </Mainbox>
    </Pagecount>
  )
}
