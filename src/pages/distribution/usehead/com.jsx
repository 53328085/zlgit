import React, { useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message,Space } from 'antd'
import {useLocation} from 'react-router-dom'
import {DistributionRoomRuntime,distributionRoom, Area} from '@api/api.js'
import {  getcurlRommid,setCurrentlevel, levelDefaultLabel,  getRoomId, roomId,adaptation, selectcurlRommid,selectcurlRommidl, getcurlRommidl,getSite} from "@redux/systemconfig";
import Textloop from '@com/textloop'
import Devicelist from './devicelist'
import {filterProps} from '@com/usehandler'
import {Cdivider} from '@com/comstyled'
import {useTransformerList} from './api'
const Mainbox =styled.div`
&& {
  background-color:#fff;
   padding-left: 16px;
   border: 1px solid #d7d7d7;
   border-radius: 4px;
    height: 48px;
     display: flex;
     .ant-form-inline .ant-form-item {
       margin-right: 0px;
     }
}
`
export default   function Index(props) {
  const {state, search} = useLocation()
 
  let { nested = '', primary} = state|| {};
  const lineName = new URLSearchParams(search)?.get('lineName')
  let isline = primary == "runtimeDistribution" && nested == "line"
  const roomIds = useSelector(roomId)
  console.log("roomIds", roomIds)
  const curid = useSelector(selectcurlRommid)
  const curidl = useSelector(selectcurlRommidl)
  const {laptop} = useSelector(adaptation)
 
  let { showRoom = true, showArea=true, setDateVal, custview, deviceStyle,
    setDeviceStyle, showSite=false} = props
  const dispacth = useDispatch();
  const projectId = useSelector(state => state.system.menus.projectId)

  const [oneLevel, setOnelevel] = useState([])

  const levelName = useSelector(levelDefaultLabel) || '园区'
  const [sites, setSites] = useState([])
  
 const [deviceopt,defaultdeviceStyle] = useMemo(()=> {
  if(!Array.isArray(oneLevel) || (Array.isArray(oneLevel) && oneLevel.length === 0)) {
    return [[], null]
  }else if(Array.isArray(oneLevel) && oneLevel.length > 0) {
   return  [[
      {label: '变压器',value: 5},
      {label: '直流屏',value: 15},
      {label: '出线柜',value: 16}
    ],deviceStyle]
  }

 },[roomIds,deviceStyle])
  const [form] = Form.useForm()
  const changeArea = (v, option) => {
   
    dispacth(setCurrentlevel(option))

    showRoom && getRoomList(v)
  }
 
  const changeRomme = (v) => {      
      dispacth(getcurlRommid(v))
      
  }
  const lchangeRomme = (v) => {
    dispacth(getcurlRommidl(v))
  }
  
  
  const changeTime = (time, option) => {
    setDateVal(time)
  }
  const changeSite=(_,option) => {
    dispacth(getSite(option))
  }
  const getSites = async(roomId)=> {
    try {
       let {success, data} =   await  useTransformerList({projectId, roomId})
       if(success && Array.isArray(data) && data?.length>0) {
        setSites(data)
        form.setFieldValue("site", data[0]?.sn)
        dispacth(getSite(data[0]))
       }else {
         setSites([])
         form.setFieldValue("site", null)
         dispacth(getSite(null))
       }
    } catch (error) {
      setSites([])
      form.setFieldValue("site", null)
      dispacth(getSite(null))
    }
     
  }

  const getOnelevel = async () => {// 园区
  
    try {
      let { success, data, errMsg } = await Area.AreaList(projectId)
      if (success) {
        if (Array.isArray(data) && data?.length) {
          setOnelevel(data)
          form.setFieldValue("area", data[0].id)
          getRoomList(data[0].id)
          dispacth(setCurrentlevel(data[0]))
        } else {
          form.setFieldsValue({
            areaId: null,
            roomId: null,
            site: null,

          })
          setOnelevel([])
        //  setRoomList([])
          dispacth(setCurrentlevel({}))
          dispacth(getRoomId([]))
          setSites([])
   
          dispacth(getSite(null))
          message.warning("没有设置园区")
        }
      } else {
        message.warning(errMsg || "数据出错")
        dispacth(setCurrentlevel({}))
        form.setFieldsValue({
          areaId: null,
          roomId: null,
          site: null,
        })
        dispacth(getRoomId([]))
        setOnelevel([])
        setSites([])
   
        dispacth(getSite(null))
     //   setRoomList([])
      }
    } catch (error) {

    }

  }
  const getRoomList = async (id) => { // 房间
    const {success, data, errMsg} = await distributionRoom.RoomList(projectId, id)
    if (success && Array.isArray(data) && data.length > 0) {        
        dispacth(getRoomId(data))
     
        form.setFieldValue("roomId", data[0].id)
        dispacth(getcurlRommid(data[0].id));
        getSites(data[0].id)
    }else {
      dispacth(getRoomId([]))
      form.setFieldsValue({
        roomId: null,
        site: null,
      })
      dispacth(getcurlRommid(null))
      setSites([])
   
      dispacth(getSite(null))
      if (!success) {
        message.warning(errMsg || "数据出错")
      } else {
        message.warning("没有配电房")
      }
    }
  }
  useEffect(() => {
    if(Number.isInteger(projectId))   getOnelevel()
  }, [projectId])
 
 useEffect(() => {
  if(isline) {
    dispacth(getcurlRommidl(0))
    form.setFieldValue("roomIdl", 0)
  }

}, [isline])
/* useEffect(() => {
  if (nested == "environment" || lineName ) {
    setTimeSelect(true)
  } else {
    setTimeSelect(false)
  }
}, [nested, lineName]) */
const timeroute = ["environment", "quality"]  // 显示时间的路由

const showDate = (nested &&  timeroute.includes(nested)) || lineName
const showDeviceStyle = nested && nested =='monitoring'
const showDevlist = nested && nested == 'quality'
const onValuesChange = (_, allValues) => {      
    
  props.setexparams({...allValues})
}
useEffect(() => {
  if(nested && Number.isInteger(parseInt(projectId))) {
    props.setexparams({...form.getFieldsValue(true)})
  }
 

}, [nested, projectId])
return (
  <div>
          <Mainbox>
              <Form
                  form={form}
                  colon={false}
                  layout="inline"  
                  style={{flex: 1,  display: 'flex', alignItems: 'center',  justifyContent: "space-between"}} 
                  onValuesChange={onValuesChange}             
              >
                <Space   size={16}>
                {showArea &&  <Form.Item label={levelName}   name="area" style={{ marginBottom: 0 }}>
                      <Select 
                      style={{ width: laptop ? 150 : 200 }} 
                      options={oneLevel} 
                      fieldNames={{ label: 'name', value: 'id' }} 
                      onChange={changeArea}                      
                      ></Select>
                  </Form.Item>}
                  {showRoom && <> 
                 {isline ? <Form.Item name="roomIdl" initialValue={0} >
                      <Select
                          options={[{name: '全部配电房', id: 0},...roomIds]}
                          fieldNames={{ label: 'name', value: 'id' }}
                          style={{ width: laptop ? 160 : 240 }}
                          placeholder="请选择配电房"
                          onChange={lchangeRomme}
                          {...filterProps}
                          ></Select>
                  </Form.Item>
                  : <Form.Item name="roomId"  >
                  <Select
                      options={roomIds}
                      fieldNames={{ label: 'name', value: 'id' }}
                      style={{ width:laptop ? 160 : 240 }}
                      placeholder="请选择配电房"
                      {...filterProps}
                      onChange={changeRomme}></Select>
                   </Form.Item>
                  }
                  </>
                  }
                  {
                    showSite && <Form.Item name="site">
                      <Select options={sites} style={{ width: laptop ? 160 : 240 }} fieldNames={{label: "name", value: "sn"}} onChange={changeSite}></Select>
                    </Form.Item>
                  }
                  {
                    showDevlist &&<Devicelist roomId={curid} projectId={projectId} /> 
                  }
                  {
                    showDate && <Form.Item label="日期" name="dateval" initialValue={moment()}>
                      <DatePicker size='middle'  onChange={changeTime}></DatePicker>
                    </Form.Item>
                  }
                  {
                    showDeviceStyle && <Form.Item name="deviceStyle" initialValue={defaultdeviceStyle}>
                      <Select  style={{width: laptop ? 150 : 200}} 
                      labelInValue={true}
                      options={deviceopt} onChange={(v) => setDeviceStyle(v)} ></Select>
                    </Form.Item>
                  }
                  </Space>
                  <Space style={{marginLeft: laptop ? "16px" : "64px"}}>
                  {
                   custview && <Form.Item noStyle >
                      {custview}
                   </Form.Item>
                  }
 </Space>
                {(showDevlist&&laptop) ? null : <Form.Item style={{marginLeft: 'auto', marginRight: 0}}>
                  <Textloop projectId={projectId} roomId={curid} laptop={laptop} />
                  </Form.Item>  
}
              </Form>
            
          </Mainbox>
  </div>
)
}
