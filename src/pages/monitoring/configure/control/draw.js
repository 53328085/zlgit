import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { Drawer, Select, Button, Typography, Space, Form, Input, message, Switch } from 'antd'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import Titlelayout from '@com/titlelayout.js'
import UserTable from "@com/useTable";
import { AutoValve } from '@api/api'
import { CustButtonT } from "@com/useButton"
import {filterDeviceStyle} from '@redux/systemconfig'
import Devicestyle from "@com/useSerach/devicestyle"
const { Paragraph } = Typography

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
          text-align: center;
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
    align: 'center',
    render: (_, record, index) => <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked={record.enabled} onChange={e => {
      console.log(index)
      record.enabled = Number(e)
    }} />
  },
]

const unselectdevice = [
  {
    title: '设备编号',
    dataIndex: 'sn',
    key: 'sn',

  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',

  },
  {
    title: '安装位置',
    dataIndex: 'address',
    key: 'address',

  }
]
function Draw({ params }, ref) {
  const deviceStyle = useSelector(filterDeviceStyle)
  const [open, setOpen] = useState(false)
  const [sfrom] = Form.useForm()
  const { Item } = Form
  let { projectId, planId } = params || {}
   
  const [usedtb, setusedtable] = useState([])
  const [unusedtb, setUnusedtb] = useState([])
  const unusedtbbk = useRef()
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
      title: '是否启用策略',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record, index) => <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked={record.enabled} onChange={e => {
        let arr = usedtb.map((el, i) => {
          if (index == i) {
            el.enabled = Number(e);
            return el
          } else {
            return el
          }

        })
        setusedtable([...arr])
      }} />
    },
  ]
  const getData = async () => {
    try {
      let { success, data, errMsg } = await AutoValve.GetDeviceConfigure(params)
      if (success) {
        if (data?.constructor == Object) {
          let { unused, used } = data
          setUnusedtb(unused)
          setusedtable(used)
          unusedtbbk.current = unused
        } else {
          setUnusedtb([])
          setusedtable([])
        }
      } else {
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
    if (params) getData()
  }, [params])
  const drawClose = () => {
    setOpen(false);
    sfrom.resetFields()
  };
  const drawOpen = () => {
    setOpen(true)
  }
  const onSave = async () => {
    if (!planId || !projectId) return
    let post = {
      planId,
      projectId,
      device: usedtb.map(t => ({ sn: t.sn, enabled: Number(t.enabled) }))
    }
    let { success, errMsg } = await AutoValve.ConfigureDevice(post)
    if (success) {
      message.success('保存成功')
      getData()
      drawClose()
    } else {
      message.warning(errMsg || "数据出错")
    }
  }
  useImperativeHandle(ref, () => ({
    drawClose,
    drawOpen,
  }))

  const changeUnselected = (v) => {
    console.log(v)
    try {
      if (v != 0) {
        let arr = unusedtbbk.current?.filter(i => v == i.deviceStyle) || []
        setUnusedtb(arr)
      } else {
        setUnusedtb(unusedtbbk.current || [])
      }
    } catch (error) {

    }

  };
  let keys = unselectdevice.map(i => i.key)
  const onSerach = (v) => {

    try {
      if (v) {
        let value = v.trim().toLowerCase()
        let arr = [];
        unusedtbbk.current.forEach(i => {
          let f = [];
          for (let key of keys) {
            f.push(i[key]?.toLowerCase().includes(value))
          }
          if (f.includes(true)) {
            arr.push(i)
          }
        })
        setUnusedtb(arr)
      } else {
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
    if (!devices.current) return
    let keys = devices.current.map(k => k.id)
    setUnusedtb([...unusedtb, ...devices.current])
    let data = usedtb.filter(t => !keys.includes(t.id))
    setusedtable([...data])
    setUnselectedRowKeys([])
    devices.current = {}
    undevices.current = {}
  }
  const selected = (f) => {
    if (!undevices.current) return
    let keys = undevices.current.map(k => k.id)

    setusedtable([...usedtb, ...undevices.current])
    let undata = unusedtb.filter(t => !keys.includes(t.id))
    setUnusedtb([...undata])
    setSelectedRowKeys([])
    devices.current = {}
    undevices.current = {}
  }
  return (
    <Drawerbox
      onClose={drawClose}
      open={open}
      width={1688}
      closable={false}
      maskClosable={false}
      contentWrapperStyle={{ margingRight: '16px' }}

      destroyOnClose
    >
      <Titlelayout title="选中设备">

        <UserTable
          columns={deviceColumns}
          rowSelection={rowSelection}
          dataSource={usedtb}
          rowKey="id"
          ref={setb}
          scroll={{
            y: 696
          }}
          style={{ marginTop: '16px' }}
        />


      </Titlelayout>
      <div className="optab">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Paragraph>选择设备</Paragraph>
          <div style={{ display: 'flex', justifyContent: "space-between", padding: "0 16px" }}>
            <Button
              type="primary"
              icon={<LeftOutlined style={{ fontSize: "18px", marginRight: "8px" }} />}
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
            text="save"
          />


          <CustButtonT block onClick={drawClose} text="Cancel" type="default" sylte={{ height: '40px' }} wh="100%" />

        </div>
      </div>
      <Titlelayout title="未选中的设备">
        <div className="unselected">

          <Form
            form={sfrom}
            initialValues={{
              deviceStyle: 0,
            }}
          >
            <Space size={16}>
              <div style={{width: "200px"}}>
              <Devicestyle projectId={projectId} itemprops={{label: "设备类型"}} onchange={changeUnselected} all={true}  />
              </div>
             {/*  <Item label="设备类型" name="type">
                <Select
                  style={{ width: "112px" }}
                  onChange={changeUnselected}
                  fieldNames={{value: "deviceStyle", label: "name"}}
                  options={ deviceStyle?.length > 0 ? [{deviceStyle:0 , name: "全部类型"}, ...deviceStyle] : []}
               
                ></Select>
              </Item> */}
              <Item name="alike" label="设备搜索">
                <Inptserach
                  allowClear
                  placeholder="请输入设备编号/安装地址"
                  onSearch={onSerach}
                />
              </Item>
            </Space>
          </Form>
          <UserTable
            columns={unselectdevice}
            rowSelection={unrowSelection}
            dataSource={unusedtb}
            scroll={{ y: 696 }}
            ref={untb}
            rowKey="id"
          />
        </div>
      </Titlelayout>

    </Drawerbox>
  )
}
export default forwardRef(Draw)
