
import React , { useEffect, useState, useRef, useMemo } from 'react'
import style from './style.module.less'
import {Form,Select} from 'antd'
import { useSelector } from 'react-redux'
import OrderContent from './ordercontent'
export default function Index() {
  const [form] =Form.useForm()
  const [areavalue, setAreavalue] = useState(0)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions =oneLevel.length>0? useMemo(() => ([{ name: oneLevel[0].levelName, id: 0 }, ...oneLevel]), [oneLevel]):[]
  //改变区域
  const changeArea = (v) => {
    console.log(v)
    setAreavalue(v)
  }

  return (
    <div className={style.Order}>
      <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px',  border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length>0?0:null}></Select>
            </Form.Item>
          </Form>
        </div>
       <OrderContent style={style} areavalue={areavalue}></OrderContent>
    </div>
  )
}