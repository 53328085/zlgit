import React, {useState, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {nanoid} from '@reduxjs/toolkit'
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import moment from 'moment';
import {Space, Image, Modal, Button, Form, Input, Select, Divider, Table} from 'antd'
import {UserOutlined, PoweroffOutlined, ExclamationCircleFilled, PlusCircleOutlined} from '@ant-design/icons'
import {useAntdTable} from 'ahooks'
import {Project} from '@api/api.js'
import Chintlog from '@imgs/chintlog.png'
//import { servicesVersion } from 'typescript'
export default function Index() {
  const Mainbox = styled.div`  
    background-image: linear-gradient(#003399, #000000);
    padding: 32px;
    flex: 1;
    display: grid;
    grid-template-rows: 101px 1fr;
    row-gap: 32px;
    color: #fff;
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 32px;
        border-bottom: 1px solid #dedede;
        .name {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .ch {
                color: #fff;
                font-size: 36px;
                height: 46px;
                line-height: 46px;
            }
            .en {
                color: rgba(255,255, 255, 0.6);
                font-size: 16px;
                font-style: italic;
            }
           
        }
        .loginName {
                font-size: 20px;
                color: #f2f2f2;
            }
        .exit {
            color: rgba(255,255,255, 0.6);
            transition: color 0.3s;
            &:hover {
                color: #fff;
            }
        }
    }
    .maincontent {
        display: grid;
        grid-template-rows: 42px 1fr;
        row-gap: 32px;
        .serach {
            .ant-form-item {
                margin-right: 0px;
            }
            .addbtn {
                 width: 144px;
                 height: 40px;
                 background-color: #002e88;
                  color: #fff;
                 font-size: 14px;
                 display: flex;
                 align-items: center;
                 .anticon+span {
                    margin-left: 16px;
                 }
                }
            .ant-input-search-button {
                background-color: #002e88;
            }
            .ant-space-item:last-of-type {
                margin-left: auto;
            }
        }
        .ant-table {
            background-color: transparent;
            color: #fff;
            font-size: 16px;
        }
    }
  `
  const Modalbox = styled(Modal)`
  .ant-modal-header, .ant-modal-body, .ant-modal-footer {
    background-color: #1b1d23;
    color: #ccc;
    
  }
  .ant-modal-body {
    font-size: 18px;
  }
  .ant-modal-header {
    .ant-modal-title {
        color:#ccc;
        font-size: 18px;
    }
  }
  .ant-modal-footer {
    .ant-btn {
      
        width: 96px;
        height: 36px;
    }
    .ant-btn + .ant-btn {
        margin-left: 16px;
    }
    .ant-btn-default {
        background-color: transparent;
        color: #ccc;
    }
    .ant-btn-primary{
        background-color: #0b2ba7;
    }
  }

  `
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [formParams, setFormParams] = useState(form.getFieldsValue())
  const [count, setCount] = useState(0)
  console.log(form.getFieldsValue())
  const {Item} = Form
  const {Option} = Select
  const {Search} = Input
 const [isshow, setShow] = useState(false) 
 const  [options, setOptions] = useState([
    {label: '全部', value: 0},
    {label: '已发布', value: 1},
    {label: '未发布', value: 2},
    {label: '已过期', value: 3},
    {label: '未过期', value: 4}
 ])
 const onShow = () => {
    console.log(1111)
    setShow(true)
 }
 const onCancel = () => {
    setShow(false)
 }
 const onOk = () => {
    setShow(false)
    navigate('/', {})

 }
 const onSearch = () => {

 }
 const columns = [
    {
       
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 50,
        render: (text,record,index) => `${index+1}`,
     },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '项目地址',
      dataIndex: 'address',
      key: 'address',
      with: 420
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 620,
      render: (text) => {
        return text == 1 ? '已发布' : '未发布'
      }
    },
    {
      title: '有效期',
      key: 'projectValidStageTime',
      dataIndex: 'projectValidStageTime',
      render: (text) => moment(text).format('YYYY-MM-DD')
    },
    {
      title: '操作',
      key: 'custop',
      dataIndex: 'custop',
      render: () => (
        <Space>
            <Button>项目配置</Button>
            <Button>进入项目</Button>
        </Space>
      )

    }
  ];
  let params = {
    pageNum: 1,
    pageSize: 12
  }
 
  const getTableData = ({current, pageSize}, formData) => {  
    setFormParams((formParams) => ({...formParams, ...formData}))
   
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    return  Project.queryProject(params).then(res => {
      let {success, data, totalNum} = res
      if (success && Array.isArray(data)) {
        setCount(totalNum)
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        setCount(0)
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const {tableProps, search} = useAntdTable(getTableData, {
    form,   
    defaultPageSize: 12,
   })
  const {submit} = search

 
 const {chineseTitle, englishTitle, systemLogoImage} = useSelector(state => state.system)
 const {loginName} = useSelector(state => state.user)

  return (
    <>
    <Mainbox>
       <div className='title'>
          <Space size={32}>
              <Image src={systemLogoImage ?  "data:image/png;base64,"+ systemLogoImage : Chintlog} height={68} preview={false}></Image>
              <div className='name'>
                 <p className='ch'>{chineseTitle || '正泰智慧能源服务平台'}</p>
                 <p className='en'>{englishTitle || 'Chint Smart Energy Service Platform'}</p>
              </div>
          </Space>
          <Space size={32}>
                <UserOutlined style={{color:'#fff', fontSize: '32px'}}/> 
                <span className='loginName'>{loginName}</span>
                <PoweroffOutlined style={{fontSize: '30px', cursor: "pointer"}} className="exit" onClick={() => onShow()} />
          </Space>
       </div>
       <div className='maincontent'>
          <Form
            layout='inline'
            className='serach'
            form={form}
            initialValues={
               {
                projectName: '',
                valid: 0
               } 
            }
          >
            <Space size={32} style={{flex: 1}}>
            <Item>
                <Button icon={<PlusCircleOutlined  style={{color: '#fff', fontSize: '24px'}}  />}  className='addbtn'>新增项目</Button>
            </Item>
            <Item name="projectName">
               <Search placeholder="请输入项目名称" 
                onSearch={submit} 
                style={{ width: 508 }} 
                allowClear                 
                enterButton="查询"/>
                
            </Item>
            <Item>
                <Divider dashed style={{borderColor: '#fff', height: '36px', margin: '0px'}}  type="vertical" />
            </Item>
            <Item name="valid">
                <Select placeholder="项目状态" style={{width: '200px'}} onChange={ submit}>
                    {options.map(o => (<Option value={o.value}>{o.label } </Option>))}
                </Select>
            </Item>
           
            <Item>
                <span style={{color:'#ccc', fontSize: '16px'}}>当前账户共有{count}个项目</span>
            </Item>
            </Space>
          </Form>
          <Table columns={columns} {...tableProps} rowClassName="rowclass" rowKey='id' bordered pagination={{position: 'bottomCenter'}}> </Table>
       </div>

    </Mainbox>
    <Modalbox title="提示信息" open={isshow} onOk={onOk} onCancel={onCancel} centered={true} closable={false} width={488} >
        <Space size={16}><ExclamationCircleFilled style={{fontSize: '40px',  color:'#0033ff'}}  /> 是否退出系统？</Space>
        
      </Modalbox>
    </>
  )
}
