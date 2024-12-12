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

import { Link, useOutletContext, useLocation} from "react-router-dom";
import { useAntdTable } from "ahooks";
import styled, {css} from "styled-components";
import style from "./style.module.less";
import Icard from "./card";
import imgurl from "./images/index.js";
import { Monitoring } from "@api/api.js";
import { ExportExcel } from "@com/useButton";
import {
  selectProjectId,
  selectOneLevelDefaultId,
  deviceState,
  adaptation
} from "@redux/systemconfig.js";

import Table from "@com/useTable";
import { Serach, Cdivider,  CPagination} from "@com/comstyled";
import bgi from "./images/bgi.png"
import Pagecount from "@com/pagecontent";
const channel = new BroadcastChannel('my-channel')
const sty =css`
grid-template-columns: repeat(auto-fill, minmax(438px, 1fr));
gap: 16px;
  flex: 1;
  .cardItem{
    .cardImg {
      width: 98px;
      height: 98px;
    }
  }
  

 
`
const Cardbox=styled.div`
 display: grid;
    grid-template-columns: repeat(3, 538px);
    grid-template-rows: repeat(4, 152px);
    row-gap: 16px;
    justify-content: space-between;
 
    .cardItem {
  //  width: 538px;
    height: 152px;
    background-color: #fff;
    border: 1px solid rgb(215, 215, 215);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: url(${bgi});
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    .warning {
        width: 14px;
        height: 14px;
        background-color: #08bf00;
       // border: 1px solid rgba(0,0,0,0.2);
        border-radius: 50%;
        position: absolute;
        top: 8px;
        left: 8px;
        animation: flicker 600ms  infinite linear;
    }
    .warningred {
        width: 14px;
        height: 14px;
        background-color: #f13c3c;
      //  border: 1px solid rgba(0,0,0,0.2);
        border-radius: 50%;
        position: absolute;
        top: 8px;
        left: 8px;
        animation: flicker 600ms  infinite linear;
    }
  /*   .cardImgBox {
        width: 128px;
        height: 128px;
      
        display: flex;
        align-items: center;
        justify-content: center;
    } */

    .cardImg {
        width: 128px;
        height: 128px;
        // margin-left: 24px;
        // background-color: #237ae4;
    }

    .ItemValue {
      
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;

        .valueTitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: #000;
            font-weight: 700;
            text-align: left;
            width: 96%;
            span{
                width: 183px;
            }
        }

        .valueData {
            //margin-top: 10px;
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
        }

        .btnStyle {
            display: grid;
            grid-template-columns: repeat(2, 200px);
            grid-template-rows: repeat(2, 35px);
            margin-top: 10px;

            .btnBoxStyle {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border-radius: 93px;
                width: 196px;
                border: 1px solid rgb(215, 215, 215);
                height: 24px;
                padding-left: 10px;
                padding-right: 10px;
                border-radius: 40px;
                background-color: rgba(0, 0, 51, 1);
                color: #33FF00;
            }

            .timeStyle {
                width: 85px;
                height: 22px;
                font-size: 12px;
                color: #fff;
                line-height: 22px;
                border-radius: 40px;
                z-index: 10;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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
    .stateAlarm{
        position: absolute;
        top: 4px;
        right: -18px;
        transform: rotate(45deg);
        background-color: rgb(255, 77, 79);
        color: #fff;
        width: 65px;
        text-align: center;
        font-size: 14px;
    }
}

    .btnBoxStyle {
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;

   
}
${props=> props.laptop ? sty : null}
  
`

export default function Index(props) {
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  let areaId = useSelector(selectOneLevelDefaultId);
  let {exparams} = useOutletContext()
  let {deviceStyle} = exparams
  const dstate = useSelector(deviceState)
  let {laptop} = useSelector(adaptation)
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
 
  channel.onmessage = (event) => {
    console.log('Received message:', event);
    event.data&&getGatewayImages()
    event.data&&submit()
    
  };

 
  
 
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
    // 设备状态
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
    // 设备型号
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
  const getOverviewData = ({ current, pageSize }, formData) => {
    let f = [areaId, deviceStyle, projectId].every(s => Number.isInteger(s))
    if(!f) return;
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
                  //imgList.push(data[indexs].imageBase64);
                  imgList.push(data[indexs]);
                } else {
                }
              });
            });
            console.log(imgList)
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
      console.log(deviceStyle,"----deviceStyle")
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
  useEffect(()=>{
    console.log("dstate",dstate)
  },[dstate])
  return (
    <Pagecount>
      <div className="flexcol">
        <Form
          layout={laptop ? "vertical" : "line"}
          form={form}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
          initialValues={{
            alike: '',
            category: '',
            state: 0
          }}
        >
          <Space size={laptop ? 16 : 64} split={laptop ? "" :<Cdivider />} >
            <Form.Item
              label="设备查询"
              name="alike"
              style={{ marginBottom: 0 }}
            >
              <Serach
                placeholder="输入设备名称/设备编号/安装地址"
                style={{ width: laptop ? "280px" : "340px" }}
                onSearch={submit}
              />
            </Form.Item>
            <Form.Item
              label="设备型号"
              name="category"
              style={{ marginBottom: 0 }}
            >
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
            <Form.Item
              label="设备状态"
              name="state"
              style={{ marginBottom: 0 }}
            >
              <Select
                style={{
                  width: laptop ? 100 : 200,
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
          <Space size={laptop ? 8 :16} style={{ marginLeft: "auto" }}>
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
            {tableProps?.dataSource?.length > 0 ?
                tableProps?.dataSource.map((item, index) => { // state 1, 离线 2 在线 3 告警; states 
                /*   let status =
                    Object.prototype.toString.call(item.status) ===
                    "[object Object]"
                      ? item.status[1]
                      : ""; */
                  let imgbase =(Array.isArray(imageList) && imageList?.length > 0) ? imageList?.find(i => i.category == item.category) : null
                  let {closeImageBase64, imageBase64, openImageBase64} = imgbase ?? {}
                  return (
                    <div key={index}>
                      <Link
                        to={`/deviceDetail?sn=${encodeURIComponent(item.sn)}&deviceStyle=${encodeURIComponent(deviceStyle)}`}
                        target="_blank"
                      >
                      
                        <Icard
                          img={
                            !imgbase ? imgurl.category: (openImageBase64 && item.status?.["1"]=="Open")?
                           openImageBase64: (closeImageBase64 && item.status?.["1"]=="Close")?
                           closeImageBase64:  (imageBase64 || imgurl.category)
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
          </Cardbox>
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
          <CPagination
            style={{ marginLeft: "auto", marginTop: "auto" }}
            size="small"
            onChange={changepage}          
            {...tableProps.pagination}
            showSizeChanger={false}
          />
        )}
      </div>
    </Pagecount>
  );
}
