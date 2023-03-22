import React , { useEffect, useState, useRef, useMemo } from 'react'
// import DevopSearch from '@com/devopSearch/devopSearch'
import WarnContent from './warncontent'
import style from './style.module.less'
import {Form,Select} from 'antd'
import { useSelector } from 'react-redux'
export default function Index() {
  const [form] =Form.useForm()
  const [areavalue, setAreavalue] = useState(0)
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions = useMemo(() => ([{ name: oneLevel[0].levelName, id: 0 }, ...oneLevel]), [oneLevel])
  //改变区域
  const changeArea = (v) => {
    console.log(v)
    setAreavalue(v)
  }
  return (
    <div className={style.warning}>
      <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px',  border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
          >
            <Form.Item label="园区选择" name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={0}></Select>
            </Form.Item>
          </Form>
        </div>
      <WarnContent style={style} areavalue={areavalue}/>
    </div>
  )
}
