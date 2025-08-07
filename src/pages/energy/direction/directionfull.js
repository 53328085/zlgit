import React, { useState, useRef, useEffect, } from "react";

import { Form, Space, DatePicker, Select } from "antd";
import moment from 'moment';
import Pagecount from '@com/pagecontent'
import CustContext from "@com/content.js";

import { EnergyFlowRuntime, Editapi } from "@api/api"
import { useSelector } from 'react-redux'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import { getTime } from '@com/usehandler'
import Titlelayout from '@com/titlelayout'

import Ichart from '@com/useEcharts/Ichart';

const { QueryFlowByEnergyType, queryElectric, queryWater } = EnergyFlowRuntime

export default function Index() {
  const projectId = useSelector(selectProjectId);
  const levelone = useSelector(selectOneLevel)
  const areaId = levelone.map(a => a.id);

  const [form] = Form.useForm();
  const { Item } = Form


  const [energyoptions, setEnergyoptions] = useState([])
  const energyTypeDefault = useRef(1)
  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3

  const [dateData, setdateData] = useState() // 日、月、年 1， 2， 3
  const [op, setOp] = useState(1)
  const picker = ['', 'date', 'month', 'year'][timetype];
  console.log(op)
  const [params, setParams] = useState({
    type: 1,
    energyType: energyTypeDefault.current,
    date: moment().format('yyyy-MM-DD'),
    projectId
  })
  const [options, setOptions] = useState({
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        layout: "none",
        emphasis: {
        },
        data: [],
        links: [],
        right: "5%",
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        },

      }
    ],
    type: 5,
  })

  const getEnergyType = async () => {
    try {
      if (!Number.isInteger(parseInt(projectId))) return
      let { success, data } = await Editapi.QueryEnergyType(projectId)
      if (success && Array.isArray(data) && data?.length) {
        let types = data.map((d, index) => ({ label: d.name, value: d.type }))
        energyTypeDefault.current = types[0].value
        setEnergyoptions(types)
      } else {
        energyTypeDefault.current = 1
        setEnergyoptions([])
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getData = async () => {
    console.log(params)
    try {
      // let hander = [queryElectric, "", queryWater, '', '', '', '', queryWater][op]
      // let { success, data } = await hander(params, areaId)
      let { success, data } = await QueryFlowByEnergyType(params, areaId)
      if (success && data.constructor == Object) {

        const { link = [] } = data
        let arr = []
        let sources = Array.from(new Set([...link.map(i => i.source)]))



        sources.forEach(s => {
          let depth = link.filter(l => l.source == s).map(d => d.target)

          arr = [...arr, s, ...depth]

        })

        let datas = Array.from(new Set([...arr])).map(name => ({ name }))
        let links = link.map(l => ({ ...l, value: parseFloat(l.value) }))
        setOptions({
          ...options,
          series: [
            {
              ...options.series[0],
              data: datas,
              links,
              label: {
                fontSize: 10
              },
              nodeAlign: "left",
              nodeGap: 12,
              lineStyle: {
                color: "source"
              }
            }
          ]
        })

      }
    } catch (error) {
      console.log(error)
    }


  }
  useEffect(() => {
    getEnergyType()
  }, [projectId])
  useEffect(() => {
    getData()
  }, [params])

  useEffect(() => {
    setParams(prev => ({ ...prev, energyType: op }));
  }, [op])

  const datechange = (e) => {
    let date = getTime(moment(e), timetype)
    setdateData(date)
    setParams({
      ...params,
      type: timetype,
      date,
    })
  }



  const timechange = (e) => {
    setTimetype(e);
    let date = '';
    if (dateData == undefined) {
      date = getTime(moment(), e)
    } else {
      date = dateData
    }
    setParams({
      ...params,
      type: e,
      date,
    })
  }
  const opchange = (e) => {
    console.log(e)
    setOp(e)
  }
  const CustView = () => {
    const viewstyle = {
      display: 'flex',
      justifyContent: "space-between",
      flex: 1,
      //    'marginLeft': '32px',
      //   'paddingLeft': '32px',
      //   'borderLeft': '1px dotted #d7d7d7',
    }
    return (
      <div style={viewstyle}>
        <Item label="能源类型" initialValue={energyTypeDefault.current} name="energy">
          <Select
            style={{ width: '112px' }}
            onChange={opchange}
            value={op}
            options={energyoptions}

          />
        </Item>
        <Space size={16}>
          <Item label="日期选择" name="type" initialValue={1}>
            <Select style={{ width: '80px' }} options={[
              { value: 1, label: '日' },
              { value: 2, label: '月' },
              { value: 3, label: '年' },
            ]}
              onChange={timechange}
            ></Select>
          </Item>

          <Item nostyle name="date" initialValue={moment(new Date(), 'YYYY-MM-DD')}>
            <DatePicker placeholder="请选择日期" picker={picker} onChange={datechange} style={{ width: '160px' }} />
          </Item>
        </Space>
      </div>
    )
  }

  const propsData = {
    form,
    custview: <CustView />,
    isAreaId: false
  }


  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach={true} pd="0px">
        <Titlelayout title="能源流向" layout="flex">
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Ichart custoption={options} />
          </div>
        </Titlelayout>
      </Pagecount>
    </CustContext.Provider>
  )
}
