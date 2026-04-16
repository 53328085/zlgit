import React, {useState, forwardRef, useImperativeHandle, useRef, useEffect} from 'react'
import {Drawer, Select, Button, Typography, Form, Input, Space,  } from 'antd'
import { useSelector } from "react-redux";
import {   LeftOutlined, RightOutlined } from "@ant-design/icons";
import {useTranslation} from "react-i18next"
import styled, {css} from 'styled-components'
import Titlelayout from '@com/titlelayout.js'
import UserTable from "@com/useTable";
import {  useConfigDeviceMutation,useApiDataMutation, useBoundaryConfigQuery} from '@redux/carbon'
import {isObject} from "@com/usehandler"
import {CustButtonT,CustButton, i18warning, i18success, CustTransO} from "@com/useButton"
import {Cdivider, Serach} from '@com/comstyled'
import { adaptation } from "@redux/systemconfig";
const {Paragraph} = Typography

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



 
const csssty = css`
 .ant-drawer-header {
        padding: 8px 12px;
 }
.ant-drawer-body{
  column-gap: 16px;
  padding: 12px;
  .optab{
   // padding: 0 16px;
  }
  .unselected{
    padding: 16px 0 0 0;
  }
}
 
`
const Drawerbox = styled(Drawer)`
  && {

    .ant-drawer-content-wrapper {
      width: calc(100% - 200px) !important;
      height: calc(100% - 80px);
      top: 80px;
    }
    .ant-drawer-wrapper-body {
      background-color: #003366;
     
      .ant-drawer-body {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        column-gap: 30px;
       grid-template-rows: 1fr;
       .outwrap{ 
            position: relative;
            flex: 1;
            overflow: auto;
          }
          .inwrap {
            position: absolute;
            width: 100%;
            
          }
        .title {
          padding-left: 16px;
          border-left: 4px ${props=> props.theme.primaryColor} solid;
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
          display: grid;
          grid-template-rows: 32px  1fr;
          padding: 16px;
          row-gap: 16px;
          background-color: #fff;
          grid-template-columns: 1fr;
          flex:1;
        }

        .optab {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
       //   padding: 32px 0;
          > div {
            .ant-typography {
              color: #fff;
            }
            .ant-btn-icon-only {
              width: 64px;
              height: 46px;
            }
          }
        }
        
      }
      ${props=>props.theme.laptop  ? csssty : null}
    }
  }
`;
const deviceColumns = [
    {
        title: <CustTransO ns="comm" text="deviceSn" />,
        dataIndex: 'deviceSn',
        key: 'deviceSn',
        align: 'center'
    },
    {
        title:  <CustTransO ns="comm" text="deviceName" />,
        dataIndex: 'deviceName',
        key: 'deviceName',
        align: 'center'
    },
    {
        title:  <CustTransO ns="comm" text="address" />,
        dataIndex: 'address',
        key: 'address',
        align: 'center'
    },
    
]

