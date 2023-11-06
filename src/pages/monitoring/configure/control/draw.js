import React, {useState, forwardRef, useImperativeHandle, useRef, useEffect} from 'react'
import {Drawer, Select, Button, Typography, Space, Form, Input, message} from 'antd'
import {   LeftOutlined, RightOutlined } from "@ant-design/icons";
import styled from 'styled-components'
import Titlelayout from '@com/titlelayout.js'
import UserTable from "@com/useTable";
import {AutoValve} from '@api/api'
const {Paragraph} = Typography

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
        title: '设备编号',
        dataIndex: 'sn',
        key: 'sn',
        align: 'center'
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
    },
    {
        title: '安装位置',
        dataIndex: 'address',
        key: 'address',
        align: 'center'
    },
    {
        title: '是否启用',
        dataIndex: 'status',
        key: 'status',
        align: 'center'
    },
]
function Draw({params}, ref) {
    const [open, setOpen] = useState(false)
    const [sfrom]= Form.useForm()
    const {Item} = Form
    let {projectId, planId} = params || {}
   // let {used, unused} = tabledata
   const [usedtb, setusedtable] = useState([])
   const [unusedtb, setUnusedtb] = useState([])
    const getData = async () =>{
        try {
        let {success, data, errMsg} =   await AutoValve.GetDeviceConfigure(params)
        if(success) {
           if(data?.constructor ==Object) {
             let {unused, used} = data
             setUnusedtb(unused)
             setusedtable(used)
           }else {
            setUnusedtb([])
            setusedtable([])
           }
        }else {
            setUnusedtb([])
            setusedtable([])
            message.warning(errMsg || "数据出错")
        }
        } catch (error) {
            
        }
       
    }
  
    const devices = useRef([]);
    const undevices = useRef([])
    useEffect(() => {
      if(params)   getData()
    }, [params])
    const drawClose = () => {   
        setOpen(false);
        sfrom.resetFields()
      };
    const drawOpen = () => {
        setOpen(true)
    }
    const onSave =async () => {
        if(  !planId || !projectId) return
        let post = {
            planId,
            projectId,
            device: usedtb.map(t => t.sn)
        }
     let {success, errMsg} = await  AutoValve.ConfigureDevice(post)
     if(success) {
        message.success('保存成功')
        getData()
     }else {
        message.warning(errMsg || "数据出错")
     }
    }
    useImperativeHandle(ref, () => ({
        drawClose,
        drawOpen,
    }))
   
    const changeUnselected = () => {
        let params = sfrom.getFieldsValue();
        let {type} = params
      //  setDevietype(type)
        try {
        //  getUNselect({ areaId: curareaId.current, ...params });
        //  getSelected({ areaId: curareaId.current, type})
        } catch (error) {
          console.log(e);
        }
      };
      const setb = useRef()
      const untb = useRef()
      const rowSelection = { // 已选中的设备
        onChange: (selectedRowKeys, selectedRows, info) => {
           devices.current = selectedRows;
           
        },
      };
      const unrowSelection = { // 未选中的设备
        onChange: (selectedRowKeys, selectedRows, info) => {
           undevices.current = selectedRows;
           
        },

      };
      const unselect = () => {
        if(!devices.current) return
        let keys = devices.current.map(k => k.id)
        
        setUnusedtb([...unusedtb, ...devices.current])
        let data = usedtb.filter(t => !keys.includes(t.id))
        setusedtable([...data])
        devices.current = {}
        undevices.current={}
      }
      const selected = (f) => {
         if(!undevices.current) return
         let keys = undevices.current.map(k => k.id)
            
           setusedtable([...usedtb, ...undevices.current])
            let undata = unusedtb.filter(t => !keys.includes(t.id))
            setUnusedtb([...undata])
           
            devices.current = {}
           undevices.current={}
      }
  return (
    <Drawerbox
    onClose={drawClose}
     open={open}
     width={1688}
    closable={false}
    destroyOnClose
  >
    <Titlelayout title="选中设备">
       
        <UserTable
          columns={deviceColumns}
          rowSelection={rowSelection}
          dataSource={usedtb}
          rowKey="id" 
          ref= {setb}
          scroll={{
            y: 696
          }}
        />
     
      
    </Titlelayout> 
    <div className="optab">
      <div>
        <Paragraph>选择设备</Paragraph>
        <Space>
          <Button
            type="primary"
            icon={<LeftOutlined style={{ fontSize: "18px" }} />}
            onClick={selected}
          ></Button>
          <Button
            type="primary"
            icon={<RightOutlined style={{ fontSize: "18px" }} />}
            onClick={unselect}
          ></Button>
        </Space>
      </div>
      
      <div>
       <Button
          type="primary"
          block
          style={{ marginBottom: "16px" }}
          onClick={onSave}
        >
          保存
        </Button>
        <Button block onClick={drawClose}  >
          关闭
        </Button>
      </div>
    </div>
    <Titlelayout title="未选中的设备">
    <div className="unselected">
      
      <Form
        form={sfrom}
        initialValues={{
          type: "1",
        }}
      >
        <Space size={16}>
          <Item label="设备类型" name="type">
            <Select
              style={{ width: "112px" }}
              onChange={changeUnselected}
              options={[
                {
                  value: "1",
                  label: "电表",
                },
                {
                  value: "2",
                  label: "水表",
                },
                {
                  value: "3",
                  label: "燃气表",
                },
              ]}
            ></Select>
          </Item>
          <Item name="alike" label="设备搜索">
            <Inptserach
              allowClear
              placeholder="请输入设备编号/安装地址"
              onSearch={changeUnselected}
            />
          </Item>
        </Space>
      </Form>
      <UserTable
        columns={deviceColumns}
        rowSelection={unrowSelection}
        dataSource={unusedtb}
        scroll={{y: 696}}
        ref={untb}
        rowKey="id"
      />
      </div>
      </Titlelayout>
     
  </Drawerbox>
  )
}
export default forwardRef(Draw)
