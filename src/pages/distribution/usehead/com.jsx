import React, { useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message,Space } from 'antd'
import {useLocation} from 'react-router-dom'
import {DistributionRoomRuntime,distributionRoom, Area} from '@api/api.js'
import {  getcurlRommid,setCurrentlevel, levelDefaultLabel,  getRoomId, roomId, selectcurlRommid,selectcurlRommidl, getcurlRommidl} from "@redux/systemconfig";
import Textloop from '@com/textloop'
import {filterProps} from '@com/usehandler'
export default   function Index(props) {
  const {state, search} = useLocation()
  
  let { nested = '', primary} = state|| {};
  const lineName = new URLSearchParams(search)?.get('lineName')
  let isline = primary == "runtimeDistribution" && nested == "line"
  const roomIds = useSelector(roomId)
  const curid = useSelector(selectcurlRommid)
  const curidl = useSelector(selectcurlRommidl)
  //const roomid =  isline ? curidl : curid
  const [RommId, setRoomId] = useState(curid)
  let { showRoom = true, showArea=true, setDateVal, custview } = props
  const dispacth = useDispatch();
  const projectId = useSelector(state => state.system.menus.projectId)

  const [oneLevel, setOnelevel] = useState([])

  const levelName = useSelector(levelDefaultLabel) || '园区'

  const [roomlist, setRoomList] = useState([])
 
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
  const [TimeSelect, setTimeSelect] = useState(true);
  
  const changeTime = (time, option) => {
    setDateVal(time)
  }

  const getOnelevel = async () => {
  
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
            roomId: null
          })
          setOnelevel([])
          setRoomList([])
          dispacth(setCurrentlevel({}))
          message.warning("没有设置园区")
        }
      } else {
        message.warning(errMsg || "数据出错")
        dispacth(setCurrentlevel({}))
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
    const {success, data, errMsg} = await distributionRoom.RoomList(projectId, id)
    if (success && Array.isArray(data) && data.length > 0) {        
        dispacth(getRoomId(data))
     
        form.setFieldValue("roomId", data[0].id)
        dispacth(getcurlRommid(data[0].id));
    }else {
      dispacth(getRoomId([]))
      form.setFieldValue('roomId', null)
      dispacth(getcurlRommid(null))
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
useEffect(() => {
  if (nested == "environment" || lineName ) {
    setTimeSelect(true)
  } else {
    setTimeSelect(false)
  }
}, [nested, lineName])
return (
  <div>
          <div style={{backgroundColor: "#fff", paddingLeft: '16px', border: '1px solid #d7d7d7', borderRadius: 4, height: '48px', display: 'flex'}}>
              <Form
                  form={form}
                  colon={false}
                  layout="inline"  
                  style={{flex: 1,  display: 'flex', alignItems: 'center',}} 
                                
              >
                {showArea &&  <Form.Item label={levelName}   name="area" style={{ marginBottom: 0 }}>
                      <Select 
                      style={{ width: 200 }} 
                      options={oneLevel} 
                      fieldNames={{ label: 'name', value: 'id' }} 
                      onChange={changeArea}                      
                      ></Select>
                  </Form.Item>}
                  {showRoom && <><Form.Item>
                      <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
                  </Form.Item>
                 {isline ? <Form.Item name="roomIdl" initialValue={0} >
                      <Select
                          options={[{name: '全部配电房', id: 0},...roomIds]}
                          fieldNames={{ label: 'name', value: 'id' }}
                          style={{ width: 240 }}
                          placeholder="请选择配电房"
                          onChange={lchangeRomme}
                          {...filterProps}
                          ></Select>
                  </Form.Item>
                  : <Form.Item name="roomId"  >
                  <Select
                      options={roomIds}
                      fieldNames={{ label: 'name', value: 'id' }}
                      style={{ width: 240 }}
                      placeholder="请选择配电房"
                      {...filterProps}
                      onChange={changeRomme}></Select>
                   </Form.Item>
                  }
                  </>
                  }
                 
                  {
                    TimeSelect && <Form.Item label="日期" name="dataval" initialValue={moment()} style={{marginLeft: "auto"}}>
                      <DatePicker size='middle'  onChange={changeTime}></DatePicker>
                    </Form.Item>
                  }
                  {
                   custview && <Form.Item noStyle>
                      {custview}
                   </Form.Item>
                  }

                 <Form.Item style={{marginLeft: 'auto', marginRight: 0}}>
                  <Textloop projectId={projectId} roomId={curid} />
                  </Form.Item>  
                 
              </Form>
            
          </div>
  </div>
)
}
