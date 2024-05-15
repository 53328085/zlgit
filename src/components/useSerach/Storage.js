// 储能管理
import React from 'react'
import {Form, Space} from 'antd'
import {useRequest} from 'ahooks'
import {SiteManagerDesigner, PCSMonitorRuntime, StorageContainerDesigner} from '@api/api'
const {Item} = Form
export function Index(props) {
  const {areaId} = props
  return (<Space>
    
    <Item name="stationName" label="站点选择"   >
              <Select options={options} fieldNames={{label: 'name', value: 'name'}} style={{width: '264px'}} ></Select>  
     </Item>
  </Space>)

}