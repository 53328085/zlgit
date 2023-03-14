import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import { Select, Button, message } from 'antd';
import OtherPage from './otherPage'
import MainPage from './mainPage'
import { useRequest } from 'ahooks';
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { AreaSetting } from '@api/api.js'

export default function Index() {
  const {Option} = Select
  const [display, setDisplay] = useState(true);
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
  const [areaName, setAreaName] = useState('')
  const getAreaData = () =>{
    return QueryAllArea (projectId, 1).then(res=> {
      let {success, data} = res
      if(success && data){
        setAreaList(data)
        setDefaultArea(data[0].id)
        setAreaId(data[0].id)
        setAreaName(data[0].name)
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
    areaList.map(item => {
      if(item.id == value){
        setAreaName(item.name)
      }
    })
  }

  const getValueFromOther = (param)=>{
    setDisplay(param)
  }
  const getValueFromMain = (param)=>{
    setDisplay(param)
  }
  const goBack = () => {
    setDisplay(true)
  }


  return (
    <div>
      {contextHolder}
      <div className={style.header}>
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
        {display ? null : <Button style={{marginRight:12,marginLeft:'auto', borderRadius:4, width:96 }} size='middle' onClick={goBack}>返回</Button>}
      </div>
    {display ? <OtherPage sendToIndex={getValueFromOther} areaId={areaId} areaName={areaName}></OtherPage>:<MainPage sendToIndex={getValueFromMain} areaId={areaId} areaName={areaName}></MainPage>}
    </div>
  )
}