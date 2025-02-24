import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment";
import { Button, DatePicker, message, Space, Empty, Select } from 'antd'
import { useOutletContext } from 'react-router-dom'
import Pagecount from '@com/pagecontent'
import Titlelayout from '@com/titlelayout'
import ItemCard from './itemCard'
import dayjs from 'dayjs';

import { selectcurlRommid, adaptation } from "@redux/systemconfig";
import styled from 'styled-components'

import { Cabinets } from '@api/api.js'
import Chart from './Chart'

import { isObject } from "@com/usehandler"

const { RangePicker } = DatePicker;

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
   flex: 1;
   display: grid;
   grid-template-columns: repeat(auto-fill,minmax(150px, 1fr));
   gap:16px;
   padding-top: 16px;
 
`


const Header = styled.div`
width:100%;
height:16px;
display:flex;
flex-direction:row;
align-items:center;
justify-content:flex-end;
position: relative;
 .timeSelect{
  position: absolute;
  top:20px;
  right:32px;
  z-index: 1000;
}
`;
export default function Index() {
  const { dateval } = useOutletContext()
  const projectId = useSelector(state => state.system.menus.projectId)
  const roomId = useSelector(selectcurlRommid)
  const [htdata, setHtdata] = useState([])
  const [monitoring, setMonitoring] = useState({})
  let { laptop } = useSelector(adaptation)
  const {
    entranceVos,
    fireVos,
    floodVos,
    noiseVos,
    smokeVos,
    temperatureHumidityVos
  } = isObject(monitoring) ? monitoring : {};
  const EnvironmentTrend = async () => {
    try {
      const { success, data, errMsg } = await Cabinets.QueryEnvironmentMonitorList(1)
      if (success && data) {
        setHtdata(data.temperatureHumidityVos)
        setMonitoring(data)
      } else {
        setHtdata([])
        setMonitoring([])
        if (!success) message.warning(errMsg)
      }
    } catch (error) {

    }

  }
  const EnvironmentChart = async (time, dataId, type) => {
    let params = {}
    try {
      if (typeof (time) === 'string') {
        params = {
          siteId: 1,
          monitorId: dataId,
          type: type === 'date' ? 1 : type === 'month' ? 2 : type === 'year' ? 3 : 4,
          startDate: time,
          endDate: time
        }
      } else {
        params = {
          siteId: 1,
          monitorId: dataId,
          type: type === 'date' ? 1 : type === 'month' ? 2 : type === 'year' ? 3 : 4,
          startDate: time[0],
          endDate: time[1]
        }
      }
      const { success, data, errMsg } = await Cabinets.QueryTemperatureHumidityTrend(params)
      if (success) {
        const list = htdata.map(item => {
          return item.id === dataId ? data : item
        })
        setHtdata(list)
      } else {
        if (!success) message.warning(errMsg)
      }
    } catch (error) {

    }

  }
  const today = moment().startOf('date');
  const tmonth = moment().startOf('month')
  const tyear = moment().startOf('year')
  const [timePickers, setTimePickers] = useState({});
  const disabledDate = (current) => {
    return current > dayjs().endOf('date');
  };
  // 处理时间选择器类型变更
  const handlePickerTypeChange = (pickerType, dataId) => {
    setTimePickers((prevState) => ({
      ...prevState,
      [dataId]: {
        ...prevState[dataId],
        pickerType,
        // value: pickerType === 'custom' ? [] : undefined, // 自定义范围选择器重置值
      },
    }
    ));
    let date = ''
    let dateList = []
    if (pickerType === 'date') {
      date = moment().format('YYYY-MM-DD')
    } else if (pickerType === 'month') {
      date = moment().format('YYYY-MM-01')
    } else if (pickerType === 'year') {
      date = moment().format('YYYY-01-01')
    } else {
      dateList = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
    EnvironmentChart(pickerType === 'custom' ? dateList : date, dataId, pickerType)
  };
  // 处理时间选择器值变更
  const handleDateChange = (dates, dateString, dataId, pickerType) => {
    let time = ''
    if (pickerType === 'date') {
      // console.log(dateString);
      time = dateString
    } else if (pickerType === 'month') {
      time = dateString + '-01'
      // console.log(dateString + '-01');
    } else if (pickerType === 'year') {
      time = dateString + '-01-01'
    } else {
      time = dateString
    }
    setTimePickers((prevState) => ({
      ...prevState,
      [dataId]: {
        ...prevState[dataId],
        value: dates,
      },
    }));

    EnvironmentChart(time, dataId, pickerType)
  };
  useEffect(() => {
    EnvironmentTrend()
  }, [])
  useEffect(() => {
  }, [timePickers])
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>
        <Titlelayout title="配电房环境监测" layout="flex" bordered="n">
          <Cardlist>
            {Array.isArray(temperatureHumidityVos) && temperatureHumidityVos?.map(d => <ItemCard tValue={`${d.temperature}℃`} hValue={d.humidity} title={d.name} ht="ht" img="temperatureC" />)}
            {Array.isArray(noiseVos) && noiseVos?.map(d => <ItemCard value={d.noise} title={d.name} img="nosieC" />)}
            {Array.isArray(floodVos) && floodVos?.map(d => <ItemCard value={d.state == 0 ? '无水' : d.state == 1 ? '有水' : '未知'} title={d.name} img="waterC" />)}
            {Array.isArray(smokeVos) && smokeVos?.map(d => <ItemCard value={d.state == 0 ? '无烟' : d.state == 1 ? '有烟' : '未知'} title={d.name} img="smookC" />)}
            {(Array.isArray(fireVos) && fireVos.length > 0) ? fireVos?.map(d => <ItemCard value={d.state == 0 ? '无明火' : d.state == 1 ? '有明火' : '未知'} title={d.name} img="fireC" />) : null}
            {(Array.isArray(entranceVos) && entranceVos?.length > 0) ? entranceVos?.map(d => <ItemCard value={d.state == 0 ? '门关闭' : d.state == 1 ? '门打开' : '未知'} title={d.name} img="doorC" key={d.name + d.state} />) : null}


          </Cardlist>

        </Titlelayout>
        {Array.isArray(htdata) && htdata.map((item, index) => {
          const { pickerType = 'date' } = timePickers[item.id] || {};
          return (
            <div key={item.id}>
              <Header>
                <div className='timeSelect'>
                  <span style={{ marginRight: "10px" }}>时间查询</span>
                  <Select value={pickerType} style={{ width: 96, marginRight: 16 }} onChange={(value) => handlePickerTypeChange(value, item.id)}
                    options={[
                      { value: 'date', label: '日', },
                      { value: 'month', label: '月', },
                      { value: 'year', label: '年' },
                      { value: 'custom', label: '自定义' },
                    ]}
                  />

                  {pickerType != 'custom' ?
                    <DatePicker
                      picker={pickerType}
                      style={{ width: 320 }}
                      disabledDate={disabledDate}
                      //value={value.length ? value[0] : null} // 只显示单个日期（对于非自定义选择器）
                      defaultValue={pickerType == 'date' ? moment(today) : pickerType == 'month' ? moment(tmonth) : pickerType == 'year' ? moment(tyear) : null}
                      onChange={(date, dateString) =>
                        handleDateChange([date], dateString, item.id, pickerType) // 确保传递数组以保持状态一致
                      }
                    /> : <RangePicker style={{ width: 320 }} disabledDate={disabledDate} defaultValue={[moment(today), moment(today)]} onChange={(dates, dateString) => handleDateChange(dates, dateString, item.id, pickerType)} />}
                </div>
              </Header>
              <Chart data={item} laptop={laptop} allData={htdata} />
            </div>)
        })}

      </Mainbox>
    </Pagecount>
  )
}
