import React, { useState, useRef, useEffect } from "react";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Form, Select, DatePicker, Button, Radio, Spin } from "antd";
import { Radio_Options, Init_Value, Date_Value, Table_Option } from "./data";
import { AirTable, AirChart, AirEnergyDetail, Frequency } from "./comp";
import { Container, Header, Main } from "./style";
import { DownloadOutlined } from "@ant-design/icons";
import BlueColumn from "@com/bluecolumn/index.jsx";
import i18 from "../../../i18n";
import CusContext from "@com/content";
import { ExportData } from "./util";
import { AirConditioningManagement } from "@api/api.js";
import { selectProjectId } from "@redux/systemconfig";
import { useSelector } from "react-redux";
import { useReactive } from "ahooks";
import moment from "moment";
export default function Index() {
  const [treeId, setTreeId] = useState();
  const [tabId, setTabId] = useState("1"); //1：空调用能；2：空调节能
  const [tbmodel, setTbmodel] = useState(1); //1：列表模式；2：图表模式
  const [airDetail, setAirDetail] = useState();
  const tableRef = useRef();
  const [type, setType] = useState("date");
  const { Item } = Form;
  const [form] = Form.useForm();
  const energyRef = useRef(); //空调用能明细弹框
  const enableRef = useRef(); //开启频次
  const openTbIdRef = useRef(); // 开关弹窗对应的表格行id
  const projectId = useSelector(selectProjectId);
  const stateData = useReactive({
    proportion: [],
    saveTrend: {},
    useTrend: {},
    euList: [],
    esList: [],
  });
  //空调监控表格分页
  const pageInfo = useReactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  //空调监控弹窗内表格分页
  const modalPageInfo = useReactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  //开关弹窗数据
  const modalData = useReactive({
    deivemes: {},
    tbdata: [],
    totalCount: 0,
  });
  const timedate = useReactive({
    date: moment().format("YYYY-MM-DD"),
    datetype: 1,
  });
  // 添加loading状态管理
  const [loading, setLoading] = useState({
    pageLoading: false, // 主页面数据loading
    modalLoading: false, // 弹窗数据loading
    queryLoading: false, // 查询按钮loading
  });

  // 分页变化处理函数
  const handlePageChange = (page, pageSize) => {
    pageInfo.pageNum = page;
    pageInfo.pageSize = pageSize;
    QueryEnergyConsumptions(); // 重新查询数据
  };
  const getDateType = (type, date) => {
    return type == 1
      ? moment(date).format("YYYY-MM-DD")
      : type == 2
      ? moment().format("YYYY-MM-01")
      : moment().format("YYYY-01-01");
  };
  //查询能耗监控数据
  const QueryEnergyConsumptions = async () => {
    return executeApiCall(
      AirConditioningManagement.QueryEnergyConsumptions,
      {
        ids: treeId,
        pageNum: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
      },
      {
        loadingKey: "pageLoading",
        onSuccess: (res) => {
          const { proportion, saveTrend, useTrend, euList, esList } = res.data;
          stateData.proportion = proportion ?? [];
          stateData.saveTrend = saveTrend ?? {};
          stateData.useTrend = useTrend ?? {};
          stateData.euList = euList ?? [];
          stateData.esList = esList ?? [];
          pageInfo.pageNum = res.pageNum;
          pageInfo.pageSize = res.pageSize;
          pageInfo.total = res.total;
        },
      }
    );
  };
  //查询用电明细
  // 统一的API调用基础函数
  const executeApiCall = async (apiFunction, params, options = {}) => {
    const { loadingKey, onSuccess, useFormData = true } = options;

    try {
      // 设置loading状态
      if (loadingKey) {
        setLoading((prev) => ({ ...prev, [loadingKey]: true }));
      }

      // 构建请求参数
      let requestParams = { projectId, ...params };

      // 如果需要表单数据，添加日期相关参数
      if (useFormData) {
        requestParams = {
          ...requestParams,
          dayMonthYear: timedate?.datetype,
          date: timedate?.date,
        };
      }
      // 调用API
      const res = await apiFunction(requestParams);
      // 处理成功响应
      if (res.success && onSuccess) {
        onSuccess(res);
      }
      return res;
    } catch (error) {
      throw error;
    } finally {
      // 重置loading状态
      if (loadingKey) {
        setLoading((prev) => ({ ...prev, [loadingKey]: false }));
      }
    }
  };

  // 查询用电明细
  const QueryEnergyDetail = async (conditionerId) => {
    return executeApiCall(
      AirConditioningManagement.QueryEnergyDetail,
      { conditionerId },
      {
        onSuccess: (res) => {
          setAirDetail(res.data);
        },
      }
    );
  };

  // 查询IO详情
  const QueryIoDetail = async () => {
    return executeApiCall(
      AirConditioningManagement.QueryIoDetail,
      { conditionerId: openTbIdRef.current },
      {
        onSuccess: (res) => {
          modalData.deivemes = res.data;
        },
      }
    );
  };

  // 后端分页查询IO数据（支持排序和过滤）
  const PageIO = async (IoState = 0, sortField = 0, sortOrder = "ascend") => {
    return executeApiCall(
      AirConditioningManagement.PageIO,
      {
        IoState, // 过滤参数：0-全部，1-开启，2-关闭
        pageNum: modalPageInfo.pageNum,
        pageSize: modalPageInfo.pageSize,
        conditionerId: openTbIdRef.current,
        // 添加排序参数
        controlType: sortField, // 排序字段，如 '1-系统 2-手动'
        asc: sortOrder=='ascend'?true:false, // 排序方向：'ascend' 或 'descend'
      },
      {
        loadingKey: "modalLoading",
        onSuccess: (res) => {
          modalData.tbdata = res.data || [];
          modalData.totalCount = res.total || 0;
          modalPageInfo.pageNum = res.pageNum || 1;
          modalPageInfo.pageSize = res.pageSize || 10;
          modalPageInfo.total = res.total || 0;
        },
      }
    );
  };
  //打开空调用能明细弹框
  const openEnergyModal = (record) => {
    energyRef.current?.onOpen();
    QueryEnergyDetail(record.id);
  };
  const openFrModal = (record) => {
    console.log("record", record);
    openTbIdRef.current = record?.id;
    enableRef.current?.onOpen();
    QueryIoDetail();
    // 初始化时使用默认排序参数调用PageIO
    PageIO();
  };

  const onFinish = async (values) => {
    setLoading((prev) => ({ ...prev, queryLoading: true }));
    try {
      const values = form.getFieldsValue();
      const date = getDateType(values.dtype, values.date);
      timedate.date = date;
      timedate.datetype = values.dtype;
      await QueryEnergyConsumptions(); // 点击查询按钮时重新获取数据
    } finally {
      setLoading((prev) => ({ ...prev, queryLoading: false }));
    }
  };

  const [enableVal, setEnableVal] = useState(0);
  // 添加后端排序状态管理
  const [sortInfo, setSortInfo] = useState({
    filter: 0,      //默认不筛选
    order: true     // 默认升序，对应data.js中的defaultSortOrder
  });
  
  const enableChange = (e) => {
    const newFilterValue = e.target.value;
    setEnableVal(newFilterValue);
    // 过滤变化时重置到第一页
    modalPageInfo.pageNum = 1;
    // 调用后端过滤接口
    PageIO(newFilterValue, sortInfo.filter, sortInfo.order);
  };

  // modal关闭时重置状态
  const handleModalClose = () => {
    setEnableVal(0);
    // 重置为默认排序状态，而不是清空
    setSortInfo({ filter: 1, order: true });
    // 清空modal数据
    modalData.tbdata = [];
    modalData.deivemes = {};
    modalData.totalCount = 0;
    enableRef.current?.onCancel();
  };

  // 后端分页变化处理函数
  const onPageChange = (page, pageSize) => {
    modalPageInfo.pageNum = page;
    modalPageInfo.pageSize = pageSize;
    // 调用后端接口，保持当前过滤和排序状态
    PageIO(enableVal, sortInfo.filter, sortInfo.order);
  };

  // 后端表格变化处理函数（支持排序）
  const handleTableChange = (pagination, filters, sorter) => {
    console.log('表格变化:', { pagination, filters, sorter });
    
    let needReload = false;
    let newSortInfo = { ...sortInfo };
    
   
    //处理过滤变化
    if(filters?.controlType&&filters?.controlType.length>0 &&filters?.controlType[0]!=sortInfo.filter){
      newSortInfo = {
        ...newSortInfo,
        filter: filters?.controlType[0] || 0
      };
      setSortInfo(newSortInfo);
        // 排序变化时重置到第一页
      modalPageInfo.pageNum = 1;
      needReload = true;
    }
    if(!filters?.controlType){
       newSortInfo = {
        ...newSortInfo,
        filter:  0
      };
      setSortInfo(newSortInfo);
        // 排序变化时重置到第一页
      modalPageInfo.pageNum = 1;
      needReload = true;
    }
    // 处理排序变化
    if (Object.keys(sorter).length>0 && (sorter.order !== sortInfo.order)) {
      newSortInfo = {
        ...newSortInfo,
        order: sorter.order || null
      };
      setSortInfo(newSortInfo);
      
      // 排序变化时重置到第一页
      modalPageInfo.pageNum = 1;
      needReload = true;
    }
     // 处理分页变化
    if (pagination && (pagination.current !== modalPageInfo.pageNum || pagination.pageSize !== modalPageInfo.pageSize)) {
      modalPageInfo.pageNum = pagination.current;
      modalPageInfo.pageSize = pagination.pageSize;
      modalPageInfo.total = pagination.total;
      needReload = true;
    }
    // 调用后端接口
    if (needReload) {
      PageIO(enableVal, newSortInfo.filter, newSortInfo.order);
    }
  };

  useEffect(() => {
    // 初始化数据加载
    QueryEnergyConsumptions();
    return () => {
      openTbIdRef.current = null;
    };
  }, [treeId, projectId, tabId]);
  return (
    <Pagecount bgcolor="#eeeff4" pd={0}>
      <Container>
        <Header>
          <Radio.Group
            block
            options={Radio_Options}
            defaultValue="1"
            optionType="button"
            buttonStyle="solid"
            size="large"
            onChange={(e) => {
              setTabId(e.target.value);
            }}
          />
          <Form
            form={form}
            layout="inline"
            onFinish={onFinish}
            initialValues={Init_Value}
          >
            <Item name="dtype">
              <Select
                size="default"
                options={Date_Value}
                style={{ width: 80, marginRight: 16 }}
                onChange={(e) => {
                  if (e == "1") {
                    setType("date");
                  } else if (e == "2") {
                    setType("month");
                  } else {
                    setType("year");
                  }
                }}
              ></Select>
            </Item>
            <Item name="date">
              <DatePicker
                size="default"
                style={{ width: 160 }}
                picker={type}
              ></DatePicker>
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading.queryLoading}
                style={{ marginLeft: 16 }}
              >
                查询
              </Button>
            </Item>
          </Form>
        </Header>
        <Main>
          <div className="tree-box">
            <UseTree
              areaId={0}
              setTreeId={setTreeId}
              setLine={() => {}}
              showline={false}
              datatype={5}
              energytype={1}
              allselect={true}
              showSearch={true}
              title="空调设备列表"
            />
          </div>
          <div className="right-box">
            <BlueColumn
              name={tabId == 1 ? "空调能耗分析" : "空调节能分析"}
              bg={{ borderRadius: "4px" }}
              styled={{ marginBottom: 16, width: "100%" }}
            >
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  icon={<DownloadOutlined />}
                  style={{
                    borderRadius: "2px",
                    width: "96px",
                    display: tbmodel == 2 ? "none" : "block",
                  }}
                  onClick={() => {
                    const { columns, tablechartRef } = tableRef.current;
                    ExportData(
                      tabId == 1 ? stateData.euList : stateData.esList,
                      columns,
                      tablechartRef
                    );
                  }}
                >
                  {i18.t("export", { ns: "button" })}
                </Button>
                <Radio.Group
                  block
                  options={Table_Option}
                  defaultValue="1"
                  optionType="button"
                  buttonStyle="solid"
                  size="large"
                  style={{ marginLeft: 16 }}
                  onChange={(e) => {
                    setTbmodel(e.target.value);
                  }}
                />
              </div>
            </BlueColumn>
            <div
              style={{
                width: "100%",
                flex: 1,
                overflow: "hidden",
                display: "flex",
              }}
            >
              {/* <Spin spinning={loading.pageLoading} style={{ width: '100%', flex: 1 }}> */}
              {tbmodel == 1 ? (
                <CusContext.Provider>
                  <AirTable
                    tabId={tabId}
                    openEnergyModal={openEnergyModal}
                    openFrModal={openFrModal}
                    ref={tableRef}
                    key={tabId}
                    euList={stateData.euList}
                    esList={stateData.esList}
                    pageInfo={pageInfo}
                    onPageChange={handlePageChange}
                    loading={loading.pageLoading}
                  ></AirTable>
                </CusContext.Provider>
              ) : (
                <AirChart
                  tabId={tabId}
                  key={tabId}
                  proportion={stateData.proportion}
                  useTrend={stateData.useTrend}
                  saveTrend={stateData.saveTrend}
                ></AirChart>
              )}
              {/* </Spin> */}
            </div>
          </div>
        </Main>
        <AirEnergyDetail
          energyRef={energyRef}
          airDetail={airDetail}
        ></AirEnergyDetail>
        <Frequency
          domRef={enableRef}
          onChange={enableChange}
          value={enableVal}
          modalData={modalData}
          modalPageInfo={modalPageInfo}
          onPageChange={()=>{}}
          onTableChange={handleTableChange} // 传递后端表格处理函数
          onClose={handleModalClose}
          loading={loading.modalLoading}
          time={timedate.date}
        ></Frequency>
      </Container>
    </Pagecount>
  );
}
