import React, {useState, useRef, useEffect, useCallback} from 'react'
import {Form, Space, Input, Button, Select, message} from 'antd'
import styled from 'styled-components'
// import Custmodl from '@com/useModal'
import {AreaSetting} from '@api/api.js'
import UserTable from '@com/useTable'
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
export default function Region({projectId, CModal}) {
 const mref = useRef()
 const dref = useRef()
 const fref = useRef()
 const nfref = useRef()
 const [form] = Form.useForm()
 const [modalform] = Form.useForm()
 const [ffrom] = Form.useForm()
 const {QueryAreaLevels, InsertAreaLevel, DeleteAreaLevel, UpdateAreaLevel, QueryAreaLevelFields, InsertAreaLevelField, DeleteAreaLevelField} = AreaSetting 
const [title, setTitle] = useState()
const [datas, setDatas] = useState(null)
const [handler,setHandler ] = useState(0);
const [level, setLevel] = useState()
const [levelid, setLevelid] = useState()
const [tableData, setTableData] = useState([])
 const edit = ({name, type, level}) => {
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
     modalform.resetFields()
     mref.current.onOpen()
 }

 const del = async () => {
   try {
      let {success, errMsg} = await DeleteAreaLevel({projectId, level: levelid})
      levelid =''; 
      success && message.success({
         content: '删除成功',
         duration: 0.3,
         onClose: () => queryarealevels().then(() =>  dref.current.onCancel()),
      })
      !success && message.warning(errMsg || '数据出错')
     
   } catch (error) {
      
   }
   
 }
 const ondel = (level) => { 
   setLevelid(level);
   dref.current.onOpen()
 }
  const queryarealevels = async () => {
     try {
        let {success, data} = await QueryAreaLevels(projectId)
        success && setDatas(data) ;
       
     } catch (error) {
        console.log(error);
     }
  }
  const onFinish = () => {

  }
  const editArea = async () => {
   try {
      const params = {...modalform.getFieldsValue(), level: level, projectId };
      let {success,errMsg} =  await UpdateAreaLevel(params)
      levelid = '';
      success && message.success({
         content: '修改成功',
         duration: 0.3,
         onClose: () =>  queryarealevels().then(() => mref.current.onCancel() ),
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
      success && message.success({
         content: '保存成功',
         duration: 0.3,
         onClose: () =>  queryarealevels().then(() => mref.current.onCancel() ),
      })
      !success && message.warning(errMsg || '数据出错')
      
   } catch (error) {
      console.log(error)
   }
   

}
  const onOk = () => {
       console.log(handler);
       handler == 1 && addArea();
       handler == 2 && editArea();
   
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
  const delFiled = async ({id}) => {
     
      try {
        let {success, errMsg}  =  await DeleteAreaLevelField({projectId, fieldId: id}) 
        if (!success) return message.warning(errMsg || '数据出错');
        success && QueryAreaLevelFields({projectId, level:levelid});
      } catch (error) {
         
      }
      await DeleteAreaLevelField 
  }
  const editfiled = async (level) => {
   
   try {
      setLevelid(level)
      console.log(levelid);
     let {success, data} =  await QueryAreaLevelFields({projectId, level})
     success && setTableData([...data]) ;
     fref.current.onOpen();
    
   } catch (error) {
      console.log(error)
   }
     
  }
  const closefiled = () => {
   fref.current.onCancel()
  }
  const addfiled = () => {
   nfref.current.onOpen()
  }

  const onNewFiled = async () => {  // 新增字段
    try {
      const params = {...ffrom.getFieldsValue(), projectId, level: levelid}
      let {success, errMsg} = await InsertAreaLevelField(params)
      if(!success) return message.warning(errMsg || '数据出错')
      QueryAreaLevelFields({projectId, level})
    } catch (error) {
      
    }
  
  }
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
                   <Input  />
                   </Item>
                   <Button type='primary' ghost onClick={() => edit(d)}>修改区域</Button>
                   <Button type="primary" danger ghost disabled={index != datas?.length - 1} onClick={() => ondel(d.level)}>删除</Button>
                   <Button type='primary' ghost onClick={() => editfiled(d.level)}>编辑字段</Button>
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
             <Form name="modalform" form={modalform}>
                 <Item name="name" label="区域名称">
                     <Input/>
                 </Item>
                 <Item name="type" label="区域用途">
                      <Select>
                         <Select.Option value={0}  >无</Select.Option>
                         <Select.Option value={1}  >楼层</Select.Option>
                         <Select.Option value={2} >房间</Select.Option>
                      </Select>
                 </Item>
             </Form>
        </CModal>
        <CModal title='删除区域' ref={dref}  mold="cust" width={592}   onOk={del} type='warn'>
              <p>是否确认删除区域</p>
        </CModal>
        <CModal title='编辑字段' ref={fref}  mold="cust" width={874}   footer={[<Button type='primary' onClick={addfiled}>新增</Button>, <Button   ghost onClick={closefiled}>关闭</Button>

        ]} >
             <UserTable columns={columns} dataSource={tableData} rowKey="id"    />
              
        </CModal>
        <CModal title="新增字段" ref={nfref}  mold="cust" width={512} okText="保存" onOk={onNewFiled}>
             <Form name="modalform" form={ffrom}>
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
}