const unselectdevice = [
  {
      title: <CustTransO ns="comm" text="deviceSn" />,
      dataIndex: 'deviceSn', 
      key: 'deviceSn',
     
  },
  {
      title: <CustTransO ns="comm" text="deviceName" />,
      dataIndex: 'deviceName',
      key: 'deviceName',
      
  },
  {
      title: <CustTransO ns="comm" text="address" />,
      dataIndex: 'address',
      key: 'address',
     
  }
]
function Draw({params}, ref) {
    const {t} = useTranslation(["comm"])
    const [open, setOpen] = useState(false)
    const [sfrom]= Form.useForm()
    const [apiform] = Form.useForm()
    const {Item} = Form
    console.log('draw')
   // let {used, unused} = tabledata
   const [usedtb, setusedtable] = useState([])
   const [unusedtb, setUnusedtb] = useState([])
   const unusedtbbk = useRef()
   const {laptop} = useSelector(adaptation)
  
  
    const devices = useRef([]);
    const undevices = useRef([])
    const [type, setType] = useState(1)
    const Ctitle=(
      <Select value={type} onChange={(v) => setType(v)}>
         <Select.Option value={1}>自动采集-表计采集</Select.Option>
         <Select.Option value={2}>自动采集-数据对齐</Select.Option>
      </Select>
    )
    console.log(params)
    const  {configData, isError, error } = useBoundaryConfigQuery(params, {  // 查询排放边界配置结构
       skip: !params,
       selectFromResult: ({data}) => ({
        
         configData: data?.data ?? null
       })
     }
    ) 
  
   useEffect(() => {
     if(isError) return i18warning(error)
     if(configData && isObject(configData)) {
      let {relations, noRelations} = configData
        setusedtable(Array.isArray(relations) ? relations : [])
        setUnusedtb(Array.isArray(noRelations) ? noRelations : [])
        unusedtbbk.current = Array.isArray(noRelations) ? noRelations : [];
     }else {
        setusedtable([])
        setUnusedtb([])
     }
   }, [configData])


/*     useEffect(() => {
      if(params) {
        getData()
      }


    }, [params]) */

    const drawClose = () => {   
      setOpen(false);
      sfrom.resetFields()
      apiform.resetFields()
    };
    const drawOpen = () => {
        setOpen(true)
    }


    // 排放边界配置
 
   
    const [saveconfig, {isLoading}] = useConfigDeviceMutation()
    const onSave =async () => {
        try {
         

            let {enterpriseId,subCategoryId,carbonBoundaryId } =params
             let sns = Array.isArray(usedtb) ? usedtb.map(d => d.deviceSn) : [];
            let body = {
               enterpriseId,
               subCategoryId,
               carbonBoundaryId,
               sns,
            }
           let {success, errMsg} = await saveconfig(body).unwrap()
           if(success) {
              i18success('save')
              drawClose()
           }else {
              i18warning(errMsg)
           }
         
        } catch (error) {
           console.log(error)
        }
       
    }
 
   // 保存APi 
   const [savApi, {isLoading: apiLoading}] = useApiDataMutation()
   const onSaveApi =async () => {
      try {
        const post = await apiform.validateFields()
        
        const {success, errMsg} = await savApi({...params,post})
        if(success) {
          i18success('save')
          drawClose()
        }else {
          i18warning(errMsg)
           
        }
      } catch (error) {
      
      }

   }
 
 // end


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
      const btnsty = laptop
    ? {
        height: "32px",
        width: "55px",
      }
    : {
        height: "46px",
        width: "68px",
      };
  const savesty = laptop
    ? {
        height: "34px",
        width:"120px",
      }
    : {
        height: "46px",
        width: "146px"
      };
  return (
    <Drawerbox
    onClose={drawClose}
     open={open} 
    closable={false}
    maskClosable={false}
    contentWrapperStyle={{margingRight: '16px'}}
    title={Ctitle}
    destroyOnHidden
  >
  {type==2 ? (<Titlelayout title={t("comm:APIinterface")} layout="flex" style={{height: '376px'}} >
       <Apibox>
          <Cdivider type="h" />
           <Form form={apiform}>
               <Form.Item name="httpUrl" normalize={value => value.trim()} rules={[ 
                {
                //  type: "url",
                  required: true, 
                }
               ]}>
                  <Input></Input>
               </Form.Item>
               <Form.Item name="script">
                  <Input.TextArea  rows={6}></Input.TextArea>
               </Form.Item>
               <Form.Item>
                  <CustButtonT text="ok" loading={apiLoading}    style={{marginLeft: "auto"}} onClick={onSaveApi} /> 
               </Form.Item>
            </Form>
       </Apibox>
 
      
     
   </Titlelayout>) 
   :
   <>
    <Titlelayout title={''} layout="flex">
       <div className="outwrap">
          <div className="inwrap">
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
    <div className="optab">
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Paragraph> <CustTransO ns="comm" text="Pleaseselectdevice" /></Paragraph>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <CustButton 
            icon={<LeftOutlined   />}
            style={btnsty}
            onClick={selected}
          ></CustButton>
          <CustButton
            icon={<RightOutlined  />}
            style={btnsty}
            onClick={unselect}
          ></CustButton>
        </div>
      </div>
      
      <Space   direction="vertical">
       <CustButtonT
          block
          style={savesty}
          onClick={onSave}
          wh="100%"
          loading={isLoading}
          text="save"
        />
       
        <CustButtonT block   onClick={drawClose}   text="Cancel" type="default" style={savesty} wh="100%" />
      
      </Space>
    </div>
    <Titlelayout title={<CustTransO ns="comm" text="Unselecteddevices" />} layout="flex">
    <div className="unselected">
      
      <Form
        form={sfrom}
        initialValues={{
          type: "0",
        }}
      >
          <Item name="alike" label={<CustTransO ns="comm" text="SearchDevice" />}>
            <Serach
              allowClear
              style={{width: "256px"}}
              placeholder={t("comm:pedna")}
              onSearch={onSerach}
            />
          </Item>
      </Form>
      <div className="outwrap">
        <div className="inwrap">
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
      </>
}
  </Drawerbox>
  )
}
export default forwardRef(Draw)
