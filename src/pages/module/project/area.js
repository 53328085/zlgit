import React, {useState, useRef, useEffect, useCallback, useImperativeHandle, } from 'react'
import {Form, Space, Input, Button, Select, message} from 'antd'
import styled from 'styled-components'
// import Custmodl from '@com/useModal'
import {AreaSetting} from '@api/api.js'
import UserTable from '@com/useTable'
//import CModal from '@com/useModal'
const Item = Form.Item
const Boxitem = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 32px);
  row-gap: 32px;
  padding: 32px 0 16px 0;
  border-bottom: 1px dotted #dedede;
  .iptbox {
    display: grid;
    grid-template-columns: 320px 96px 96px 96px;
    column-gap: 16px;
  }
  .delbox {
    display: grid;
    grid-template-columns: 120px 112px;
    column-gap: 32px;
    .ant-btn {
      padding-left: 0;
      padding-right: 0;
    }
  }
`

const {QueryAreaLevels, InsertAreaLevel, DeleteAreaLevel, UpdateAreaLevel, QueryAreaLevelFields, InsertAreaLevelField, DeleteAreaLevelField} = AreaSetting 
const Editfiled = React.forwardRef(({level, projectId, CModal}, ref) => {
  const [tableData, setTableData] = useState([])
  const nfref = useRef()
  const fref = useRef()
  const [ffrom]= Form.useForm() 
  const queyFiled = async ( ) => {
     try {
       let {success, data} =  await QueryAreaLevelFields({projectId, level})
       success && setTableData([...data]) ;
     } catch (error) {
       return error
     }
    
   }
  const delFiled = async ({id}) => {
     
      try {
        let {success, errMsg}  =  await DeleteAreaLevelField({projectId, fieldId: id}) 
        if (!success) return message.warning(errMsg || '数据出错');
      
        success &&  queyFiled(level)
      } catch (error) {
         console.log(error)
      }
    
  }
 
 
 const onNewFiled = async () => {  // 新增字段
   try {
     const params = {...ffrom.getFieldsValue(), projectId, level}
     let {success, errMsg} = await InsertAreaLevelField(params)
     if(!success) return message.warning(errMsg || '数据出错')
     success && ref.current.onCancel()
    // QueryAreaLevelFields({projectId, level})
     queyFiled(level)
   } catch (error) {
     console.log(error)
   }
 
 }
 
 
   const columns = [
     {
        dataIndex: "name",
        title: "字段名称",  
        key: 'name'     
      },
      {
        dataIndex: "typeDescription",
        title: "字段用途",
        key: 'typeDescription',
      },
      {
        dataIndex: '',
        title: '操作',
        render: (_, data) =>{
          return  <Button onClick={() => delFiled(data)} type="link">删除</Button>
        },
        align: "center",
      }
    ]
    useEffect(() => {
      queyFiled()
    }, [level])
    return (
        <div style={{height: '350px', overflow: 'auto'}}>
         <UserTable columns={columns} dataSource={tableData} rowKey="id"    />
         <CModal title="新增字段" ref={ref}  mold="cust" width={512} okText="保存" onOk={onNewFiled}>
              <Form name="modalform" form={ffrom}  preserve={false}>
                  <Item name="name" label="字段名称">
                      <Input/>
                  </Item>
                  <Item name="type" label="字段用户">
                       <Select>
                          <Select.Option value={0}>无</Select.Option>
                          <Select.Option value={1}>经纬度</Select.Option>
                          <Select.Option value={2}>面积</Select.Option>
                       </Select>
                  </Item>
              </Form>
         </CModal>
      </div>
    )
 
 
 
 })


export default function Region({projectId, CModal}) {
 const mref = useRef()
 const dref = useRef()
 const emref = useRef()
 
 const [form] = Form.useForm()
 const [modalform] = Form.useForm() 

const [title, setTitle] = useState()
const [datas, setDatas] = useState([])
const [handler,setHandler ] = useState(0);
const [level, setLevel] = useState()
//const [levelid, setLevelid] = useState()

const [curlevel, setCurlevel] = useState({})
const levelid = useRef()
 const edit = (d) => {
       let {name, type, level} = d
       setCurlevel({
        ...curlevel,
        ...d,
       })
      setLevel(level);
      setHandler(2);
     setTitle('修改区域')
     modalform.setFieldsValue({
       name,
       type,
     })
     mref.current.onOpen()
    // UpdateAreaLevel()
 }

 const add = () => {
     setHandler(1);
     setTitle('新增区域')
   //  modalform.resetFields()
     mref.current.onOpen()
 }

 const del = async () => {
   try {
      let {success, errMsg} = await DeleteAreaLevel({projectId, level: levelid.current})
      if(success) {
        dref.current.onCancel()
        message.success({
          content: '删除成功',
          duration: 0.3,
          onClose: () => queryarealevels(),
        })     
       
      } else {
        message.warning(errMsg || '数据出错')
      }
   } catch (error) {
      
   }
 }


 const ondel = (level) => { 
  // setLevelid(level);
   levelid.current = level
   dref.current.onOpen()
 }
  const queryarealevels = async () => {
     try {
        let {success, data} = await QueryAreaLevels(projectId)
        if (success && Array.isArray(data)) {
          success && setDatas([...data]);
        }else {
          setDatas([])
        }
       
     } catch (error) {
        console.log(error);
     }
  }
  const onFinish = () => {

  }
  const editArea = async () => {
    
    let {id, level} = curlevel
   try {
      const {name} = modalform.getFieldsValue()
      const params = {...modalform.getFieldsValue(), level: level, projectId };
      let {success,errMsg} =  await UpdateAreaLevel(params)
    
      success && message.success({
         content: '修改成功',
         duration: 0.3,
         onClose: () => { 
         // setLevelid('')
            mref.current.onCancel()
            queryarealevels().then(() => form.setFieldValue([id.toString()+level], name))
         },
      })
      !success && message.warning(errMsg || '数据出错')
      
   } catch (error) {
      console.log(error)
   }
   

}
  const addArea = async () => {
   try { 
      const params = {...modalform.getFieldsValue(), level: datas.length + 1, projectId };
      let {success,errMsg} =  await InsertAreaLevel(params)


      if(success) {
        mref.current.onCancel()
        message.success({
          content: '保存成功',
          duration: 0.3,
          onClose: () =>  queryarealevels() ,
       })
      } else {
        message.warning(errMsg || '数据出错')
      }
      
   } catch (error) {
      console.log(error)
   }
   

}
  const onOk = () => {      
       handler == 1 && addArea();
       handler == 2 && editArea();
   
  }

// 编辑字段 start
  const efref = useRef()
  const editfiled = async (level) => { 
    setCurlevel(level)
    emref.current.onOpen();  
  }
  

  const closefiled = () => {
    emref.current.onCancel();  
  }
 
  const addfiled = () => {
    efref.current.onOpen()
  }

  // 编辑字段 end
 const numberFormat = useCallback((number) =>  new Intl.NumberFormat('zh-Hans-CN-u-nu-hanidec').format(number), [projectId])
  useEffect(() => {
     queryarealevels();
  }, [projectId])
  return (
    <div style={{flex: 1}}>
        <Form
        style={{width: '705px'}}
         form={form}
         onFinish={onFinish}
        >
         {
           datas?.map((d, index)=> (
            <Boxitem style={{paddingTop: 0}}>
               <span>{numberFormat(d.level)}级区域</span>
               <div className='iptbox'>                
                   <Item name={d.id.toString() + d.level} label="" initialValue={d.name}>
                   <Input  disabled/>
                   </Item>
                   <Button type='primary' ghost onClick={() => edit(d)}>修改区域</Button>
                   <Button type="primary" danger ghost disabled={index != datas?.length - 1} onClick={() => ondel(d.level)}>删除</Button>
                   <Button type='primary' ghost onClick={() => editfiled(d)}>编辑字段</Button>
              </div>
            </Boxitem>
           ))
         }
         <Boxitem style={{borderBottom: 'none'}}>
             <div className='delbox'>
             <Button type="primary" onClick={add}>+新增下级区域</Button>
           {/*   <Button type="primary" >保存</Button> */}
             </div>
          </Boxitem>
         
        </Form>
        {/* 新增，修改区域 */}
        <CModal title={title} ref={mref}  mold="cust" width={512} okText="保存" onOk={onOk}>
             <Form name="modalform" form={modalform} initialValues={{
              type: 0
             }} preserve={false}>
                 <Item name="name" label="区域名称">
                     <Input/>
                 </Item>
                 <Item name="type" label="区域用途" rules={[
                  {
                    required: true,
                    message: '选择区域用途'
                  }
                 ]}>
                      <Select>
                         <Select.Option value={0} >无</Select.Option>
                         <Select.Option value={1}>楼栋</Select.Option> 
                         <Select.Option value={2}>楼层</Select.Option>
                         <Select.Option value={3}>房间</Select.Option>
                      </Select>
                 </Item>
             </Form>
        </CModal>
        <CModal title='删除区域' ref={dref}  mold="cust" width={592}   onOk={del} type='warn'>
              <p>是否确认删除区域</p>
        </CModal>
       
       
              
        <CModal title='编辑字段' ref={emref}  mold="cust" width={874}   footer={[<Button type='primary' onClick={addfiled}>新增</Button>, <Button   ghost onClick={closefiled}>关闭</Button>]} >

            
            <Editfiled ref={efref}  projectId={projectId} CModal={CModal} {...curlevel}  />     
        </CModal>
    </div>
  )
}
