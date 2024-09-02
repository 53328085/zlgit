import React, {useRef, useEffect, forwardRef, useImperativeHandle, useState} from 'react'
import {Form, Input, Select, Row, Col, Typography, Space, DatePicker, message} from 'antd'
import {useRequest} from 'ahooks'
import styled from 'styled-components'
import CModal from '@com/useModal'
import {Cdivider} from '@com/comstyled'
import { WorkTicketRuntime } from '@api/api'

import Usetable from '@com/useTable'
import {CustButton,   CustLink } from '@com/useButton'
import {columns, ncolumns, scolumns, wcolumns} from './columns'
import Tablecom from './tablecom'
const Mainbox = styled.div`
&& {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: #515151;
    padding-right: 32px;
    .ant-form-item.updown {
        .ant-row.ant-form-item-row{
            display: block;
        }
    }
    .subtitle{
        
        display: flex;
        height: 32px;
        padding-left: 8px;
        align-items: center;
        background-color: #f2f2f2;
        font-weight: bold;
    }
    .flex {
        display: flex;
        justify-content: space-between;
    }
}
`
const Mtitle = styled.div`
&&{
        font-size: 20px;
        color: #515151;
        text-align: center;
        padding-bottom: 32px;
        font-weight: bold;
    }
`
const {GetCommanderList, GetReviewerList, GetTeamList, GetTeamMemberList,AddWorkTicket} = WorkTicketRuntime
export default  forwardRef(function Addticket({type, projectId, areaId,switchHouseId, userId,}, ref) {
 
  const title =  `填写第${['一','一', '二'][type]}中工作票`
  const [uform] = Form.useForm()
  const [list, setList] = useState({
    0: [],
    1: [],
    2: [],
    length: 3
  })
  
  const [commander, reviewer, team] = Array.from(list)
 // const [member, setMember] = useState([])
  const tref = useRef()
  const rules = [{
    required: true
  }]
  const getMemberList = async (teamId) => {
      try {
        let params ={
            teamId,
            projectId,
         }
       let {success, data} = await GetTeamMemberList(params)
       if(success && Array.isArray(data)) {
          uform.setFieldValue('TeamMember',  data)
       }else{
         setMember([])
        uform.setFieldValue('TeamMember', [])
       }
      } catch{
        
      }
     
  }
  const getDataList= async () => { 
    try {
        if(![projectId, areaId].every(p => Number.isInteger(parseInt(p)))) return
        let params = {
            projectId,
            areaId
        }
        let promises = [GetCommanderList(params),GetReviewerList(params),GetTeamList(params)]
        let  data = await Promise.allSettled(promises)
        let listObj ={}
        data.forEach((req,index) => {
             try {
                let {status, value} = req 
                if(status=="fulfilled" && value?.success && Array.isArray(value?.data)) {
                    listObj[index] = value.data
                } 
             } catch (error) {
                
             }
        })
        
        setList({...list, ...listObj})
        return listObj[2]
    } catch{
        
    }
 
  }

  useEffect(() => {
    getDataList().then(res => {
        if(Array.isArray(res) && res?.length >0) {
            getMemberList(res[0].id)
        }else{
            setMember([])
        }
    })
  }, [projectId, areaId])
  const onOk = async() => {
      try {
        let values =await uform.validateFields()
        let ext ={
            Type:type,
            AreaId: areaId,
            SwitchHouseId:switchHouseId,
            CreatorId:userId,
        }
        let params ={
            projectId,
            areaId,
            switchHouseId
        }
       let {success, errMsg} = await  AddWorkTicket({...values, ...ext}, params)
       if(success) {
         message.success('保存成功')
       }else {
         message.warning(errMsg)
       }
      } catch (error) {
        return Promise.reject(error)
      }
     
  }
  useImperativeHandle(ref,() => ({
    onOpen: () => tref.current.onOpen(),
    onCancel: () => tref.current.onCancel(),
    
  }))
  return (
    <CModal   ref={tref} onOk={onOk} title={<Mtitle>{title}</Mtitle>} width={1050}   mold="cust" nolf="no" bdpd="0px 0px 32px 32px" custft>
    <Form form={uform}  preserve={false} requiredMark="optional" labelCol={{flex: '6em'}} labelAlign='left' style={{height: '1450px', overflowY: 'auto'}}>
        <Mainbox>
   
        <Row gutter={32}>
            <Col span={6}>
                <Form.Item label="单位" name="Unit" rules={rules} normalize={value => value?.trim()} className='updown'>
                 <Input /> 
           </Form.Item>
           </Col>
        <Col span={6}>
       <Form.Item label="变电所" name="Substation" rules={rules} className='updown'>
           <Input /> 
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label="编号" name="No" rules={rules} className='updown'>
           <Input /> 
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label="风险等级" name="RiskLevel" rules={rules} initialValue={1} className='updown'>
        <Select options={[
            {
             label: 'Ⅰ',
             value: 1, 
            },
            {
                label: 'Ⅱ',
                value: 2, 
              },
              {
                label: 'Ⅲ',
                value: 3, 
              }
           ]} /> 
       </Form.Item>
       </Col>
       </Row>
   
     <Cdivider type="h" />
     <div className='subtitle'>1. 工作负责人</div>
    
        <Row gutter={[0, 14]}>
            <Col span={8}>
                <Form.Item label="负责人" name="CommanderId" rules={rules}>
                 <Select options={commander} fieldNames={{label: 'name', value: 'id'}} /> 
           </Form.Item>
           </Col>
        <Col span={8} offset={8}>
       <Form.Item label="工作审核人" name="ReviewerId" rules={rules}>
        <Select options={reviewer} fieldNames={{label: 'name', value: 'id'}} /> 
       </Form.Item>
       </Col>
       
       <Col span={8}>
                <Form.Item label="班组选择" name="TeamId" rules={rules}>
                <Select options={team} fieldNames={{label: 'name', value: 'id'}} /> 
           </Form.Item>
           </Col>
       </Row>
      
        <div className='flex'>
            <div className='subtitle' style={{flex:1, marginRight: '16px'}}>2. 班组成员（不包括工作负责人）</div>
           <CustButton ghost>新增班组成员</CustButton>
        </div>
        <Form.Item name="TeamMember">
            <Tablecom columns={columns}   />
        </Form.Item>
     
       <div className='subtitle' style={{flex:1, marginRight: '16px'}}>3. 工作的配电站名称及设备双重名称</div>
          <Form.Item name="Name">
            <Input.TextArea rows={4} />
            </Form.Item>  
            <div className='flex'>
            <div className='subtitle' style={{flex:1, marginRight: '16px'}}>4. 工作任务</div>
           <CustButton ghost>新增工作任务</CustButton>
        </div>
        <Form.Item name="WorkTask">
        <Tablecom columns={wcolumns} />
        </Form.Item>
        
        <div className='subtitle' >5. 工作计划时间</div>   
        <Row gutter={64}>
            <Col span={12}>
            <Form.Item name="Start" label="开始时间" rules={rules}>
                <DatePicker showTime />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item name="End" label="结束时间" rules={rules}>
                <DatePicker showTime />
            </Form.Item>
            </Col>
        </Row>
        <div className='flex'>
            <div className='subtitle' style={{flex:1, marginRight: '16px'}}>6. 安全措施</div>
           <CustButton ghost>新增安全措施</CustButton>
        </div>
        <Form.Item name="SecurityMeasures">
        <Tablecom columns={scolumns}  />
        </Form.Item>
        <div className='flex'>
            <div className='subtitle' style={{flex:1, marginRight: '16px'}}>7. 工作地点保留带电部分或注意事项</div>
           <CustButton ghost>新增注意事项</CustButton>
        </div>
        <Form.Item name="Note">
        <Tablecom columns={ncolumns}  />
        </Form.Item>
        </Mainbox>
     </Form>
</CModal>
  )
})
