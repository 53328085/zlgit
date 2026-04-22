import React, {
  useState,
  useRef,
  useEffect,
  useCallback
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
import {useAntdTable} from "ahooks"
import update from 'immutability-helper';
import styled, {css} from "styled-components";
import UserTable from "@com/useTable";
import { Area } from "@api/api.js";
import { WarningFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Serach ,Drawerbox} from '@com/comstyled'

import { selectOneLevel, selectOneLevelDefaultId, getOnelevel, publishState, filterDeviceStyle,adaptation } from '@redux/systemconfig.js'
import { useSelector, useDispatch } from 'react-redux'
 
import { CustLink, CancelButton , CustButton,CustButtonT} from "@com/useButton"
import  {components } from './draggable'
import {useAddSummaryDeviceOrder,useAddSubDeviceOrder} from "./api"
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

const Inptserach = styled(Input.Search)`
  && {
    width: 288px;
    .ant-input-search
      .ant-input-group
      .ant-input-affix-wrapper:not(:last-child) {
      border-radius: 16px 0 0 16px !important;
    }
  }
`;
const { Link, Text, Paragraph } = Typography;
const { Item } = Form;
export default function Index({ projectId, level,   name, allLevel }) {

 
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
  const [isAdd, setIsAdd] = useState(true);
  const [open, setOpen] = useState(false);
  const [deviceSummary, setDeviceSummary] = useState([]);
  const [deviceSub, setDeviceSub] = useState([]);
  const [Unselected, setUnSelected] = useState([]);

  const [tabelData, setTableData] = useState([])
  const [columns, setColumns] = useState([]);
  //const [topAreaId, setTopAreaId] = useState(() => level == 1 ? 0 : leveloption[0]?.id)
  const [topAreaId, setTopAreaId] = useState(oneLevelDefaultId)
  /*   const [fields, setFields] = useState({
      field: [],
      type: [],
    }); */

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

 




  //  配置 start
  const deviceColumns = [
    {
      title: "设备编号",
      dataIndex: "sn",
      key: "sn",
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
    try {
      let { success, data } = await Area.QueryUnusedMeter({
        projectId,
        type,
        areaId,
        alike,
      }); // 未选中
      if (success && Array.isArray(data)) {
        setUnSelected([...data]);
        devices.current.unselected = data;
      } else {
        setUnSelected([]);
      }
    } catch (error) { }
  };

  const getSelected = async ({ areaId, type = devietype }) => {
    let {
      data: { deviceSummary, deviceSub },
      success,
    } = await Area.QueryUsedMeter({ projectId, type, areaId }); // 已选中 type: 0
    if (success && Array.isArray(deviceSummary)) {
      setDeviceSummary([...deviceSummary]);
      
      devices.current.deviceSummary = deviceSummary;
    } else {
      setDeviceSummary([]);
      devices.current.deviceSummary = [];
    }
    if (success && Array.isArray(deviceSub)) {
      setDeviceSub([...deviceSub]);
      devices.current.deviceSub = deviceSub;
    } else {
      setDeviceSub([]);
      devices.current.deviceSub = [];
    }


  }


  const deviceData = async (record) => {
    try {
      /*  let {type, areaId} = record   
  let {success, data} = await Area.QueryUnusedMeter({projectId, type:1, areaId}) // 未选中 
   if (success && Array.isArray(data)) {
    setUnSelected([...data])
    devices.current.unselected = data
   }else {
    setUnSelected([])
   } */


      let { areaId } = record;
      // let  topareaid = form.getFieldValue('topAreaId');
      // let topid = level == 1 ? areaId : topareaid
      //  await getUNselect({ areaId: topid });

      await getUNselect({ areaId });
      await getSelected({ areaId })

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
    selectedRowKeys: rowSelectionData,
    onChange: (selectedRowKeys, selectedRows, info) => {
      setRowSelection(selectedRowKeys)
      setMaindata([...selectedRows]);
    },
  };
  const [subrowSelectionData, setSubRowSelection] = useState([])
  const [subdata, setSubdata] = useState([])
  const subrowSelection = {   // 分表
    selectedRowKeys: subrowSelectionData,
    onChange: (selectedRowKeys, selectedRows, info) => {
      setSubRowSelection(selectedRowKeys)
      setSubdata([...selectedRows]);
    },
  };

  const [unrowSelectionData, setUnRowSelection] = useState([])
  const [undata, setUndata] = useState([])
  const unrowSelection = {   // 分表
    selectedRowKeys: unrowSelectionData,
    onChange: (selectedRowKeys, selectedRows, info) => {
      setUnRowSelection(selectedRowKeys)
      setUndata([...selectedRows]);
    },
  };



  const onMove = async (type) => {

    let { areaId } = Record
    let selected = [[], undata, maindata, undata, subdata][type]
    // let selected = devices.current.selected; 

    if (selected.length < 1) return message.warning('请选择设备', 2)
    if (type == 2 || type == 4) setUnRowSelection([])
    if (type == 1) setRowSelection([])
    if (type == 3) setSubRowSelection([])
    let params = selected.map(s => s.sn);
    let handler = ['', 'AddSummaryDevice', 'RemoveSummaryDevice', 'AddSubDevice', 'RemoveSubDevice'][type]
    let { success, errMsg } = await Area[handler](projectId, areaId, params)
    if (success) {
      devices.current.selected = [];
      getSelected({ areaId })
      getUNselect({ areaId })
    } else {
      message.error(errMsg || '数据出错', 2)
    }

  };

  /*   const configureMeter = async () => {
      let params = {
        projectId,
        areaId: Record.areaId,
        deviceSummary: deviceSummary.map((i) => i.sn),
        deviceSub: deviceSub.map((i) => i.sn),
      };
      let { success, errMsg } = await Area.ConfigureMeter(params);
      success &&
        custMsg({
          content: "保存成功",
          onClose: () => {
            deviceData(Record);
          },
        });
      !success && custMsg({ success, content: errMsg || "数据出错" });
    }; */
  const handlersearch = (e,type) => {
    try {
      let str = e.trim();
      if(type===1) { //分表
        str &&
        setDeviceSub((arr) =>
          arr.filter((a) => a.sn?.includes(str) || a.address?.includes(str) || a.name?.includes(str))
        );
       !str && setDeviceSub([...devices.current.deviceSub]);
      }else  { // 主表
        str &&
        setDeviceSummary((arr) =>
          arr.filter((a) => a.sn?.includes(str) || a.address?.includes(str) || a.name?.includes(str))
        );
       !str && setDeviceSummary([...devices.current.deviceSummary]);
      }
     
    } catch (error) {
      console.log(error);
    }

  };
  const changeUnselected = () => {
    let params = sfrom.getFieldsValue();
    let { type } = params
    setDevietype(type)
    try {
      getUNselect({ areaId: curareaId.current, ...params });
      getSelected({ areaId: curareaId.current, type })
    } catch (error) {
      console.log(e);
    }
  };

  //  配置 end

  const getTableData = ({current, pageSize}, formData) => {
    // 列表查询
    console.log(formData)
    if (isNaN(level)) return;
    if(!Number.isInteger(parseInt(projectId))) return
   // let value = form.getFieldsValue()
   
  let  params = { pageNum:current,pageSize,level,projectId, ...formData }
  return  Area.QueryByPage(params)
      .then((res) => {
        let { success, data , total } = res;
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
        console.log(formart);
        if (success && Array.isArray(formart) && formart.length) {
    
         return {
             total: total,
             list: formart,
           };  
        } else {
         
           return {
              total: 0,
              list: [],
            }; 
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const {tableProps, search} = useAntdTable(getTableData, {
    form,
    defaultPageSize:15,
    refreshDeps: [level,projectId],
})
 const {submit} = search
 
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

        const moveRow = useCallback(
          (dragIndex, hoverIndex) => {
            const dragRow = deviceSummary[dragIndex];
            setDeviceSummary(
              update(deviceSummary, {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, dragRow],
                ],
              }),
            );
          },
          [deviceSummary],
        );

        const moveRow2 = useCallback(
          (dragIndex, hoverIndex) => {
            const dragRow = deviceSub[dragIndex];
            setDeviceSub(
              update(deviceSub, {
                $splice: [
                  [dragIndex, 1],
                  [hoverIndex, 0, dragRow],
                ],
              }),
            );
          },
          [deviceSub],
        );


  const onOk =async(type=0)=>{
    try {
      const {areaId} = Record
       
      const msn = deviceSummary?.map?.((item,idx) => ({sn:item.sn, order: idx+1})) || []
      const dsn = deviceSub?.map?.((item,idx) => ({sn:item.sn, order: idx+1})) || []
      let params ={
        projectId,
        areaId,
      }
      let body1 ={
        ...params,
        orderDevices:msn
      }
      let body2 ={
        ...params,
        orderDevices:dsn
      }
      let  promises = type==0 ? useAddSummaryDeviceOrder({}, body1) : useAddSubDeviceOrder({}, body2)
      let  {success, errMsg} =await promises
      if (success) {
        message.success(type==0 ? '总表保存成功' : '分表保存成功')
        getSelected({ areaId })
      }else {
        message.error(errMsg || '数据错误')
      }
      
      
     
    } catch (error) {
      console.log(error)
    }


    // drawClose()
  }
  return (
    <Mainbox ref={boxref}>

      <Form form={form} layout="inline" initialValues={{ name: "" }}>
        <Space size={16}>
          {level == 1 && (
            <>
            <Form.Item name="name" label={`${name}查询`} initialValue="">
              <Serach
                placeholder={`请输入${name}名称`}
                style={{ width: "340px" }}
                onSearch={submit}
              />
            </Form.Item>
            <Item name="topAreaId" initialValue={0} hidden noStyle>
              <Input  />
            </Item>
            </>
          )}
          {level > 1 && (
            <>
              <Item label={`${levelone.name}名称`} name="topAreaId" initialValue={0}>
                <Select
                  options={[...oneLevel, { name: '全部', id: 0 }]}
                  fieldNames={{
                    label: "name",
                    value: "id",
                    options: "options",
                  }}
                  style={{ width: "200px" }}
                  onChange={submit}
                ></Select>
              </Item>
              <Form.Item name="name" label={`${name}查询`} initialValue="">
                <Serach
                  placeholder={`请输入${name}名称`}
                  style={{ width: "340px" }}
                  onSearch={submit}
                />
              </Form.Item>
            </>
          )}

        </Space>
      </Form>
      <UserTable columns={columns}  {...tableProps} rowKey="areaId" />
    
    <Drawerbox/>
        <Drawer
          onClose={drawClose}
          open={open}         
          closable={false}
          destroyOnHidden
              rootClassName="drawerbox"
              styles={{
        content: {
          margingRight: '16px',
        
           
        }
      }}
        >
          <div className="selected">
            <div className="total">
              <p className="title"><span>{name}总表</span>  <CustButtonT text="save" onClick={()=>onOk(0)}     /></p>
              <Space size={16}>
                <Text style={{ color: "#333" }}>设备搜索</Text>
                <Inptserach
                  allowClear
                  onPressEnter={(e)=>handlersearch(e,0)}
                  placeholder="请输入设备编号/安装地址/设备名称"
                  onSearch={(e)=>handlersearch(e,0)}
                />
              </Space>
              <div className="outwrap">
                <div className="inwrap">
                  <DndProvider backend={HTML5Backend}>
                <UserTable
                columns={deviceColumns}
                rowSelection={rowSelection}
                dataSource={deviceSummary}
                components={components}
                onRow={(_, index)=> {
                   const attr ={
                    index,
                    moveRow
                   }
                   return attr
                }}
                rowKey="id"
              />
              </DndProvider>
                </div>
              </div>
            
            </div>
            <div className="sub">
              <p className="title"><span>{name}分表</span> <CustButtonT text="save" onClick={()=>onOk(1)}     /></p>
              <Space size={16}>
                <Text style={{ color: "#333" }}>设备搜索</Text>
                <Inptserach
                  allowClear
                  onPressEnter={(e)=>handlersearch(e,1)}
                  placeholder="请输入设备编号/安装地址/设备名称"
                  onSearch={(e)=>handlersearch(e,1)}
                />
              </Space>
              <div className="outwrap">
                <div className="inwrap">
                <DndProvider backend={HTML5Backend}>
                <UserTable
                columns={deviceColumns}
                rowSelection={subrowSelection}
                dataSource={deviceSub}
                components={components}
                onRow={(_, index)=> {
                   const attr ={
                    index,
                    moveRow:moveRow2
                   }
                   return attr
                }}
                rowKey="id"

              />
              </DndProvider>
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
                  onClick={() => onMove(1)}
                  style={btnsty}
                ></CustButton>
                <CustButton
                  icon={<RightOutlined />}
                  onClick={() => onMove(2)}
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
                 onClick={() => onMove(3)}
                    />
                 
                
                <CustButton
                 icon={<RightOutlined />} 
                 style={btnsty}
                 onClick={() => onMove(4)}
                 
                /> 
              </Space>
            </div>
            <Space size={16}>           
             
              <CustButtonT text="cancel" onClick={drawClose}   style={savesty} />
            </Space>
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
                    placeholder="请输入设备编号/安装地址/设备名称"
                    onSearch={changeUnselected}
                  />
                </Item>
              </Space>
            </Form>
            <div className="outwrap">
              <div className="inwrap">
              <UserTable
              columns={deviceColumns}
              rowSelection={unrowSelection}
              dataSource={Unselected}
              rowKey="id"
            />
              </div>
            </div>
           
          </div>
        </Drawer>
      {/* </Mask> */}
    </Mainbox>
  );
}
