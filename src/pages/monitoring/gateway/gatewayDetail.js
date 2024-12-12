import { React, useState, useEffect } from "react";
import styled from "styled-components";
import style from "./style.module.less";
import { useSelector } from "react-redux";
import imgurl from "./images/index.js";
import { Pagination, message, Typography, Button } from "antd";
import { useLocation } from "react-router";
import { Monitoring } from "@api/api.js";
import { Link, useNavigate } from "react-router-dom";
import {
  selectProjectId,
  mixtitle,
  systemConfigInfo,
  currProject,
} from "@redux/systemconfig.js";

import Table from "@com/useTable";
const { Text } = Typography;
const Mainbox =  styled.div`
&&{
  background-color: ${props => props.theme.gatewaybgcolor || "#135abd"};
  .leftImgBox,.rightHead {
    background-color: ${props => props.theme.gatewaybgcolor || "#135abd"};
  }
  .head{
    background-color: ${props => props.theme.gatewayheardcolor || "#003366"};
  }
  
}
`

const Ctitlec = styled.div`  // detail?.state == 2 ? style.leftImgState : detail.state == 3 ? style.leftImgStateAlarm : style.leftImgStateOff
&&{
    width: 96px;
    height: 32px;
    background-color: ${props => props.state==2 ? props.theme.successColor : props.state == 3 ? props.theme.errorColor : "#666" };
    border: none;
   // border: 1px solid rgb(0, 204, 0);
    color: #fff;
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}
`
export default function GatewayDetail(props) {
  const { projectName, logoImage } = useSelector(currProject);
  let location = useLocation();
  let qs = require("query-string");
  let search = qs.parse(location.search);
  /* useEffect(() => {
      document.title = `NIS6000 正泰储能 网关详情`
      return () => document.title= 'NIS6000 正泰储能 网关详情'
    },[location])  */

  const projectId = useSelector(selectProjectId);
  const enchtitle = useSelector(mixtitle);
  const { chineseTitle } = useSelector(systemConfigInfo);
  //   const [messageApi, contextHolder] = message.useMessage();
  const {
    RuntimeGateway: { RuntimeGatewayDetail, Children, Log, CategoryImages,RTGCall },
  } = Monitoring;
  let [state, setstate] = useState(true);
  let [detail, setDetail] = useState({});
  const onchangeTab = () => {
    setstate(!state);
  };
  const [page, setpage] = useState(1);
  let [total, setTotal] = useState(1);
  let [pageNum, setPageNum] = useState(1);
  const [pageLog, setpageLog] = useState(1);
  let [totalLog, setTotalLog] = useState(1);
  let [pageNumLog, setPageNumLog] = useState(1);
  const columns = [
    {
      title: "设备编号",
      dataIndex: "sn",
      key: "sn",
      render: (sn) => (
        <Link to={`/deviceDetail?sn=${sn}`} target="_blank">
          {" "}
          {sn}{" "}
        </Link>
      ),
      id: "id",
      width: 315,
    },
    {
      title: "设备型号",
      dataIndex: "category",
      key: "category",
      id: "id",
      width: 224,
    },
    {
      title: "设备状态",
      dataIndex: "state",
      key: "state",
      id: "id",
      width: 150,
      render: (state) => {
        if (isNaN(state)) return;
        let text = ["离线", "离线", "正常", "告警"];
        let s = state > 3 ? 1 : state;
        let type = ["secondary", "secondary", "success", "danger"][s];
        return <Text type={type}>{text[s]}</Text>;
      },
    },
    {
      title: "安装地址",
      dataIndex: "address",
      key: "address",
      id: "id",
      width: 288,
    },
    {
      title: "通信地址",
      dataIndex: "commAddressName",
      key: "commAddressName",
      id: "id",
      width: 150,
    },
    {
      title: "通信端口",
      dataIndex: "commPortName",
      key: "commPort",
      id: "id",
      width: 150,
    },
    {
      title: "通信协议",
      dataIndex: "commProtocolName",
      key: "commProtocol",
      id: "id",
      //  width: 258
    },
  ];
  const columnsLog = [
    {
      title: "操作时间",
      dataIndex: "time",
      key: "sn",
      id: "id",
      width: 510,
    },
    {
      title: "操作日志",
      dataIndex: "content",
      key: "category",
      id: "id",
      width: 510,
    },
    {
      title: "操作者",
      dataIndex: "creator",
      key: "sn",
      id: "id",
    },
  ];
  let [dataSource, setdataSource] = useState([]);
  let [dataSourceLog, setdataSourceLog] = useState([]);
  const onChangePage = (page, pageSize) => {
    setpage(page);
  };
  const onChangePageLog = (page, pageSize) => {
    setpageLog(page);
  };
  const getData = () => {
    //网关详情
    return RuntimeGatewayDetail(projectId, search.sn).then((res) => {
      let { success, data } = res;
      if (success) {
        setDetail(data);
      } else {
        message.error(res.errMsg);
      }
    });
  };
  let params = {
    projectId: projectId,
    pageNum: page,
    pageSize: 1300,
    sn: search.sn,
  };
  const getChildrenData = () => {
    //网关子设备详情
    return Children(params).then((res) => {
      let { success, data } = res;
      if (success) {
        setdataSource(data);
        setTotal(total);
      } else {
        message.error(res.errMsg);
      }
    });
  };
  let paramsLog = {
    projectId: projectId,
    pageNum: pageLog,
    pageSize: 12,
    sn: search.sn,
  };
  const getLogData = () => {
    //网关子设备详情
    return Log(paramsLog).then((res) => {
      let { success, data } = res;
      if (success) {
        setdataSourceLog(data);
        setTotalLog(total);
      } else {
        message.error(res.errMsg);
      }
    });
  };
  const setRTGCall=async ()=>{
    const resp = await RTGCall({ProjectId:projectId ,Sn:search.sn})
    if(resp.success){
      message.success("召读设备成功!")
      getChildrenData();
    }else{
      message.error(resp.errMsg||"召读设备失败!")
    }
  }
  useEffect(() => {
    document.title = enchtitle + " " + (location.state?.title || "");
    return () => (document.title = enchtitle);
  }, [location]);
  useEffect(() => {
    getData();
  }, [search.sn, projectId]);
  useEffect(() => {
    getChildrenData();
  }, [search.sn, projectId, page, params.pageSize]);
  useEffect(() => {
    getLogData();
  }, [search.sn, projectId, pageLog, paramsLog.pageSize]);
  return (
    <Mainbox className={style.main}>
      <div className={style.head + " head"}>
        {logoImage ? (
          <img src={logoImage} className={style.headImg}></img>
        ) : null}
        <p>{chineseTitle}</p>
      </div>
      <div className={style.body}>
        <div className={style.left}>
          <div className={style.leftHead}>
            <div className={style.leftHeadLine}></div>
            <p>网关详情</p>
          </div>
          <div className={style.leftImgBox + " leftImgBox"}>
            <img
              src={
                detail
                  ? "data:image/png;base64," + detail.imageBase64
                  : imgurl.category
              }
              className={style.leftImg}
            ></img>
            <Ctitlec
              state={detail.state}
            >
              {detail.state == 3
                ? "网关告警"
                : detail.state == 2
                ? "网关在线"
                : "网关失联"}
            </Ctitlec>
          </div>
          <div className={style.leftBottom}>
            <p>
              <span className={style.leftBottomSpan}>网关编号：</span>
              <span>{detail.sn}</span>
            </p>
            <p>
              <span className={style.leftBottomSpan}>网关名称：</span>
              <span>{detail.name}</span>
            </p>
            {/* <p><span className={style.leftBottomSpan}>设备类型：</span><span>{detail.category}</span></p> */}
            <p>
              <span className={style.leftBottomSpan}>设备型号：</span>
              <span>{detail.category}</span>
            </p>
            <p>
              <span className={style.leftBottomSpan}>联网方式：</span>
              <span>{detail.connMethod}</span>
            </p>
            <p>
              <span className={style.leftBottomSpan}>子设备数：</span>
              <span>{detail.childrenCnt}</span>
            </p>
            <div className={style.line}></div>
            <p>
              <span className={style.leftBottomSpan}>安装地址：</span>
            </p>
            <p>
              <span>{detail.address}</span>
            </p>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.rightHead + " rightHead"}>
            <div
              className={state ? style.tabBoxW : style.tabBoxB}
              onClick={onchangeTab}
            >
              子设备
            </div>
            <div
              className={!state ? style.tabBoxW : style.tabBoxB}
              onClick={onchangeTab}
            >
              操作日志
            </div>
          </div>
          <div className={style.newTime}>
              <img src={imgurl.time} className={style.time}></img>
              <p>数据最新更新时间：{detail.lastSampleTime}</p>
              <Button type="primary" style={{marginLeft:'auto'}} onClick={setRTGCall}>手动召读</Button>
          </div>
          <img src={imgurl.line} className={style.timeline}></img>
          <div className={style.tableBox}>
            {state ? (
              <div>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  rowKey={(columns) => columns.id}
                  scroll={{
                    y: 668,
                  }}
                ></Table>
                <Pagination
                  className={style.pageNumD}
                  size="small"
                  current={page}
                  total={total}
                  defaultPageSize={12}
                  onChange={onChangePage}
                  showSizeChanger={false}
                />
              </div>
            ) : (
              <div>
                <Table
                  columns={columnsLog}
                  dataSource={dataSourceLog}
                  rowKey={(columnsLog) => columnsLog.id}
                  scroll={{
                    y: 668,
                  }}
                ></Table>
                <Pagination
                  className={style.pageNumD}
                  size="small"
                  current={pageLog}
                  total={totalLog}
                  defaultPageSize={12}
                  onChange={onChangePageLog}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Mainbox>
  );
}
