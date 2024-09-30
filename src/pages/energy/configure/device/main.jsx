import React, {  useState, useRef, useMemo, useEffect} from 'react'
import {Button,  message, Form, Input, Typography, Space, Image } from 'antd'; 
import {useTranslation} from 'react-i18next'
import Custmodl from '@com/useModal'
 
import {  DesElectric} from '@api/api.js'
import Cupload from "@com/useUpload.js" 
import UseTransfer  from './transfer';
import Mask from '@com/mask.jsx'
import Titlelayout from '@com/titlelayout'
import UseTable from '@com/useTable'
import {CustButton} from '@com/useButton'
 
const {Link} = Typography
export default function Index ({projectId, areaId}) {
  const {t} = useTranslation(["button"])
  const aref = useRef()
  const dref = useRef()
  const [form] = Form.useForm()
  const Item = Form.Item 
 
 
 
  const { queryDrive, insertDrive, updateDrive, deleteDrive, queryDriveConfig, queryDriveUnconfig, conifgDrive, QueryImage} = DesElectric
 
  const tbcolumns = [
    {
      dataIndex: "name",
      title: "重点设备名称",
    },
    {
      dataIndex: "address",
      title: "安装位置",
    },
    {
      dataIndex: "imageKey",
      title: "设备图片",
      render: (_, record) =>  record.imgsrc ? <Image src={record.imgsrc} height={56} /> : null
    },
    {
      dataIndex: "op",
      title: "操作",
     render: (_,record) => (<Space size={32}><Link underline onClick={()=>settingClick(record.id, record.name)}>{t("button:configure")}</Link><Link underline onClick={() =>edit(record)}>{t("button:edit")}</Link>
        <Link underline type="danger" onClick={()=>deleteRecord(record.id)}>{t("button:delete")}</Link>
        </Space>) 
    },
  ]

 
 
  const [treeData, setTreeData] = useState([])
  const getTreeData = async () => {
    let {success, data, errMsg} = await  queryDrive({projectId, areaId})
     
      if(success ){         
        if(Array.isArray(data))  {
          let promise = data.map(d => QueryImage(d.imageKey));
          let images = new Map()
          let res = await Promise.allSettled(promise) ;
             res.forEach((r) => {
              let {value } = r
              if(value.success) {   
                   images.set(value.data?.imageKey, value.data?.image)      
                 
              } 
             })
             data.forEach(d => {
              d['imgsrc'] = images.get(d.imageKey)
             })
             setTreeData(data)
        }else {
          setTreeData([])
        }
      }else{
        message.warning(errMsg)
     
      }
    
  }
  useEffect(() => {
   if([areaId, projectId].every(d => Number.isInteger(parseInt(d)))) {
    getTreeData()
   }
   
  }, [areaId, projectId])
  

 
 

  const [modalTitle,setModalTitle] = useState('')
  //const [formLabel,setFormLabel] = useState('')
  const [parentId, setParentId] = useState(null)
  //const [updateId, setUpdateId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
 // const [modalTag, setModalTag] = useState('')
  const [isAdd, setIsAdd] = useState(true) // modalTag == 'add'
  const updateId = useRef()
  const addMain = () => {
    
    setModalTitle('新增重点设备')
   // setFormLabel('重点设备名称')
    setParentId(0)
    setIsAdd(true)
    aref.current.onOpen()
  }
  const edit = ({id, name, address, imgsrc}) => {
    console.log(id)
    setModalTitle('编辑重点设备')
   // setFormLabel('重点设备名称')
   updateId.current = id;
   // setUpdateId(id)
    setIsAdd(false)
    form.setFieldValue('name', name)
    form.setFieldValue('address', address)
    form.setFieldValue("imageKey",imgsrc)
    aref.current.onOpen()
  }
  const deleteRecord = id => {
    setDeleteId(id)
    dref.current.onOpen()
  }
  const onOk = async() => {
    try{
      const {name, address, imageKey} = await form.validateFields();
      let params = {
        name:encodeURIComponent(name),
        parentId,
        areaId,
        projectId,
        address: encodeURIComponent(address),
      }
      if(isAdd){
        insertDrive(params, {image:imageKey}).then(res => {
          if(res.success){
            message.success('新增重点设备成功!')
       
          }else{
            message.warning(res.errMsg)
           
          }
          form.resetFields()
          getTreeData()
        
        })
      }else {
        updateDrive({projectId, id: updateId.current, name: encodeURIComponent(name), address: encodeURIComponent(address)}, {image:imageKey}).then(res => {
          if(res.success){
            console.log(updateId.current)
            message.success('修改重点设备成功!')
           
          }else{
            message.warning(res.errMsg)
           
          }
          getTreeData()
          aref.current.onCancel() 
        })
      }
      
    }catch(e) {

    }
  }
  const onDelete = () => {
    deleteDrive({projectId, id: deleteId}).then(res=> {
      if(res.success){
        message.success('删除重点设备成功!')
       
      }else{
        message.warning(res.errMsg)
        
      }
      getTreeData()
      dref.current.onCancel()
    }).catch(error => {
       console.log(error)
    })  
  }

  //配置穿梭框
  const columns = [
    {   
        align:'center',
        title: '设备编号',
        dataIndex:'sn',
        key:'sn'
    },{
        align:'center',
        title: '设备名称',
        dataIndex:'deviceName',
        key:'deviceName'
    },{
        align:'center',
        title: '安装地址',
        dataIndex:'address',
        key:'address'
    }
  ]
  const [transTag, setTransTag] = useState('')
  //const [deleteDom, setDeleteDom] = useState(false)
  const [subTable, setSubTable] = useState([])
  const [transferTitle,setTransferTitle] = useState({})
  const [unknownTable, setUnknownTable] = useState([])
  const [structureId, setStructureId] = useState(null)
  const settingClick = async (id, valName) => {
    setStructureId(id)
    setTransferTitle({
      subTitle:valName + '-表计',
      unknownTitle:'未选中的表计',
    })
   const allSettledPromise =  Promise.allSettled([queryDriveUnconfig({projectId, id, areaId}), queryDriveConfig({projectId, id, areaId})])
   
   allSettledPromise.then(results => {
       let [{value: {success, data, errMsg}}, {value: {success: sus, data: cdata, errMsg: msg}}] = results
        if(success) {
          setUnknownTable(data || [])
        }else{
          setUnknownTable([])
          message.warning(errMsg)
          
        }
        if(sus) {
          setSubTable(cdata || [])
        }else {
          setSubTable([])
          message.warning(msg)
          
        }
      //  setDeleteDom(true)
        setTransTag('open')
   })
  }
  const getSaveValue = values => {
    let params = []
    values.subData.map(item => {
      params.push(item.sn)
    })
    
    conifgDrive({projectId, id: structureId}, params).then(res => {
      if(res.success){
        message.warning('重点设备配置成功!')
        
        setTransTag(false)
       // setTimeout(()=> {setDeleteDom(false)}, 600)
      }else{
        message.warning(res.errMsg)
        
      }
    }) 
  }
  const getCloseValue = () => {
    setTransTag(false)
   // setTimeout(()=> {setDeleteDom(false)}, 600)
  }
  const imgsty = {
    width: '160px',
    height: '120px',
    display: 'flex',
    backgroundColor: '#f7f7f7',
    border: '1px dotted #D7D7D7',
  }
  const checkImg = (_, value) => {   
    if (!!value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('项目Log必须上传'));
   
 }
  const addmodal = useMemo(() => <Custmodl title={modalTitle} ref={aref} custft={isAdd} mold="cust" width={512} onOk={onOk}>
  <div style={{display:"flex", alignItems: "center"}}>
    <Form name='addform' labelCol={{span:7}} form={form} labelAlign={'left'}   autoComplete='off' preserve={false}>
      <Item label="重点设备名称" name='name' normalize={v => v.trim()} rules={[{required:true, message:'请输入设备名称'}]}>
        <Input style={{width:'315px'}} placeholder={'请输入设备名称'} allowClear></Input>
      </Item>
      <Item label="设备安装位置" name='address' normalize={v => v.trim()} rules={[{required:true, message:'请输入地址'}]}>
        <Input style={{width:'315px'}} placeholder={'请输入地址'} allowClear></Input>
      </Item>
      <Item label="缩略图" >
         <div style={imgsty} >
            <Item noStyle name="imageKey" rules={[
              {
                validator: checkImg,
              },
            ]} >
            <Cupload wpx={160} hpx={120} swpx={160} shpx={120}  maximum={100} /> 
            </Item>
           </div>
           <span style={{color: "#515151"}}>（图片尺寸160*120px，容量小于100KB）</span>
      </Item>
    </Form>
  </div>
</Custmodl>, [modalTitle])
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: "column"}}>
      
      <Titlelayout layout="flex" title={<div style={{display: 'flex',alignItems: "center", justifyContent: "space-between"}}>
          <span>重点设备</span>
          <CustButton  wh="auto" onClick={() => addMain()}>{t("button:addKeyEquipment")}</CustButton>
        </div>}>
           <div style={{flex: 1, paddingTop: "16px"}}> 
           <UseTable columns={tbcolumns} dataSource={treeData}></UseTable>
      
       
          
           </div>
      </Titlelayout>
         { transTag &&   <Mask task={transTag}>
          <UseTransfer transferTitle={transferTitle} columns={columns} subTable={subTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>
       
          </Mask>
     }
       {addmodal}
      <Custmodl title='删除重点设备' ref={dref}  mold="cust" width={592} type="warn" onOk={onDelete}>
            是否确认删除该重点设备? 
      </Custmodl>
    </div>
  )
}