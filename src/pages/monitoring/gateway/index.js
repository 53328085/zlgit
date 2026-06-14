import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import styled, {css} from "styled-components";
import { Select, Radio, Pagination, message, Space, Form, Typography} from "antd";

import { Link } from "react-router-dom";
import { useAntdTable } from "ahooks";
import {CustTransO, i18t, i18warning,ExportExcel, RadioT} from "@com/useButton"
import {isLightColor} from "@com/usehandler"
//import Icard from "./card";
import Icard from "@com/commIcard.jsx"
import imgurl from "./images/index.js";
import { Monitoring } from "@api/api.js";
import {
  selectProjectId,
  selectOneLevelDefaultId,
  adaptation,
  themeColor
} from "@redux/systemconfig.js";
 
 
import Table from "@com/useTable";
import { Serach, Cdivider, CPagination } from "@com/comstyled";
import Pagecount from '@com/pagecontent' 
 
const sty = css`
  grid-template-columns: repeat(auto-fill, minmax(438px, 1fr));
  .cardItem{
    .cardImg {
      width: 98px;
      height: 98px;
    }
  }
`
const Cardbox = styled.div`
 display: grid;
    grid-template-columns: repeat(auto-fill, minmax(538px,1fr)); 
    gap: 16px;  
${props=> props.laptop ? sty : null}
`
 
export default function Index(props) {
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  let areaId = useSelector(selectOneLevelDefaultId);
  const {laptop} = useSelector(adaptation)
  const {primaryderived} = useSelector(themeColor)
  
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
      title: i18t("comm","sn",{text:"网关"}),
      dataIndex: "sn",
      key: "sn",
      id: "id",
    },
     {
      title:  "网关名称",
      dataIndex: "name",
      key: "name",
      id: "id",
    },
    {
      title: i18t("comm","category",{text:"网关"}),
      dataIndex: "category",
      key: "category",
      id: "id",
    },
    {
      title:  i18t("comm","netwoker"),
      dataIndex: "state",
      render: (text) => <Typography.Text type={text==2 ? "success" : "secondary"}> {text === 2 ? i18t("overview","online") : i18t("overview","offline")} </Typography.Text>,
      key: "state",
      id: "id",
    },
    {
      title: i18t("comm","connection"),
      dataIndex: "connMethod",
      key: "connMethod",
      id: "id",
    },
    {
      title: i18t("comm","childdevice"),
      dataIndex: "childrenCnt",
      key: "childrenCnt",
      id: "id",
    },
    {
      title: i18t("comm","address"),
      dataIndex: "address",
      key: "address",
      id: "id",
    },
    {
      title: i18t("comm","updateTime"),
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
    
    
      getData();
    
  }, []);

  
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
  //  if(!(isFinite(areaId) && isFinite(projectId))) return;
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
    }).catch(e=>{
      console.log(e)
    });
  };

  const { tableProps, search: hanlder, run} = useAntdTable(getOverviewData, {
    form,
    defaultPageSize: 12,
    refreshDeps: [projectId, areaId],
  });
  
  const { submit } = hanlder;
   
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
            layout={laptop ? "vertical" : "line"}
            form={form}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between"
            }}
            initialValues={{
              alike: '',
              category: '',
              state: 0
            }}
          >
            <Space size={16}>             
                <Form.Item name="alike" label={i18t("comm","Query",{text:"网关"})} style={{marginBottom: 0}}  >
                  <Serach
                    size="middle"
                    placeholder={i18t("comm","placeholder",{text:"网关编号/安装地址"})}    // "输入网关编号/安装地址"
                    style={{ width: laptop ? "200px" : "340px" }}
                    allowClear
                    onSearch={submit}
                  />
                </Form.Item>
              <Form.Item label={i18t("comm","category",{text:"网关"})} name="category" style={{marginBottom: 0}}>
                <Select
                  style={{
                    width: laptop ? 180 : 200,
                  }}
                  onChange={submit}
                >
                  <Select.Option value={""}>{i18t("comm","All",{text:" "})}</Select.Option>
                  {optionsGateway.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.category}>
                       {item.category}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              
                <Form.Item label={i18t("comm","Status",{text:"网关"})} name="state" style={{marginBottom: 0}}>
                  <Select
                    style={{
                      width: laptop ? 100 : 200,
                    }}
                    onChange={submit}
                    options={[
                      {
                        value: 0,
                        label:
                        `${i18t("comm","All")}(` +
                          (statistics.all == undefined ? 0 : statistics.all) +
                          ")",
                      },
                      {
                        value: 2,
                        label:
                         `${i18t("comm","online")}(` + 
                          (statistics.on == undefined ? 0 : statistics.on) +
                          ")",
                      },
                      {
                        value: 1,
                        label:
                         `${i18t("overview","offline")}(` +
                          (statistics.off == undefined ? 0 : statistics.off) +
                          ")",
                      },
                    ]}
                  />
                </Form.Item>
              
            </Space>
            <Space size={ laptop ? 8 :16} style={{ marginLeft: "auto" }}>
              <RadioT onChange={changeTab} /> 
              <ExportExcel disabled={isCard} tb={tableLoadRef} />
            </Space>
          </Form> 
      
        {isCard ? (
          <Cardbox laptop={laptop} >
            {  tableProps?.dataSource?.length > 0 ?   tableProps?.dataSource?.map((item, index) => {
              return (
                <div key={index} >
                  <Link to={`/gatewayDetail?sn=${item.sn}`} target="_blank">
                    <Icard
                      img={
                        imageList[index]
                          ? "data:image/png;base64," + imageList[index]
                          : imgurl.category
                      }
                      title={item.sn}
                      value={item.sn}
                      state={item.state}
                      childrenCnt={item.childrenCnt}
                      connMethod={item.connMethod}
                      lastSampleTime={item.lastSampleTime}
                      category={item.category}
                      name={item.name}
                      device={1}
                    />
                  </Link>
                </div>
              );
            })
            : null
          }
          </Cardbox>
        ) : (
          <div  style={{flex: 1, display: 'flex'}}>
            <Table
              columns={columns}
              {...tableProps}
              rowKey={(columns) => columns.sn+columns.category}
              ref={tableLoadRef}
              onExport={onExport}
              sheetName="网关监测"
            ></Table>
          </div>
        )}
     { isCard && <CPagination style={{marginLeft: 'auto', marginTop: "auto"}} size="small"  onChange={changepage}   {...tableProps.pagination} showSizeChanger={false}/>  }
      </div>
    </Pagecount>
  );
}
