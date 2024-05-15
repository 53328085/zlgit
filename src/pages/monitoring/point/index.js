import React, {
  useState,
  useEffect,
  
  useRef,
  useCallback,
  
} from "react";
import { useSelector} from "react-redux";
 
import {
  
  Select,
  Radio,
  Pagination,
  Form,
  message,
  Space,
} from "antd";

import { Link, useOutletContext} from "react-router-dom";
import { useAntdTable } from "ahooks";
import styled from "styled-components";
import style from "./style.module.less";
import Icard from "./card";
import imgurl from "./images/index.js";
import { Monitoring } from "@api/api.js";
import { ExportExcel } from "@com/useButton";
import {
  selectProjectId,
  selectOneLevelDefaultId,
} from "@redux/systemconfig.js";

import Table from "@com/useTable";
import { Serach, Cdivider } from "@com/comstyled";
import Pagecount from "@com/pagecontent";
export default function Index(props) {
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  let areaId = useSelector(selectOneLevelDefaultId);
  let {exparams} = useOutletContext()
  let {deviceStyle} = exparams
 
  // const [messageApi, contextHolder] = message.useMessage();
  const {
   
    RuntimeDevice: {
      Statistics,
      Overview,
      CategoryImages,
    },
    DeviceManager: { QueryUsedDeviceCategory },
  } = Monitoring;
  // let [deviceStyle, setdeviceStyle] = useState(1)
  let [statistics, setStatistics] = useState({});
  let [overView, setoverView] = useState({
    details: undefined,
    categories: undefined,
  });


  let [optionsGateway, setoptionsGateway] = useState([]);  
  const [isCard, setisCard] = useState(true); //卡片模式true或列表模式false
  let [total, setTotal] = useState(0);
  let [imageList, setimageList] = useState([]);
  


 
  const showTotal = (total) => `共 ${total} 条记录`;
 
  const columns = [
    {
      title: "设备编号",
      dataIndex: "sn",
      render: (sn) => (
        <Link
          to={{
            pathname: "/deviceDetail",
            search: `?sn=${encodeURIComponent(sn)}`,
          }}
          target="_blank"
        >
          {sn} 
        </Link>
      ),
      key: "sn",
      id: "id",
    },
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
      id: "id",
    },
    {
      title: "设备型号",
      dataIndex: "category",
      key: "category",
      id: "id",
    },
    {
      title: "设备状态",
      dataIndex: "state",
      render: (state) => (
        <span> {state == 1 ? "失联" : state == 2 ? "在线" : "告警"}</span>
      ),
      key: "state",
      id: "id",
    },
    {
      title: "安装地址",
      dataIndex: "address",
      key: "address",
      id: "id",
    },
    {
      title: "更新时间",
      dataIndex: "lastSampleTime",
      key: "lastSampleTime",
      id: "id",
    },
  ];
  
  const getData = () => {
    // 表计状态
    Statistics({
      projectId: projectId,
      areaId:  areaId,
      deviceStyle: deviceStyle,
    }).then((res) => {
      let { success, data } = res;
      if (success) {
        setStatistics(data || []);
      } else {
        message.error(res.errMsg);
      }
    });
  };
  const getGatewayUsed = () => {
    // 表计型号
    QueryUsedDeviceCategory({
      projectId: projectId,
      deviceStyle: deviceStyle,
    }).then((res) => {
      let { success, data } = res;
      if (success) {
        setoptionsGateway(data || []);
      } else {
        message.error(res.errMsg);
      }
    });
  };
  let initparams = useRef();
  console.log(initparams)
  const getOverviewData = ({ current, pageSize }, formData) => {
    initparams.current = {
      projectId,
      areaId,
      deviceStyle,
      pageNum: current,
      pageSize,
      ...formData,
    }
   

    return Overview(initparams.current).then((res) => {
      let { success, data, total} = res;
      if (success) {
        setoverView(data || []);
        setTotal(total);
     
        let overViewList = [];
        data?.details?.map((item) => {
          let description = "";
          item.fields.map((items) => {
            description += items.name + " " + items.value + " ";
          });
          overViewList.push({ ...item, description: description });
        });
        return {
          total,
          list:overViewList,
        };
      } else {
        message.error(res.errMsg);
        return {
          total: 0,
          list: [],
        };
      }
    });
  };
  const { tableProps, search, run } = useAntdTable(getOverviewData, {
    form,
    defaultPageSize: 12,
    refreshDeps: [areaId, deviceStyle, projectId],
  });

  const { submit } = search; 
  const getGatewayImages = () => {
    //网关图片
    CategoryImages({ projectId: projectId, group: overView.categories }).then(
      (res) => {
        let { success, data } = res;
        if (success) {
          if (data != []) {
            let imgList = [];
            overView?.details?.map((item, index) => {
              data.map((items, indexs) => {
                if (data[indexs].category == item.category) {
                  imgList.push(data[indexs].imageBase64);
                } else {
                }
              });
            });
            setimageList(imgList);
          }
        } else {
          message.error(res.errMsg);
        }
      }
    );
  };

 

  const changeTab = (val) => {   
    setisCard(val.target.value == "card" ? true : false);
   
  }; 
  const onExport = useCallback(() => {
    initparams.current.pageSize = total
    initparams.current.pageNum = 1
    return Overview(initparams.current).then((res) => {
      let { success, data, total } = res;
      if (success) {
        let overViewList=[]
        data?.details?.map(item=>{
          let description=''
          item.fields.map(items=>{
             description+=items.name+' '+items.value+' '
          })
          overViewList.push({...item,description:description})
        })
        return {
          list: overViewList,
          total,
        };
      } else {
        message.error(res.errMsg);
        return {
          list: [],
          total: 0,
        };
      }
    }).catch(e => {
      console.log(e)
    });
  }, [total]);


  useEffect(() => {
    if (Number.isFinite(areaId) && Number.isFinite(deviceStyle) && Number.isFinite(projectId)) {
      getData();
      getGatewayUsed();
    }
  }, [areaId, deviceStyle, projectId]);

  useEffect(() => {
    if (overView.categories) {
      getGatewayImages();
      console.log(456);
    }
  }, [overView.categories]);
  const changepage = (current, pageSize) => {
    try {
      let values = form.getFieldsValue();
      run({ current, pageSize }, values);
    } catch (error) {}
  };
  return (
    <Pagecount>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Form
          layout="line"
          form={form}
          style={{ display: "flex", justifyContent: "space-between" }}
          initialValues={{
            alike: '',
            category: '',
            state: 0
          }}
        >
          <Space size={64} split={<Cdivider />}>
            <Form.Item
              label="表计查询"
              name="alike"
              style={{ marginBottom: 0 }}
            >
              <Serach
                size="middle"
                placeholder="输入设备名称/表计编号/安装地址"
                style={{ width: "340px" }}
                allowClear
                enterButton="查询"
                onSearch={submit}
              />
            </Form.Item>
            <Form.Item
              label="表计型号"
              name="category"
              style={{ marginBottom: 0 }}
            >
              <Select              
                style={{
                  width: 200,
                }}
                onChange={submit}
              >
                <Select.Option value={""}>全部型号</Select.Option>
                {optionsGateway.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="表计状态"
              name="state"
              style={{ marginBottom: 0 }}
            >
              <Select
                style={{
                  width: 200,
                }}
                onChange={submit}
                options={[
                  {
                    value: 0,
                    label: "全部(" + statistics.all + ")",
                  },
                  {
                    value: 2,
                    label: "正常(" + statistics.on + ")",
                  },
                  {
                    value: 1,
                    label: "失联(" + statistics.off + ")",
                  },
                  {
                    value: 3,
                    label: "告警(" + statistics.alarm + ")",
                  },
                ]}
              />
            </Form.Item>
          </Space>
          <Space size={16} style={{ marginLeft: "auto" }}>
            <Radio.Group
              onChange={changeTab}
              defaultValue="card"
              buttonStyle="solid"
            >
              <Radio.Button
                style={{ width: "96px", marginLeft: 16, textAlign: "center" }}
                value="card"
              >
                卡片模式
              </Radio.Button>
              <Radio.Button
                style={{ width: "96px", textAlign: "center" }}
                value="list"
              >
                列表模式
              </Radio.Button>
            </Radio.Group>
            <ExportExcel disabled={isCard} tb={tableLoadRef} />           
          </Space>
        </Form>
        <Cdivider type="h" margin="16px 0" />
        {isCard ? (
          <div className={style.cardBox}>
            {tableProps?.dataSource?.length > 0 ?
                tableProps?.dataSource.map((item, index) => {
                  let status =
                    Object.prototype.toString.call(item.status) ===
                    "[object Object]"
                      ? item.status[1]
                      : "";
                  return (
                    <div key={index}>
                      <Link
                        to={`/deviceDetail?sn=${encodeURIComponent(item.sn)}&deviceStyle=${encodeURIComponent(deviceStyle)}`}
                        target="_blank"
                      >
                        <Icard
                          img={
                            imageList[index]
                              ? imageList[index]
                              : imgurl.category
                          }
                          title={item.name}
                          deviceStyle={deviceStyle}
                          value={item.address}
                          state={item.state}
                          fields={item.fields}
                          lastSampleTime={item.lastSampleTime}
                          category={item.sn}
                        />
                      </Link>
                    </div>
                  );
                })
              : ""}
          </div>
        ) : (
            <Table
              columns={columns}
              {...tableProps}
              rowKey={(columns) => columns.id}
              ref={tableLoadRef}
              onExport={onExport}
              sheetName="设备监测"
             expandable={{
                expandedRowRender: (record) => (
                  <p
                    style={{
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {record.description}
                  </p>
                ),
                rowExpandable: (record) => record.description,
              }} 
            ></Table>
          
        )}
        {isCard && (
          <Pagination
            style={{ marginLeft: "auto" }}
            size="small"
            onChange={changepage}
            showTotal={showTotal}
            {...tableProps.pagination}
            showSizeChanger={false}
          />
        )}
      </div>
    </Pagecount>
  );
}
