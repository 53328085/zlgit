import React, {useState} from 'react'
import style from './style.module.less';
import { Select, Button, message } from 'antd';
import OtherPage from './otherPage'
import MainPage from './mainPage'
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevel} from '@redux/systemconfig.js'

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
  //园区
  const [defaultArea, setDefaultArea] = useState(areaList[0].id)
  const [areaId,setAreaId] = useState(areaList[0].id)
  const [areaName, setAreaName] = useState(areaList[0].name)
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