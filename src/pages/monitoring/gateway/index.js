import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import styled, {css} from "styled-components";
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
  adaptation
} from "@redux/systemconfig.js";
import { ExportExcel } from "@com/useButton";
 
import Table from "@com/useTable";
import { Serach, Cdivider, CPagination } from "@com/comstyled";
import Pagecount from '@com/pagecontent' 
import bgi from "./images/bgi.png"
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
    grid-template-columns: repeat(3, 538px);
    grid-template-rows: repeat(4, 156px);
    gap: 16px;
    justify-content: space-between;
   
    .cardItem {
    height: 156px;
    background-color: #fff;
    border: 1px solid rgb(215, 215, 215);
    border-radius: 4px;
    //  margin-right: 16px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    justify-content: flex-start;
    background-image: url(${bgi});
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;

   
    .cardImg {
        width: 128px;
        height: 128px;
    }

    .ItemValue {
       // margin-left: 12px;
      //  margin-right: auto;
      padding-right: 8px;
      flex:1;
        text-align: left;
      //  width: 100%;
        display: flex;
        flex-direction: column;      
        justify-content: space-around;

        .valueTitle {
            display: flex;
            align-items: center;
            column-gap: 32px;
            font-size: 14px;
            color: #000;
            font-weight: 700;
            text-align: left;
            align-self: flex-start;
            
        }

        .valueData {
            //margin-top: 10px;
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
        }

        .btnStyle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            column-gap: 8px;
       
            .btnBoxStyle {
                flex: auto;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border-radius: 24px;
             
                border: 1px solid rgb(215, 215, 215);
                height: 24px;
                border-radius: 40px;
                background-color: rgba(0, 0, 51, 1);
                color: #33FF00;
            }

            .timeStyle {
                flex: auto;
                height: 24px;
                font-size: 12px;
                color: #fff;
                line-height: 24px;
                
            }

            .timeValueStyle {
                float: auto;
                height: 24px;
                font-size: 14px;
                text-align: center;
                line-height: 24px;
            }
        }
        .btnBoxStyle {
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
    border-radius: 40px;
    background-color: rgba(0, 0, 51, 1);

    .timeStyle {
        flex: auto;
        height: 24px;
        font-size: 12px;
        color: #fff;
        line-height: 24px;
        padding-left: 10px;
    }

    .timeValueStyle {
        flex: auto;
        height: 24px;
        color: #33FF00;
        font-size: 14px;
        text-align: left;
        line-height: 24px;
        padding-right: 10px;
    }
}
    }

    .boxCard {
        width: 200px;
        height: 112px;
        position: absolute;
        right: 5px;
        background-color: rgba(242, 242, 242, 0.75);
        border: 1px solid rgb(228, 228, 228);
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        padding: 16px;

        p {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .state {
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: rgb(0, 153, 102);
        color: #fff;
        width: 65px;
        text-align: center;
        font-size: 14px;
    }

    .stateOff {
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: rgb(0102, 102, 102);
        color: #fff;
        width: 65px;
        text-align: center;
        font-size: 14px;
    }
}
${props=> props.laptop ? sty : null}
`
 
export default function Index(props) {
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  let areaId = useSelector(selectOneLevelDefaultId);
  const {laptop} = useSelector(adaptation)
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
            <Space size={laptop ? 16 : 64} split={laptop ? "" :<Cdivider />}  >             
                <Form.Item name="alike" label="网关查询" style={{marginBottom: 0}}  >
                  <Serach
                    size="middle"
                    placeholder="输入网关编号/安装地址"
                    style={{ width: laptop ? "200px" : "340px" }}
                    allowClear
                    onSearch={submit}
                  />
                </Form.Item>
              <Form.Item label="网关型号" name="category" style={{marginBottom: 0}}>
                <Select
                  style={{
                    width: laptop ? 180 : 200,
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
                      width: laptop ? 100 : 200,
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
            <Space size={ laptop ? 8 :16} style={{ marginLeft: "auto" }}>
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
          <Cardbox laptop={laptop}>
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
          </Cardbox>
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
     { isCard && <CPagination style={{marginLeft: 'auto', marginTop: "auto"}} size="small"  onChange={changepage}   {...tableProps.pagination} showSizeChanger={false}/>  }
      </div>
    </Pagecount>
  );
}
