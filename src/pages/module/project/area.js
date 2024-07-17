import React, {useState, useRef, useEffect, useCallback, useImperativeHandle, useMemo, } from 'react'
import {Form, Space, Input, Button, Select, message} from 'antd'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import { publishState,iszhCN } from '@redux/systemconfig.js' 
import {useTranslation} from "react-i18next"
import {CustLink, CustButtonT} from '@com/useButton' 
import {AreaSetting} from '@api/api.js'
import UserTable from '@com/useTable'
import {useOneLevel} from '@hooks/usePublic'
 import CModal from '@com/useModal'
const Item = Form.Item
const Boxitem = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 32px);
  row-gap: 32px;
  padding: 32px 0 16px 0;
  border-bottom: 1px dotted #dedede;
  .iptbox {
    display: grid;
    grid-template-columns: 320px ${props => props.wh} 96px 96px;
    column-gap: 16px;
  }
  .delbox {
    display: grid;
    grid-template-columns: 220px 1fr;
    column-gap: 32px;
  }
`

const {QueryAreaLevels, InsertAreaLevel, DeleteAreaLevel, UpdateAreaLevel, QueryAreaLevelFields, InsertAreaLevelField, DeleteAreaLevelField} = AreaSetting 
const Editfiled = React.forwardRef(({level, projectId,}, ref) => {
  const [tableData, setTableData] = useState([])
  const {t} = useTranslation(["common","comm"])
 
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
        if (!success) return message.warning(errMsg || t("comm:dataerr"));
      
        success &&  queyFiled(level)
      } catch (error) {
         console.log(error)
      }
    
  }
 
 
 const onNewFiled = async () => {  // 新增字段
   try {
    let values = await ffrom.validateFields().then(res => res).catch(e => {
      console.log(e)
    })
    if(!values) return 
     const params = {...values, projectId, level}
     let {success, errMsg} = await InsertAreaLevelField(params)
     if(!success) return message.warning(errMsg || t("comm:dataerr"))
     if (success) {
     //  console.log(type)
     //  type && onCancel()
       queyFiled(level)
     }
    
   } catch (error) {
     console.log(error)
   }
 
 }
 
 
   const columns = [
     {
        dataIndex: "name",
        title: t("common:FieldName"),  
        key: 'name'     
      },
      {
        dataIndex: "typeDescription",
        title: t("common:FieldPurpose"),
        key: 'typeDescription',
      },
      {
        dataIndex: '',
        title: t("common:Operation"),
        render: (_, data) =>{
          return  <CustLink onClick={() => delFiled(data)}  text="delete" /> 
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
         <CModal title={t("common:Newfield")} ref={ref}  mold="cust" width={512}  onOk={onNewFiled}
           custft={true}
        >
      <Form name="modalform" form={ffrom}  preserve={false}>
          <Item name="name" label={t("common:FieldName")} rules={[{
            required: true
          }]}>
              <Input/>
          </Item>
          <Item name="type" label={t("common:FieldPurpose")} rules={[{
            required: true
          }]}>
               <Select>
                  <Select.Option value={0}>{t("common:None")}</Select.Option>
                  <Select.Option value={1}>{t("common:LatitudeLongitude")}</Select.Option>
                  <Select.Option value={2}>{t("common:Area")}</Select.Option>
               </Select>
          </Item>
      </Form>
 </CModal>
      
      </div>
    )
 
 
 
 })

function Region({projectId, CModal, Add}) {
 const ispublish = useSelector(publishState)
 const iszh = useSelector(iszhCN)
 const mref = useRef()
 const dref = useRef()
 const emref = useRef()
 const {t} = useTranslation(["common","comm"])

 const [form] = Form.useForm()
 const [modalform] = Form.useForm() 

const [title, setTitle] = useState()
const [datas, setDatas] = useState([])
const [handler,setHandler ] = useState(1);
const isAdd =  handler == 1
const [level, setLevel] = useState()
const [curlevel, setCurlevel] = useState({})
const newlevel = useRef()
const editlevel = useRef()
const editId = useRef()
editlevel.current = level
newlevel.current = datas.length
editId.current = curlevel?.id
 const edit = (d) => {
       console.log(d)
       let {name, type, level} = d
       setCurlevel({ 
        ...d,
       })
      setLevel(level);
      setHandler(2);
     setTitle(t("common:ModifyArea"))
     modalform.setFieldsValue({
       name,
       type,
     })
     mref.current.onOpen()
    // UpdateAreaLevel()
 }

 const add = () => {
     setHandler(1);
     setTitle(t("common:newarea"))
   //  modalform.resetFields()
     mref.current.onOpen()
 }

 const del = async () => { 
     
   try {
      let {success, errMsg} = await DeleteAreaLevel({projectId, level})
      if(success) {
        dref.current.onCancel()
        message.success({
          content: t("comm:successfullydelete"),
          duration: 0.3,
          onClose: () => queryarealevels(),
        })     
       
      } else {
        message.warning(errMsg || t("comm:dataerr"))
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
   
   try {
      let values = await modalform.validateFields() 
      if (!values) return
      const {name, type} = values
      const params = {name: window.encodeURIComponent(name),type, level: editlevel.current, projectId };
      let {success,errMsg} =  await UpdateAreaLevel(params)
    
      success && message.success({
         content: t("comm:modifysuccessfully"),
         duration: 0.3,
         onClose: () => { 
         // setLevelid('')
            mref.current.onCancel()
            queryarealevels().then(() => form.setFieldValue([editId.current.toString()+editlevel.current], name))
         },
      })
      !success && message.warning(errMsg || t("comm:dataerr"))
      
   } catch (error) {
      console.log(error)
   }
   

}
  const addArea = async (type) => { 
   try { 
     let values = await modalform.validateFields()
      if (!values) return
      let {name, type} = values
      const params = {name: window.encodeURIComponent(name),type, level: newlevel.current + 1, projectId };
      let {success,errMsg} =  await InsertAreaLevel(params)

      
      if(success) {
       // type && mref.current.onCancel()
        modalform.resetFields()
        message.success({
          content: t("comm:savesuccessfully"),
          duration: 0.3,
          onClose: () =>  queryarealevels() ,
       })
      } else {
        message.warning(errMsg || t("comm:dataerr"))
      }
      
   } catch (error) {
      console.log(error)
   }
} 
const closeArea = () => {
  mref.current.onCancel()
}
  const onOk = async (type=true) => {  
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

 const Addcust = useMemo(() => <Add title={title} ref={mref} form={modalform} CModal={CModal} onCancel={closeArea}  mold="cust" width={512}  onOk={onOk}  newlevel={newlevel} isAdd={isAdd}  />, [title, level])

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
            <Boxitem style={{paddingTop: 0}} key={d.id} wh={iszh ? "96px" : "auto"}>
               <span>{ iszh ?  `${numberFormat(d.level)}级区域` : t("common:Area_level", {level: d.level})} </span>
               <div className='iptbox'>                
                   <Item name={d.id.toString() + d.level} label="" initialValue={d.name}>
                   <Input  disabled/>
                   </Item>
                   <Button type='primary' ghost onClick={() => edit(d)} disabled={ispublish}>{t("common:ModifyArea")}</Button>
                   <Button type="primary" danger ghost disabled={index != datas?.length - 1 || ispublish} onClick={() => ondel(d)}>{t("common:Delete")}</Button>
                   <Button type='primary' ghost onClick={() => editfiled(d)} disabled={ispublish}>{t("common:EditField")}</Button>
              </div>
            </Boxitem>
           ))
         }
         <Boxitem style={{borderBottom: 'none'}}>
             <div className='delbox'>
              <CustButtonT onClick={add} disabled={ispublish} ns="common" text="AddSubordinateArea" wh="auto" />
            {/*  <Button type="primary" onClick={add} disabled={ispublish}>+新增下级区域</Button> */}
           {/*   <Button type="primary" >保存</Button> */}
             </div>
          </Boxitem>
         
        </Form>
        {/* 新增，修改区域 */}

        
       {Addcust}

          
        
        <CModal title={t("common:DeleteArea")} ref={dref}  mold="cust" width={592}   onOk={del} type='warn'>
              {t("common:todeletearea")}
        </CModal>
       
       
              
        <CModal title={t("common:EditField")} ref={emref}  mold="cust" width={874} okText={t("button:new")} onOk={addfiled}>

            
            <Editfiled ref={efref}  projectId={projectId} CModal={CModal} {...curlevel}  />     
        </CModal>
    </div>
  )
}

const Add =React.forwardRef(({form,title, onOk, CModal, onCancel, newlevel, isAdd}, ref) => {
   const {t} = useTranslation("common")

  return  <CModal title={title} ref={ref}  mold="cust" width={512}  onOk={onOk} custft={isAdd}>
   <Form name="modalform"   form={form} initialValues={{
    type: 0
   }} preserve={false}>
       <Item name="name" label={t("common:RegionName")} rules={[{required: true, message: t("common:Message_areanamemust")}]}>
           <Input/>
       </Item>
       <Item name="type" label={t("common:AreaUse")} rules={[
        {
          required: true,
          message: t("common:AreaUse")
        }
       ]}>
            <Select>
               <Select.Option value={0} >{t("common:None")}</Select.Option>
               <Select.Option value={1}>{t("common:Building")}</Select.Option> 
               <Select.Option value={2}>{t("common:Floor")}</Select.Option>
               <Select.Option value={3}>{t("common:Room")}</Select.Option>
            </Select>
       </Item>
   </Form>
   </CModal>
})

export default function(props) {
  return <Region {...props} Add={Add} />
}