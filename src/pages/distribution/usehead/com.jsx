import React, { useState, useMemo, useEffect, useRef,forwardRef,useImperativeHandle, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message } from 'antd'
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import { selectdisOneLevel, getDiscurlevel, getcurlRommid,  selectdiscurlevel  } from "@redux/systemconfig";
export default  memo(function Index(props) {
  const dispacth = useDispatch();
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(selectdisOneLevel)
   
  const areaId = useSelector(selectdiscurlevel)
  
  const roomopts = useSelector(state => state.system.roomId)
  const [roomlist, setRoomList] = useState(roomopts)
  const [roomId, setRoomId] = useState(roomopts[0]?.id)
  const [form] = Form.useForm()
  const changeArea=(v)=>{  
    getDiscurlevel(v)   
    getRoomList(v)
  }
  const changeRomme = (v) => {      
       dispacth(getcurlRommid(v))
  }
  const getRoomList = async (areaId) => {
    const resp = await distributionRoom.RoomList(projectId, areaId)
    if (resp.success) {
      setRoomList(resp.data)
      
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        let rommid = resp.data[0][['id']]
        form.setFieldValue('roomId', rommid)
        setRoomId(rommid)
        dispacth(getcurlRommid(rommid))
      } else {
        form.setFieldValue('roomId', [])
        setRoomId(null)  
      }
    }
  }
 
 useEffect(() => {
  if(areaId) {
    getRoomList(areaId)
  }
 
 }, [areaId])
return (
  <div>
          <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '7px 16px', border: '1px solid #d7d7d7', borderRadius: 4 }}>
              <Form
                  form={form}
                  colon={false}
                  layout="inline"
                  initialValues={
                    {
                      area: areaId,
                      roomId: roomId
                    }
                  }
              >
                  <Form.Item   name="area" style={{ marginBottom: 0 }}>
                      <Select 
                      style={{ width: 200 }} 
                      options={oneLevel} 
                      fieldNames={{ label: 'name', value: 'id' }} 
                      onChange={changeArea}                      
                      ></Select>
                  </Form.Item>
                  <Form.Item>
                      <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
                  </Form.Item>
                  <Form.Item name="roomId" >
                      <Select
                          options={roomlist}
                          fieldNames={{ label: 'name', value: 'id' }}
                          style={{ width: 240 }}
                          placeholder="请选择配电房"
                          onChange={changeRomme}></Select>
                  </Form.Item>
              </Form>
          </div>
  </div>
)
})
 