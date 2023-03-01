import React, { useState, useRef, useEffect, useMemo, useContext} from 'react'
import style from './style.module.less'
import { Input, Button, Space, Modal, Form, message, Typography, Select } from 'antd'
import styled from 'styled-components' 
import UserTable from '@com/useTable'
import {Area} from '@api/api.js'
import {WarningFilled} from '@ant-design/icons'
import {useAntdTable} from 'ahooks'
import warningImg from '@imgs/warning.png'
import {CustButton} from '@com/useButton'
import {custMsg} from '@com/usehandler'
import Mapcom from "@com/useMap";
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 65px 1fr;
  row-gap: 16px;
`
const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 584px;
  grid-template-rows: repeat(8, 32px);
  column-gap: 32px;
  row-gap: 16px;
  grid-auto-flow: column;
  .address {
    grid-column: 2;
  }
  .map {
    grid-column: 2;
    grid-row: 2 /-1;
  }

  `
const {Link, Text} = Typography
const {Item} = Form
export default function Index({projectId,level, CModal, name, allLevel }) {
 
  const [levelone] = useState(allLevel[0])  
  const limitlevle = allLevel.slice(0, level - 1);
  console.log(limitlevle)
  const [form] = Form.useForm();
  const [nform] = Form.useForm();
  const [nlform] = Form.useForm();
  const nref = useRef()
  const dref = useRef()
  const nlref = useRef()
  const mapref = useRef()
  const tlref = useRef()
  const [Record, setRecord] = useState({})
  const [isAdd, setIsAdd] = useState(true)
  const [levels, setLevel] = useState([])
  const [columns, setColumns] = useState([])
  const [topAreaId, setTopAreaId] = useState(0)
  const [fields, setField] =useState([])
  const title = isAdd ? `新增${name}` : `编辑${name}`; // 当前层级名称
  let params = { 
    pageNum: 1,
    pageSize: 15,
    level,
    topAreaId, // 暂时写死
    name: '',
    projectId,
  }
  const defaultParams = { // 新增，修改
    level,
    projectId,
    parentId: 0,
    name: '',
    remark: '',
    id: 0,
    fields:[],
  }
  const del = (record) => {
    setRecord({...Record, ...record});
    dref.current.onOpen();
  }
  const delOk = async () => {
    let {areaId} = Record
    let {success, errMsg} = await Area.DeleteArea({projectId, areaId})
    success && message.success({
      content: '删除成功',
      onClose: () => {
        dref.current.onCancel();
        refresh();
      }
    })
    !success && custMsg({success, content: errMsg || '数据出错'})
  }



  const getTableData = ({current, pageSize}, formData={}) => {    
    if(isNaN(level)) return;
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    console.log(formData)
    return Area.QueryByPage(params).then(res => {
      let {success, data} = res;
      let {body=[], header=[], idGroup=[], type=[]} = data || {};
      let cols = []
      setField([...header.slice(level + 1)])
      for (let k of header) {
        let col = {
          title: k,
          dataIndex: k,
          key: k,
        }
        cols.push(col) 
      }
      let colums = [...cols,  {
        title:'操作',
        key:'action',
        align: 'center',
        render: (_,record) => <Space size={32}>
          <Link underline onClick={()=>editItem(record)}>配置</Link>         
          <Link underline onClick={()=>edit(record)}>编辑</Link>
          <Link underline  type="danger" onClick={()=>del(record)}>删除</Link>
        </Space>
      }]
      setColumns(colums);
     
      let formart = body.map(((r, i) => {
         let row = {
          areaId: idGroup[i]
         }
          header.forEach((e,i) => {
              row[e] = r[i]
             // row.id= nanoid()
          })
        return row;
      }))      
      if (success && data) {
        return {
          total: colums.length,
          list: formart
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    }).catch(e => {
      console.log(e)
    })
  }

  const {tableProps, search, refresh} = useAntdTable(getTableData, {  
    form,
    refreshDeps: [level, topAreaId],
    defaultPageSize: 15,
    onError: (e) => {
      console.log(e)
    },
   
   })
 
 const {submit} = search;
 
  const quayall = async (level) => { // 园区 
     if (level == 1 || isNaN(level)) return;
     try {
      let {success, data} = await Area.QueryAll({projectId, level}) 
      if (success && Array.isArray(data)) {
        success && setLevel([...data]);
        let id = data[0]?.id || '' 
        console.log(levels)
        form.setFieldValue('topAreaId', id)
       
        setTopAreaId(id)
        console.log(topAreaId)
      }
      

     } catch (e) {
       console.log(e)
     }
  }



 
  
  const add = () => {
     setIsAdd(true)
    level == 1 &&  nref.current.onOpen();
    level == 2 && nlref.current.onOpen();
    level > 2 && tlref.current.onOpen();
   }
  const onOk = async() => { 
      try {
      let values =  await nform.validateFields()
      
      let methods = isAdd ? 'Insert' : 'UpdateArea' 
      let params = isAdd ? {...defaultParams, ...values} : {...defaultParams, ...values, id: Record.areaId }

      let {success, errMsg} = await Area[methods](params)
      success && message.success({
        content:  isAdd ? '新增成功' : '编辑成功',
        onClose: () => {
          nref.current.onCancel();
          refresh();
        }
      })
      !success && custMsg({success, content: errMsg || '数据出错'})
      } catch (error) {
        console.log(error);
      }

   
   }
   const lonOk = async () => {
    try {
      let values =  await nlform.validateFields() 
      let {remark, name, parentId, ...valueparam} =values
       
      const fields = [];
      for(let [key, value] of Object.entries(valueparam)) {
        let obj = {
           name: key,
           value,
        }
        fields.push(obj)
      }
    
      let methods = isAdd ? 'Insert' : 'UpdateArea' 
      let params = {...defaultParams, remark, name, parentId, 
        id: isAdd ? 0 :  Record.areaId,
        fields,} 
      console.log(params);
      let {success, errMsg} = await Area[methods](params)
      success && message.success({
        content:  isAdd ? '新增成功' : '编辑成功',
        onClose: () => {
          nlref.current.onCancel();
          refresh();
         
        }
      })
      !success && custMsg({success, content: errMsg || '数据出错'})
      } catch (error) {
        console.log(error);
      }

   }
   const oneLeveEdit = (record) => {
    setRecord({...Record, ...record})
    nform.setFieldsValue({
      name: record['名称'],
      remark: record['备注']
    })
    nref.current.onOpen()
   }
   const towLeveEdit = (record) => {
    console.log(record)
    setRecord({...Record, ...record})
    nlform.setFieldsValue({
      parentId: topAreaId,
      name: record['名称'],
      remark: record['备注'],
      lngLat: record['经纬度']
    })
    nlref.current.onOpen()
   }
   const edit = (record) => { 
    try {
      setIsAdd(false)
      level == 1 && oneLeveEdit(record)
      level == 2 && towLeveEdit(record)
    } catch (error) {
      console.log(error)
    }
    
   }
   useEffect(() => {
     refresh()
   }, [topAreaId])
   useEffect(() => {
    quayall()
   }, [level])
  return (
      <Mainbox>
        <Form form={form} layout="inline" initialValues={{name: ''}}>
          <Space size={16}>
           { 
           level == 1 && <Form.Item name="name" label={`${name}查询`}>
                <Input.Search placeholder={`请输入${name}名称`} allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
            </Form.Item>
            }
             { 
           level > 1 &&
             <>
             <Item label="园区名称" name="topAreaId" >
                  <Select options={levels} fieldNames={{label: 'name', value: 'id', options: 'options'}} style={{width: '200px'}}
                   onChange={submit}
                  ></Select>
             </Item>
            <Form.Item name="name" label={`${name}查询`}>
                     
                     <Input.Search placeholder={`请输入${name}名称`} allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
                  </Form.Item>
             </>     
            }
             <Form.Item>
                <CustButton style={{justifyContent: 'center'}} onClick={add}>+新增</CustButton>
            </Form.Item>
            </Space>
           
        </Form>
          <UserTable columns={columns} {...tableProps} rowKey='areaId'  style={{display: level==1 ?'block' : 'none' }} /> 
          <UserTable columns={columns} {...tableProps} rowKey='areaId' style={{display: level>1 ?'block' : 'none' }} />  
    
       
        <CModal width={554} title={title} ref={nref} onOk={onOk}  mold='cust'>
          
        <Form 
          form={nform}   
          size="middle"  
          labelCol={{flex: '7em'}}
            labelAlign="left" 
            preserve={false}
            
            >
              
                <Item label={`${levelone?.name}名称`}  name='name'   rules={[
                  {
                    required: true, 
                  }]}>
                    <Input />
                </Item>
                <Item label='备注'  name='remark'>
                    <Input />
                </Item>
        </Form>
         </CModal>
         <CModal width={1024} title={title} ref={nlref} onOk={lonOk}  mold='cust'>
          <Formbox  
          form={nlform}   
          size="middle"  
          labelCol={{flex: '7em'}}
            labelAlign="left" 
            preserve={false}
            validateMessages = {{
                required: "'${name}' 是必选字段"
            }}  
            >

            


              <Item label={`${levelone?.name}名称`}  name="parentId" rules={[
                    {
                      required: true, 
                    }]}>
                  <Select options={levels} fieldNames={{label: 'name', value: 'id', options: 'options'}} disabled={!isAdd}></Select>
              </Item>
            
              <Item label={`${name}名称`}  name="name" rules={[
                    {
                      required: true, 
                    }]}>
                  <Input />
              </Item>

              {
                fields.map(f => (

                  <Item label={f} name={f} rules={[
                    {
                      required: true, 
                    }]}>
                  <Input />
                 </Item>

                ))
              } 
              <Item label="备注" name="remark" rules={[
                    {
                      required: true, 
                    }]}>
                  <Input/>
              </Item> 
              <Item label=""   className='address' >
                 <Input.Search placeholder='请输入地址' allowClear enterButton="查询"   onSearch={() => {}}/>
              </Item> 
              <div className='map'>
                  <Mapcom setAaddress={() => {}} lngLat='' ref={mapref} />  
              </div>
          </Formbox>
         </CModal>
          {/* 层级大于2 */}
         <CModal width={592} title={title} ref={tlref} onOk={lonOk}  mold='cust'>
          <Form 
          form={nlform}   
          size="middle"  
          labelCol={{flex: '7em'}}
            labelAlign="left" 
            preserve={false}
            validateMessages = {{
                required: "'${label}' 是必选字段"
            }}  
            >
            {
                limitlevle.map((lv, index, array) => (
                   
                  <Item label={`${lv?.name}名称`}  name={index == array.length -1 ? 'parentId' : lv?.name }  >
                    { index==0 &&  <Select options={levels} fieldNames={{label: 'name', value: 'id', options: 'options'}} disabled={!isAdd}></Select> }
                    {index > 0 && <Select options={levels} fieldNames={{label: 'name', value: 'id', options: 'options'}} disabled={!isAdd} dependencies={[array[index - 1].name]}></Select>}
                  </Item>
                ))



            }
           


           <Item label={`${name}名称`}  name="name" rules={[
                    {
                      required: true, 
                    }]}>
                  <Input />
              </Item>

              {
                fields.map(f => (

                  <Item label={f} name={f}  >
                  <Input />
                 </Item>

                ))
              } 
              <Item label="备注" name="remark" rules={[
                    {
                      required: true, 
                    }]}>
                  <Input/>
              </Item> 
           
               
          </Form>
         </CModal>
         <CModal width={554} title={`删除${name}`} ref={dref} onOk={delOk} type="warn" mold='cust'>
              <p><WarningFilled />是否确认删除 <Text type="danger">{Record['名称']}</Text>和相关信息?</p>
         </CModal>
      </Mainbox>
    )
  }