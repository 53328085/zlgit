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
 
import imgurl from "./images/index.js";
import { Monitoring } from "@api/api.js";
import CommIcard from "@com/commIcard.jsx"
import {CustTransO, i18t, i18warning,ExportExcel, RadioT} from "@com/useButton"
import {
  selectProjectId,
  selectOneLevelDefaultId,
  deviceState,
  adaptation,
  themeColor
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
    grid-template-columns: repeat(auto-fill, minmax(438px, 1fr));
 //   grid-template-rows: repeat(4, 152px);
  //  row-gap: 16px;
    gap:16px;
    justify-content: space-between;
 
${props=> props.laptop ? sty : null}
  
`

export default function Index(props) {
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  let areaId = useSelector(selectOneLevelDefaultId);
  const {primaryderived} = useSelector(themeColor)
 
  let {exparams} = useOutletContext()
  let {deviceStyle} = exparams
  
  const dstate = useSelector(deviceState)
  let {laptop} = useSelector(adaptation)
  const category = Form.useWatch("category", form);

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
      title: i18t("comm","sn",{text:"设备"}),
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
      title: i18t("comm","name",{text:"设备"}),
      dataIndex: "name",
      key: "name",
      id: "id",
    },
    {
      title: i18t("comm","category",{text:"设备"}),
      dataIndex: "category",
      key: "category",
      id: "id",
    },
    {
      title: i18t("comm","Status",{text:"设备"}),
      dataIndex: "state",
      render: (state) => (
        <span> {state == 1 ? "失联" : state == 2 ? "在线" : "告警"}</span>
      ),
      key: "state",
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
    }).then(()=>{
      form.setFieldsValue({
        category: "",
      });
    });
  };
  let initparams = useRef(); 
  const getOverviewData = ({ current, pageSize }, form) => {
    const {category:cate,...formData} = form
    let f = [areaId, deviceStyle, projectId].every(s => Number.isInteger(s)) && typeof category=="string"
    if(!f) return;
    initparams.current = {
      projectId,
      areaId,
      deviceStyle,
      pageNum: current,
      pageSize,
      category,
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
    refreshDeps: [areaId, deviceStyle, projectId,category],
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
          <Space size={16}>
            <Form.Item
              label={i18t("comm","Query",{text:"设备"})}
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
              label={i18t("comm","category",{text:"设备"})}
              name="category"
              style={{ marginBottom: 0 }}
            >
              <Select              
                style={{
                  width: laptop ? 180 : 200,
                }}
              >
                <Select.Option value={""}>{i18t("comm","All",{text:""})}</Select.Option>
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
              label={i18t("comm","Status",{text:"设备"})}
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
                    label: `${i18t("comm","All")}(` + statistics.all + ")",
                  },
                  {
                    value: 2,
                    label:  `${i18t("comm","normal")}(` + statistics.on + ")",
                  },
                  {
                    value: 1,
                    label: `${i18t("overview","offline")}(` + statistics.off + ")",
                  },
                  {
                    value: 3,
                    label: `${i18t("comm","alarm", {text: "", text2: ""})}(` + statistics.alarm + ")",
                  },
                ]}
              />
            </Form.Item>
          </Space>
          <Space size={laptop ? 8 :16} style={{ marginLeft: "auto" }}>
            <RadioT onChange={changeTab} />
           {/*  <Radio.Group
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
            </Radio.Group> */}
            <ExportExcel disabled={isCard} tb={tableLoadRef} />           
          </Space>
        </Form> 
        {isCard ? (
          <Cardbox laptop={laptop} >
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
                      
                        <CommIcard
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
                          device={2}
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
