import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import { Table, Input, message, Descriptions, Divider } from "antd";
import UsetTable from "@com/useTable";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { cloneDeep } from "lodash";
import { CustButton } from "@com/useButton";
import { adaptation } from "@redux/systemconfig";
import Mask from "../mask";
const csssty = css`
  .transferContent {
    padding: 16px;
  }
  .leftTable {
    row-gap: 16px;
  }
  .actions {
    margin: 0px 8px;
    .finalButton {
      row-gap: 8px;
    }
  }
`;
const Mainbox = styled.div`
  width: 100%;
  height: 100%;
  .transferContent {
    // width: 1680px;
    height: inherit;
    background-color: #003366;
    padding: 32px;
    display: flex;
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translate(200px, -50%);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr;
    width: calc(100% - 200px);
  }

  .transferContentNoMask { 
    height: inherit;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr;
  }
  .leftTable {
    height: inherit;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
  }

  .subTable {
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
     display: flex;
     flex-direction: column;
     row-gap: 16px;
    flex: 1;
  }

  .otherSubTable {
    flex: 1;
    padding: 16px 16px 0 16px;
    background-color: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  .mainContent {
    flex: 1;
    position: relative;
    overflow: auto;
  }

  .actions {
    margin: 0 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .firstButton {
      // margin-top: 64px;
      display: flex;
      justify-content: space-between;
    }

    .secondButton {
      //  margin-top: 182px;
      display: flex;
      justify-content: space-between;
    }

    .leftButton {
      display: inline-block;
      width: 68px;
      height: 46px;
      background-color: var(--ant-primary-color);
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      line-height: 46px;
      text-align: center;

      &:hover {
        background-color: rgba(64, 158, 255, 1);
      }
    }

    .rightButton {
      display: inline-block;
      width: 68px;
      height: 46px;
      margin-left: 10px;
      background-color: var(--ant-primary-color);
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      line-height: 46px;
      text-align: center;

      &:hover {
        background-color: rgba(64, 158, 255, 1);
      }
    }

    .finalButton {
      // margin-top: 180px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      .saveButton {
        width: 146px;
        height: 40px;
        background-color: var(--ant-primary-color);
        border-radius: 4px;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        text-align: center;

        &:hover {
          background-color: rgba(64, 158, 255, 1);
        }
      }

      .closeButton {
        margin-top: 16px;
        width: 146px;
        height: 40px;
        background-color: #fff;
        border-radius: 4px;
        cursor: pointer;
        color: #212121;
        font-size: 14px;
        line-height: 40px;
        text-align: center;

        &:hover {
          opacity: 0.5;
        }
      }
    }
  }

  .rightTable {
    //  width: 714px;
    //  height: 696px;
    border-radius: 2px;
    padding: 16px 0 0 16px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }
  .rightTable,
  .leftTable {
    .publicTitle {
      height: 32px;
      padding-left: 16px;
      line-height: 32px;
      font-size: 15px;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;
      &::before{
        content: "";
        width: 3px;
        height: 11px;
        position: absolute;
        left:0px;
        background-color: ${props=> props.theme.primaryColor};
      }
      //border-left: 4px solid var(--ant-primary-color);
    }
    .searchInput {
      display: flex;
      align-items: center;
      height: 32px;
    }
    .mainTable {
      padding: 16px;
      background-color: #fff;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      flex: 1;
      
    }
    .tbwrap {
        position: absolute;
        width: 100%; 
      }
  }

  ${(props) => (props.theme.laptop ? csssty : null)}
`;

