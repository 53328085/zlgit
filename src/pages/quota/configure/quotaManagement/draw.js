import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { Drawer, Select, Button, Typography, Form, Input, message, Space } from 'antd'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styled, {css} from 'styled-components'
import {useSelector} from 'react-redux'
import Titlelayout from '@com/titlelayout.js'
import UserTable from "@com/useTable";
// import { boundarySlice, useConfigDeviceMutation, useApiDataMutation } from './boundary'
import { isObject } from "@com/usehandler"
import { CustButton,CustButtonT } from "@com/useButton"
import { Cdivider } from '@com/comstyled'
import {adaptation} from '@redux/systemconfig'
const { Paragraph } = Typography
import {QuotaManage} from '@api/api'
const Apibox = styled.div`
   flex: 1;
   display: flex;
   flex-direction: column;
   row-gap: 16px;
   padding-top: 16px;
   .ant-form-item {
    margin-bottom: 16px;
   }
`
const sty=css` 
      grid-template-columns: 1fr 140px 1fr;
        column-gap: 16px;
        grid-template-rows:  1fr; 
`
const iconsty = css`
  width: 52px;
  height: 32px;
`


const Inptserach = styled(Input.Search)`
  && {
    width: 256px;
    .ant-input-search
      .ant-input-group
      .ant-input-affix-wrapper:not(:last-child) {
      border-radius: 16px 0 0 16px !important;
    }
  }
`;
const Drawerbox = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
      width: calc(100% - 200px) !important;
      height: calc(100% - 64px);
      top: 64px;
    }
    .ant-drawer-wrapper-body {
      background-color: #003366;
      .ant-drawer-body {
        display: grid;
        grid-template-columns:  1fr 160px 1fr;
        column-gap: 30px;
        grid-template-rows: 1fr;
        .outwrap{
         //   padding-top: 16px;
            position: relative;
            flex:1;
            
          }
          .inwrap {
            position: absolute;
            width: 100%;
            height: calc(100% - 16px);
            overflow: auto;
          }
          .outwrapr{ 
            position: relative;
            flex:1;
            
          }
          .inwrapr {
            position: absolute;
            width: 100%;
            height: calc(100% - 32px);
            overflow: auto;
          }
        .leftpart{
          display: flex;
          flex-direction: column;
          row-gap: 16px;
         
        }
        ${props=> props.theme.laptop ? sty : null}
        .title {
          padding-left: 16px;
          border-left: 4px #237ae4 solid;
          color: #333;
          display: flex;
          align-items: center;
        }
        .selected {
          display: grid;
          grid-template-rows: 1fr 1fr;
          row-gap: 32px;

          .ant-table {
            height: 100%;
          }
          .total {
            display: grid;
            grid-template-rows: 32px 1fr;
            row-gap: 16px;
            padding: 16px;
            background-color: #fff;
          }
          .sub {
            display: grid;
            grid-template-rows: 32px 32px 1fr;
            padding: 16px;
            row-gap: 16px;
            background-color: #fff;
          }
        }
        .unselected {
          display: flex;
          flex-direction: column;
          padding: ${props => props.theme.laptop  ? "16px 0 0 0" : "16px" } ;
         // row-gap: 16px;
          background-color: #fff;
          flex: 1;
          .serachbox{
            display: grid;
            grid-template-columns: minmax(150px, auto) auto;
            justify-content: space-between;
            height: 32px;
            .ant-form-item{
              margin-bottom: 0px;
            }
            
          }
        }
        .optab {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 32px 0;
          text-align: center;
          
          > div {
            .ant-typography {
              color: #fff;
            }
            .ant-btn-icon-only {
              width: 64px;
              height: 46px;
              ${props => props.theme.laptop ? iconsty : null}
            }
          }
          .ant-btn-block{
            height: ${props=> props.theme.laptop ? "32px": "40px"};
          }
        }
      }
    }
  }
