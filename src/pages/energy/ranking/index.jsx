import React, {useMemo } from 'react'
import {useOutletContext} from 'react-router-dom' 
import styled from 'styled-components';
import { useSelector } from 'react-redux' 
import Ichart  from '@com/useEcharts/Ichart';
import { energyRanking } from '@api/api'
import Pagecount from "@com/pagecontent";
import Titlelayout from '@com/titlelayout'; 
import {getTime} from '@com/usehandler'
import {useRequest} from 'ahooks'
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  flex: 1;
  .chart {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
export default function Index() {
  let {exparams} = useOutletContext() 
  const projectId = useSelector(state => state.system.menus.projectId)
  const getQuery =  () => {
   
    let {areaId, date, energytype, type, shiftNo,} = exparams;
    console.log(energytype)
    let f = [areaId, date, energytype, type, shiftNo].some(key => isFinite(key)) && date 
    if(!f) return;
    let params = {
      projectId,
      areaId,
      type,
      shiftNo,
      date: getTime(date, type),
      energytype,
    }
    return energyRanking.Query(params).then(res => {
      let {success, data} = res
      if(success) {
        return data.constructor == Object ? data : {}
      }
    })

  }
 const {data} = useRequest(getQuery, {
   refreshDeps: [exparams, projectId]
 })

 const options = {
  series: [{ type: "bar"}],  
  grid:{
    left: "0px",
    right: "0",
    top: "0px",
    bottom: "35px",
    containLabel: true,
  },
  legend: {
    bottom: "5px",
  },
  xAxis: {
    type: 'value',
   
  },
  yAxis: {
    type: 'category',
    axisTick: {
      show: false
    },   
  },

}
 const dataset= {
    dimensions: [
      {name: 'name'},
      {name:  'value', displayName: ['','用电量(kWh)', 'm³', 'm³'][exparams?.energytype] },
      
    ]
  }
let [lineopt, buildopt, roomopt] =useMemo(() => {
let {line=[], building=[], room=[]} = data || {}
line.sort((a, b) => parseFloat(a.value) -parseFloat(b.value) ) 
building.sort((a, b) => parseFloat(a.value) -parseFloat(b.value) ) 
room.sort((a, b) => parseFloat(a.value) -parseFloat(b.value) ) 
return [{
  ...options,
  dataset: {
    ...dataset,
    source: line,
  }
},
{
  ...options,
  dataset: {
    ...dataset,
    source: building,
  }
},
{
  ...options,
  dataset: {
    ...dataset,
    source: room,
  }
}


]
},[data])
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <Titlelayout title="按回路排名" layout="flex">
           <div className='chart'>
              <Ichart {...lineopt} />
           </div>
        </Titlelayout>
        <Titlelayout title="按建筑排名" layout="flex">
          <div className="chart">
           <Ichart {...buildopt} />
           </div>
        </Titlelayout>
        <Titlelayout title="按房间排名" layout="flex">
        <div className="chart">
           <Ichart {...roomopt} />
           </div>
        </Titlelayout>
      </Mainbox>
    </Pagecount>
  )
}
