import React, {useState, useEffect, Fragment} from 'react'
import { useRequest } from 'ahooks';
import style from './style.module.less';
import { Select, DatePicker, message } from 'antd';
import { Sankey } from '@ant-design/plots';
import dayjs from 'dayjs'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { AreaSetting } from '@api/api.js'

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
  const changeDateType = val => {
    setType(val)
  }
  let time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1 
  month = month > 9 ? month : '0' + month
  let day = time.getDate() + 1
  day = day > 9 ? day : '0' + day
  console.log(year+'-'+month+'-'+day)
  const PickerWithType = ({ type, onChange }) => {
    if (type === 'date') return <DatePicker defaultValue={dayjs(year+'-'+month+'-'+day, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={onChange} />;
    if (type === 'month') return <DatePicker defaultValue={dayjs(year+'-'+month, 'YYYY-MM')} format={'YYYY-MM'} onChange={onChange} />;
    return <DatePicker picker={type} defaultValue={dayjs(year.toString(), 'YYYY')} format={'YYYY'} onChange={onChange} />;
  };
  const changeDate = (date, dateString) => {
    console.log(date, dateString)
  }

  //图表数据
  const data = []
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
          <PickerWithType style={{width: '160px', marginRight: '16px'}} type={type} onChange={changeDate}></PickerWithType> 
        </div>
      </div>
      <div className={style.content}>
        <div className={style.contentRight}>
          <div className={style.rightTitle}>能源流向</div>
          <Sankey style={{width:'1400px',height:650,marginLeft:'120px'}} {...config} />
        </div>
      </div>
    </div>
  )
}
