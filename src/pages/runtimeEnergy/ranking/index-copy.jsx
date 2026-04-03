import React, { useMemo, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components';

import Ichart from '@com/useEcharts/Ichart';
import { energyRanking } from '@api/api'
import Pagecount from "@com/pagecontent";
import Titlelayout from '@com/titlelayout';
import { getTime } from '@com/usehandler'
import { useRequest } from 'ahooks'
import { Select, Form } from 'antd'
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: 1040px 1fr;
  column-gap: 16px;
  flex: 1;
  .chart {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
const CustTitle = styled.div`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export default function Index() {
  const { Option } = Select;
  let { exparams, setCustview } = useOutletContext()
  let { areaId, date, energytype, type, shiftNo, projectId } = exparams;

  const getQuery = (areaId, date, energytype, type, shiftNo, projectId) => {

    let f = [areaId, energytype, type, shiftNo, projectId].every(key => Number.isInteger(key)) && date

    if (!f) return;
    let params = {
      projectId,
      areaId,
      type,
      shiftNo,
      date: getTime(date, type),
      energytype,
    }
    return energyRanking.Query(params).then(res => {
      let { success, data } = res
      if (success) {
        return data.constructor == Object ? data : {}
      }
    })

  }
  const { data } = useRequest(() => getQuery(areaId, date, energytype, type, shiftNo, projectId), {
    refreshDeps: [areaId, date, energytype, type, shiftNo, projectId]
  })

  const options = {
    series: [{ type: "bar" }],
    grid: {
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
  const dataset = {
    dimensions: [
      { name: 'name' },
      { name: 'value', displayName: ['', '用电量(kWh)', 'm³', 'm³'][exparams?.energytype] },

    ]
  }
  let [lineopt, buildopt, roomopt] = useMemo(() => {
    let { line = [], building = [], room = [] } = data || {}
    line.sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
    building.sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
    room.sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
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
  }, [data])

  const [rankingWay, setRankingWay] = useState(0)
  // const custoption = [departmentOpt, workshopOpt][rankingWay]
  const changeRankingWay = val => {
    setRankingWay(val)
  }
  const areaRanking = (
    <CustTitle className="title">按区域排名
      <Select
        size="middle"
        style={{ width: '126px' }}
        defaultValue={rankingWay}
        onChange={changeRankingWay}
      >
        <Option value={0}>全部时段</Option>
        <Option value={1}>上班时段</Option>
        <Option value={2}>下班时段</Option>

      </Select>
    </CustTitle>
  )
  const [sortSelected, setSortSelected] = useState(1)
  const sortOptions = [{
    value: 1,
    label: '升序'
  }, {
    value: 2,
    label: '降序'
  }]
  const handleSortChange = (val) => {
    setSortSelected(val)
  }
  const CustView = (
    <Form layout="inline">
      <Form.Item name="sort">
        <Select options={sortOptions} defaultValue={sortSelected} style={{ width: 188, marginLeft: 16 }} onChange={handleSortChange}></Select>
      </Form.Item>
    </Form>

  )

  useEffect(() => {
    setCustview(CustView);
    return () => {
      setCustview(undefined)
    }
  }, [])

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        {/* 按回路排名 */}
        <Titlelayout title={areaRanking} layout="flex">
          <div className='chart'>
            <Ichart {...lineopt} />
          </div>
        </Titlelayout>
        {/* 按建筑排名 */}
        <Titlelayout title="按能耗增量排名" layout="flex">
          <div className="chart">
            <Ichart {...buildopt} />
          </div>
        </Titlelayout>
        {/* <Titlelayout title="按房间排名" layout="flex">
          <div className="chart">
            <Ichart {...roomopt} />
          </div>
        </Titlelayout> */}
      </Mainbox>
    </Pagecount>
  )
}
