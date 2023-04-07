import React, {useState, useRef, useEffect, useCallback, useImperativeHandle, useMemo, } from 'react'
import {Form, Space, Input, Button, Select, message} from 'antd'
import styled from 'styled-components'
import {useLatest } from 'ahooks'
import {flushSync} from 'react-dom'
// import Custmodl from '@com/useModal'
import {AreaSetting} from '@api/api.js'
import UserTable from '@com/useTable'
import {useOneLevel} from '@hooks/usePublic'
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
    let values = ffrom.validateFields().then(res => res).catch(e => {
      console.log(e)
    })
    if(!values) return
     const params = {...values, projectId, level}
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
                  <Item name="name" label="字段名称" rules={[{
                    required: true
                  }]}>
                      <Input/>
                  </Item>
                  <Item name="type" label="字段用户" rules={[{
                    required: true
                  }]}>
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

  function Region({projectId, CModal, Add}) {
 
 const mref = useRef()
 const dref = useRef()
 const emref = useRef()
 
 const [form] = Form.useForm()
 const [modalform] = Form.useForm() 

const [title, setTitle] = useState()
const [datas, setDatas] = useState([])
const [handler,setHandler ] = useState(0);
const [level, setLevel] = useState()
const [curlevel, setCurlevel] = useState({})
const newlevel = useRef()
 newlevel.current = datas.length
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
      let {success, errMsg} = await DeleteAreaLevel({projectId, level})
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


 const ondel = (d) => { 
  // setLevelid(level);
   //levelid.current = level
   console.log(d)
   setLevel(d.level)
   dref.current.onOpen()
 }

 const [isupdate, setIsupdate] = useState(false)
 useOneLevel(projectId, isupdate)
const queryarealevels = async () => {
     try {
        let {success, data} = await QueryAreaLevels(projectId)
        if (success && Array.isArray(data) && data.length > 0) {  
            setDatas([...data]);
          if (level == 1) setIsupdate(!isupdate)
         // dispatch(getOnelevel(data))
        }else {
          setDatas([])
         
         // dispatch(getOnelevel([]))
        }
       
     } catch (error) {
        console.log(error);
     }
  }

  const editArea = async () => {
    
    let {id, level} = curlevel
   try {
      let values = await modalform.validateFields().then(res => res).catch(e => {
        console.log(e)
      })
      if (!values) return
      const {name} = values
      const params = {...values, level: level, projectId };
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
  const addArea = async (type) => { 
   try { 
     let values = await modalform.validateFields().then(res =>{
        return res
      }).catch(e => {
        console.log(e)
      })
      if (!values) return
      const params = {...values, level: newlevel.current + 1, projectId };
      let {success,errMsg} =  await InsertAreaLevel(params)

      
      if(success) {
        type && mref.current.onCancel()
        modalform.resetFields()
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
const closeArea = () => {
  mref.current.onCancel()
}
  const onOk = (type=true) => {    
       console.log(type)  
       console.log(handler)
       handler == 1 && addArea(type);
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

 const numberFormat = useCallback((number) =>  new Intl.NumberFormat('zh-Hans-CN-u-nu-hanidec').format(number), [projectId]) // 数字格式化

 const Addcust = useMemo(() => <Add title={title} ref={mref} form={modalform} CModal={CModal} onCancel={closeArea}  mold="cust" width={512} okText="保存" onOk={onOk} onSave={onOk} newlevel={newlevel}  />, [title])

  useEffect(() => {
     queryarealevels();
  }, [projectId])
  return (
    <div style={{flex: 1}}>
        <Form
        style={{width: '705px'}}
         form={form}
     
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
                   <Button type="primary" danger ghost disabled={index != datas?.length - 1} onClick={() => ondel(d)}>删除</Button>
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

        
       {Addcust}

          
        
        <CModal title='删除区域' ref={dref}  mold="cust" width={592}   onOk={del} type='warn'>
              <p>是否确认删除区域</p>
        </CModal>
       
       
              
        <CModal title='编辑字段' ref={emref}  mold="cust" width={874}   footer={[<Button type='primary' onClick={addfiled}>新增</Button>, <Button   ghost onClick={closefiled}>关闭</Button>]} >

            
            <Editfiled ref={efref}  projectId={projectId} CModal={CModal} {...curlevel}  />     
        </CModal>
    </div>
  )
}

const Add =React.forwardRef(({form,title, onOk, CModal, onCancel, newlevel}, ref) => {
  const CustFooter =  (<Space>
    <Button onClick={onCancel}>取消</Button>
       <Button type="primary" onClick={() => onOk(false, newlevel)}>应用</Button> 
     <Button type="primary" onClick={onOk}>确定</Button>
     </Space>)

  return  <CModal title={title} ref={ref}  mold="cust" width={512} okText="保存"   footer={CustFooter}>
   <Form name="modalform"   form={form} initialValues={{
    type: 0
   }} preserve={false}>
       <Item name="name" label="区域名称" rules={[{required: true, message: '区域名称必须'}]}>
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
})

export default function(props) {
  return <Region {...props} Add={Add} />
}