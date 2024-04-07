import React, { useState, useMemo, useEffect, useRef,forwardRef,useImperativeHandle, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message } from 'antd'
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import { selectdisOneLevel, getDiscurlevel, getcurlRommid, selectOneLevelDefaultId,selectOneLevel, selectdiscurlevel,setCurrentlevel, levelDefaultLabel,  getRoomId} from "@redux/systemconfig";
export default  memo(function Index(props) {
  let {showRoom = true} = props
  const dispacth = useDispatch();
  const projectId = useSelector(state => state.system.menus.projectId)
 // const oneLevel = useSelector(selectdisOneLevel)
  const levelName = useSelector(levelDefaultLabel) || '园区'
 // const areaId = useSelector(selectdiscurlevel)
 const oneLevel = useSelector(selectOneLevel)
 const areaId = useSelector(selectOneLevelDefaultId)
  const [roomlist, setRoomList] = useState([])
  const [roomId, setRoomId] = useState()
  const [form] = Form.useForm()
  const changeArea=(v, option)=>{  
     dispacth(setCurrentlevel(option))
  //  getDiscurlevel(v)   
     showRoom &&  getRoomList(v)
  }
  const changeRomme = (v) => {      
       dispacth(getcurlRommid(v))
  }
  const getRoomList = async (id) => {
    const resp = await distributionRoom.RoomList(projectId, id)
    if (resp?.success) {
      setRoomList(resp?.data)
      dispacth(getRoomId(resp?.data))
     // dispacth(getRoomList(resp?.data))
      if (Array.isArray(resp?.data) && resp.data.length > 0) {
        let id = resp.data[0][['id']]
        form.setFieldValue('roomId', id)
        setRoomId(id)
        dispacth(getcurlRommid(id))
      } else {
        form.setFieldValue('roomId', [])
        setRoomId(null)  
      }
    }
  }
 
 useEffect(() => {
  if(oneLevel?.length < 1) return 
  if(areaId) {
    getRoomList(areaId)
  }
 
 }, [areaId, oneLevel])
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
                  <Form.Item label={levelName}   name="area" style={{ marginBottom: 0 }}>
                      <Select 
                      style={{ width: 200 }} 
                      options={oneLevel} 
                      fieldNames={{ label: 'name', value: 'id' }} 
                      onChange={changeArea}                      
                      ></Select>
                  </Form.Item>
                  {showRoom && <><Form.Item>
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
                  </>
                  }
              </Form>
          </div>
  </div>
)
})
 