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
    .custrow {
      display: flex;
      column-gap: 32px;
      .custcol {
        flex: 1;
      }
    }
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
export default  forwardRef(function Addticket({type, projectId, areaId,switchHouseId, userId,getWorkTickets}, ref) {
 
  const title =  `填写第${['一','一', '二'][type]}种工作票`
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
        console.log(values)
        values.Start = values.Start.format("YYYY-MM-DD HH:mm:ss")
        values.End = values.End.format("YYYY-MM-DD HH:mm:ss")
        values.SecurityMeasures = values.SecurityMeasures.map(s => s.field1)
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
         getWorkTickets()

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

  // 新增 编辑 删除
  const [labeltext, setLabeltext] =useState([])
  const [iform] = Form.useForm();
  const iref = useRef();
  const dref = useRef()
  const [deltext, setDeltext] = useState()
  const [addval,setAddval] = useState(true)
  const ititle = addval ? '新增' : '编辑'
  const nameref = useRef()
  const indexref = useRef()
  const [addtype, setAddtype] = useState(0)
  const ionOk = async () => {
     try {
      let values = uform.getFieldValue(nameref.current)??[]
      let newval = await iform.validateFields()
     
      if(addval) {
        uform.setFieldValue(nameref.current,[...values, newval])
      }else {
        values.splice(indexref.current, 1, newval)
        
        uform.setFieldValue(nameref.current,[...values])
        iref.current.onCancel()
      }
      
     
     } catch (error) {
       return Promise.reject()
     }
     

  }

  const onAdd =(name,type) => {
    try {
      setAddtype(type)
      setAddval(true)
       nameref.current = name
      let label =  [['成员姓名', '所属公司'],["工作地点及设备双重名称","工作内容"], ["安全措施"],["工作地点保留带电部分或注意事项"]][type]
      setLabeltext(label)
      iref.current.onOpen()
    } catch (error) {
      console.log(error)
    }
   
  }
  const onedit=(record, index,name) => {
      setAddval(false)
      nameref.current = name
      indexref.current = index
      iform.setFieldsValue(record)
      iref.current.onOpen()
  }
  const ondel=(index, name, text) => {
    setDeltext(text)
    nameref.current = name
    indexref.current = index
    dref.current.onOpen()
  }
  const Delok =() => {
    let values = uform.getFieldValue(nameref.current)
    values.splice(indexref.current, 1)
    uform.setFieldValue(nameref.current, [...values])
    dref.current.onCancel()
  }
  return (
    <CModal   ref={tref} onOk={onOk} title={<Mtitle>{title}</Mtitle>} width={1050}   mold="cust" nolf="no" bdpd="0px 0px 32px 32px" custft>
    <Form form={uform}  preserve={false} requiredMark="optional" labelCol={{flex: '6em'}} labelAlign='left' style={{height: '1450px', overflowY: 'auto'}}>
        <Mainbox>
   
        <div className='custrow'>
            <div className='custcol'>
                <Form.Item label="单位" name="Unit" rules={rules} normalize={value => value?.trim()} className='updown'>
                 <Input /> 
           </Form.Item>
           </div>
        <div className='custcol'>
       <Form.Item label="变电所" name="Substation" rules={rules} className='updown'>
           <Input /> 
       </Form.Item>
       </div>
       <div className='custcol'>
       <Form.Item label="编号" name="No" rules={rules} className='updown'>
           <Input /> 
       </Form.Item>
       </div>
       {type == 1 && <div className='custcol'>
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
       </div>}
       </div>
   
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
           <CustButton ghost onClick={() => {onAdd('TeamMember', 0)}}>新增班组成员</CustButton>
        </div>
        <Form.Item name="TeamMember" rules={[{
          required: true,
          message: "请添加班组成员"
        }]}>
            <Tablecom columns={columns} onedit={onedit} ondel={ondel} name="TeamMember" deltext="班组成员" />
        </Form.Item>
     
       <div className='subtitle' >3. 工作的配电站名称及设备双重名称</div>
          <Form.Item name="Name" rules={[{
          required: true,
          message: "请输入工作的配电站名称及设备双重名称"
        }]}>
            <Input.TextArea rows={4}  />
            </Form.Item>  
        <div className='flex'>
            <div className='subtitle' style={{flex:1, marginRight: '16px'}}>4. 工作任务</div>
           <CustButton ghost onClick={() => {onAdd('WorkTask', 1)}}>新增工作任务</CustButton>
        </div>
        <Form.Item name="WorkTask" rules={[{
          required: true,
          message: "请添加工作任务"
        }]}>
        <Tablecom columns={wcolumns} onedit={onedit} ondel={ondel} name="WorkTask" deltext="工作任务" />
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
        {
          type==2 && <>
            <div className='subtitle' >6.  工作条件 (停电或不停电，或邻近及保留带电设备名称)</div>
            <Form.Item name="WorkCondition">
              <Input.TextArea rows={4}  /> 
            </Form.Item>
          </>
        }
        <div className='flex'>
            <div className='subtitle' style={{flex:1, marginRight: '16px'}}>{type == 1 ? '6. 安全措施' : '7. 注意事项（安全措施）'} </div>
           <CustButton ghost onClick={() => {onAdd('SecurityMeasures', 2)}}>新增安全措施</CustButton>
        </div>
        <Form.Item name="SecurityMeasures" rules={[{
          required: true,
          message: "请添加安全措施"
        }]}>
        <Tablecom columns={scolumns} onedit={onedit} ondel={ondel} name="SecurityMeasures" deltext="安全措施" />
        </Form.Item>
        {
          type==2 &&  <Row gutter={[64,40]}>  {/* 这四个字段不需要上传值。只显示。来自后端 */}
          <Col span={12}>
          <Form.Item   label="工作票签发人签名" labelCol={{flex: '10em'}} required >
              <Input readOnly  /> 
          </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item   label="签发时间"  labelCol={{flex: '10em'}} required >
              <DatePicker disabled placeholder='请选择日期时间' style={{width: '100%'}} />
          </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item  label="工作票会签人签名" labelCol={{flex: '10em'}} required >
              <Input readOnly /> 
          </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item  label="签发时间" labelCol={{flex: '10em'}} required >
              <DatePicker  disabled placeholder='请选择日期时间' style={{width: '100%'}} />
          </Form.Item>
          </Col>
      </Row>
        }
        {
          type == 1 &&
       <> 
       <div className='flex'>
            <div className='subtitle' style={{flex:1, marginRight: '16px'}}>7. 工作地点保留带电部分或注意事项</div>
           <CustButton ghost onClick={() => {onAdd('Note', 3)}}>新增注意事项</CustButton>
        </div>
        <Form.Item name="Note" rules={[{
          required: true,
          message: "请添加注意事项"
        }]}>
        <Tablecom columns={ncolumns} onedit={onedit} ondel={ondel} name="Note" deltext="注意事项"  />
        </Form.Item>
        </>
        }   
        {
          type ==2 && <>
           <div className='subtitle' >8. 补充安全措施 (工作许可人填写)</div>
           <Form.Item name="SupplementSafetyMeasure" rules={[{
          required: true,
          message: "请添加补充安全措施"
        }]}>
            <Input.TextArea rows={4} placeholder='若没有则填"无"， 不得空白'/>
           </Form.Item>
           <div className='subtitle' >9.  确认本工作票 1~8 项</div>
           <div style={{display: 'flex', flexDirection: 'column'}}>
           <Form.Item name="LicenseTime" label="许可开始工作时间" labelCol={{flex: '10em'}} rules={rules}>
              <DatePicker showTime />
           </Form.Item>
           <Form.Item   label="工作许可人签名" labelCol={{flex: '10em'}} required>
              <Input style={{width: 160}} readOnly />
           </Form.Item>
           <Form.Item   label="工作负责人签名" labelCol={{flex: '10em'}} required>
              <Input style={{width: 160}} readOnly />
           </Form.Item>
           </div>
           <div className='subtitle' >10. 现场交底，工作班成员确认工作负责人布置的工作任务、人员分工、安全措施和注意事项并签名</div>
           <Form.Item>
              <Input.TextArea readOnly rows={4} placeholder='工作班成员在明确了工作负责人、专责监护人交待的工作任务、人员分工、安全措施和注意事项后，在工作负责人所持工作票人签名，不得代签' />
           </Form.Item>
          </>
        }  
        </Mainbox>
     </Form>
     <CModal   ref={iref} onOk={ionOk} title={ ititle } width={585}   mold="cust"    custft={addval}>
      <Form form={iform}  preserve={false} requiredMark="optional" layout="vertical"  labelAlign='left'>
        {
           addtype<2 ? <> <Form.Item label={labeltext[0]} name="field1" rules={rules}>
            {addtype ==0 ?<Input /> : <Input.TextArea rows={2} showCount />}
       </Form.Item>
       <Form.Item label={labeltext[1]} name="field2" rules={rules}>
       {addtype ==0 ?<Input /> : <Input.TextArea rows={4} showCount />}
       </Form.Item></>
       : <Form.Item label={labeltext[0]} name="field1" rules={rules}>
            <Input.TextArea rows={4} showCount />
       </Form.Item>

        }
       
      </Form>
    </CModal>
    <CModal title="删除"  ref={dref} onOk={Delok}  width={512} type="warn" mold="cust">
        <> 是否要删除{deltext}？</>
      </CModal>
</CModal>
  )
})
