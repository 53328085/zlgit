import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {Form, Input,Space,Typography, message, Button, Tooltip} from 'antd'
import {LeftOutlined, RightOutlined} from  '@ant-design/icons'
import {distributionRoom} from '@api/api.js'
import Usetable from '@com/useTable'
import {CustButton, CustLink} from "@com/useButton"
import CModal from '@com/useModal'
import {isObject} from '@com/usehandler'
import {phoneValidator} from '@pages/rule.js'
const {Link} = Typography
const Mainbox = styled.div`
 display: grid;
 grid-template-rows: 34px 1fr;
 grid-template-columns: 488px 288px;
 flex: 1;
 gap: 16px 32px;
`
const Mdbox = styled.div`
 display: flex;
 height: 435px;
 column-gap: 32px;
 padding-bottom: 32px;
 border-bottom: 1px dotted #d7d7d7;
`
export default function Index({projectId, areaId}) {
     // 负责人
  const [isadd, setIsadd] = useState(true)
  const [pdata, setPdata] = useState([])
  const recordRef = useRef({})
  const [pfrom] = Form.useForm();
  const ptitle = isadd ? '新增' : '编辑'
  const pref = useRef();
  const dref= useRef() 
  const columns = [
    {
        title: '负责人',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
    },
    {
        title: '操作',
        key: 'operate',
        render: (_, record) => <Space size={32}>
            <CustLink text="edit"  onClick={() =>editCommanders(record) } /> 
            <CustLink text="delete" type="danger" onClick={() => delCommander(record)} /> 
            </Space>
    }
]
  const getCommanders= async () => {
    try {
        let{success, data} = await distributionRoom.GetCommanders({projectId, areaId, alike:''})
        if(success && Array.isArray(data)) {
            setPdata(data)
        }
    } catch (error) {
        console.log(error)
    }
 
  }
  const addCommanders = () => {
       setIsadd(true)
       pref.current.onOpen()
  }
  const editCommanders =(record) => {
      const {name, mobile} = record
      recordRef.current=record
      pfrom.setFieldsValue({Name:name, Mobile: mobile })
      setIsadd(false)
      pref.current.onOpen()
  }
  const delCommander =(record) => {
   
    recordRef.current=record
    
    dref.current.onOpen()
}
  const ponOk =async ()=> {
         try {
            const {id} = recordRef.current
            const values =await pfrom.validateFields()
            const handler = isadd ? distributionRoom.AddCommander({...values,AreaId: areaId}, projectId) : distributionRoom.UpdateCommander({...values,projectId, id})
            let {success,errMsg }  = await handler
            if(success) {
                getCommanders()
                message.success( isadd ? '新增成功' : '编辑成功')
                if(!isadd) pref.current.onCancel();
            }else {
                message.warning(errMsg || '数据出错')
            }
         } catch (error) {
           return  Promise.reject(error)
         }
          
  }
  const pDelok = async () => {
     try {
        const {id, name,mobile } = recordRef.current
       let {success, errMsg} = await distributionRoom.DelCommander({id,name,mobile,projectId})
       if(success) {
        message.success('删除成功')
        dref.current.onCancel()
         getCommanders()

       }else {
        message.warning(errMsg || '数据出错')
       }
     } catch (error) {
        
     }

  }

  // 审核人
  const [usedtb, setusedtable] = useState([])
  const [unusedtb, setUnusedtb] = useState([])
  const [reviewers, setReviewers] = useState([])
  const rref = useRef()
  const getReviewers = async() => {
     try {
       let {success, data, errMsg} =  await distributionRoom.GetReviewers({projectId,areaId})
        if(success && isObject(data)) {
            let {config, noConfig} = data
            let personnel = {
                config: Array.isArray(config) ? config : [],
                noConfig: Array.isArray(noConfig) ? noConfig : []
            }
            setReviewers(personnel.config)
            return Promise.resolve({success, data:personnel})
        }else {
            return Promise.reject({success: false, errMsg})
        }
       
     } catch (error) {
        return Promise.reject({success: false})
     }
  }
 const openReview = async()=> {
    try {
        let {success, data} = await getReviewers()
        if(success) {
            let {config, noConfig} = data
            setusedtable(config)
            setUnusedtb(noConfig)
            rref.current.onOpen()   
        }else {
            message.warning('获取数据出错')
        }
    } catch (error) {
        
    }
 }


 const undevices = useRef([])
 const devices = useRef([])
 const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 工作票审核人员
 const [unselectedRowKeys, setUnselectedRowKeys] = useState([]) // 可选人员
 const ronOk = async () => {
     if(Array.isArray(usedtb) && usedtb.length > 0) {
        
        let ids = usedtb.map(u => u.id)
       const {success,errMsg} =  await  distributionRoom.ConfigReviewer(ids, {projectId, areaId})
       if(success) {
         message.success("配置成功")
         getReviewers();
         rref.current.onCancel();
       }else {
         message.warning(errMsg || '数据出错')
       }
     }else {
        return message.warning('请选择人员')
     }
 }
 const rowSelection = { // 工作票审核人
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
            setusedtable([...usedtb, ...undevices.current]) // 工作票审核人
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
        setUnusedtb([...unusedtb, ...devices.current])
        let data = usedtb.filter(t => !keys.includes(t.id))
       setusedtable([...data])
        setSelectedRowKeys([])
        devices.current = {}
        undevices.current={}
  }
 const rcolumns = [
    {
        title: '成员姓名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
    },
]

const ecolumns = [
    {
        title: '成员姓名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
    },
]
useEffect(() => {
    if([projectId, areaId].every(n => Number.isInteger(parseInt(n)))){
        getCommanders()
        getReviewers()
    } 
  }, [projectId, areaId])
  return (
    <Mainbox>
           <div>
              <CustButton onClick={addCommanders} ghost>新增负责人</CustButton>
           </div>
           <div>
              <CustButton onClick={openReview} ghost>选择审核人</CustButton>
           </div>
           <Usetable columns={columns} dataSource={pdata} hbg="#ecf5ff" hbc="#515151" pd="8px 4px"></Usetable>
           <Usetable columns={ecolumns} dataSource={reviewers} hbg="#ecf5ff" hbc="#515151" pd="8px 4px"></Usetable>
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
         <CModal title="删除"  ref={dref} onOk={pDelok}  width={512} type="warn" mold="cust">
         是否要删除该工作票负责人？
      </CModal>
      <CModal title='选择工作票审核人' ref={rref} onOk={ronOk}   width={998}   mold="cust"  >
        <Mdbox>
            <Usetable 
            columns={rcolumns} 
            rowSelection={rowSelection}
            dataSource={usedtb} 
            scroll={{y: 396}}
            rowKey="id"
            title={(arg) => { 
              return '工作票审核人'
            }}></Usetable>
            <Space>
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
             columns={ecolumns} 
             dataSource={unusedtb}
             title={() => '可选人员'} 
             scroll={{y: 396}}
             rowKey="id"
             rowSelection={unrowSelection}
             ></Usetable>
        </Mdbox>
      </CModal>
    </Mainbox>
  )
}
