import React, { useState, useEffect, useRef } from "react";
import { useRequest } from "ahooks";
import style from "./style.module.less";
import { message } from "antd";
import UseHeader from "@com/useHeader";
import Searchtree from "@com/searchTree";
import Barchart from "./barChart";
import Ringchart from "./ringChart";
import Percent from "./percent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import { utils, writeFile } from "xlsx";
import { EnergyPublicRuntime } from "@api/api.js";
import { validRange } from "semver";
export default function Index(props) {
  const tableRef = useRef();
  const {
    queryEnergyCategoryTree,
    queryElectricYear,
    queryElectricDay,
    queryElectricMonth,
    queryWaterDay,
    queryWaterMonth,
    queryWaterYear,
    queryGasDay,
    queryGasMonth,
    queryGasYear,
  } = EnergyPublicRuntime;
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };
  const projectId = useSelector(selectProjectId);
  //导出数据
  const exportData = () => {
    console.log("export");
    // const params = { raw: true };
    // const workbook = utils.book_new(); // 新建工作簿
    // let table = tableRef.current
    // const ws = utils.table_to_sheet(
    //   // 新建工作表
    //   table,
    //   params
    // );
    // utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    // let file =  "xlsx";
    // writeFile(workbook, '公共能耗.xlsx', { bookType: file }); // 下载
  };
  const headerProps = {
    isEnergy: true, //能耗类型
    isDate: true, //日期
    isShift: true, //班次
    isTab: false, //能耗、费用radioButton
    isSearch: true, //查询按钮
    isExport: true, //导出按钮
    export: exportData, //导出调用方法
  };
  const [headerData, setHeaderData] = useState({});
  const getFromChild = (data) => {
    setHeaderData(data);
  };
  const [treeIdList, setTreeIdList] = useState([]);
  //右下角 公共能耗同比  能耗数据展示
  const [energySub, setEnergySub] = useState([]);
  const [energyTotal, setEnergyTotal] = useState({});
  //右上角环形
  const [proportion, setProportionl] = useState([]);
  //柱状图
  const [detail, setDetail] = useState({});
  //自定义调用方法
  const pageInfo = () => {
    if (headerData.energyType === 1 && headerData.type === "year") {
      // 当选择能源类型是:电，时间类型是:年
      return queryElectricYear(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          setEnergySub(data.energySub);
          setEnergyTotal(data.energyTotal);
          setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 1 && headerData.type === "date") {
      // 当选择能源类型是:电，时间类型是:日
      return queryElectricDay(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          setEnergySub(data.energySub);
          setEnergyTotal(data.energyTotal);
          setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 1 && headerData.type === "month") {
      // 当选择能源类型是:电，时间类型是:月
      return queryElectricMonth(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          setEnergySub(data.energySub);
          setEnergyTotal(data.energyTotal);
          setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 2 && headerData.type === "date") {
      // 当选择能源类型是:水，时间类型是:日
      return queryWaterDay(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          // setEnergySub(data.energySub);
          // setEnergyTotal(data.energyTotal);
          // setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 2 && headerData.type === "month") {
      // 当选择能源类型是:水，时间类型是:月
      return queryWaterMonth(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          // setEnergySub(data.energySub);
          // setEnergyTotal(data.energyTotal);
          // setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 2 && headerData.type === "year") {
      // 当选择能源类型是:水，时间类型是:年
      return queryWaterYear(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          // setEnergySub(data.energySub);
          // setEnergyTotal(data.energyTotal);
          // setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 3 && headerData.type === "date") {
      // 当选择能源类型是:燃气，时间类型是:日
      return queryGasDay(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          // setEnergySub(data.energySub);
          // setEnergyTotal(data.energyTotal);
          // setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 3 && headerData.type === "month") {
      // 当选择能源类型是:燃气，时间类型是:月
      return queryGasMonth(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          // setEnergySub(data.energySub);
          // setEnergyTotal(data.energyTotal);
          // setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    } else if (headerData.energyType === 3 && headerData.type === "year") {
      // 当选择能源类型是:燃气，时间类型是:年
      return queryGasYear(
        projectId,
        headerData.areaId,
        headerData.date,
        headerData.shift,
        treeIdList
      ).then((res) => {
        let { success, data } = res;
        if (success && data) {
          // setEnergySub(data.energySub);
          // setEnergyTotal(data.energyTotal);
          // setProportionl(data.proportion);
          setDetail(data.detail);
        } else {
          messageContent("error", res.errMsg);
        }
      });
    }
  };
  const { run: runPageInfo } = useRequest(pageInfo, {
    manual: true,
  });
  useEffect(() => {
    runPageInfo();
  }, [headerData, treeIdList]);
  //树
  const [treeData, setTreeData] = useState([]);
  const fieldNames = {
    title: "name",
    key: "id",
    children: "childs",
  };
  const getCategoryTree = () => {
    return queryEnergyCategoryTree(projectId, headerData.energyType).then(
      (res) => {
        let { success, data } = res;
        if (success) {
          if (data) {
            setTreeData(data);
          } else {
            setTreeData([]);
          }
        } else {
          messageContent("error", res.errMsg);
        }
      }
    );
  };
  const { run: runTree } = useRequest(getCategoryTree, {
    manual: true,
  });

  const getSelcetedTree = (val) => {
    //公共能耗分类选中id获取
    const arr = val.map((item) => {
      return item.node.id;
    });
    setTreeIdList(() => [...arr]);
  };
  const [showElectricity, setShowElectricity] = useState(true);
  useEffect(() => {
    if (headerData.energyType) {
      runTree(headerData.energyType);
    }
    if (headerData.energyType == 1) {
      setShowElectricity(true);
    } else {
      setShowElectricity(false);
    }
    console.log(headerData.energyType);
    runPageInfo();
  }, [headerData.energyType]);

  return (
    <div>
      {contextHolder}
      <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
      <div className={style.content}>
        <Searchtree
          title="公共能耗分类"
          fieldNames={fieldNames}
          treeData={treeData}
          getValues={getSelcetedTree}
        ></Searchtree>
        {showElectricity ? (
          <div className={style.contentMiddle}>
            <span className={style.title}>公共能耗</span>
            {detail !== {} ? (
              <Barchart
                detailGive={detail}
                energyType={showElectricity}
                className={style.barChart}
              ></Barchart>
            ) : null}
          </div>
        ) : (
          <div className={style.contentMiddleBig}>
            <span className={style.title}>公共能耗</span>
            {detail !== {} ? (
              <Barchart
                detailGive={detail}
                energyType={showElectricity}
                className={style.barChart}
              ></Barchart>
            ) : null}
          </div>
        )}
        {showElectricity == 1 ? (
          <div className={style.contentRight}>
            <div className={style.rightTop}>
              <span className={style.title}>公共能耗占比</span>
              {proportion.length !== 0 ? (
                <Ringchart proportionGive={proportion}></Ringchart>
              ) : null}
            </div>
            {energySub.length !== 0 && energyTotal !== {} ? (
              <Percent
                energySubGive={energySub}
                energyTotalGive={energyTotal}
              ></Percent>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
