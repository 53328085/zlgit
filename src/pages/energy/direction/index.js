import React, {useState, useEffect, Fragment} from 'react'
import { useRequest } from 'ahooks';
import style from './style.module.less';
import { Select, DatePicker, message, Empty  } from 'antd';
import { Sankey } from '@ant-design/plots';
import dayjs from 'dayjs'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { AreaSetting, EnergyFlowRuntime } from '@api/api.js'

//dayjs bug
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
dayjs.extend(weekday)
dayjs.extend(localeData)

export default function Index() {
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    })
  }
  const projectId = useSelector(selectProjectId);
  const { QueryAllArea } = AreaSetting
  const { queryComprehensive, queryElectric, queryWater, queryGas } = EnergyFlowRuntime
  //园区
  const [areaList, setAreaList] = useState([])
  const [defaultArea, setDefaultArea] = useState()
  const [areaId,setAreaId] = useState(0)
  const getAreaData = () =>{
    return QueryAllArea (projectId, 1).then(res=> {
      let {success, data} = res
      if(success && data){
        setAreaList(data)
        setDefaultArea(data[0].id)
        setAreaId(data[0].id)
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { data:AreaData } = useRequest(getAreaData,{
    onSuccess:(result,params) => {}
  })
  const changeArea = (value) => {
    setAreaId(value)
  }
  //能源类型
  const [energyType, setEnergyType] = useState(0)
  const changeEnergyType = val => {
    setEnergyType(val)
  }
  //日期选择
  const [type, setType] = useState('year')
  let time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1 
  month = month > 9 ? month : '0' + month
  let day = time.getDate()
  day = day > 9 ? day : '0' + day
  const [date, setDate] = useState(year.toString()+'-01-01')
  const changeDateType = val => {
    setType(val)
    if(val == 'year') setDate(year.toString()+'-01-01')
    if(val == 'month') setDate(year+'-'+month+'-01')
    if(val == 'date') setDate(year+'-'+month+'-'+day+'')
  }
  const changeDate = (date, dateString) => {
    if(type == 'year') setDate(dateString+'-01-01')
    if(type == 'month') setDate(dateString+'-01')
    if(type == 'date') setDate(dateString+'')
  }
  const PickerWithType = ({ type, onChange }) => {
    if (type === 'date') return <DatePicker  picker={type} value={dayjs(date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={onChange} />;
    if (type === 'month') return <DatePicker  picker={type} value={dayjs(date, 'YYYY-MM')} format={'YYYY-MM'} onChange={onChange} />;
    if (type === 'year') return <DatePicker  picker={type} value={dayjs(date, 'YYYY')} format={'YYYY'} onChange={onChange} />;
  };

  //获取数据
  //综合能耗
  const getComprehensive = () => {
    let dateType = type == 'year'? 3 : type == 'month' ? 2 : 1 
    queryComprehensive(projectId, dateType, date, [areaId]).then(res => {
      if(res.success){
        if(res.data){
          setData(res.data.link)
        }else{
          setData([])
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { run:runCompre } = useRequest(getComprehensive, {
    manual: true
  })
  //电
  const getElectric = () => {
    let dateType = type == 'year'? 3 : type == 'month' ? 2 : 1 
    queryElectric(projectId, dateType, date, [areaId]).then(res => {
      if(res.success){
        if(res.data){
          setData(res.data.link)
        }else{
          setData([])
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { run:runElectric } = useRequest(getElectric, {
    manual: true
  })
  //水
  const getWater = () => {
    let dateType = type == 'year'? 3 : type == 'month' ? 2 : 1 
    queryWater(projectId, dateType, date, [areaId]).then(res => {
      if(res.success){
        if(res.data){
          setData(res.data.link)
        }else{
          setData([])
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { run:runWater } = useRequest(getWater, {
    manual: true
  })
  //燃气
  const getGas = () => {
    let dateType = type == 'year'? 3 : type == 'month' ? 2 : 1 
    queryGas(projectId, dateType, date, [areaId]).then(res => {
      if(res.success){
        if(res.data){
          setData(res.data.link)
        }else{
          setData([])
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { run:runGas } = useRequest(getGas, {
    manual: true
  })
  useEffect(()=>{
    if(areaId == 0) return;
    if(energyType == 0){
      runCompre()
    }
    if(energyType == 1){
      runElectric()
    }
    if(energyType == 2){
      runWater()
    }
    if(energyType == 3){
      runGas()
    }
  },[areaId, energyType, date])

  //图表数据
  const [data, setData]= useState([])
  const config = {
    data: data,
    sourceField: 'source',
    targetField: 'target',
    weightField: 'value',
    nodeWidthRatio: 0.01,
    nodePaddingRatio: 0.03,
  };

  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <div style={{display:'flex',alignItems:'center'}}>
          <span style={{marginLeft: '16px',marginRight: 16}}>园区选择</span>
          <Select
            placeholder="请选择园区"
            size="middle"
            key={defaultArea}
            defaultValue={defaultArea}
            style={{width: '200px'}}
            onChange={changeArea}
          >
            {areaList.map(item => {
              return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
            })}
          </Select>
          <div className={style.line}></div>
          <span>能源类型</span>
          <Select
            placeholder="全部类型"
            size="middle"
            style={{width: '126px', marginLeft: '16px'}}
            defaultValue={0}
            onChange={changeEnergyType}
          >
            <Option value={0}>综合能耗</Option>
            <Option value={1}>电</Option>
            <Option value={2}>水</Option>
            <Option value={3}>燃气</Option>
          </Select> 
        </div>
        <div className={style.rightHeader}>
          <Select
            size="middle"
            style={{width: '80px', marginRight: '16px'}}
            defaultValue={"year"}
            onChange={changeDateType}
          >
            <Option value="date">日</Option>
            <Option value="month">月</Option>
            <Option value="year">年</Option>
          </Select>
          <PickerWithType 
            style={{width: '160px', marginRight: '16px'}} 
            type={type} 
            onChange={changeDate}
          ></PickerWithType> 
        </div>
      </div>
      <div className={style.content}>
        <div className={style.contentRight}>
          <div className={style.rightTitle}>能源流向</div>
          {data.length == 0 ? <Empty style={{marginTop: 150}}></Empty> : <Sankey style={{width:'1400px',height:650,marginLeft:'120px'}} {...config} /> }
        </div>
      </div>
    </div>
  )
}
