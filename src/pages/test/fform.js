import React, { useState, useEffect, useContext, useRef, useCallback,useMemo } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
 
import { Input, Button, Select, Radio, Pagination, Form, message, Space } from 'antd'
 
 
import { Monitoring } from '@api/api.js'
 
import { selectProjectId, selectOneLevel, selectOneLevelDefaultId, levelDefaultLabel } from '@redux/systemconfig.js'
import {getpropject, zlmenus} from "@redux/reduxTest"
 
 
export default function Index(props) {
  const dispatch = useDispatch()
  const projectId = useSelector(selectProjectId)
  const [form] = Form.useForm();
  let areaId = useSelector(selectOneLevelDefaultId);
  
  const {DeviceTypeManager: {AllDeviceStyle}, RuntimeDevice: { Statistics, Overview, CategoryImages, Detail, Current, HistoryTrend, HistoryTable, EnergyActuary, EnergyReport, AlarmPage }, DeviceManager: { QueryUsedDeviceCategory } } = Monitoring
 // let [deviceStyle, setdeviceStyle] = useState(1)
  let [statistics, setStatistics] = useState({})
  let [overView, setoverView] = useState({ details: undefined, categories: undefined })
   const menus = useSelector(zlmenus)
 
 console.log(menus)
 function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      console.log('action')
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
 

thunk.withExtraArgument = createThunkMiddleware;
 
 

  useEffect(() => {
     dispatch(getpropject(projectId)).then(res => {
      console.log(res)
     })
  }, [projectId])
  
  
 
 

  


  // let [imgUrl, setimgUrl] = useState()
  const getGatewayImages = () => {//网关图片
    CategoryImages({ projectId: '', group: '' }).then(res => {
      let { success, data } = res
      if (success) {
        if (data != []) {
          let imgList = []
          overView?.details?.map((item, index) => {
            data.map((items, indexs) => {
              if (data[indexs].category == item.category) {
                imgList.push(data[indexs].imageBase64)
              } else {
              }
            })
          })
          setimageList(imgList)
        }
      } else {
        message.error(res.errMsg)
      }
    }).catch(e => {
      console.log(e)
    })
  }
 
  
 
 
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: "20px"}}>
       <h1>react测试</h1>
     
    </div >
  )
}
