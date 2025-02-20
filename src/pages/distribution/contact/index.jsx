import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useStore, useDispatch } from "react-redux";

import {
  Input,
  Button,
  Select,
  Radio,
  Pagination,
  FormTable,
  message,
  Space,
  Divider,
  Form,
} from "antd";

import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useRequest } from "ahooks";
import style from "./style.module.less";
import Icard from "./card";
import imgurl from "./images/index.js";
import {
  Monitoring,
  distributionRoom,
  DistributionRoomRuntime,
} from "@api/api.js";
import { ExportExcel } from "@com/useButton";
import { selectProjectId, selectcurlRommid ,adaptation} from "@redux/systemconfig.js";

import Table from "@com/useTable";
import Pagecount from "@com/pagecontent";
import { Serach, Cdivider, Borderleft } from "@com/comstyled";
const Mainbox = styled.div`
  && {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .bottomTab {
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;

      .radioBox {
        position: absolute;
        right: 0;
      }
    }
    .cardBox {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(458px, 1fr));
      grid-auto-rows: 152px;
     // grid-template-rows: repeat(4, 152px);
       gap: 16px;
      justify-content: space-between;
    }
  }
`;

export default function Index(props) {
  const dispatch = useDispatch();
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  // const [messageApi, contextHolder] = message.useMessage();
  const {
    DeviceTypeManager: { AllDeviceStyle },
    RuntimeDevice: {
      CategoryImages,
    },
    DeviceManager: { QueryUsedDeviceCategory },
  } = Monitoring;
  let [deviceStyle, setdeviceStyle] = useState(1);
  let [statistics, setStatistics] = useState({});
  let [overView, setoverView] = useState({
    details: undefined,
    categories: undefined,
  });

  const roomId = useSelector(selectcurlRommid);
  let [optionsGateway, setoptionsGateway] = useState([]);
  const [changeTag, setChangeTag] = useState("");
  const [isCard, setisCard] = useState(true); //卡片模式true或列表模式false
  let [total, setTotal] = useState(0);
  let [imageList, setimageList] = useState([]);
  let {laptop} = useSelector(adaptation)
  let initparams = {
    projectId: projectId,
    // areaId: areaId,
    // gatewayId: 0,
    deviceStyle: 13,
    // category: '',
    alike: "",
    state: 0,
    pageNum: 1,
    pageSize: 12,
  };

  const [params, setParams] = useState(initparams);

  const showTotal = (total) => `共 ${total} 条记录`;
  const columns = [
    {
      title: "设备编号",
      dataIndex: "sn",
      render: (sn) => (
        <Link
          to={{
            pathname: "/deviceDetail",
            search: `?sn=${sn}`,
          }}
          target="_blank"
        >
          {" "}
          {sn}{" "}
        </Link>
      ),
      key: "sn",
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
  let [dataSource, setdataSource] = useState([]);
  let [devices, setDevies] = useState([]);

  const getType = async () => {
    // 表计类型

    try {
      let { success, data } = await AllDeviceStyle();
      if (success && Array.isArray(data)) {
        setDevies(data);
      } else {
        setDevies([]);
      }
    } catch (error) {
      setDevies([]);
    }
  };
  const getData = () => {
    // 表计状态
    DistributionRoomRuntime.Statistics({
      projectId: params.projectId,
      roomId,
      deviceStyle: params.deviceStyle,
    })
      .then((res) => {
        let { success, data } = res;
        if (success) {
          setStatistics(data || []);
        } else {
          message.error(res.errMsg);
        }
      })
      .catch();
  };
  const getGatewayUsed = () => {
    // 表计型号
    QueryUsedDeviceCategory({
      projectId: projectId,
      deviceStyle: params.deviceStyle,
    })
      .then((res) => {
        let { success, data } = res;
        if (success) {
          setoptionsGateway(data || []);
        } else {
          message.error(res.errMsg);
        }
      })
      .catch();
  };
  const getOverviewData = () => {
    //   表计数据
    DistributionRoomRuntime.Overview({ ...params, roomId })
      .then((res) => {
        let { success, data, total, pageNum } = res;
        if (success) {
          setoverView(data || []);
          setTotal(total);
          // setPageNum(pageNum)
          let overViewList = [];
          data?.details?.map((item) => {
            let description = "";
            item.fields.map((items) => {
              description += items.name + " " + items.value + " ";
            });
            overViewList.push({ ...item, description: description });
          });
          console.log(overViewList);
          setdataSource(overViewList);
        } else {
          message.error(res.errMsg);
        }
      })
      .catch();
  };

  const paginationProps = {
    current: params.pageNum, //当前页码
    pageSize: params.pageSize, // 每页数据条数
    total, // 总条数
    onChange: (page) => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
    showTotal: (total) => `共${total}条记录`,
  };
  const handlePageChange = (page) => {
    //setPageNum(page);
    setParams({
      ...params,
      pageNum: page,
    });
  };

  // let [imgUrl, setimgUrl] = useState()
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

  const onChangeValue = (e) => {
    setParams({
      ...params,
      alike: e,
    });
  }; //输入框改变值

  const handleChange = (e) => {
    // getOverviewData()
    setParams({
      ...params,
      category: e,
      pageNum: 1,
    });
  }; //网关型号选择
  const handleChangeState = (e) => {
    setParams({
      ...params,
      state: e,
      pageNum: 1,
    });
  }; //网关状态选择
  const changeTab = (val) => {
    console.log(val);
    setisCard(val.target.value == "card" ? true : false);
    // setPageNum(1)
    // setParams({
    //   ...initparams
    // })
    //getOverviewData()
  }; //切换卡片列表模式

  const onExport = useCallback(() => {
    //   表计数据
    let posts = { ...params, roomId, pageNum: 1, pageSize: total };
    return DistributionRoomRuntime.Overview(posts).then((res) => {
      let { success, data, total, pageNum } = res;
      if (success) {
        // setPageNum(pageNum)
        let overViewList = [];
        data?.details?.map((item) => {
          let description = "";
          item.fields.map((items) => {
            description += items.name + " " + items.value + " ";
          });
          overViewList.push({ ...item, description: description });
        });
        return {
          list: overViewList,
          total,
        };
      } else {
        message.error(res.errMsg);
      }
    });
  }, [params]);

  useEffect(() => {
    getType();
  }, []);
  useEffect(() => {
    if (Number.isFinite(roomId)) {
      getOverviewData();
      getData();
      getGatewayUsed();
    } else {
      setdataSource([]);
      setoverView({ details: undefined, categories: undefined });
      setStatistics({ all: 0, off: 0, on: 0, alarm: 0 });
    }
  }, [roomId, params]);
  useEffect(() => {
    if (overView.categories) {
      getGatewayImages();
      console.log(456);
    }
  }, [overView.categories]);
  const onChangePage = (page, pageSize) => {
    // setPageNum(page)

    setParams({
      ...params,
      pageNum: page,
    });
  };
  return (
    <Pagecount>
      <Mainbox>
        <div className="bottomTab">
          <Space size={16}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <span>触点查询</span>
            <Serach
              placeholder="输入设备编号/安装地址"
              style={{ width: "260px", marginLeft: 16 }}
              onSearch={onChangeValue}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            
            <span>测温状态</span>
            <Select
              value={params.state}
              style={{
                width: 200,
                marginLeft: 16,
              }}
              onChange={handleChangeState}
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
          </div>
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
        </div>
      
        {isCard ? (
          <div className="cardBox">
            {overView.details != null
              ? overView.details.map((item, index) => {
                  return (
                    <div key={index}>
                      <Link to={`/deviceDetail?sn=${item.sn}`} target="_blank">
                        <Icard
                          img={
                            imageList[index]
                              ? imageList[index]
                              : imgurl.contactor
                          }
                          title={item.name}
                          deviceStyle={params.deviceStyle}
                          value={item.address}
                          state={item.state}
                          fields={item.fields}
                          lastSampleTime={item.lastSampleTime}
                          category={item.sn}
                          laptop={laptop}
                        />
                      </Link>
                    </div>
                  );
                })
              : ""}
          </div>
        ) : (
          <div   style={{ flex: 1, display: "flex" }}>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowKey={(columns) => columns.id}
              ref={tableLoadRef}
              onExport={onExport}
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
              pagination={paginationProps}
              hbg="#f0f9ff"
              hbc="#515151"
            ></Table>
          </div>
        )}
        {isCard && (
          <Pagination
            className={style.pageNum}
            size="small"
            current={params.pageNum}
            total={total}
            showTotal={showTotal}
            defaultPageSize={12}
            onChange={onChangePage}
            showSizeChanger={false}
          />
        )}
      </Mainbox>
    </Pagecount>
  );
}
