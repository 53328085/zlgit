import React, { useState, useMemo, useEffect, useRef,forwardRef,useImperativeHandle, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message } from 'antd'
import {DistributionRoomRuntime,distributionRoom, Area} from '@api/api.js'
import {  getcurlRommid,setCurrentlevel, levelDefaultLabel,  getRoomId} from "@redux/systemconfig";
export default  memo(function Index(props) {
  let {showRoom = true} = props
  const dispacth = useDispatch();
  const projectId = useSelector(state => state.system.menus.projectId)

  const [oneLevel, setOnelevel] = useState([]) 
   
  const levelName = useSelector(levelDefaultLabel) || '园区'
 
  const [roomlist, setRoomList] = useState([])
 // const [roomId, setRoomId] = useState()
  const [form] = Form.useForm()
  const changeArea=(v, option)=>{  
     dispacth(setCurrentlevel(option))
  
     showRoom &&  getRoomList(v)
  }
  const changeRomme = (v) => {      
       dispacth(getcurlRommid(v))
  }
  const  getOnelevel = async () => {
        try {
          let {success, data, errMsg} = await Area.AreaList(projectId)
          if(success) {
             if (Array.isArray(data) && data?.length) {
                setOnelevel(data)             
                form.setFieldValue("area", data[0].id)
                getRoomList(data[0].id)
             }else {
               form.setFieldsValue({
                 areaId: null,
                 roomId: null
               })
               setOnelevel([])
               setRoomList([])
              
               message.warning("没有设置园区")
             }
          }else {
              message.warning(errMsg || "数据出错")
             
              form.setFieldsValue({
                areaId: null,
                roomId: null
              })
              setOnelevel([])
              setRoomList([])
           }
        } catch (error) {
          
        }
          
  }  
  const getRoomList = async (id) => {
    const resp = await distributionRoom.RoomList(projectId, id)
    if (resp?.success) {
     
     // dispacth(getRoomList(resp?.data))
      if (Array.isArray(resp?.data) && resp.data.length > 0) {
        setRoomList(resp?.data)
        dispacth(getRoomId(resp?.data))
        let id = resp.data[0][['id']]
        form.setFieldValue('roomId', id)
      //  setRoomId(id)
        dispacth(getcurlRommid(id))
       
      } else {
        setRoomList([])
        dispacth(getRoomId([]))
        form.setFieldValue('roomId', [])
       // setRoomId(null)  
      }
    }
  }
  useEffect(() => {
    if(Number.isInteger(projectId))   getOnelevel()
  }, [projectId])
 

return (
  <div>
          <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '7px 16px', border: '1px solid #d7d7d7', borderRadius: 4 }}>
              <Form
                  form={form}
                  colon={false}
                  layout="inline"
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
 