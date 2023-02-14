import React,{ useEffect, useState } from 'react'
import DeviceContent from './deviceContent'
import gateWayImg from '@imgs/gateway.png';
import style from './style.module.less'
import AllColumns from './columns'
import { Monitoring } from '@api/api.js'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Upload } from 'antd';
import Table from '@com/useTable'
import electricImg from '@imgs/diaobiao.png'
 
export default function gateway() {
  const [imgUrl, setImaUrl] = useState(gateWayImg) //默认网关图
  const { DeviceTypeManager: { GatewayType } } = Monitoring;
  const projectId = useSelector(state => state.system.menus.projectId)
  let params = {
    projectId,
    pageNum: 1,
    pageSize: 10,
    alike: ''
  }
  //新增电表类型
  let AddModal = () => {
    return (
      <div className={style.deviceControl}>
          <div>

          </div>
          <div>
            <div>设备图片</div>
            <div className={style.imageGroup}>
                <img src={electricImg}></img>

            </div>
          </div>
      </div>
    ) 
}


const getTableData = async () => {
  const result = await GatewayType(params)
  const { data, errMsg, success } = result;
  if (success && Array.isArray(data)) {

  }
}
getTableData()
const onOk=()=>{

}
let deviceProps = {
  value:0,
  name:'新增电表类型',
  AddModal,
  canceltext:'取消',
  oktext:'确认',
  onOk,
  width: 1032
};
  return (
    <div>
      <DeviceContent {...deviceProps} >
        <Table  columns={ AllColumns[1] }></Table>
      </DeviceContent>
    </div>
  )
}
