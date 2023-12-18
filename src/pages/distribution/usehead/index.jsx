import React, { useState, useMemo, useEffect, useRef,forwardRef,useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message } from 'antd'
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import { selectOneLevel, getRoomList } from "@redux/systemconfig";
export default forwardRef(function Index({QueryFibreTempilPartitions,active,setActive,setChannel,channelInfo,initchart,QueryFibreTempilWarningInfo=() => {}},ref) {
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(selectOneLevel)
  const roomopts = useSelector(state => state.system.roomId)
  const [roomlist, setRoomList] = useState(roomopts)
  const [roomId, setRoomId] = useState(roomopts[0]?.id)
  const [form] = Form.useForm()
  const changeArea=(v)=>{
    console.log(v)
    getRoomList(v)
  }
  const getRoomList = async (areaId) => {
    const resp = await distributionRoom.RoomList(projectId, areaId)
    if (resp.success) {
      setRoomList(resp?.data)
      getRoomList(resp?.data)
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        form.setFieldValue('roomId', resp.data[0][['id']])
        setRoomId(resp.data[0][['id']])
       
      } else {
        form.setFieldValue('roomId', [])
        setRoomId(null)  
      }
    }
  }
  useEffect(()=>{
    QueryFibreTempilWarningInfo && QueryFibreTempilWarningInfo(roomId)
  },[roomId])
  useEffect(()=>{
    console.log(roomId)
    !roomId&&setChannel([])
     roomId&&QueryFibreTempilPartitions && QueryFibreTempilPartitions(roomId)
    if(!roomId){
      channelInfo.info={}
    }
    initchart && initchart()
    console.log(channelInfo)
  },[roomId,active])
  useImperativeHandle(ref,()=>{
    return {
      roomId
    }
  })
return (
  <div>
          <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
              <Form
                  form={form}
                  colon={false}
                  layout="inline"
                  initialValues={{
                      area: oneLevel.length > 0 ? oneLevel[0]?.id : null,
                      roomId: roomlist.length > 0 ? roomlist[0].id : null
                  }}
              >
                  <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
                      <Select 
                      style={{ width: 200 }} 
                      options={oneLevel} 
                      fieldNames={{ label: 'name', value: 'id' }} 
                      onChange={changeArea}
                      placeholder="请选择园区"
                      ></Select>
                  </Form.Item>
                  <Form.Item>
                      <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
                  </Form.Item>
                  <Form.Item name="roomId" >
                      <Select
                          value={roomId}
                          options={roomlist}
                          fieldNames={{ label: 'name', value: 'id' }}
                          style={{ width: 240 }}
                          placeholder="请选择配电房"
                          onChange={(v)=>{
                              console.log(v)
                              setRoomId(v) 
                              setActive(0)  
                          }}></Select>
                  </Form.Item>
              </Form>
          </div>
  </div>
)
}
) 