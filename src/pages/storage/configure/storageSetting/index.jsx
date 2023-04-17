import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import firstwarn from "@imgs/warning.png";
import { useSelector } from "react-redux";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
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
  Upload,
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
  const oneLevel = useSelector((state) => state.system.onelevel);
  //表格展示数据
  // const [dataSource, setDataSource] = useState([]);
  const dataSource = [];
  //分页
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    total, // 总条数
    onChange: (page) => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
  };
  const handlePageChange = (page) => {
    setPageNum(page);
  };
  const natureList = [
    {
      id: 1,
      name: "业主自投",
    },
    {
      id: 2,
      name: "运营商投资",
    },
    {
      id: 3,
      name: "建设投资",
    },
  ];
  //删除告警类型弹窗
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  //新增 修改 弹窗
  const [addModal, setAddModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  //&所属园区
  const areaList = useSelector(selectOneLevel);
  const [defaultArea, setDefaultArea] = useState(areaList[0]?.id || undefined);
  const changeArea = (value) => {
    setDefaultArea(value);
  };
  // 所属站点
  const sectionList = [
    {
      id: 1,
      name: "正泰物联杭州园区",
    },
    {
      id: 2,
      name: "正泰物联温州园区",
    },
  ];
  const [defaultsection, setDefaultSection] = useState(
    sectionList[0]?.id || undefined
  );
  const changeSection = (value) => {
    setDefaultSection(value);
  };
  const [defaultNature, setDefaultNature] = useState(natureList[0].id);
  const changeNature = (value) => {
    setDefaultNature(value);
  };
  const ChangeTime = (value) => {
    console.log(value);
  };
  const columns = ispublish
    ? [
        {
          title: oneLevel[0]?.levelName ? oneLevel[0].levelName : "园区名称",
          dataIndex: "station",
          key: "station",
          align: "center",
        },
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
          title: "备注",
          dataIndex: "tag",
          key: "tag",
          align: "center",
        },
      ]
    : [
        {
          title: oneLevel[0]?.levelName ? oneLevel[0].levelName : "园区名称",
          dataIndex: "station",
          key: "station",
          align: "center",
        },
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
          title: "备注",
          dataIndex: "tag",
          key: "tag",
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

  //点击新增 打开弹框
  const showAdd = () => {
    form.resetFields(); //当新增时重置
    setFileList();
    setModalTitle("新增站点");
    setAddModal(true);
  };
  //编辑
  const editRecord = (record) => {
    console.log(record);
    setModalTitle("编辑站点");
    setAddModal(true);
    form.setFieldsValue({ time: moment("2010-01-01", "YYYY-MM-DD") });
    form.setFieldsValue(record);
  };
  //删除
  const deleteRecord = (record) => {
    setDeleteTypeModal(true);
  };
  //删除站点确认
  const deleteOk = () => {
    setDeleteTypeModal(false);
  };
  //删除站点取消
  const deleteCancel = () => {
    setDeleteTypeModal(false);
  };
  //新增 确认
  const addOk = async() => {
    if (modalTitle === "新增站点") {
      const values = await form.validateFields();
      console.log(values.image)
    } else if (modalTitle === "编辑站点") {
      setAddModal(false);
    }
  };
  //新增 取消
  const addCancel = () => {
    setAddModal(false);
    setImageUrl();
  };
  const [fileList, setFileList] = useState([]); //文件列表
  const [imageUrl, setImageUrl] = useState(""); //上传的图片
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const normFile = async (e) => {
    return await getBase64(e.file);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      console.log(file);
      const reader = new FileReader();
      if (file.status === "removed") {
        setImageUrl();
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }
    });
  // 上传文件之前的钩子，参数为上传的文件
  const beforeUpload = async (file) => {
    const url = await getBase64(file);
    setImageUrl(url);
    return false;
  };
  // onPreview	点击文件链接或预览图标时的回调
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleCancel = () => {
    setPreviewOpen(false);
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
          onOk={deleteOk}
          onCancel={deleteCancel}
          width={512}
          cancelText={"取消"}
          centered={true}
          closable={false}
          maskClosable={false}
          okText={"确认"}
          okType={"danger primary"}
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
          width={640}
          cancelText={"取消"}
          centered={true}
          closable={false}
          maskClosable={false}
          okText={"确认"}
          okType={"primary"}
          forceRender={true}
        >
          <div className={style.addHeaderTitle}>{modalTitle}</div>
          <Form
            name="addform"
            form={form}
            requiredMark={false}
            autoComplete="off"
            labelAlign="left"
            colon={false}
            labelCol={{ flex: "90px" }}
          >
            <Item
              name="areaId"
              label={
                oneLevel[0]?.levelName ? '所属' + oneLevel[0].levelName : "所属园区"
              }
              rules={[
                { required: true, message: `请选择${oneLevel[0].levelName}` },
              ]}
            >
              <Select
                placeholder={
                  oneLevel[0]?.levelName
                    ? `请选择${oneLevel[0].levelName}`
                    : "园区名称"
                }
              >
                {areaList.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Item>
            <Item
              name="name"
              label="站点名称"
              rules={[{ required: true, message: "请输入站点名称" }]}
            >
              <Input placeholder="请输入站点名称"></Input>
            </Item>
            <Item
              name="no"
              label="站点编号"
              rules={[{ required: true, message: "请输入站点编号" }]}
            >
              <Input placeholder="请输入站点编号" />
            </Item>
            <Item
              name="capacity"
              label="储能容量"
              rules={[{ required: true, message: "请输入储能容量" }]}
            >
              <Input placeholder="请输入储能容量" />
            </Item>
            <Item
              label="投运时间"
              name="deliveryTime"
              rules={[
                {
                  required: true,
                  message: "请选择投运时间",
                },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                onChange={ChangeTime}
              />
            </Item>
            <Item
              name="investmentNature"
              label="投资性质"
              rules={[{ required: true, message: "请选择所属站点" }]}
            >
              <Select
                placeholder="请选择投资性质"
              >
                {natureList.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Item>
            <Item name="remark" label="备注信息">
              <Input placeholder="请输入备注信息" />
            </Item>
            <Item name="image" label="站点图片" getValueFromEvent={normFile}>
              <Upload
                listType="picture-card"
                className={style.uploader}
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
                beforeUpload={beforeUpload}
              >
                {imageUrl ? null : (
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Upload
                    </div>
                  </div>
                )}
              </Upload>
            </Item>
          </Form>
        </Modal>
        <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </div>
    </div>
  );
}
