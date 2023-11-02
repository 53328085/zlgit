import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input,  Select, DatePicker, TimePicker, Divider, Drawer, Checkbox, message} from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import {CustButton, ExportExcel} from '@com/useButton'
import UseSerach, {AreaSelect} from '@com/useSerach'
import Usetable from '@com/useTable'
import {AutoValve} from '@api/api'
 import Custmodal from '@com/useModal'
import redwarn from '@imgs/redwarn.png'
import successIcon from '@imgs/success.png'
import Drag from './Drag'
const {Paragraph, Link} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;

const CDrawer = styled(Drawer)`
&& {
  .ant-drawer-title {
    padding-left: 16px;
    border-left: 4px solid #2828a4 ;
    color: #2a2f55;
    font-size: 16px;
  }
  .ant-table-container .ant-table-content .ant-table-thead {
    
     tr>th{
        background-color: #237ae4;
        color: #fff;
        height: 32px;
        padding: 0;
      }
     
  }
}`
const Stepconent = styled.div`
  border-top: 1px dotted #2a2f55;
  padding-top: 16px;
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 32px;
 && {
  .ant-table-container .ant-table-content .ant-table-thead {
    
    tr>th{
       background-color: #2a2f55;
       color: #fff;
       height: 32px;
       padding: 0;
     }
    
 }
 } 
`
const Mainbox = styled.div`
    && {
      flex: 1;
      display: flex;
      flex-direction: column;
      .content {
        display: grid;
        grid-template-rows: 50px 1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        padding-top: 16px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

        }
        .ant-table-thead {
            tr:first-of-type th {
              background-color: #f0f9ff;
            }
        }
        .ant-form-inline {
          .ant-form-item {
            margin-right: 0;
          }
        }
      }
       
       }

`
const P = styled(Paragraph)`
&& {
  margin-bottom: 0px;
  line-height: 1;
  font-size: 18px;
  color:#666;
}
 
`

const controlcolumns = [
    {
        title: '序号',
        dataIndex: 'sn',
        key: 'date',
        align: 'center'
    },
    {
        title: '设备编号',
        dataIndex: 'bh',
        key: 'eventType',
        align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'content',
      align: 'center'
     },
     {
      title: '设备型号',
      dataIndex: 'caty',
      key: 'content',
      align: 'center'
     },
     {
      title: '安装地址',
      dataIndex: 'address',
      key: 'content',
      align: 'center'
     },
   ]
