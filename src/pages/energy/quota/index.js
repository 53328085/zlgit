import React, {useEffect, useState} from 'react'
import style from './style.module.less';
import { Select, Button, message } from 'antd';
import OtherPage from './otherPage'
import MainPage from './mainPage'
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevel, levelDefaultLabel} from '@redux/systemconfig.js'

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
  const areaList = useSelector(selectOneLevel)
  const levelName = useSelector(levelDefaultLabel) || '园区'
  //园区
  const [defaultArea, setDefaultArea] = useState()
  const [areaId,setAreaId] = useState()
  const [areaName, setAreaName] = useState()
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
 useEffect(()=> {
  if(areaList.length == 0 || !areaList) {
    message.error('当前项目尚未配置园区!')
    return;
  }else{
    setDefaultArea(areaList[0].id)
    setAreaName(areaList[0].name)
    setAreaId(areaList[0].id)
  }
 },[])

  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <span style={{marginLeft: '16px',marginRight: 16}}>{levelName}选择</span>
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