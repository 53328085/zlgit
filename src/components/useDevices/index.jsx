import React, {useState, useEffect} from 'react'
import {Select} from 'antd'
const {DeviceTypeManager: {AllDeviceStyle} } = Monitoring
export default function index({style={ width: 200, marginLeft: 16}, handleChangeDevice, defaultvalue}) {
    const [devices, setDevies] = useState([])
    const getType = async () => { // 获取设备类型
        
        try {
          let {success, data} = await AllDeviceStyle();
          if(success && Array.isArray(data)) {
             setDevies(data);
          }else {
            setDevies([]);
          }
        } catch (error) {
          setDevies([]);
        }
  }
  useEffect(() => {
     getType();
  }, [])
  return (
    <Select
          value={defaultvalue}
          style={style}
          fieldNames={{label: "name", value: "deviceStyle"}}
          onChange={handleChangeDevice}
          options={devices}
        />
  )
}