`;
const deviceColumns = [
  {
    title: '设备编号',
    dataIndex: 'deviceSn',
    key: 'deviceSn',
    align: 'center'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    align: 'center'
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: 'address',
    align: 'center'
  },

]

const unselectdevice = [
  {
    title: '设备编号',
    dataIndex: 'deviceSn',
    key: 'deviceSn',

  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',

  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: 'address',

  }
]
function Draw({params }, ref) {
    const {projectId,quotaAreaId } = params || {}
    const [open, setOpen] = useState(false)
    const [sfrom]= Form.useForm()
    const [fromed] = Form.useForm()
    const {Item} = Form
    const {laptop} = useSelector(adaptation)
   
   const [usedtb, setusedtable] = useState([])
   const [unusedtb, setUnusedtb] = useState([])
  
   const unusedtbbk = useRef()
 
  
  
    const devices = useRef([]);
    const undevices = useRef([])
 
   const getTable =async (params) => {
      try {
        let {success, data} = await  QuotaManage.QueryQuotaAreaDeviceConfig(params)
        if(success && isObject(data)) {
          let {noRelations, relations} = data
          setUnusedtb(Array.isArray(noRelations) ? noRelations : [])
          setusedtable(Array.isArray(relations) ? relations : [])
          unusedtbbk.current = noRelations
        }else {
          setUnusedtb([]);
          setusedtable([])
        }
      } catch (error) {
        
      }
    
   }
 
  useEffect(() => {
    let f = [projectId, quotaAreaId].every(v => Number.isInteger(v))
    if(f) {
      getTable({projectId, quotaAreaId})
    }

  }, [projectId, quotaAreaId])
 

    const drawClose = () => {   
      setOpen(false);
      sfrom.resetFields()
      
    };
    const drawOpen = () => {
        setOpen(true)
    }

    const [loading, setLoading] = useState(false)
    const onSave = async () => {
      try {
        console.log(usedtb)
        if(usedtb.length <1) return message.warning('请选择表计设备')
          let sns = usedtb.map(u => u.deviceSn)
          let data ={
            ...params,
            sns
          }
        setLoading(true)
       let {success, errMsg}   = await  QuotaManage.SaveQuotaAreaDeviceConfig(data)
       if(success) {
         message.success('保存成功')
         drawClose()
       }else {
         message.warning(errMsg || '数据出错')
       }
      } catch (error) {
        console.log(error)
      } finally {
         setLoading(false)
      }

    }
 
   
   
 
 
 


    useImperativeHandle(ref, () => ({
        drawClose,
        drawOpen,
    }))
   
/*     const changeUnselected = (v) => {
       try {
        if (v != 0) {
          let arr = unusedtbbk.current?.filter(i => v == i.deviceStyle ) || []
          setUnusedtb(arr)
        }else {
          setUnusedtb(unusedtbbk.current || [])
        }
       } catch (error) {
        
       }
     
      }; */
     let keys = unselectdevice.map(i => i.key)
     const onSerach = (v) => {
       console.log(v)
       try {
        if(v) {
          let value = v.trim().toLowerCase()
          let arr = [];
          unusedtbbk.current.forEach(i => {
            let f = [];
             for(let key of keys) {
              f.push(i[key]?.toLowerCase().includes(value))
             }
             if(f.includes(true)) {
              arr.push(i)
             }
          })
          setUnusedtb(arr)
       }else {
        setUnusedtb(unusedtbbk.current || [])
       
       }
       } catch (error) {
          console.log(error)
       }
       


    }
      const setb = useRef()
      const untb = useRef()

    
      const [selectedRowKeys, setSelectedRowKeys] = useState([]) // 已选中的设备
      const [unselectedRowKeys, setUnselectedRowKeys] = useState([]) // 未选中的设备
      const rowSelection = { // 已选中的设备
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows, info) => {
           devices.current = selectedRows;
           setSelectedRowKeys([...selectedRowKeys])
           
        },
      };
      const unrowSelection = { // 未选中的设备
        selectedRowKeys: unselectedRowKeys,
        onChange: (selectedRowKeys, selectedRows, info) => {
           console.log(selectedRows)
           undevices.current = selectedRows;
           setUnselectedRowKeys([...selectedRowKeys])
           
        },

      };
      const unselect = () => {
        console.log('unselect')
        if(!devices.current) return
        let keys = devices.current.map(k => k.deviceSn)
        setUnusedtb([...unusedtb, ...devices.current])
        unusedtbbk.current =[...unusedtb, ...devices.current]
        let data = usedtb.filter(t => !keys.includes(t.deviceSn))
       setusedtable([...data])
        setSelectedRowKeys([])
      //  setUnselectedRowKeys([...unselectedRowKeys,...keys])
        devices.current = {}
        undevices.current={}
      }
      const selected = (f) => {
         console.log(undevices.current)
         if(Array.isArray(undevices.current)&& undevices.current?.length >0) {
         let keys = undevices.current.map(k => k.deviceSn)   
         console.log(keys);         
            setusedtable([...usedtb, ...undevices.current]) // 已选中的设备表
            let undata = unusedtb.filter(t => !keys.includes(t.deviceSn))
            setUnusedtb([...undata]) // 未选中的设备表
            unusedtbbk.current = unusedtbbk.current.filter(t => !keys.includes(t.deviceSn))
            console.log('selected', undata)
           // setSelectedRowKeys([...selectedRowKeys,...keys])
            setUnselectedRowKeys([])
            devices.current = {}
            undevices.current={}
         }
      }
  return (
    <Drawerbox
    onClose={drawClose}
     open={open}
     
    closable={false}
    maskClosable={false}
    contentWrapperStyle={{margingRight: '16px'}}
    title=""
    destroyOnClose
  >
 
   <div className='leftpart'>
    <Titlelayout title='选择的表计设备' layout="flex" dr="column" bodypad="16px 0 0 0">
      
    <Form
        form={fromed}
        initialValues={{
          type: "0",
        }}
      >
          <Item name="alike" label="设备搜索">
            <Inptserach
              allowClear
              style={{width: "256px"}}
              placeholder="请输入设备编号/安装地址"
              onSearch={onSerach}
            />
          </Item>
      </Form>
      <div className='outwrap'>
          <div className='inwrap'>
        <UserTable
          columns={deviceColumns}
          rowSelection={rowSelection}
          dataSource={usedtb}
          rowKey="deviceSn" 
          ref= {setb}
          
        />
     </div>
     </div>
      
    </Titlelayout> 
    </div>
    <div className="optab">
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',  }}>
        <Paragraph>选择设备</Paragraph>
        <div style={{display: 'flex', justifyContent:"space-between"}}>
          <Button
            type="primary"
            icon={<LeftOutlined style={{ fontSize: "18px",marginRight: "8px" }} />}
            onClick={selected}
          ></Button>
          <Button
            type="primary"
            icon={<RightOutlined style={{ fontSize: "18px" }} />}
            onClick={unselect}
          ></Button>
        </div>
      </div>
      
      <Space direction="vertical" >
       <CustButtonT
          block 
          onClick={onSave}
          wh="100%"      
          loading={loading}
          text="save" 
          
       >
         
        </CustButtonT>  
       
        <CustButtonT block onClick={drawClose}   text="Cancel" type="default"   wh="100%" /> 
      
      </Space>
    </div>
    <Titlelayout title="未选中的表计设备" layout="flex">
    <div className="unselected">
      
      <Form
        form={sfrom}
        initialValues={{
          type: "0",
        }}
      >
          <Item name="alike" label="设备搜索">
            <Inptserach
              allowClear
              style={{width: "256px"}}
              placeholder="请输入设备编号/安装地址"
              onSearch={onSerach}
            />
          </Item>
      </Form>
      <div className='outwrapr'>
      <div className='inwrapr'>
      <UserTable
        columns={unselectdevice}
        rowSelection={unrowSelection}
        dataSource={unusedtb}
       
        ref={untb}
        rowKey="deviceSn"
      />
      </div>
      </div>
      </div>
      </Titlelayout>
      
 
  </Drawerbox>
  )
}
export default forwardRef(Draw)
