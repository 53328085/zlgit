import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {Form, Input,Space,Typography, message, Button, Tooltip} from 'antd'
import {LeftOutlined, RightOutlined} from  '@ant-design/icons'
import {distributionRoom} from '@api/api.js'
import Usetable from '@com/useTable'
import {CustButton, CustLink, i18success, i18warning} from "@com/useButton"
import CModal from '@com/useModal'
import {isObject, encode} from '@com/usehandler'
 
const {Link} = Typography
const Mainbox = styled.div`
 display: flex;
 flex-direction: column;
 row-gap: 32px;
 .tbwrap {
    flex: 1;
    padding-bottom: 32px;
    border-bottom: 1px dotted #d7d7d7;
    display: flex;
 }
`
const Mdbox = styled.div`

 display: flex;
 flex-direction: column;
 row-gap: 16px;
 .team {
 display: flex;
 
 column-gap: 32px;
 padding-bottom: 32px;
 border-bottom: 1px dotted #d7d7d7;
 height: 435px;
 
 }
`
export default function Index({projectId, areaId}) {
    // 成员

    const [aform] = Form.useForm()
    const [isadd, setIsadd] =useState(true)
    const atitle = isadd ? '新增' : '编辑'
    const aref = useRef();
    const dref = useRef();
    const recordRef=useRef();
    const [members, setMembers] = useState([])
    const getMembers = async() => {
        try {
            let {success, data, errMsg} = await distributionRoom.GetMembers({projectId, areaId, alike: ''})
            if(success && Array.isArray(data)) {
                setMembers(data)
                return Promise.resolve({success, data})
            }else {
                setMembers([])
                if(!success) {
                    i18warning(errMsg)
                }
                return Promise.reject({success: false})
            }
        } catch (error) {
            return Promise.reject({success: false})
            
        }
   
    }
    const addmember = async() => {
       setIsadd(true)
       aref.current.onOpen()
    }
    const editMember = (record) => {
         
          aform.setFieldsValue({...record})
          setIsadd(false)
          aref.current.onOpen();
    }
    const delMember = async (record) =>{
         recordRef.current = record;
         dref.current.onOpen();
    }
   const mDelok= async()=> {
     try {
        let {success, errMsg} =  await  distributionRoom.DelMember({projectId, id: recordRef.current.id})
        if(success) {
            i18success('delete')
            dref.current.onCancel()
            getMembers()
        }else {
            i18warning(errMsg)
        }
     } catch (error) {
        
     }
   }
    const monOk = async() => {
       try {
          let {name, company, id} = await aform.validateFields();
          let hander = isadd ? distributionRoom.AddMember({name: encode(name), company: encode(company), projectId, areaId}) :  distributionRoom.UpdateMember({projectId, name: encode(name), company: encode(company), id})
         let {success, errMsg} = await hander
         if(success) {
            i18success('new')
            getMembers()
            if(!isadd) aref.current.onCancel()
         }else {
            i18warning(errMsg)
         }
       } catch (error) {
          return Promise.reject('')
       }
    }
    const columns = [
        {
            title: '所属',
            dataIndex: 'company',
            key: 'company',
            width: 320,
        },
        {
            title: '成员姓名',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },       
        {
            title: '操作',
            key: 'operate',
            width: 196,
            render: (_, record) => <Space size={32}>
                <CustLink text="edit"  onClick={() =>editMember(record) } /> 
                <CustLink text="delete" type="danger" onClick={() => delMember(record)} /> 
                </Space>
        }
    ]

    // 班组
    const [teams, setTeams] = useState([])
    const [usedtb, setusedtable] = useState([])
    const [unusedtb, setUnusedtb] = useState([])
    const [isaddT, setIsaddT] = useState(true) // 新增或编辑
    const ttitle = isaddT ? '新增' : '编辑'
    const teamRef = useRef()
    const teamRecod = useRef()
    const undevices = useRef([])
 const devices = useRef([])
 const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 班组成员
 const [unselectedRowKeys, setUnselectedRowKeys] = useState([]) // 可选人员
 const tdref = useRef()
 const getTeams = async ()=> {
    try {
      let {success, data} = await distributionRoom.GetTeams({projectId, areaId, alike: ''})
      if(success && Array.isArray(data)) {
        setTeams(data)
      }else {
        setTeams([])
      }
    } catch {
        
    }
   
}
const addTeam= async () => {
    try {
        setIsaddT(true)
        let {success, data} = await  getMembers();
        if(success) {
           setUnusedtb(data)
           teamRef.current.onOpen();
        }else {
           message.warning('获取数据出错')
        }
    } catch (error) {
        console.log(error)
    }
 
   

}
const editTeam =async (record) => {
    try {
        setIsaddT(false)
        let {success, data} = await distributionRoom.GetConfigTeamMembers({projectId, teamId: record.id})
       
        if(success) {
           
            setusedtable(Array.isArray(data?.config) ? data.config : [])
            setUnusedtb(Array.isArray(data?.noConfig) ? data.noConfig : [])
            form.setFieldsValue({...record})
            teamRef.current.onOpen()
        } else {
            message.warning('获取数据出错')
         }
    } catch{
        
    }
 
    
}
const delTeam = (record) => {
    teamRecod.current = record;
    tdref.current.onOpen();
}
const tDelok =async() => {
   let {success, errMsg} = await  distributionRoom.DelTeam({projectId, id: teamRecod.current?.id})
   if(success) {
     i18success('delete')
     tdref.current.onCancel()
     getTeams()
   }else {
     i18warning(errMsg)
   }
}

 const rowSelection = { // 班组成员
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows, info) => {
       devices.current = selectedRows;
       setSelectedRowKeys([...selectedRowKeys])
       
    },
  };
 const unrowSelection = { // 可选人员
    selectedRowKeys: unselectedRowKeys,
    onChange: (selectedRowKeys, selectedRows, info) => {
       undevices.current = selectedRows;
       setUnselectedRowKeys([...selectedRowKeys])
       
    },

  };
  const selected =() => {
    
         if(Array.isArray(undevices.current)&& undevices.current?.length >0) {
         let keys = undevices.current.map(k => k.id)   
         let ids = usedtb.map(u => u.id)
            let ft = undevices.current.filter(f => !ids.includes(f.id) )   // 已在班组成员中的不添加      
            setusedtable([...usedtb, ...ft]) // 班组成员
            let undata = unusedtb.filter(t => !keys.includes(t.id))
            setUnusedtb([...undata]) // 可选人员
          
         
            setUnselectedRowKeys([])
            devices.current = {}
            undevices.current={}
         }
  }
  const unselect =() => {
        if(!devices.current) return
        let keys = devices.current.map(k => k.id)
        let ids = unusedtb.map(u => u.id);
        let ft = devices.current.filter(f => !ids.includes(f.id))
        setUnusedtb([...unusedtb, ...ft])
        let data = usedtb.filter(t => !keys.includes(t.id))
       setusedtable([...data])
        setSelectedRowKeys([])
        devices.current = {}
        undevices.current={}
  }
    const [form] = Form.useForm()

  
   const teamonOk = async () => {
    try {
        if(usedtb?.length <1) return message.warning('没有班组成员')
        let {name, id} =await form.validateFields()
        let params = isaddT ? {
            projectId,
            areaId,
            name:encode(name),
        } : {
            projectId,
            areaId,
            name:encode(name),
            id,
        }
        console.log(params)
        let body =[...new Set(usedtb.map(u => u.id))];
        let {success} = await distributionRoom.AddAndUpdateTeam(body, params)
        if(success) {
            i18success('new')
            getTeams()
            if(!isaddT) teamRef.current.onCancel()
        }
    } catch (error) {
        console.log(error)
    }
   }
    const columns2 = [
        {
            title: '班组名称',
            dataIndex: 'name',
            key: 'name',
            width: 320,
        },
        {
            title: '班组成员',
            dataIndex: 'member',
            key: 'member',
            width: 200
        },       
        {
            title: '操作',
            key: 'operate',
            width: 196,
            render: (_, record) => <Space size={32}>
                <CustLink text="edit"  onClick={() =>editTeam(record) } /> 
                <CustLink text="delete" type="danger" onClick={() => delTeam(record)} /> 
                </Space>
        }
    ]
    const rcolumns = [
        {
            title: '成员姓名',
            dataIndex: 'name',
            key: 'name',
            width: 130
        },   
        {
            title: '所属公司',
            dataIndex: 'company',
            key: 'company',
            width: 180,
        },
           
       
    ]
  useEffect(() => {
    if([projectId, areaId].every(n => Number.isInteger(parseInt(n)))){
        getMembers();
        getTeams();
    } 
  }, [projectId, areaId])
  return (
    <Mainbox>
        <div className='tbwrap' key="a">
            <div key="b"> 
         <Usetable columns={columns} rowKey="id" dataSource={members} hbg="#ecf5ff" hbc="#515151" pd="8px 4px" title={() =>  <CustButton onClick={addmember} ghost>新增成员</CustButton>}></Usetable>
         </div>
         </div>
         <Usetable columns={columns2} rowKey="id" dataSource={teams} hbg="#ecf5ff" hbc="#515151" pd="8px 4px" title={() =>  <CustButton onClick={addTeam} ghost>新建班组</CustButton>}></Usetable>
         <CModal title={atitle} ref={aref} onOk={monOk}   width={585}   mold="cust" custft={isadd} apply="adding">
             <Form form={aform} layout="vertical" preserve={false} requiredMark="optional">
                <Form.Item label="成员姓名" name="name" rules={[{required: true}]} normalize={value => value?.trim()}>
                    <Input /> 
                </Form.Item>
                <Form.Item label="所属公司" name="company" normalize={value => value?.trim()} rules={[
                  {
                    required: true,
                  },
                  ]}>
                    <Input /> 
                </Form.Item>
                <Form.Item name="id" noStyle>
                    <Input type="hidden" /> 
                </Form.Item>
             </Form>
         </CModal>
         <CModal title="删除"  ref={dref} onOk={mDelok}  width={512} type="warn" mold="cust">
         是否要删除成员？
      </CModal>
      <CModal title="删除提示"  ref={tdref} onOk={tDelok}  width={512} type="warn" mold="cust">
      是否要删除该班组？
      </CModal>
      <CModal title={ttitle} ref={teamRef} onOk={teamonOk}   width={998}   mold="cust" custft={isaddT} apply="adding" >
        <Mdbox>
            <Form form={form} layout="vertical">
                 <Form.Item name="name" label="班组名称" rules={[{
                    required: true
                 }]}>
                    <Input />
                 </Form.Item>
                 <Form.Item name="id" noStyle>
                    <Input type="hidden" /> 
                 </Form.Item>

            </Form>
            <div className='team'>
            <Usetable 
            columns={rcolumns} 
            rowSelection={rowSelection}
            dataSource={usedtb} 
            scroll={{y: 396}}
            rowKey="id"
            title={(arg) =>  "班组成员"}></Usetable>
            <Space style={{alignSelf: 'center'}}>
            <Button
            type="primary"
            style={{height: '48px', width: '68px', borderRadius: '4PX'}}
            icon={<LeftOutlined style={{ fontSize: "18px" }}  />}
            onClick={selected}
          ></Button>
          <Button
            type="primary"
            style={{height: '48px', width: '68px',borderRadius: '4PX'}}
            icon={<RightOutlined style={{ fontSize: "18px" }} />}
            onClick={unselect}
          ></Button>
            </Space>
            <Usetable 
             columns={rcolumns} 
             dataSource={unusedtb}
             title={() => '可选成员'} 
             scroll={{y: 396}}
             rowKey="id"
             rowSelection={unrowSelection}
             ></Usetable>
             </div>
        </Mdbox>
      </CModal>
    </Mainbox>
  )
}
