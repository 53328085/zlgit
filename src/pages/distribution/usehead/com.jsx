import React, { useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, Button, DatePicker, Form, Divider, message, Space } from 'antd'
import { useLocation } from 'react-router-dom'
import moment from 'moment';
import { DistributionRoomRuntime, distributionRoom, Area } from '@api/api.js'
import { getcurlRommid, setCurrentlevel, levelDefaultLabel, getRoomId, roomId, selectcurlRommid, setEnvironmentTime } from "@redux/systemconfig";
export default memo(function Index(props) {
  const location = useLocation()
  let { state = {} } = location
  let { nested = '', primary } = state;
  let isline = primary == "runtimeDistribution" && nested == "line"
  const roomIds = useSelector(roomId)
  const curid = useSelector(selectcurlRommid)
  const [RommId, setRoomId] = useState(curid)
  let { showRoom = true } = props
  const dispacth = useDispatch();
  const projectId = useSelector(state => state.system.menus.projectId)

  const [oneLevel, setOnelevel] = useState([])

  const levelName = useSelector(levelDefaultLabel) || '园区'

  const [roomlist, setRoomList] = useState([])
  // const [roomId, setRoomId] = useState()
  const [form] = Form.useForm()
  const changeArea = (v, option) => {
    dispacth(setCurrentlevel(option))

    showRoom && getRoomList(v)
  }
  const changeRomme = (v) => {
    dispacth(getcurlRommid(v))
    setRoomId(v)
  }
  const [TimeSelect, setTimeSelect] = useState(true);
  const [dateval, setDateVal] = useState(moment())
  const changeTime = (time, option) => {
    setDateVal(time)
    dispacth(setEnvironmentTime(option))
  }
  const getOnelevel = async () => {
    if (nested != "environment") {
      setTimeSelect(false)
    } else {
      setTimeSelect(true)
    }
    try {
      let { success, data, errMsg } = await Area.AreaList(projectId)
      if (success) {
        if (Array.isArray(data) && data?.length) {
          setOnelevel(data)
          form.setFieldValue("area", data[0].id)
          getRoomList(data[0].id)
        } else {
          form.setFieldsValue({
            areaId: null,
            roomId: null
          })
          setOnelevel([])
          setRoomList([])

          message.warning("没有设置园区")
        }
      } else {
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
    const { success, data, errMsg } = await distributionRoom.RoomList(projectId, id)
    if (success && Array.isArray(data) && data.length > 0) {
      dispacth(getRoomId(isline ? [...data, { name: '全部配电房', id: 0 }] : data))
      let id = isline ? 0 : data[0].id
      form.setFieldValue("roomId", id)
      dispacth(getcurlRommid(id))
    } else {
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
    if (Number.isInteger(projectId)) getOnelevel()
  }, [projectId, nested])
  useEffect(() => {
    dispacth(setEnvironmentTime(dateval))
  }, [dateval])
  return (
    <div>
      <div style={{ position: "relative", backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '7px 16px', border: '1px solid #d7d7d7', borderRadius: 4 }}>
        <Form
          form={form}
          colon={false}
          layout="inline"
        >
          <Form.Item label={levelName} name="area" style={{ marginBottom: 0 }}>
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
            <Form.Item name="roomId" initialValue={RommId}>
              <Select
                options={roomIds}
                fieldNames={{ label: 'name', value: 'id' }}
                style={{ width: 240 }}
                placeholder="请选择配电房"
                onChange={changeRomme}></Select>
            </Form.Item>
          </>
          }
        </Form>
        {TimeSelect && <Space style={{ position: "absolute", right: "16px" }} initialValue={moment()} >
          <span>日期</span>
          <DatePicker size='middle' value={dateval} onChange={changeTime}></DatePicker>
        </Space>}
      </div>
    </div>
  )
})
