import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Select, Radio, Pagination, message, Space, Form} from "antd";

import { Link } from "react-router-dom";
import { useAntdTable } from "ahooks";

import style from "./style.module.less";
import Icard from "./card";
import imgurl from "./images/index.js";
import { Monitoring } from "@api/api.js";
import {
  selectProjectId,
  selectOneLevelDefaultId,
} from "@redux/systemconfig.js";
import { ExportExcel } from "@com/useButton";
import Table from "@com/useTable";
import { Serach, Cdivider } from "@com/comstyled";
import Pagecount from '@com/pagecontent' 

const Mainbxox = styled.div`
  && {
    flex: 1;
    display: flex;
    flex-direction: column;
    
  }

`
export default function Index(props) {
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  let areaId = useSelector(selectOneLevelDefaultId);

  const {
    RuntimeGateway: { RuntimeGatewayStatistics, Overview, CategoryImages },
    DeviceManager: { QueryUsedGateway },
  } = Monitoring;
   
  let [statistics, setStatistics] = useState({});
 

  let [optionsGateway, setoptionsGateway] = useState([]);

  const [isCard, setisCard] = useState(true); //卡片模式true或列表模式false
 
  let [imageList, setimageList] = useState([]);
  
  const [total, setTotal] = useState(0)
  // let [arr,setArr] = useState([])
 
  const columns = [
    {
      title: "网关编号",
      dataIndex: "sn",
      key: "sn",
      id: "id",
    },
    {
      title: "网关型号",
      dataIndex: "category",
      key: "category",
      id: "id",
    },
    {
      title: "网络连接",
      dataIndex: "state",
      render: (text) => <span> {text === 2 ? "在线" : "离线"} </span>,
      key: "state",
      id: "id",
    },
    {
      title: "联网方式",
      dataIndex: "connMethod",
      key: "connMethod",
      id: "id",
    },
    {
      title: "子设备",
      dataIndex: "childrenCnt",
      key: "childrenCnt",
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
    //设备统计
    RuntimeGatewayStatistics({ projectId, areaId })
      .then((res) => {
        let { success, data } = res;
        if (success) {
          setStatistics(data|| {});
        } else {
          setStatistics({});
          message.error(res.errMsg);
        }
      })
      .catch(() => {
        setStatistics({});
      });
  };

  const getGatewayUsed = () => {
    //使用的网关
    QueryUsedGateway(projectId)
      .then((res) => {
        let { success, data } = res;
        if (success) {
          setoptionsGateway(Array.isArray(data) ? data : []);
        } else {
          setoptionsGateway([]);
          message.error(res.errMsg);
        }
      })
      .catch(() => {
        setoptionsGateway([]);
      });
  };
  useEffect(() => {
    getGatewayUsed();
  }, []);
  useEffect(() => {
    console.log(areaId)
    if (Number.isFinite(areaId)) {
      getData();
    }
  }, [areaId]);

  
  const getGatewayImages = (categories, details) => {
    //网关图片
    if (details.length < 1) {
      setimageList([])
      return
    }
    CategoryImages({ projectId: projectId, group: categories }).then(
      (res) => {
        let { success, data } = res;
        if (success) {
          if (data != []) {
            let imgList = [];
           details.map((item, index) => {
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
  const  params =useRef({
    projectId: projectId,
    areaId: areaId,
    category: '',
    alike: '',
    state: '',
    pageNum: 1,
    pageSize: 14,
  })
  const getOverviewData = ({ current, pageSize }, formData) => {
    //设备统计
    if(!(isFinite(areaId) && isFinite(projectId))) return;
    let { category, alike, state } = formData;
    params.current ={
      projectId,
      areaId,
      pageNum: current,
      pageSize: pageSize,
      alike,
      state,
      category
    }
    return Overview(params.current).then((res) => {
      let { success, data, total } = res;
      setTotal(Number.isFinite(total) ? total : 0)
      if (success) {
        let { details, categories } = data || {}
        let list = Array.isArray(details) ? details : [];
        let cates = Array.isArray(categories) ? categories : [];
        getGatewayImages(cates, list)
        return {
          list,
          total: Number.isFinite(total) ? total : 0,
        };
      } else {
        
        return {
          list: [],
          total: 0,
        };
      }
    });
  };

  const { tableProps, search: hanlder, run} = useAntdTable(getOverviewData, {
    form,
    defaultPageSize: 12,
    refreshDeps: [projectId, areaId],
  });
  
  const { submit } = hanlder;
  const showTotal =(total) =>  `共 ${total} 条记录`;
  const onExport = useCallback(() => {
    params.current.pageSize = total
    params.current.pageNum = 1
    return Overview(params.current).then((res) => {
      let { success, data, total } = res;
      if (success) {
        return {
          list: data.details || [],
          total,
        };
      } else {
        message.error(res.errMsg);
        return {
          list: [],
          total: 0,
        };
      }
    });
  }, [total]);


  const changeTab = (val) => {
    setisCard(val.target.value == "card" ? true : false);
    
    //  getOverviewData()
  }; //切换卡片列表模式
 const changepage = (current, pageSize) => {
    try {
       let values = form.getFieldsValue();
        run({current, pageSize}, values)
    } catch (error) {
      
    }
 }
  return (
    <Pagecount>
        <div className="flexcol">
       
          <Form
            layout="line"
            form={form}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
            initialValues={{
              alike: '',
              category: '',
              state: 0
            }}
          >
            <Space size={64} split={<Cdivider />}  >             
                <Form.Item name="alike" label="网关查询" style={{marginBottom: 0}}  >
                  <Serach
                    size="middle"
                    placeholder="输入网关编号/安装地址"
                    style={{ width: "340px" }}
                    allowClear
                    onSearch={submit}
                  />
                </Form.Item>
              <Form.Item label="网关型号" name="category" style={{marginBottom: 0}}>
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
              
                <Form.Item label="网关状态" name="state" style={{marginBottom: 0}}>
                  <Select
                    style={{
                      width: 200,
                    }}
                    onChange={submit}
                    options={[
                      {
                        value: 0,
                        label:
                          "全部(" +
                          (statistics.all == undefined ? 0 : statistics.all) +
                          ")",
                      },
                      {
                        value: 2,
                        label:
                          "正常(" +
                          (statistics.on == undefined ? 0 : statistics.on) +
                          ")",
                      },
                      {
                        value: 1,
                        label:
                          "失联(" +
                          (statistics.off == undefined ? 0 : statistics.off) +
                          ")",
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
            {  tableProps?.dataSource?.length > 0 ?   tableProps?.dataSource?.map((item, index) => {
              return (
                <div key={index}>
                  <Link to={`/gatewayDetail?sn=${item.sn}`} target="_blank">
                    <Icard
                      img={
                        imageList[index]
                          ? "data:image/png;base64," + imageList[index]
                          : imgurl.category
                      }
                      title={item.sn}
                      value={item.address}
                      state={item.state}
                      childrenCnt={item.childrenCnt}
                      connMethod={item.connMethod}
                      lastSampleTime={item.lastSampleTime}
                      category={item.category}
                      name={item.name}
                    />
                  </Link>
                </div>
              );
            })
            : null
          }
          </div>
        ) : (
          <div  style={{flex: 1, display: 'flex'}}>
            <Table
              columns={columns}
              {...tableProps}
              rowKey={(columns) => columns.id}
              ref={tableLoadRef}
              onExport={onExport}
              sheetName="网关监测"
            ></Table>
          </div>
        )}
     { isCard && <Pagination style={{marginLeft: 'auto'}} size="small"  onChange={changepage}  showTotal={showTotal}  {...tableProps.pagination} showSizeChanger={false}/>  }
      </div>
    </Pagecount>
  );
}
