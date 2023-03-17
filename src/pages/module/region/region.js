import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import {
  Input,
  Button,
  Space,
  Form,
  message,
  Typography,
  Select,
  InputNumber,
  Drawer,
  Cascader
} from "antd";
import { nanoid } from "@reduxjs/toolkit";
import styled from "styled-components";
import UserTable from "@com/useTable";
import { Area } from "@api/api.js";
import { WarningFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAntdTable } from "ahooks";
import warningImg from "@imgs/warning.png";
import { CustButton } from "@com/useButton";
import { custMsg } from "@com/usehandler";
import Mapcom from "@com/useMap";
import {selectOneLevel, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import {useSelector} from 'react-redux'
const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 48px 1fr;
  row-gap: 16px;
  flex: 1;
`;
const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: ${(p) => (p.islngLat ? "1fr 584px;" : "1fr")};
  grid-template-rows: ${(p) =>
    isNaN(p.rowes)
      ? "repeat(8, 32px)"
      : p.islngLat
      ? `repeat(${p.rowes + 5}, 32px)`
      : `repeat(${p.rowes}, 32px)`};
  column-gap: 32px;
  row-gap: 20px;
  grid-auto-flow: ${(p) => (p.islngLat ? "column" : "row")};
  .address {
    grid-column: 2;
  }
  .map {
    grid-column: 2;
    grid-row: 2 /-1;
  }
`;
const Drawerbox = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
      width: 100% !important;
    }
    .ant-drawer-wrapper-body {
      background-color: #003366;
      .ant-drawer-body {
        display: grid;
        grid-template-columns: 692px 1fr 714px;
        column-gap: 32px;
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
const { Link, Text, Paragraph } = Typography;
const { Item } = Form;
export default function Index({ projectId, level, CModal, name,  allLevel }) {
  const oneLevel = useSelector(selectOneLevel) // 一级
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId) // 一级默认id
  const [levelone] = useState(allLevel[0]);

  const limitlevle = allLevel.slice(0, level - 1);
  const fields = allLevel?.find(item => item.level == level)?.fields || [];
  
  const [form] = Form.useForm();
  const [nform] = Form.useForm();
  const [sfrom] = Form.useForm();
  const nref = useRef(); // 新增，编辑
  const dref = useRef(); // 删除
  
  const mapref = useRef();
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
 
  const islngLat = fields?.find(item => item.type == 1);
  const address = useRef("");
  const title = isAdd ? `新增${name}` : `编辑${name}`; // 当前层级名称  defaultParams

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


  const  CascaderSct = () => {
    const [leveloptions, setLevelOption] = useState(() => oneLevel.map(i => ({...i, children: [], isLeaf:  level - 1 == 1})) )


     // level = 2 显示前一级， = 3 显示前两两级, 依次类推
   
    const fieldNames = {
      label: 'name',
      value: 'id',
      children: 'children'
    }
    const loadData = async (selectedOptions) => {
    
      try {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        console.log(targetOption)
        targetOption.loading = true;
        let {id, level: curlevel} = targetOption // level:3 , curlevel: 2, 1
        console.log(level)
        console.log(curlevel)
        if ((level - curlevel) == 1)  {
          targetOption.children = [];
          targetOption.isLeaf = true
          setLevelOption([...leveloptions])
          return
        } else {
        const params = {
          projectId,
          level: curlevel + 1,
          parentId: id,
        }
        
      let {data, success} =  await Area.QueryAll(params) 
       targetOption.loading = false
       if (success && Array.isArray(data)) {
        let cardata = data.map(i => ({...i,  children: [], isLeaf: level - curlevel == 1}))
        targetOption.children = cardata;
        setLevelOption([...leveloptions])
        /* setLevelOption(arr => {
          let i = arr.findIndex(ar => ar.id == id);
          if (i > -1) {

          }
          arr.splice(i,1, targetOption)
          return arr
        }) */
       } else {
        targetOption.children = [];
        targetOption.isLeaf = true
        setLevelOption([...leveloptions])
       }
      }
       // targetOption.loading = false;
       
      } catch (error) {
        console.log(error)
      }
    

    }
   const onChagne =(value, selectedOptions) => {
     console.log(value)
     console.log(selectedOptions)
   }
  
    return (
      <Item label="父节点" name="parentId" rules={[
        {
          required: true,
          message: '请选择父节点'
        }
      ]}>
         <Cascader options={leveloptions} fieldNames={fieldNames} loadData={loadData} onChange={onChagne}   />
      </Item>
    )


  }
 //   级联选择 end

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
  const drawClose = () => {
    setOpen(false);
  };
  const drawopen = () => {
    setOpen(true);
  };

  const getUNselect = async ({ type = 1, areaId, alike = "" } = {}) => {
    curareaId.current = areaId;
    console.log(curareaId);
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
    } catch (error) {}
  };
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
      await getUNselect({ areaId });

      let {
        data: { deviceSummary, deviceSub },
        success: suc,
      } = await Area.QueryUsedMeter({ projectId, type: 0, areaId }); // 已选中

      if (suc && Array.isArray(deviceSummary)) {
        setDeviceSummary([...deviceSummary]);
        devices.current.deviceSub = deviceSub;
      } else {
        setDeviceSummary([]);
      }
      if (suc && Array.isArray(deviceSub)) {
        setDeviceSub([...deviceSub]);
      } else {
        setDeviceSub([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const config = async (record) => {
    try {
      setRecord({ ...record });
      deviceData(record).then(() => {
        drawopen();
      });
    } catch (error) {
      console.log(error);
    }
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows, info) => {
      devices.current.selected = selectedRows;
    },
  };
  const onMove = (type) => {
    let selected = devices.current.selected;
    const choose = (arr) =>
      arr.filter((a) => {
        return !selected.find((s) => s.id == a.id);
      });

    switch (type) {
      case 1:
        setDeviceSummary((arr) => [...arr, ...selected]);
        setUnSelected(choose);
        break;
      case 2:
        setUnSelected((arr) => [...arr, ...selected]);
        setDeviceSummary(choose);
        break;
      case 3:
        setDeviceSub((arr) => [...arr, ...selected]);
        setUnSelected(choose);
        break;
      case 4:
        setUnSelected((arr) => [...arr, ...selected]);
        setDeviceSub(choose);
        break;
      default:
        break;
    }
    devices.current.selected = [];
  };

  const configureMeter = async () => {
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
    console.log(params);
    try {
      getUNselect({ areaId: curareaId.current, ...params });
    } catch (error) {
      console.log(e);
    }
  };

  //  配置 end

  const del = (record) => {
    setRecord({ ...Record, ...record });
    dref.current.onOpen();
  };
  const delOk = async () => {
    let { areaId } = Record;
    let { success, errMsg } = await Area.DeleteArea({ projectId, areaId });
    success &&
      message.success({
        content: "删除成功",
        onClose: () => {
          dref.current.onCancel();
          refresh();
        },
      });
    !success && custMsg({ success, content: errMsg || "数据出错" });
  };

  const getTableData = () => {    
    // 列表查询
    if (isNaN(level)) return;
    
    let value = form.getFieldsValue()
   
    params = {...params, ...value }
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
        if(index > -1) header.splice(index,1)
        console.log(header)
        for (let k of header) {
          let col = {
            title: k,
            dataIndex: k,
            key: k,
          };
          cols.push(col);
        }
        let colums = [
          ...cols,
          index > -1 ?   {title: '备注', dataIndex: '备注', key: '备注'}: {},
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (_, record) => (
              <Space size={32}>
                <Link underline onClick={() => config(record)}>
                  配置
                </Link>
                <Link underline onClick={() => edit(record)}>
                  编辑
                </Link>
                <Link underline type="danger" onClick={() => del(record)}>
                  删除
                </Link>
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
        if (success && data) {
          setTableData([...formart])
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


  const add = () => {
    address.current = "";
    setIsAdd(true);
    nref.current.onOpen();
  };

  const onOk = async () => {
    // 新增、编辑

    try {
      let values = await nform.validateFields();
      let { remark, name, parentId = Record.parentId, lngLat={} } = values; // 编辑时 parentId=Record.parentId
      console.log(values)
      console.log(lngLat)
      console.log(fields)
      let parent_id = isAdd && level > 1 ?   parentId.pop() : parentId;
      let other = [];
      for (let key of fields) {
        let obj = {}
        if (key.type == 1) {
          obj = {
            name: key.name,
            value: lngLat[key.name]
          }
        }else {
          obj = {
            name: key.name,
            value: values[key.name],
         }
         
        };
        other.push(obj);
      } 
      let methods = isAdd ? "Insert" : "UpdateArea";
      let params = {
        ...defaultParams,
        remark,
        name,
        parentId: parent_id,
        id: isAdd ? 0 : Record.areaId,
        fields: other,
      };    
      let { success, errMsg } = await Area[methods](params);
      success &&
        message.success({
          content: isAdd ? "新增成功" : "编辑成功",
          onClose: () => {
            nref.current.onCancel();
            getTableData();
          },
        });
      !success && custMsg({ success, content: errMsg || "数据出错" });
    } catch (error) {
      console.log(error);
    }
  };

  const edit = (record) => {
    console.log(record)
    let lngLat = fields.filter(f => f.type == 1)?.map(i => i.name);
    
    setIsAdd(false);
    setRecord({ ...Record, ...record });
    let { 名称, 备注, areaId, ...keys } = record;
     
    nform.setFieldsValue({
      name: record["名称"],
      remark: record["备注"],
      ...keys,
    });
    for(let key of fields) {
      if(key.type == 1) {
         nform.setFieldValue(['lngLat', `${key.name}`], record[key.name]);
       }else {
         nform.setFieldValue(key.name, record[key.name]);
       }

     }
    nref.current.onOpen();
  };
  const setAaddress = (adr) => {
   let {lngLat} = nform.getFieldsValue();
   //console.log(lngLat)
   //nform.setFieldValue(['lngLat', '经纬度'], `${adr.lng},${adr.lat}`);
   
   for(let key in lngLat) {   
    console.log(lngLat[key]) 
     if(!lngLat[key]){
        nform.setFieldValue(['lngLat', `${key}`], `${adr.lng},${adr.lat}`);
        break
     }

   }
    nform.setFieldsValue({
     // 'lngLat.经纬度': `${adr.lng},${adr.lat}`,
      address: adr.address,
    });
  };
  const inputType = (f, type) => {
    switch (type) {
      case 0:
        return (
          <Item label={f} name={f}>
            <Input />
          </Item>
        );
      case 1:
        return (
          <Item label={f} name={['lngLat', f]} tooltip="为保证精度点击地图获取,清空后再重新获取" rules={[{
            required: true,
          }]} >
            <Input allowClear />
          </Item>
        );
      case 2:
        return (
          <Item label={f} name={f} tooltip="面积类数据保留两位小数" key={f}>
            <InputNumber
              step="0.01"
              precision={2}
              style={{ width: "100%" }}
              min={0}
              addonAfter="㎡"
            />
          </Item>
        );

      case 3:
        return (
          <Item label={f} name={f} tooltip="楼层数据为整数" key={f}>
            <InputNumber precision={0} style={{ width: "100%" }} />
          </Item>
        );
      default:
        return (
          <Item label={f} name={f}>
            <Input />
          </Item>
        );
    }
  };
  const tableOnchange = (e) => {
    console.log(e)
    let {current} = e
    setPagination({
      ...pagination,
      current,
    })
   // params.pageNum = current;
   // getTableData();
  }
  useEffect(() => {
    if(pagination.current > 1)  {
      getTableData()
    }
    
  }, [pagination.current])
  useEffect(() => {
   // getLevelOption();
    if (level == 1) {
      form.setFieldsValue({
        topAreaId: null,
      });
      getTableData()
    }else if (level > 1) {
      form.setFieldsValue({
        topAreaId,
      });
      getTableData()
    }
  
  }, [level]);
  
  return (
    <Mainbox ref={boxref}>
      <Form form={form} layout="inline" initialValues={{name: ""}}>
        <Space size={16}>
          {level == 1 && (
            <Form.Item name="name" label={`${name}查询`}>
              <Input.Search
                placeholder={`请输入${name}名称`}
                allowClear
                enterButton="查询"
                style={{ width: "550px" }}
                onSearch={getTableData}
              />
            </Form.Item>
          )}
          {level > 1 && (
            <>
              <Item label={`${levelone.name}名称`} name="topAreaId">
                <Select
                  options={oneLevel}
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
                <Input.Search
                  placeholder={`请输入${name}名称`}
                  allowClear
                  enterButton="查询"
                  style={{ width: "550px" }}
                  onSearch={getTableData}
                />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <CustButton style={{ justifyContent: "center" }} onClick={add}>
              +新增
            </CustButton>
          </Form.Item>
        </Space>
      </Form>
      <UserTable columns={columns}  dataSource={tabelData} pagination={pagination} onChange={tableOnchange} rowKey="areaId" />
      {/*    <UserTable columns={columns} {...tableProps} rowKey='areaId'  style={{display: level==1 ?'block' : 'none' }} /> 
          <UserTable columns={columns} {...tableProps} rowKey='areaId' style={{display: level>1 ?'block' : 'none' }} />   */}

      {/* 抽屉 */}
      {/*  devices.current.deviceSummary = [];
        devices.current.deviceSub = [] */}
      <Drawerbox
        placement="right"
        onClose={drawClose}
        open={open}
        getContainer={() => boxref.current}
        style={{ position: "absolute" }}
        closable={false}
      >
        <div className="selected">
          <div className="total">
            <p className="title">园区总表</p>
            <UserTable
              columns={deviceColumns}
              rowSelection={rowSelection}
              dataSource={deviceSummary}
              rowKey="id"
            />
          </div>
          <div className="sub">
            <p className="title">园区分表</p>
            <Space size={16}>
              <Text style={{ color: "#333" }}>设备搜索</Text>
              <Inptserach
                allowClear
                onPressEnter={handlersearch}
                placeholder="请输入设备编号/安装地址"
                onSearch={handlersearch}
              />
            </Space>
            <UserTable
              columns={deviceColumns}
              rowSelection={rowSelection}
              dataSource={deviceSub}
              rowKey="id"
            />
          </div>
        </div>
        <div className="optab">
          <div>
            <Paragraph>选中园区总表</Paragraph>
            <Space>
              <Button
                type="primary"
                icon={<LeftOutlined style={{ fontSize: "18px" }} />}
                onClick={() => onMove(1)}
              ></Button>
              <Button
                type="primary"
                icon={<RightOutlined style={{ fontSize: "18px" }} />}
                onClick={() => onMove(2)}
              ></Button>
            </Space>
          </div>
          <div>
            <Paragraph>选择园区分表</Paragraph>
            <Space>
              <Button
                type="primary"
                icon={
                  <LeftOutlined
                    style={{ fontSize: "18px" }}
                    onClick={() => onMove(3)}
                  />
                }
              ></Button>
              <Button
                type="primary"
                icon={
                  <RightOutlined
                    style={{ fontSize: "18px" }}
                    onClick={() => onMove(4)}
                  />
                }
              ></Button>
            </Space>
          </div>
          <div>
            <Button
              type="primary"
              block
              style={{ marginBottom: "16px" }}
              onClick={configureMeter}
            >
              保存
            </Button>
            <Button block onClick={drawClose}>
              关闭
            </Button>
          </div>
        </div>
        <div className="unselected">
          <p className="title">未选中的设备</p>
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
            rowSelection={rowSelection}
            dataSource={Unselected}
            rowKey="id"
          />
        </div>
      </Drawerbox>

      {/* 新增 / 编辑*/}
      <CModal
        width={islngLat ? 1024 : 554}
        title={title}
        ref={nref}
        onOk={onOk}
        mold="cust"
      >
        <Formbox
          islngLat={islngLat}
          rowes={limitlevle.length + 2 + fields.length}
          form={nform}
          size="middle"
          labelCol={{ flex: "7em" }}
          labelAlign="left"
          preserve={false}
          validateMessages={{
            required: "'${label}' 是必选字段",
          }}
        >
          {isAdd
            ?  
              
             level > 1 && <CascaderSct /> 
            : limitlevle?.map((lv, index, array) => {
                return (
                  <Item label={`${lv?.name}名称`} name={lv?.name}>
                    <Input disabled={!isAdd} />
                  </Item>
                );
              })}

          <Item
            label={`${name}名称`}
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Item>

          {fields?.map((f, index) => inputType(f.name, f.type))}
          <Item
            label="备注"
            name="remark"
          >
            <Input />
          </Item>
          {islngLat && (
            <>
              <Item
                label="地址"
                className="address"
                name="address"
                tooltip="请从地图获取地址"
              >
                <Input
                  placeholder="请从地图获取地址"
                  allowClear
                  value={address.current}
                />
              </Item>
              <div className="map">
                <Mapcom setAaddress={setAaddress} ref={mapref} />
              </div>
            </>
          )}
        </Formbox>
      </CModal>
      {/* 删除 */}
      <CModal
        width={554}
        title={`删除${name}`}
        ref={dref}
        onOk={delOk}
        type="warn"
        mold="cust"
      >
        <p>
          <WarningFilled />
          是否确认删除 <Text type="danger">{Record["名称"]}</Text>和相关信息?
        </p>
      </CModal>
    </Mainbox>
  );
}
