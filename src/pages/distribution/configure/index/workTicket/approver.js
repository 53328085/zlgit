import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {Form, Input,Space,Typography} from 'antd'
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import Usetable from '@com/useTable'
import {CustButton} from "@com/useButton"
import CModal from '@com/useModal'
 
import {phoneValidator} from '@pages/rule.js'
const {Link} = Typography
const Mainbox = styled.div`
 display: grid;
 grid-template-rows: 34px 1fr;
 grid-template-columns: 488px 288px;
 flex: 1;
 gap: 16px 32px;
`

export default function Index({projectId, areaId}) {
  const [isadd, setIsadd] = useState(true)
  const [pfrom] = Form.useForm();
  const ptitle = isadd ? '新增' : '编辑'
  const pref = useRef();
  const columns = [
    {
        title: '负责人',
        dataIndex: 'Name',
        key: 'Name'
    },
    {
        title: '手机号',
        dataIndex: 'Mobile',
        key: 'Mobile'
    },
    {
        title: 'operate',
        key: 'operate',
        render: () => <Space size={32}>
            <Link underline type="success">编辑</Link>
            <Link underline type="danger">删除</Link>
            </Space>
    }
]
  const getCommanders= async () => {
    await distributionRoom.GetCommanders({projectId, areaId, alike:''})
  }
  const addPrincipal = () => {
       setIsadd(true)
       pref.current.onOpen()
  }
  const ponOk =async ()=> {
         try {
            const values =await pfrom.validateFields()
            await distributionRoom.AddCommander({...values,AreaId: areaId}, projectId)
         } catch (error) {
           return  Promise.reject(error)
         }
          
  }
  useEffect(() => {
    if([projectId, areaId].every(n => Number.isInteger(parseInt(n)))){
        getCommanders()
    } 
  }, [projectId, areaId])
  return (
    <Mainbox>
           <div>
              <CustButton onClick={addPrincipal} ghost>新增负责人</CustButton>
           </div>
           <div>
              <CustButton onClick="" ghost>选择审核人</CustButton>
           </div>
           <Usetable columns={columns} dataSource={[]} hbg="#ecf5ff" hbc="#515151" pd="8px 4px"></Usetable>
           <CModal title={ptitle} ref={pref} onOk={ponOk}   width={470}   mold="cust" custft={isadd}>
             <Form form={pfrom} layout="vertical" preserve={false} requiredMark="optional">
                <Form.Item label="负责人姓名" name="Name" rules={[{required: true}]} normalize={value => value?.trim()}>
                    <Input /> 
                </Form.Item>
                <Form.Item label="负责人手机号" name="Mobile" rules={[
                  {
                    required: true,
                  },
                  {
                    validator: phoneValidator
                   }, 
                  
                  ]}>
                    <Input /> 
                </Form.Item>
             </Form>
         </CModal>
    </Mainbox>
  )
}
