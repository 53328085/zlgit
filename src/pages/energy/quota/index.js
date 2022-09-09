import React, {useState, useEffect} from 'react'
import style from './style.module.less';
import { SearchOutlined } from '@ant-design/icons';
import { Select,Input, Button, Progress, Pagination } from 'antd';
import UseHeader from '@com/useHeader'
import { useNavigate } from 'react-router-dom';
import OtherPage from './otherPage'
import MainPage from './mainPage'

export default function Index() {
  const {Option} = Select
  const navigate = useNavigate();
  const [display, setDisplay] = useState(true);

  const getValueFromOther = (param)=>{
    setDisplay(param)
  }
  const getValueFromMain = (param)=>{
    setDisplay(param)
  }


  return (
    <>
    {display ? <OtherPage sendToIndex={getValueFromOther}></OtherPage>:<MainPage sendToIndex={getValueFromMain}></MainPage>}
    </>
  )
}