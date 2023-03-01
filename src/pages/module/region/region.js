import React, { useState, useRef, useEffect, useMemo, useContext, useCallback} from 'react'
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
import { Column } from '@antv/g2plot'
import { repeat } from 'lodash'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 65px 1fr;
  row-gap: 16px;
`
const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: ${p => p.islngLat ? '1fr 584px;' : '1fr' };
  grid-template-rows:  ${p => isNaN(p.rowes) ? 'repeat(8, 32px)' : p.islngLat ? `repeat(${p.rowes + 3}, 32px)` : `repeat(${p.rowes}, 32px)` } ;
  column-gap: 32px;
  row-gap: 16px;
  grid-auto-flow: ${p => p.islngLat ? 'column' : 'row' };
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
export default function Index({projectId,level, CModal, name, allLevel}) {
  
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
  //const [leveloption, setLevelOption] = useState({})
 
  const [columns, setColumns] = useState([])
  //const [topAreaId, setTopAreaId] = useState(() => level == 1 ? 0 : leveloption[0]?.id)
  const  [fields, setFields] = useState([])
  
  const islngLat = fields.includes('经纬度')
  
  const title = isAdd ? `新增${name}` : `编辑${name}`; // 当前层级名称
  const leveloption = useRef({})
  const topAreaId = level == 1 ? 0 : leveloption.current['level1'][0]?.id
  console.log(leveloption)
  let params = { //查询
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
 
  const getLevelOption = async (parentId=0, level=1) => {  // 查询层级
    console.log(parentId, level)
    
     try {
      let {success, data} = await  Area.QueryAll({
        projectId,
        level,
        parentId,
      })
       if (success && Array.isArray(data)) return leveloption.current[`level${level}`] = data;                  //setLevelOption(obj => ({...obj, [`level${level}`]: data}))
       leveloption.current[`level${level}`] = []
     } catch (error) {
       console.log(error)
     } 
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



  const getTableData = ({current, pageSize}, formData={}) => {     // 列表查询
    if(isNaN(level)) return;
    
    
      
   
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    
    return Area.QueryByPage(params).then(res => {
      let {success, data} = res;
      let {body=[], header=[], idGroup=[], type=[]} = data || {};
      let cols = []
      console.log(header.slice(level + 1))
      setFields([...header.slice(level+1)])
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
  
  const add = () => { 
     setIsAdd(true)
     nref.current.onOpen()
   }
 
   const  onOk = async () => { // 新增、编辑
    try {
      let values =  await nlform.validateFields() 
      let {remark, name, parentId=0, ...valueparam} =values
       
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
          nref.current.onCancel();
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
    getLevelOption()
  }, [])
   useEffect(() => {
     form.setFieldsValue({
      topAreaId
     })
     refresh()
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
             <Item label={`${levelone.name}名称`} name="topAreaId" >
                  <Select options={leveloption.current[`level1`]} fieldNames={{label: 'name', value: 'id', options: 'options'}} style={{width: '200px'}}
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
    
       {/* 新增 */}
        <CModal width={fields.includes('经纬度') ? 1024 : 554} title={title} ref={nref} onOk={onOk}  mold='cust'>


        <Formbox 
          islngLat={fields.includes('经纬度')}
          rowes={limitlevle.length + 2 + fields.length}
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
                limitlevle?.map((lv, index, array) => {
                 
                   if (index ==0) { return (
                      <Item label={`${lv?.name}名称`}  name={index == array.length -1 ? 'parentId' : lv?.name }  >
                       <Select options={leveloption.current[`level1`] || []} fieldNames={{label: 'name', value: 'id', options: 'options'}} disabled={!isAdd} onChange={(e) => getLevelOption(e, lv.level)}></Select> 
                      </Item>
                     )
                   } else  {
                     return(
                       <Item label={`${lv?.name}名称`}  name={index == array.length -1 ? 'parentId' : lv?.name } dependencies={[array[index - 1].name]}  > 
                         <Select options={leveloption.current[`level${lv.level}`] || []} fieldNames={{label: 'name', value: 'id', options: 'options'}} disabled={!isAdd} onChange={(e) => getLevelOption(e, lv.level)}></Select>
                       </Item>
                     )
                   }
                 
                })



            }
           


           <Item label={`${name}名称`}  name="name" rules={[
                    {
                      required: true, 
                    }]}>
                  <Input />
              </Item>

              {
                fields?.map(f => (

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
              {
                islngLat &&
                <>
                <Item label=""   className='address' >
                  <Input.Search placeholder='请输入地址' allowClear enterButton="查询"   onSearch={() => {}}/>
                </Item> 
                <div className='map'>
                    <Mapcom setAaddress={() => {}} lngLat='' ref={mapref} />  
                </div>
              </>
              }
               
          </Formbox>








          
       {/*  <Form 
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
        </Form> */}
         </CModal>
       {/*   <CModal width={1024} title={title} ref={nlref} onOk={lonOk}  mold='cust'>
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
                  <Select options={leveloption[`level${level}`]} fieldNames={{label: 'name', value: 'id', options: 'options'}} disabled={!isAdd}></Select>
              </Item>
            
              <Item label={`${name}名称`}  name="name" rules={[
                    {
                      required: true, 
                    }]}>
                  <Input />
              </Item>

              {
                fields?.map(f => (

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
          
         <CModal width={592} title={title} ref={tlref} onOk={lonOk}  mold='cust'>
         
         </CModal> */}
         <CModal width={554} title={`删除${name}`} ref={dref} onOk={delOk} type="warn" mold='cust'>
              <p><WarningFilled />是否确认删除 <Text type="danger">{Record['名称']}</Text>和相关信息?</p>
         </CModal>
      </Mainbox>
    )
  }