export default function index(props) {
  console.log(props)
  const { t } = useTranslation(["button"]);
  const [messageApi, contextHolder] = message.useMessage();
  const task = props.mask == "open";
  const { Search } = Input;
  const { laptop } = useSelector(adaptation);
  const columns = props.columns;

  const fibre = props.fibre || {};
  const [mainData, setMainData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [subCopy, setSubCopy] = useState([]);
  const [unknownData, setUnknownData] = useState([]);
  const [unknownCopy, setUnknownCopy] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    let mainArr = cloneDeep(props.mainTable);
    let subArr = cloneDeep(props.subTable);
    let unknownArr = cloneDeep(props.unknownTable);

    setMainData(mainArr);
    setSubData(subArr);
    setSubCopy(subArr);
    setUnknownData(unknownArr);
    setUnknownCopy(unknownArr);
  }, [props]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const unknownToMain = () => {
     if (selectedRowKeys.length == 0) {
      messageApi.open({
        type: "warning",
        content: "请至少选择一个设备！",
      });
      return;
    }  else {
       console.log(selectedRowKeys)
       let unarr = unknownData.filter?.(u => !selectedRowKeys.includes(u.id))
       let sedarr = unknownData.filter?.(u =>  selectedRowKeys.includes(u.id))
     
      setMainData(mainData.concat(sedarr));
      setUnknownData(unarr);
      setSelectedRowKeys([]);
      setUnknownCopy(unarr)
    }
  };

  //总表->未知
  const [selectedMainKeys, setSelectedMainKeys] = useState([]);
  const onSelectMain = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys);
    console.log(mainData);
    setSelectedMainKeys(newSelectedRowKeys);
  };
  const mainSelection = {
    selectedRowKeys: selectedMainKeys,
    onChange: onSelectMain,
  };
  const MainToUnknown = () => {
    if (selectedMainKeys.length == 0) {
      messageApi.open({
        type: "warning",
        content: "请先选择设备！",
      });
      return;
    } else {
      let tounknowData = mainData.filter((d) =>
        selectedMainKeys.includes(d.id)
      );
      let restData = mainData.filter((d) => !selectedMainKeys.includes(d.id));
      setUnknownData(unknownData.concat(tounknowData));
      setMainData([...restData]);
      setSelectedMainKeys([]);
     
    }
  };

  const unknownToSub = () => {
    console.log(subData);
    console.log(props.type);
    if (subData.length > 0 && props.type == "fibre") {
      // fiber 光纤测温
      return messageApi.open({
        type: "warning",
        content: "光纤设备至多添加一个！",
      });
    }
    if (selectedRowKeys.length == 0) {
      messageApi.open({
        type: "warning",
        content: "请至少选择一个设备！",
      });
      return;
    } else {
      let arr = [...unknownData];
      let arr2 = [];
      let copyArr = [...unknownCopy];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < selectedRowKeys.length; j++) {
          if (arr[i].id == selectedRowKeys[j]) {
            for (let x = 0; x < copyArr.length; x++) {
              if (arr[i].id == copyArr[x].id) {
                copyArr.splice(x, 1);
              }
            }
            arr2.push(arr[i]);
            arr.splice(i, 1);
          }
        }
      }
      setSubData([...subData.concat(arr2)]);
      setSubCopy(subCopy.concat(arr2));
      setUnknownData(arr);
      setUnknownCopy(copyArr);
      setSelectedRowKeys([]);
    }
  };

  const [selectedSubKeys, setSelectedSubKeys] = useState([]);
  const onSelectSub = (newSelectedRowKeys) => {
    setSelectedSubKeys(newSelectedRowKeys);
     
  };
  const subSelection = {
    selectedRowKeys: selectedSubKeys,
    onChange: onSelectSub,
  };
  const subToUnknown = () => {
    if (selectedSubKeys.length == 0) {
      messageApi.open({
        type: "warning",
        content: "请先选择设备！",
      });
      return;
    } else {
      let arr = [...subData];
      let arr2 = [];
      let copyArr = [...subCopy];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < selectedSubKeys.length; j++) {
          if (arr[i].id == selectedSubKeys[j]) {
            for (let x = 0; x < copyArr.length; x++) {
              if (arr[i].id == copyArr[x].id) {
                copyArr.splice(x, 1);
              }
            }
            arr2.push(arr[i]);
            arr.splice(i, 1);
          }
        }
      }
      setUnknownData(unknownData.concat(arr2));
      setUnknownCopy(unknownCopy.concat(arr2));
      setSubData(arr);
      setSubCopy(copyArr);
      setSelectedSubKeys([]);
    }
  };

  const handleClose = () => {
    setSearchValue("");
    setSubserach("");
    props.closeValue("close");
    setSelectedRowKeys([]);
    setSelectedSubKeys([]);
    setSelectedMainKeys([]);
  };
  const [clearSubData, setClearSubData] = useState(false);
  const [clearSearchDo, setClearSearchDo] = useState(false); //是否进行搜索行为
  const [clickSearch, setClickSearch] = useState(false); //是否点击搜索
  const handleSave = () => {
    if (clickSearch) {
      console.log("点击了保存", clickSearch);
      setClearSearchDo(true);
      // setClickSearch(false)
      setSearchValue("");
    } else {
      props.saveValue({
        mainData,
        subData,
        unknownData,
      });
      setSelectedRowKeys([]);
      setSelectedSubKeys([]);
      setSelectedMainKeys([]);
    }
  };

  let tag = columns[0].key;
  let keys = columns.map((c) => c.key);

  const onSearchSub = async (value) => {
    setSubserach(value);
    let arr = [];
    setClickSearch(true);
    console.log("------", clearSearchDo);
    console.log("!!!!!!", clickSearch);

    setSelectedSubKeys([]);
    if (value == "") {
      setSubData([...subCopy]);
      if (clearSearchDo) {
        setClearSearchDo(false);
        setClearSubData(true);
        setClickSearch(false);
      }
    } else {
      subCopy.map((item) => {
        let f = [];
        for (let key of keys) {
          f.push(item[key].indexOf(value) != -1);
        }
        if (f.includes(true)) arr.push(item);
      });
      console.log(arr);
      setSubData([...arr]);
    }
  };

  useEffect(() => {
    console.log(subData.length, subData, clearSubData);
    if (clearSubData) {
      setClearSubData(false);
      props.saveValue({
        mainData,
        subData,
        unknownData,
      });

      setSelectedRowKeys([]);
      setSelectedSubKeys([]);
      setSelectedMainKeys([]);
    }
  }, [clearSubData]);
  useEffect(() => {
    console.log(clearSearchDo);
    if (clearSearchDo) {
      onSearchSub("");
    }
  }, [clearSearchDo]);
  const onSearchUnknown = (value) => {
    let arr = [];
    setSelectedRowKeys([]);
    if (value == "") {
      setUnknownData([...unknownCopy]);
    } else {
      unknownCopy.map((item) => {
        let f = [];
        for (let key of keys) {
          f.push(item[key].indexOf(value) != -1);
        }
        if (f.includes(true)) arr.push(item);
       
      });
      console.log(arr);
      setUnknownData([...arr]);
    }
  };
  const [subserach, setSubserach] = useState("");
  const btnsty = laptop
    ? {
        height: "32px",
        width: "55px",
      }
    : {
        height: "46px",
        width: "68px",
      };
  const savesty = laptop
    ? {
        height: "34px",
        width: "120px",
      }
    : {
        height: "46px",
        width: "146px",
      };
  return (
    <Mask task={task} maskBack={props.maskBack}>
      <Mainbox>
        <div
          className={
            props.maskBack == false
              ? "transferContentNoMask"
              : "transferContent"
          }
        >
          {contextHolder}
          {props.transferTitle.mainTitle != ""
            ? props.type != "fibre" && (
                <div className="leftTable">
                  <div className="mainTable">
                    <div className="publicTitle">
                      {props.transferTitle.mainTitle}
                    </div>
                    <div className="mainContent">
                       <div className="tbwrap">
                      <UsetTable
                        bordered
                        dataSource={mainData}
                        columns={columns} 
                        rowKey="id"
                        pagination={false}
                        rowSelection={mainSelection} 
                      ></UsetTable>
                      </div>
                    </div>
                  </div>
                  <div className="subTable">
                    <div className="publicTitle">
                      {props.transferTitle.subTitle}
                    </div>
                    <div className="searchInput">
                      <span style={{ marginRight: 16 }}>设备搜索</span>
                      <Search
                        placeholder="请输入设备编号/安装地址"
                        style={{ width: 256 }}
                        value={subserach}
                        allowClear
                        onChange={(e) => setSubserach(e.target.value)}
                        enterButton
                        onSearch={onSearchSub}
                      ></Search>
                    </div>
                    <div className="mainContent">
                      <div className="tbwrap">
                        <UsetTable
                          bordered
                          dataSource={subData}
                          columns={columns} 
                          rowKey="id"
                          pagination={false}
                          rowSelection={subSelection}
                        ></UsetTable>
                      </div>
                    </div>
                  </div>
                </div>
              )
            : props.type != "fibre" && (
                <div className="leftTable">
                  <div className="otherSubTable">
                    <div className="publicTitle">
                      {props.transferTitle.subTitle}
                    </div>
                    <div className="searchInput">
                      <span style={{ marginRight: 16 }}>设备搜索</span>
                      <Search
                        placeholder="设备编号/设备名称/安装地址"
                        style={{ width: 256 }}
                        value={subserach}
                        allowClear
                        onChange={(e) => setSubserach(e.target.value)}
                        enterButton
                        onSearch={onSearchSub}
                      ></Search>
                    </div>
                    <div className="mainContent">
                      <div className="tbwrap">
                        <UsetTable
                          bordered
                          dataSource={subData}
                          columns={columns} 
                          rowKey="id"
                          pagination={false}
                          rowSelection={subSelection}
                        ></UsetTable>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          {props.type == "fibre" && (
            <div className="leftTable">
              <div className="otherSubTable">
                <div className="publicTitle">
                  {props.transferTitle.subTitle}
                </div>
                <Descriptions title="" column={1} size="small" bordered>
                  <Descriptions.Item label="测温通道">
                    {fibre.channel}
                  </Descriptions.Item>
                  <Descriptions.Item label="分区编号">
                    {fibre.subfield}
                  </Descriptions.Item>
                  <Descriptions.Item label="分区名称">
                    {fibre.subfieldName}
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <div className="mainContent">
                  <div className="tbwrap">
                    <UsetTable
                      bordered
                      dataSource={subData}
                      columns={columns}
                      rowKey="id"
                      pagination={false}
                      rowSelection={subSelection}
                    ></UsetTable>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="actions">
            {props.transferTitle.mainTitle != "" ? (
              <div className="firstButton">
                <CustButton
                  icon={<LeftOutlined />}
                  style={btnsty}
                  onClick={unknownToMain}
                ></CustButton>
                <CustButton
                  icon={<RightOutlined />}
                  style={btnsty}
                  onClick={MainToUnknown}
                ></CustButton>
              </div>
            ) : null}
            <div className="secondButton">
              <CustButton
                icon={<LeftOutlined />}
                style={btnsty}
                onClick={unknownToSub}
              ></CustButton>
              <CustButton
                icon={<RightOutlined />}
                style={btnsty}
                onClick={subToUnknown}
              ></CustButton>
            </div>
            <div className="finalButton">
              <CustButton onClick={handleSave} style={savesty}>
                {t("button:save")}
              </CustButton>
              {props.maskBack == false ? null : (
                <CustButton
                  type="default"
                  style={savesty}
                  onClick={() => handleClose()}
                >
                  {t("button:cancel")}
                </CustButton>
              )}
            </div>
          </div>
          <div className="rightTable">
            <div className="publicTitle">
              {props.transferTitle.unknownTitle}
            </div>
            <div className="searchInput">
              <span style={{ marginRight: 16 }}>设备搜索</span>
              <Search
                placeholder="设备编号/设备名称/安装地址"
                style={{ width: 256 }}
                enterButton
                onSearch={onSearchUnknown}
                allowClear
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              ></Search>
            </div>
            <div className="mainContent">
              <div className="tbwrap">
                <UsetTable
                  bordered
                  pagination={props.maskBack == false ? false : true}
                  dataSource={unknownData}
                  columns={columns}
                  rowKey="id"
                  rowSelection={rowSelection}
                ></UsetTable>
              </div>
            </div>
          </div>
        </div>
      </Mainbox>
    </Mask>
  );
}
