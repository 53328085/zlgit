import React, { useEffect, useState } from 'react'
import BlueColumn from '@com/bluecolumn'
import { Form, Input, Select, TimePicker } from 'antd'
import styled from 'styled-components'
import { useReactive, useMemoizedFn, useLatest } from 'ahooks';
import WarningPng from '@imgs/warning.png'
import MyModal from '@com/useModal'
import style from './style.module.less'
import moment from 'moment';
const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

export default function Buildplan() {
  const [form] = Form.useForm()
  const [planList, setPlanList] = useState([])
  const planSelect = [
    {
      value: 1,
      label: "一天一班"
    },
    {
      value: 2,
      label: "一天二班"
    },
    {
      value: 3,
      label: "一天三班"
    },
    {
      value: 4,
      label: "一天四班"
    },
  ]
  const chooseTime = (v, i) => {
    console.log(v, i);
  }
  const disfunc = (n, m) => {
    let arr = [];
    let marr = [];
    for (let j = n + 1; j < 24; j++) {
      arr.push(j)
    }

    for (let i = m + 1; i < 60; i++) {
      marr.push(i)
    }

    return {
      disabledHours: () => arr,
      disabledMinutes: (selecthour) => {
        if (n == selecthour) {
          return marr
        }
      }
    }
  }
  const disfuncdesc = (n, m) => {
    let arr = [];
    let marr = [];
    for (let j = 0; j < n; j++) {
      arr.push(j)
    }
    for (let i = 0; i < m; i++) {
      marr.push(i)
    }
    return {
      disabledHours: () => arr,
      disabledMinutes: (selecthour) => {
        if (n == selecthour) {
          return marr
        }
      }
    }

  }
  const changePlan = (v) => {
    let arr = []
   
    for (let i = 1; i <= v; i++) {
      form.resetFields([`name${i}`,`time${i}`])
      arr.push(<FlexDiv>
        <Form.Item label={`班次${i}名称`} name={`name${i}`}>
          <Input placeholder="请输入班次"></Input>
        </Form.Item>
        <Form.Item label="班次时段" name={`time${i}`} >
          <TimePicker.RangePicker format={'HH:mm'} onChange={(v) => chooseTime(v, i)} disabledTime={(n, type) => {
            const { time1, time2, time3, time4, plan } = form.getFieldsValue()
            let hour1end, hour2start, hour2end, hour3start, hour3end, hour4start;
            let min1end, min2start, min2end, min3start, min3end, min4start;
            if (time1) {
              hour1end = time1[1].hour()
              min1end = time1[1].minutes()
            }
            if (time2) {
              hour2start = time2[0].hour()
              hour2end = time2[1].hour()
              min2start = time2[0].minutes()
              min2end = time2[1].minutes()
            }
            if (time3) {
              hour3start = time3[0].hour()
              hour3end = time3[1].hour()
              min3start = time3[0].minutes()
              min3end = time3[1].minutes()
            }
            if (time4) {
              hour4start = time4[0].hour()
              min4start = time4[0].minutes()
            }
            if (plan > 1) {
              if (i == 1) {
                if (hour2start) {
                  return disfunc(hour2start, min2start)
                } else if (hour3start) {
                  return disfunc(hour3start, min3start)
                } else if (hour4start) {
                  return disfunc(hour4start, min4start)
                }
              }
              if (i == 2) {
                let disablearr = []
                let disableminarr = []
                let disablemaxarr = []
                if (hour1end) {
                  const hour = disfuncdesc(hour1end).disabledHours()
                  disablearr = [...disablearr, ...hour]
                  let arr = []
                  for (let i = 0; i < min1end; i++) {
                    arr.push(i)
                  }
                  disableminarr = [...disableminarr, ...arr]
                }
                if (hour3start) {
                  const hour = disfunc(hour3start).disabledHours()
                  disablearr = [...disablearr, ...hour]
                  let arr = []
                  for (let i = min3start + 1; i < 60; i++) {
                    arr.push(i)
                  }
                  disablemaxarr = [...disableminarr, ...arr]
                } else if (hour4start) {
                  const hour = disfunc(hour4start).disabledHours()
                  disablearr = [...disablearr, ...hour]
                  let arr = []
                  for (let i = min4start + 1; i < 60; i++) {
                    arr.push(i)
                  }
                  disablemaxarr = [...disableminarr, ...arr]
                }
                return {
                  disabledHours: () => disablearr,
                  disabledMinutes: (selecthour) => {
                    if (hour1end == selecthour) {
                      return disableminarr
                    } else if (selecthour == hour3start || selecthour == hour4start) {
                      return disablemaxarr
                    }
                  }
                }
              }
              if (i == 3) {
                let disablearr = []
                let disableminarr = []
                let disablemaxarr = []
                if (hour2end) {
                  const hour = disfuncdesc(hour2end).disabledHours()
                  disablearr = [...disablearr, ...hour]
                  let arr = []
                  for (let i = 0; i < min2end; i++) {
                    arr.push(i)
                  }
                  disableminarr = [...disableminarr, ...arr]
                } else if (hour1end) {
                  const hour = disfuncdesc(hour1end).disabledHours()
                  disablearr = [...disablearr, ...hour]
                  let arr = []
                  for (let i = 0; i < min1end; i++) {
                    arr.push(i)
                  }
                  disableminarr = [...disableminarr, ...arr]
                }
                if (hour4start) {
                  const hour = disfunc(hour4start).disabledHours()
                  disablearr = [...disablearr, ...hour]
                  let arr = []
                  for (let i = min4start + 1; i < 60; i++) {
                    arr.push(i)
                  }
                  disablemaxarr = [...disableminarr, ...arr]
                }
                return {
                  disabledHours: () => disablearr,
                  disabledMinutes: (selecthour) => {
                    if (hour4start == selecthour) {
                      return disablemaxarr
                    } else if (selecthour == hour2end || selecthour == hour1end) {
                      return disableminarr
                    }
                  }
                }
              }
              if (i == 4) {
                if (hour3end) {
                  return disfuncdesc(hour3end, min3end)
                } else if (hour2end) {
                  return disfuncdesc(hour2end, min2end)
                } else if (hour1end) {
                  return disfuncdesc(hour1end, min1end)
                }
              }
            }
            return {}
          }} />
        </Form.Item>
      </FlexDiv>)
    }
    setPlanList(() => [...arr])
  }
  useEffect(() => {
    changePlan(3)
  }, [])
  return (
    <div>
      <Form
        form={form}
        colon={false}
        initialValues={{
          plan: 3
        }}
      >
        <Form.Item
          label="班次选择&nbsp;&nbsp; "
          name="plan"
        >
          <Select options={planSelect} style={{ width: 183 }} onChange={changePlan}></Select>
        </Form.Item>
        {planList}
      </Form>

    </div>
  )
}



export function EditUser({ editUser }) {

  const [form] = Form.useForm()
  useEffect(() => {
    console.log(editUser)
    form.setFieldValue("user", editUser)
  }, [])
  return (
    <Form
      form={form}
    >
      <Form.Item name="user">
        <Select>

        </Select>
      </Form.Item>
    </Form>
  )
}

export let DeleteModal = ({ delRef, name = '', content = '', ...other }) => {
  return (

    <MyModal mold='cust' ref={delRef} {...other} className={style.DelModal}>

      <BlueColumn name={name} styled={{ padding: '24px 0px', color: '#ff4d4f' }} bg={{ backgroundColor: '#ff4d4f' }}></BlueColumn>
      <div>
        <img src={WarningPng} style={{ margin: '0 32px', width: 48, height: 48 }}></img>
        <span>{content}</span>
      </div>

    </MyModal>

  )
}