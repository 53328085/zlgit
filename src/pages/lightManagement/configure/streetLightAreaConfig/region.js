import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Input,
  Button,
  Space,
  Form,
  message,
  Typography,
  Select,
  Drawer,
} from "antd";

import styled, {css} from "styled-components";
import UserTable from "@com/useTable";
import { Area } from "@api/api.js";
import { WarningFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";

import { Serach } from '@com/comstyled'

import { selectOneLevel, selectOneLevelDefaultId, getOnelevel, publishState, filterDeviceStyle,adaptation } from '@redux/systemconfig.js'
import { useSelector, useDispatch } from 'react-redux'
import Mask from '@com/mask.jsx'
import { CustLink, CancelButton , CustButton} from "@com/useButton"
import {useListUnBindLight, useListBindLight, useAddConfig , useRemoveConfig} from "./api"
const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 48px 1fr;
  row-gap: 16px;
  flex: 1;
`;
 
const sty=css` 
      grid-template-columns: 1fr auto 1fr;
        column-gap: 16px;
        grid-template-rows:  1fr; 
        .selected{
          row-gap:16px;
        }
`
const iconsty = css`
  width: 48px;
  height: 32px;
`
const Drawerbox = styled(Drawer)`
  && {
  //  z-index: 10001;
    .ant-drawer-content-wrapper {
      width: calc(100% - 200px)!important;
      height: calc(100% - 64px);
      top:64px;
    }
    .ant-drawer-wrapper-body {
      background-color: #003366;
      .ant-drawer-body {
        display: grid;
        grid-template-columns: 692px 1fr 714px;
        column-gap: 30px;
        grid-template-rows: 1fr;
       
        .title {
          padding-left: 16px;
          border-left: 4px ${props=> props.theme.primaryColor} solid;
          color: #333;
          display: flex;
          align-items: center;
        }
        .selected {
          display: flex;  
          row-gap: 32px;
          flex-direction:column;
          .total {
            display: grid;
            grid-template-rows: 32px 1fr;
            row-gap: 16px;
            padding: 16px;
            background-color: #fff;
            flex:1;
          }
          .sub {
            display: grid;
            grid-template-rows: 32px 32px 1fr;
            padding: 16px;
            row-gap: 16px;
            background-color: #fff;
            flex: 1;
          }
        }
        .outwrap {
          position: relative;
          height: 100%;
          overflow: auto;
          .inwrap {
            position: absolute;
            width: 100%;
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
        ${props=> props.theme.laptop ? sty : null}
      }
     
    }
  }
`;
const Inptserach = styled(Input.Search)`
  && {
    
    .ant-input-search
      .ant-input-group
      .ant-input-affix-wrapper:not(:last-child) {
      border-radius: 16px 0 0 16px !important;
    }
  }
`;
const { Link, Text, Paragraph } = Typography;
const { Item } = Form;
export default function Index({ projectId, level,  name,id, allLevel }) {

  const dispatch = useDispatch();
  const oneLevel = useSelector(selectOneLevel) // 一级 
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId) // 一级默认id
  const ispublish = useSelector(publishState)
  const [levelone] = useState(allLevel[0]);
  const {laptop} = useSelector(adaptation)
  const limitlevle = allLevel.slice(0, level - 1);
  const fields = allLevel?.find(item => item.level == level)?.fields || [];
  const [form] = Form.useForm();
  const [sfrom] = Form.useForm();

  const boxref = useRef();
  const [Record, setRecord] = useState({});
 
  const [open, setOpen] = useState(false);
  const [deviceSummary, setDeviceSummary] = useState([]);
  const [deviceSub, setDeviceSub] = useState([]);
  const [Unselected, setUnSelected] = useState([]);

  const [tabelData, setTableData] = useState([])
  const [columns, setColumns] = useState([]);
 
  const [topAreaId, setTopAreaId] = useState(oneLevelDefaultId)
 

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })

  const devices = useRef({
    unselected: [],
    deviceSummary: [],
    deviceSub: [],
    selected: [],
  });



  const curareaId = useRef(null);
  let params = {
    //查询
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    level,
    topAreaId: 0,
    name: "",
    projectId,
  };
  const defaultParams = {
    // 新增，修改
    level,
    projectId,
    parentId: 0,
    name: "",
    remark: "",
    id: 0,
    fields: [],
  };
  const upateOneLevel = async () => {
    if (level != 1) return
    try {
      let { success: lsuccess, data: levelData } = await Area.QueryAll({ projectId, level: 1, parentId: 0 })
      lsuccess && dispatch(getOnelevel(levelData || []));
      !lsuccess && dispatch(getOnelevel([]));
    } catch (error) {
      console.log(error)
    }
  }




  //  配置 start
  const deviceColumns = [
    {
      title: "设备编号",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "安装地址",
      dataIndex: "address",
      key: "address",
    },
  ];

  const deviceStyles = useSelector(filterDeviceStyle)
  const [devietype, setDevietype] = useState(0) // 设备类型
  const drawClose = () => {
    setOpen(false);
    sfrom.resetFields()
  };
  const drawopen = () => {
    setOpen(true);
  };

  const getUNselect = async ({ type = devietype, areaId, alike = "" } = {}) => {
    curareaId.current = areaId;
     console.log(Record)
    try {
      let { success, data } = await useListUnBindLight({},{
        projectId,
        rId:Record?.areaId,
      }); // 未选中
      if (success && Array.isArray(data)) {
        setUnSelected([...data]);
      //  devices.current.unselected = data;
      } else {
        setUnSelected([]);
      }
    } catch (error) {
      console.log(error)
     }
  };

  const getSelected = async () => {
     try {
  
    let {
      data: { deviceSummary, deviceSub },
      success,
    } = await useListBindLight({},{ projectId, rId:Record?.areaId }); // 已选中 type: 0
    if (success && Array.isArray(deviceSummary)) {
      setDeviceSummary([...deviceSummary]);
    //  devices.current.deviceSub = deviceSub;
    } else {
      setDeviceSummary([]);
    }
    if (success && Array.isArray(deviceSub)) {
      setDeviceSub([...deviceSub]);
    } else {
      setDeviceSub([]);
    }
        
  } catch (error) {
      console.log(error)
  }

  }


  const deviceData = async (record) => {
    try {
      await getUNselect();
      await getSelected()

    } catch (error) {
      console.log(error);
    }
  };
  const config = async (record) => {
    console.log(record)
    try {
      setRecord({ ...record });
      deviceData(record).then(() => {
        drawopen();
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [rowSelectionData, setRowSelection] = useState([])
  const [maindata, setMaindata] = useState([])
  const rowSelection = {   // 总表
  //  selectedRowKeys: rowSelectionData,
    onChange: (selectedRowKeys, selectedRows, info) => {
      setRowSelection(selectedRowKeys)
      setMaindata([...selectedRows]);
    },
  };
  const [subrowSelectionData, setSubRowSelection] = useState([])
  const [subdata, setSubdata] = useState([])
  const subrowSelection = {   // 分表
  //  selectedRowKeys: subrowSelectionData,
    onChange: (selectedRowKeys, selectedRows, info) => {
      setSubRowSelection(selectedRowKeys)
      setSubdata([...selectedRows]);
    },
  };

  const [unrowSelectionData, setUnRowSelection] = useState([])
  const [undata, setUndata] = useState([])
  const unrowSelection = {   // 未选中
   // selectedRowKeys: unrowSelectionData,
    onChange: (selectedRowKeys, selectedRows, info) => {
       setUnRowSelection(selectedRowKeys)
      setUndata([...selectedRows]);
    },
  };



  const onMove = async (type,h, m) => {  // h: 1, 绑定 2. 解绑 m, 1 总表 2. 分表

    console.log(type)
    let selected = [[], undata, maindata, undata, subdata][type]
    // let selected = devices.current.selected; 

    if (selected.length < 1) return message.warning('请选择设备', 2)
     setUnRowSelection([])
     setRowSelection([])
     setSubRowSelection([])
    let body = selected.map(s => s.id);
    let handler = ['', useAddConfig , useRemoveConfig][h]  
    let { success, errMsg } = await handler({projectId, type:m, rid:id}, body )
    if (success) {
     console.log(subrowSelectionData)
    //  devices.current.selected = [];
      getSelected()
      getUNselect()
      message.success(h==1 ? "绑定成功" : "解绑成功")
    } else {
      message.error(errMsg || '数据出错', 2)
    }

  };


  const handlersearch = (e) => {
    let str = e.trim();
    str &&
      setDeviceSub((arr) =>
        arr.filter((a) => a.sn?.includes(str) || a.address?.includes(str))
      );
    !str && setDeviceSub([...devices.current.deviceSub]);
  };
  const changeUnselected = () => {
    let params = sfrom.getFieldsValue();
    let { type } = params
    setDevietype(type)
    try {
      getUNselect();
      getSelected()
    } catch (error) {
      console.log(e);
    }
  };

  //  配置 end

  const getTableData = () => {
    // 列表查询
    if (isNaN(level)) return;

    let value = form.getFieldsValue()
    //setTopAreaId(value.topAreaId)
    params = { ...params, ...value }
    console.log(pagination)
    console.log(params)
    Area.QueryByPage(params)
      .then((res) => {
        let { success, data, total } = res;
        let {
          body = [],
          header = [],
          idGroup = [],
          type = [],
          parentIdGroup = [],
        } = data || {};
        let cols = [];
        let index = header.findIndex(h => h == '备注')
        // if(index > -1) header.splice(index,1)
        if (index > -1) {
          header.splice(index, '备注')
        }
        for (let k of header) {
          let col = {
            title: k,
            dataIndex: k,
            key: k,
          };
          cols.push(col);
        }
        let colums = ispublish ? [...cols] : [
          ...cols,
          // index > -1 ?   {title: '备注', dataIndex: '备注', key: '备注'}: {},
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (_, record) => (
              <Space size={32}>
                <CustLink text="configure" onClick={() => config(record)} />

                {/*  <Link underline onClick={() => edit(record)}>
                  编辑
                </Link>
                <Link underline type="danger" onClick={() => del(record)}>
                  删除
                </Link> */}
              </Space>
            ),
          },
        ];

        setColumns(colums);
        let formart = body.map((r, i) => {
          let row = {
            areaId: idGroup[i],
            parentId: parentIdGroup[i],
            type: type,
          };
          header.forEach((e, i) => {
            row[e] = r[i];
            // row.id= nanoid()
          });
          return row;
        });
        //  console.log(formart);
        if (success && data) {
          setTableData([...formart])
          // console.log(tabelData);
          setPagination({
            ...pagination,
            total: total,
          })
          /*  return {
             total: colums.length,
             list: formart,
           }; */
        } else {
          setTableData([])
          /*   return {
              total: 0,
              list: [],
            }; */
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };



  const tableOnchange = (e) => {
    console.log(e)
    let { current } = e
    setPagination({
      ...pagination,
      current,
    })

  }
  useEffect(() => {
    getTableData()

  }, [pagination.current])
  useEffect(() => {
    // getLevelOption();
    if (level == 1) {
      form.setFieldsValue({
        topAreaId: null,
      });
      getTableData()
    } else if (level > 1) {
      form.setFieldsValue({
        topAreaId: 0,
      });
      getTableData()
    }

  }, [level]);
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
          width: "120px",
        }
      : {
          height: "46px",
          width: "146px",
        };
  return (
    <Mainbox ref={boxref}>

      <Form form={form} layout="inline" initialValues={{ name: "" }}>
        <Space size={16}>
          {level == 1 && (
            <Form.Item name="name" label={`${name}查询`}>
              <Serach
                placeholder={`请输入${name}名称`}
                style={{ width: "340px" }}
                onSearch={getTableData}
              />
            </Form.Item>
          )}
          {level > 1 && (
            <>
              <Item label={`${levelone.name}名称`} name="topAreaId">
                <Select
                  options={[...oneLevel, { name: '全部', id: 0 }]}
                  fieldNames={{
                    label: "name",
                    value: "id",
                    options: "options",
                  }}
                  style={{ width: "200px" }}
                  onChange={getTableData}
                ></Select>
              </Item>
              <Form.Item name="name" label={`${name}查询`}>
                <Serach
                  placeholder={`请输入${name}名称`}
                  style={{ width: "340px" }}
                  onSearch={getTableData}
                />
              </Form.Item>
            </>
          )}

        </Space>
      </Form>
      <UserTable columns={columns} dataSource={tabelData} pagination={pagination} onChange={tableOnchange} rowKey="areaId" />
      {/*    <UserTable columns={columns} {...tableProps} rowKey='areaId'  style={{display: level==1 ?'block' : 'none' }} /> 
          <UserTable columns={columns} {...tableProps} rowKey='areaId' style={{display: level>1 ?'block' : 'none' }} />   */}

      {/* 抽屉 */}
      {/*  devices.current.deviceSummary = [];
        devices.current.deviceSub = [] */}
     
        <Drawerbox
          onClose={drawClose}
          open={open}         
          closable={false}
          destroyOnClose
          contentWrapperStyle={{ margingRight: '16px' }}
        >
          <div className="selected">
            <div className="total">
              <p className="title">{name}总表</p>
              <div className="outwrap">
                <div className="inwrap">
                <UserTable
                columns={deviceColumns}
                rowSelection={{
                  selectedRowKeys: rowSelectionData,
                  ...rowSelection
                }}
                dataSource={deviceSummary}
                rowKey="id"
              />
                </div>
              </div>
            
            </div>
            <div className="sub">
              <p className="title">{name}分表</p>
              <Space size={16}>
                <Text style={{ color: "#333" }}>设备搜索</Text>
                <Inptserach
                  allowClear
                  onPressEnter={handlersearch}
                  placeholder="请输入设备编号/安装地址"
                  onSearch={handlersearch}
                />
              </Space>
              <div className="outwrap">
                <div className="inwrap">
                <UserTable
                columns={deviceColumns}
                rowSelection={{
                  selectedRowKeys: subrowSelectionData,
                  ...subrowSelection,
                }}
                dataSource={deviceSub}
                rowKey="id"

              />
                </div>
              </div>
             
            </div>
          </div>

          <div className="optab">
            <div>
              <Paragraph>选中{name}总表</Paragraph>
              <Space>
                <CustButton
                  icon={<LeftOutlined  />}
                  onClick={() => onMove(1, 1, 1)}
                  style={btnsty}
                ></CustButton>
                <CustButton
                  icon={<RightOutlined />}
                  onClick={() => onMove(2, 2, 1)}
                  style={btnsty}
                ></CustButton>
              </Space>
            </div>
            <div>
              <Paragraph>选择{name}分表</Paragraph>
              <Space size={16}>
                <CustButton
                 icon={<LeftOutlined />} 
                 style={btnsty}
                 onClick={() => onMove(3, 1, 2)}
                    />
                 
                
                <CustButton
                 icon={<RightOutlined />} 
                 style={btnsty}
                 onClick={() => onMove(4, 2, 2)}
                 
                /> 
              </Space>
            </div>
            <div>
             
              <CancelButton onClick={drawClose} style={savesty} />

            </div>
          </div>
          <div className="unselected">
            <p className="title">未选中的设备</p>
            <Form
              form={sfrom}
              initialValues={{
                type: 0
              }}
            >
              <Space size={16}>
                <Item label="设备类型" name="type">
                  {/* <Select
                  style={{ width: "112px" }}
                 onChange={changeUnselected}
                options={[
                  {
                    value: "0",
                    label: "全部类型",
                  },
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
                    {
                      value: "12",
                      label: "断路器",
                    },
                  ]}
                /> */}
                  <Select
                    style={{ width: "128px" }}
                    onChange={changeUnselected}
                    defaultValue={devietype}
                    fieldNames={{ label: "name", value: "deviceStyle" }}
                    options={deviceStyles?.length > 0 ? [{ deviceStyle: 0, name: "全部类型" }, ...deviceStyles] : []}
                  />
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
            <div className="outwrap">
              <div className="inwrap">
              <UserTable
              columns={deviceColumns}
              rowSelection={{
                selectedRowKeys: unrowSelectionData,
                ...unrowSelection,
              }}
              dataSource={Unselected}
              rowKey="id"
            />
              </div>
            </div>
           
          </div>
        </Drawerbox>
     
    </Mainbox>
  );
}
