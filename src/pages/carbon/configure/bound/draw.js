import React, {useState, forwardRef, useImperativeHandle, useRef, useEffect} from 'react'
import {Drawer, Select, Button, Typography, Form, Input, message,  } from 'antd'
import {   LeftOutlined, RightOutlined } from "@ant-design/icons";
import {useTranslation} from "react-i18next"
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout.js'
import UserTable from "@com/useTable";
import {  useConfigDeviceMutation,useApiDataMutation, useBoundaryConfigQuery} from '@redux/carbon'
import {isObject} from "@com/usehandler"
import {CustButtonT, i18warning, i18success, CustTransO} from "@com/useButton"
import {Cdivider} from '@com/comstyled'

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
      height:min-content;
      top: 80px;
      right: 16px;
    }
    .ant-drawer-wrapper-body {
      background-color: #003366;
      .ant-drawer-body {
        display: grid;
        grid-template-columns: 692px 1fr 714px;
        column-gap: 30px;
        grid-template-rows: 700px;
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
          display: grid;
          grid-template-rows: 32px 32px 1fr;
          padding: 16px;
          row-gap: 16px;
          background-color: #fff;
        }
        .optab {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 0;
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
  
   // let {used, unused} = tabledata
   const [usedtb, setusedtable] = useState([])
   const [unusedtb, setUnusedtb] = useState([])
   const unusedtbbk = useRef()
  
  
    const devices = useRef([]);
    const undevices = useRef([])
    const [type, setType] = useState(1)
    const Ctitle=(
      <Select value={type} onChange={(v) => setType(v)}>
         <Select.Option value={1}>自动采集-表计采集</Select.Option>
         <Select.Option value={2}>自动采集-数据对齐</Select.Option>
      </Select>
    )

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
          if(Array.isArray(usedtb) && usedtb.length > 0) {

            let {enterpriseId,subCategoryId,carbonBoundaryId } =params
             let sns = usedtb.map(d => d.deviceSn)
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
          }else {
            message.warning(<CustTransO text="Pleaseselectdevice" ns="comm"/>)
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
   
    const changeUnselected = (v) => {
       try {
        if (v != 0) {
          let arr = unusedtbbk.current?.filter(i => v == i.deviceStyle ) || []
          setUnusedtb(arr)
        }else {
          setUnusedtb(unusedtbbk.current || [])
        }
       } catch (error) {
        
       }
     
      };
      let keys = unselectdevice.map(i => i.key)
     const onSerach = (v) => {

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
           undevices.current = selectedRows;
           setUnselectedRowKeys([...selectedRowKeys])
           
        },

      };
      const unselect = () => {
        if(!devices.current) return
        let keys = devices.current.map(k => k.deviceSn)
        setUnusedtb([...unusedtb, ...devices.current])
        let data = usedtb.filter(t => !keys.includes(t.deviceSn))
       setusedtable([...data])
        setSelectedRowKeys([])
      //  setUnselectedRowKeys([...unselectedRowKeys,...keys])
        devices.current = {}
        undevices.current={}
      }
      const selected = (f) => {
         if(!undevices.current) return
         let keys = undevices.current.map(k => k.deviceSn)
            
            setusedtable([...usedtb, ...undevices.current])
            let undata = unusedtb.filter(t => !keys.includes(t.deviceSn))
            setUnusedtb([...undata])
           // setSelectedRowKeys([...selectedRowKeys,...keys])
            setUnselectedRowKeys([])
            devices.current = {}
            undevices.current={}
      }
  return (
    <Drawerbox
    onClose={drawClose}
     open={open}
     width={1688}
    closable={false}
    maskClosable={false}
    contentWrapperStyle={{margingRight: '16px'}}
    title={Ctitle}
    destroyOnClose
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
    <Titlelayout title={''}>
       
        <UserTable
          columns={deviceColumns}
          rowSelection={rowSelection}
          dataSource={usedtb}
          rowKey="deviceSn" 
          ref= {setb}
          scroll={{
            y: 500
          }}
        />
     
      
    </Titlelayout> 
    <div className="optab">
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: "0 16px"}}>
        <Paragraph> <CustTransO ns="comm" text="Pleaseselectdevice" /></Paragraph>
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
      
      <div>
       <CustButtonT
          block
          style={{ marginBottom: "16px", height: "40px" }}
          onClick={onSave}
          wh="100%"
          loading={isLoading}
          text="save"
        />
          
       
        <CustButtonT block onClick={drawClose}   text="Cancel" type="default" sylte={{height: '40px'}} wh="100%" />
      
      </div>
    </div>
    <Titlelayout title={<CustTransO ns="comm" text="Unselecteddevices" />}>
    <div className="unselected">
      
      <Form
        form={sfrom}
        initialValues={{
          type: "0",
        }}
      >
          <Item name="alike" label={<CustTransO ns="comm" text="SearchDevice" />}>
            <Inptserach
              allowClear
              placeholder={t("comm:pedna")}
              onSearch={onSerach}
            />
          </Item>
      </Form>
      <UserTable
        columns={unselectdevice}
        rowSelection={unrowSelection}
        dataSource={unusedtb}
        scroll={{y: 500}}
        ref={untb}
        rowKey="deviceSn"
      />
      </div>
      </Titlelayout>
      </>
}
  </Drawerbox>
  )
}
export default forwardRef(Draw)
