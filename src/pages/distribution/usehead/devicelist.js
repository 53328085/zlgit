import React, {useState, memo, useEffect} from 'react'
import {PowerQuality} from '@api/api'
 
import {Select, Form} from 'antd'
 
export default memo(function Index({projectId, roomId}) {
    
    const [devices, setDevices] = useState([])
    const getDeviceList =async() => {
        try {
          let body ={
            projectId,
            roomId,
            
          }
          let {success, data} = await   PowerQuality.DeviceList(body)
          if(success && Array.isArray(data) && data?.length >0) {
            
              setDevices(data)
            
          }else {
            setTabs([])
          
          
          }
        } catch (error) {
           
        }
       
      }
      useEffect(() => {
        if([projectId, roomId].every(n => Number.isInteger(parseInt(n)))) {
           getDeviceList() 
        }
    
      }, [projectId, roomId])
  return (
    <Form.Item name="sn" initialValue={1}>
        <Select style={{width: 180}} options={[
            {label: '进线一电能质量', value: 1},
            {label: '进线二电能质量', value: 2}
        ]}></Select>
        </Form.Item>
   
  )
})
