import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import firstwarn from "@imgs/warning.png";
import { useSelector } from "react-redux";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  message,
  Select,
  DatePicker,
} from "antd";
import {
  selectProjectId,
  publishState,
  selectOneLevel,
} from "@redux/systemconfig.js";
export default function Index() {
  const tableRef = useRef();
  const [form] = Form.useForm();
  const Item = Form.Item;
  const ispublish = useSelector(publishState);
  //删除告警类型弹窗
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  //新增 修改 弹窗
  const [addModal, setAddModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  // 所属站点
  const sectionList = useSelector(selectOneLevel);
  const [defaultArea, setDefaultArea] = useState(
    sectionList[0]?.id || undefined
  );
  const [areaId, setAreaId] = useState(sectionList[0]?.id || undefined);
  const changeArea = (value) => {
    setAreaId(value);
  };
  const columns = ispublish
    ? [
        {
          align: "center",
          title: "站点名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "安装地址",
          dataIndex: "address",
          key: "address",
          align: "center",
        },
        {
          title: "站点类型",
          dataIndex: "type",
          key: "type",
          align: "center",
        },
        {
          title: "站点容量 (kWh)",
          dataIndex: "capacity",
          key: "capacity",
          align: "center",
        },
        {
          title: "投运时间",
          dataIndex: "time",
          key: "time",
          align: "center",
        },
        {
          title: "投资性质",
          dataIndex: "nature",
          key: "nature",
          align: "center",
        },
      ]
    : [
        {
          align: "center",
          title: "站点名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "安装地址",
          dataIndex: "address",
          key: "address",
          align: "center",
        },
        {
          title: "站点类型",
          dataIndex: "type",
          key: "type",
          align: "center",
        },
        {
          title: "站点容量 (kWh)",
          dataIndex: "capacity",
          key: "capacity",
          align: "center",
        },
        {
          title: "投运时间",
          dataIndex: "time",
          key: "time",
          align: "center",
        },
        {
          title: "投资性质",
          dataIndex: "nature",
          key: "nature",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (_, record) => (
            <Space size="middle">
              <span
                className={style.editText}
                onClick={() => editRecord(record)}
              >
                编辑
              </span>
              <span
                className={style.deleteText}
                onClick={() => deleteRecord(record)}
              >
                删除
              </span>
            </Space>
          ),
        },
      ];
  const paginationProps = {};
  //表格展示数据
  // const [dataSource, setDataSource] = useState([]);
  const dataSource = [
    {
      id: 1,
      name: "站点名称1",
      address: "1号楼B2 储能室",
      type: "站点类型",
      capacity: "200 kWh",
      time: "2023/03/13",
      nature: "业主自投",
    },
    {
      id: 2,
      name: "站点名称2",
      address: "3号楼B2 储能室",
      type: "站点类型",
      capacity: "200 kWh",
      time: "2023/01/11",
      nature: "运营商投资",
    },
  ];
  //点击新增 打开弹框
  const showAdd = () => {
    setModalTitle("新增站点");
    setAddModal(true);
  };
  //编辑
  const editRecord = () => {};
  //删除
  const deleteRecord = () => {};
  //删除告警类型确认
  const deleteTypeOk = () => {};
  const handleTypeDelete = () => {};
  //新增 确认
  const addOk = () => {
    setAddModal(false);
  };
  //新增 取消
  const addCancel = () => {
    setAddModal(false);
  };
  return (
    <div className={style.box}>
      <div className={style.content}>
        <div className={style.contentHead}>
          <div className={style.contentTitle}>站点管理</div>
          {ispublish ? null : (
            <Button
              type="primary"
              className={style.contentAdd}
              onClick={showAdd}
            >
              新增
            </Button>
          )}
        </div>
        <Table
          style={{ marginTop: "16px" }}
          columns={columns}
          dataSource={dataSource}
          rowKey={(record) => record.id}
          size="small"
          pagination={paginationProps}
          ref={tableRef}
          bordered
        ></Table>
        <Modal
          className={style.deleteModal}
          open={deleteTypeModal}
          onOk={deleteTypeOk}
          onCancel={handleTypeDelete}
          width={512}
          cancelText={"取消"}
          centered={true}
          closable={false}
          maskClosable={false}
          okText={"确认"}
          okType={"primary"}
        >
          <div className={style.deleteHeader}>删除提示</div>
          <div className={style.deleteBody}>
            <img className={style.warnIcon} src={firstwarn}></img>
            <span>是否确认删除站点？</span>
          </div>
        </Modal>
        <Modal
          className={style.addModal}
          open={addModal}
          onOk={addOk}
          onCancel={addCancel}
          width={550}
          cancelText={"取消"}
          centered={true}
          closable={false}
          maskClosable={false}
          okText={"确认"}
          okType={"primary"}
        >
          <div className={style.addHeaderTitle}>{modalTitle}</div>
          <Form
            name="addform"
            form={form}
            requiredMark={false}
            autoComplete="off"
            labelAlign="left"
            labelCol={{ flex: "90px" }}
          >
            <Item
              name="name"
              label="所属站点"
              rules={[{ required: true, message: "请选择所属站点" }]}
            >
              <Select
                key={defaultArea}
                onChange={changeArea}
                placeholder="请选择所属站点"
              >
                {sectionList.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Item>
            <Item
              name="address"
              label="安装地址"
              rules={[{ required: true, message: "请输入安装地址" }]}
            >
              <Input placeholder="请输入安装地址" />
            </Item>
            <Item
              name="capacity"
              label="容量(kWh)"
              rules={[{ required: true, message: "请输入储能容量" }]}
            >
              <Input placeholder="请输入储能容量" />
            </Item>
            <Item
              label="投运时间"
              name="time"
              rules={[
                {
                  required: true,
                  message: "请选择投运时间！",
                },
              ]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