const stepcolumns = [
   
    {
        title: '设备编号',
        dataIndex: 'bh',
        key: 'eventType',
        align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'content',
      align: 'center'
     },
     {
      title: '设备型号',
      dataIndex: 'caty',
      key: 'content',
      align: 'center'
     },
     {
      title: '安装地址',
      dataIndex: 'address',
      key: 'content',
      align: 'center'
     },
   ]
 const errColumns = [
    {
        title: '错误行号',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
    },
    {
        title: '错误原因',
        dataIndex: 'eventType',
        key: 'eventType',
        align: 'center'
    },
  ]
  const Stepcom = () => {
    const onSearch = () => {}
    const [form] = Form.useForm()
    const tableProps = {}
    return (
      <Stepconent>
      <Form
       form={form}  
      layout="inline"
      colon={false}
      labelAlign='left'
      style={{justifyContent: "space-between"}}
    >
      
      <Form.Item label="设备查询" name="name">
         <Input.Search placeholder='输入设备编号/安装地址' allowClear style={{width: "320px"}} onSearch={onSearch} enterButton="查询"  />
      </Form.Item>
      <Form.Item label="设备型号" name="life">
         <Select style={{width: "200px"}} options={[
          {value: "0", label: "全部型号"},
          {value: "1", label: "断路器1"},
          {value: "2", label: "断路器2"}
         ]}></Select>
      </Form.Item>
    </Form>
    <Usetable columns={stepcolumns}  {...tableProps}   rowKey={nanoid()} rowSelection={{ columnWidth: "112px"}}   />
    </Stepconent>
    )
  }
  let week =  [
    {label: '周一', value: 1},
    {label: '周二', value: 2},
    {label: '周三', value: 3},
    {label: '周四', value: 4},
    {label: '周五', value: 5},
    {label: '周六', value: 6},
    {label: '周日', value: 7},
  ]
  let days = Array.from({length: 31},(v, i) => ({label: i < 9 ? '0'+ (i+1) : (i+1).toString(), value: i+1 }))

 const Addmodal = memo(({title, modal, isAdd, onOk, form}) => {
 return  <Custmodal
  title={title}
  ref={modal}
  mold="cust"
  width="820px"
  custft={isAdd}
  onOk={onOk}
  >
    <Form
      form={form}
     layout="horizontal"
     labelCol={{span: 5}}
     colon={false}
     labelAlign='left'
     style={{width: "496px"}}
   >
     <Form.Item label="选择园区" name="areaId">
        <AreaSelect />
     </Form.Item>
     <Form.Item label="策略名称" name="name">
        <Input />
     </Form.Item>
     <Form.Item label="执行周期" name="cycle">
        <Select 
        
        options={[
         {value: 1, label: "每日"},
         {value: 2, label: "每周"},
         {value: 3, label: "每月"}
        ]}></Select>
     </Form.Item>
       
     
         <Item  shouldUpdate   noStyle  >
            {
             ({getFieldValue}) => {
              let type;
              type= getFieldValue('cycle')
              let options = [[],[], week, days][type]
               if(type === 1 || !type) return null
               return ( 
                  <Item name="cycleTime" label="选择重复">
                   <Checkbox.Group options={options}    /> 
                  </Item>
               )
             }
            } 
           </Item>
        
     <Form.Item label="执行分闸" name="autoOpenTime">
       <TimePicker   format='HH:mm' style={{width: "200px"}} placeholder='执行分闸时间' />
     </Form.Item>
     <Form.Item label="执行合闸" name="autoCloseTime">
       <TimePicker   format='HH:mm' style={{width: "200px"}} placeholder='执行合闸时间' />
     </Form.Item>
     <Form.Item label="备注" name="remark">
       <Input />
     </Form.Item>
   </Form>
  </Custmodal>
 })


 function Main({projectId, areaId}) {
   const [form] = Form.useForm()
 
   
 
   const [open, setOpen] = useState(false)
   const [keycode, setKeycode] = useState(0)
   const [total, setTotal] = useState(0)
   const modal = useRef()
   const stepmodl = useRef()
   const delmo = useRef()
   const delId = useRef()
   const exportref = useRef()   
   const [isAdd, setIsAdd] = useState(true)
   const title = isAdd ? '新增自动策略控制' : '编辑自动策略控制'
   const edit = () => {
    setIsAdd(false)
    modal.current.onOpen()
   }

   const add = () => {
    setIsAdd(true)
    modal.current.onOpen()
   }

   const config = async (planId) => {
     try {
       let params = {
         projectId,
         planId,
         device: []
       }
       await AutoValve.QueryUsedDevice({projectId, areaId, planId})
       await AutoValve.ConfigureDevice(params)
     } catch (error) {
      
     }

   }
   const onExport = () => {
    exportref.current.onOpen()
   }

   const view = async (planId) => {
     try {
      let params = {
        projectId,
        areaId,
        planId,
        dedeviceStyle: 0,
        alike: ''
      }
      await AutoValve.GetDeviceConfigure(params)
     } catch (error) {
       console.log(error)
     }
     
   }
   const columns = [
    {
        title: '策略名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
    },
    {
        title: '周期',
        dataIndex: 'cycleTime',
        key: 'cycleTime',
        align: 'center'
    },
    {
      title: '分闸执行时间',
      dataIndex: 'autoOpenTime',
      key: 'autoOpenTime',
      align: 'center'
     },
     {
      title: '合闸执行时间',
      dataIndex: 'autoCloseTime',
      key: 'autoCloseTime',
      align: 'center'
     },
     {
      title: '策略说明',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center'
     },
     {
      title: '被控设备',
      dataIndex: 'device',
      key: 'device',
      align: 'center',
      render: (_, record) => <Link underline onClick={() => view(record.id)}>查看详细</Link>
     },
     {
      title: '操作',
      dataIndex: 'op',
      key: 'op',
      align: 'center',
      render: (_, record) => {
        return <Space size={32}>
          <Link underline onClick={() => config(record.id)}>配置</Link>
          <Link underline onClick={() => edit(true)}>编辑</Link>
          <Link underline type="danger" onClick={() => del(record.id)}>删除</Link>
          </Space>
      }
     },
   ]

 const QueryReports =  ({current, pageSize}) => {   
   
  
    let params = {
      pageNum: current,
      pageSize,
      areaId,
      projectId,
      alike: ''
     
     
    }
    return AutoValve.getPageData(params).then(res => {
      let {success, data, total} = res
      setTotal(total)
      if (success && Array.isArray(data) && data.length >0) {
          return {
            list: data,
            total
          }  
     } else {
      return {
        list: [],
        total: 0
      }  
     }
    })
   
  }
  const {tableProps, refresh} = useAntdTable(QueryReports, {
    defaultPageSize: 14,
    refreshDeps: [areaId]
  })
  
  const del = (id) => {
    delId.current = id
    delmo.current.onOpen()
   }
   const delOk = async () => {
     try {
      let param = {
        projectId,
        id: delId.current
       }
      let {success, errMsg} =  await AutoValve.Delete(param);
      if(success) {
        message.success("删除成功")
        delmo.current.onCancel()
        run()
      }else {
        message.warning(errMsg|| "数据出错")
      }
     } catch (error) {
      
     }
    
   }
  

  const tableref = useRef()
  const onOk = useCallback(async() => {
     try {
      let {autoCloseTime, autoOpenTime, ...rest} = await  form.validateFields();
     
      let params = {
        ...rest,
        autoCloseTime: autoCloseTime.format("HH:mm:SS"),
        autoOpenTime: autoOpenTime.format('HH:mm:SS'),
        projectId,
      }
      let handler = isAdd ? 'Add' : 'Update'
      let {success, errMsg} = await  AutoValve[handler](params)
      let content = isAdd ? '新增成功' : '编辑成功';
      if(success) {
        message.success(content);
        if(isAdd) form.resetFields();
        if(!isAdd)   modal.current.onCancel();
        refresh()
      }else {
        message.warning(errMsg || "数据出错")
      }
     
     } catch (error) {
        console.log(error)
     }
  }, [isAdd])
  const onBack =() => {
    stepmodl.current.onCancel()
    modal.current.onOpen()
  }
  const successRef = useRef()
  const errorRef = useRef()
  const onResult = () => { // 导入需后端接口
     let result = 'success'
     if(result == 'success' ) {
        // successRef.current.onOpen();

        errorRef.current.onOpen()
     }
  }
  return (
    <Mainbox>    
    <Titlelayout title="自动控制" layout="flex" >
    <div className='content'>
        <UseSerach 
        style={{padding: '0 0 16px 0', borderTop: "none"}}
        custview={ <Space size={16} style={{marginLeft: 'auto'}} >
              <CustButton key="add" onClick={add}>新增</CustButton>
              <CustButton key="export" onClick={onExport}>批量导入</CustButton>
             <ExportExcel tb={tableref} />
          </Space>}  />
       
        
       
        <Usetable columns={columns} ref={tableref} {...tableProps}   rowKey={nanoid()}    />   
       <CDrawer
        title="被控设备"
        width={928}
        open= {open}
        bodyStyle={{
          backgroundColor: '#f2f2f2',
          padding: '32px'
        }}
        headerStyle={{
          backgroundColor: '#f2f2f2',
          padding: '32px 32px 0 32px'
        }}
        closable={false}

        extra={<Button type="primary" onClick={() => setOpen(false)} style={{width: '96px'}}>关闭</Button>}
       >    
       <Divider  style={{margin: '0 0 16px 0', color: "#2a2f55", borderWidth: "1px"}} dashed />
       <Usetable columns={controlcolumns}  {...tableProps}   rowKey={nanoid()}    />  
       </CDrawer>
    </div>
    </Titlelayout>

    <Custmodal
        key="export"
        mold="cust"
        width={560}
        ref={exportref}
        title="批量导入"
        onOk={onResult}
       
      >
         <Drag />
      </Custmodal>
{/* 导入成功 */}
      <Custmodal
        key="success"
        mold="cust"
        width={560}
        ref={successRef}
        title="批量导入"
        okText="关闭"
       
      >
        <div style={{display: "flex",alignItems: "center", fontSize: "18px", color: "#1e1e1e",padding: "0 32px"}}>  <Image src={successIcon} preview={false} style={{marginRight: "32px"}} width={48}   />
            <span style={{marginLeft: "32px"}}>批量导入成功</span>
         </div>
      </Custmodal>

      <Custmodal
        key="error"
        mold="cust"
        width={560}
        type="warn"
        ref={errorRef}
        title="参数下发失败"
        okText="确认"
       
      >
         <Usetable columns={errColumns} ></Usetable>
      </Custmodal>
      <Addmodal title={title} modal={modal} isAdd={isAdd} onOk={onOk} form={form} />
   {/*  <Custmodal
     title={title}
     ref={modal}
     mold="cust"
     width="820px"
     custft={isAdd}
     onOk={onOk}
     >
       <Form
         form={form}
        layout="horizontal"
        labelCol={{span: 5}}
        colon={false}
        labelAlign='left'
        style={{width: "496px"}}
      >
        <Form.Item label="选择园区" name="areaId">
           <AreaSelect />
        </Form.Item>
        <Form.Item label="策略名称" name="name">
           <Input />
        </Form.Item>
        <Form.Item label="执行周期" name="cycle">
           <Select 
           
           options={[
            {value: 1, label: "每日"},
            {value: 2, label: "每周"},
            {value: 3, label: "每月"}
           ]}></Select>
        </Form.Item>
          
        
            <Item  shouldUpdate   noStyle  >
               {
                ({getFieldValue}) => {
                 let type;
                 type= getFieldValue('cycle')
                 let options = [[],[], week, days][type]
                  if(type === 1 || !type) return null
                  return ( 
                     <Item name="cycleTime" label="选择重复">
                      <Checkbox.Group options={options}    /> 
                     </Item>
                  )
                }
               } 
              </Item>
           
        <Form.Item label="执行分闸" name="autoOpenTime">
          <TimePicker   format='HH:mm' style={{width: "200px"}} placeholder='执行分闸时间' />
        </Form.Item>
        <Form.Item label="执行合闸" name="autoCloseTime">
          <TimePicker   format='HH:mm' style={{width: "200px"}} placeholder='执行合闸时间' />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input />
        </Form.Item>
      </Form>
     </Custmodal> */}
     

 {/*     <Custmodal
     title="选择执行设备"
     ref={stepmodl}
     mold="cust"
     width="820px"
     okText="完成"
     cancelText="上一步"
     onOk={onStep}
     onCancel={onBack}
     >
      <Stepcom />
     </Custmodal> */}


     <Custmodal
        key="warning"
        mold="cust"
        type="warn"
        width={592}
        ref={delmo}
        title="删除"
        onOk={delOk}
       
      >
        <div
          style={{ display: "flex", alignItems: "center", padding: "0 32px" }}
        >
          <img src={redwarn} style={{ width: "48px" }}></img>
          <p style={{ fontSize: "16px", paddingLeft: "16px" }}>
             是否确认删除该自动控制策略?
          </p>
        </div>
      </Custmodal>
    </Mainbox>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}