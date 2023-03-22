import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import dashed from "@imgs/dashed.png";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Divider,
  message 
} from "antd";
import AlarmEventModal from "./alarmEventModal";
import { AlarmManagement } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
export default function Index() {
  const { QueryAlarmPage, QueryAddAlarm } = AlarmManagement;
  const projectId = useSelector(selectProjectId);
  const [messageApi] = message.useMessage();
  const tableRef = useRef();

  const Item = Form.Item;
  //告警管理数据
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  //表格展示数据
  const [dataSource, setDataSource] = useState([]);
  const getAlarmData = () => {
    return QueryAlarmPage(projectId, pageNum, pageSize).then((res) => {
      if (res.success) {
        setDataSource(JSON.parse(res.data));
        // setTotal(res.total);
      } else {
        messageApi.open({
          type: "error",
          content: res.errMsg,
        });
      }
    });
  };
  const { data: AreaData } = useRequest(getAlarmData, {
    onSuccess: (result, params) => {},
  });
  //分页
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

  const columns = [
    {
      align: "center",
      title: "告警方案名称",
      dataIndex: "name",
      key: "name",
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
          <span className={style.editText} onClick={() => edit()}>
            编辑
          </span>
          <span className={style.deleteText} onClick={() => deleteRecord()}>
            删除
          </span>
        </Space>
      ),
    },
  ];

  //  新增告警声明初始化
  const [name, setName] = useState();
  const [tag, setTag] = useState();

  //新增告警事件
  const [addAlarmEvent, setAddAlarmEvent] = useState(false);
  //新增告警
  const [addModal, setAddModal] = useState(false);
  //新增告警方案
  const [addAlarmModal, setaddAlarmModal] = useState(false);
  const [form] = Form.useForm();
  //删除
  const deleteRecord = () => {
    setAddModal(true);
  };
  //新增告警
  const showAdd = () => {
    setAddModal(true);
  };
  //下一步
  const addOk = async () => {
    try {
      const values = await form.validateFields();
      let params = {
        projectId: projectId,
        name: values.name,
        tag: values.tag,
      };
      return
        QueryAddAlarm(params).then((res) => {
          if (res.success) {
            messageApi.open({
              type: "success",
              content: "告警方案新增成功！",
            });
          } else {
            messageApi.open({
              type: "error",
              content: res.errMsg || "新增失败,请重试！",
            });
          }
        });
      // else if(modalTitle == '编辑配电房'){
      //   params.id = editId
      //   updateRoom(params).then(res => {
      //     if(res.success){
      //       messageApi.open({
      //         type:'success',
      //         content:'配电房编辑成功！',
      //       })
      //       queryRoom()
      //     }else{
      //       messageApi.open({
      //         type:'error',
      //         content:res.errMsg || '配电房编辑失败,请重试！',
      //       })
      //     }

      setAddModal(false);
      setaddAlarmModal(true);
    } catch (errorInfo) {}
  };
  //取消告警
  const handleCancel = () => {
    setAddModal(false);
    setaddAlarmModal(false);
  };
  //新增告警方案
  const addAlarmOk = () => {
    setaddAlarmModal(true);
  };
  //新增告警事件
  const showAddAlarmEvent = () => {
    setAddAlarmEvent(true);
  };
  const changeAddAlarmEvent = () => {
    setAddAlarmEvent(false);
  };
  return (
    <div className={style.box}>
      <div className={style.content}>
        <div className={style.contentTitle}>告警管理</div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showAdd()}
        >
          新增方案
        </Button>
        <Table
          style={{ marginTop: "16px" }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          size="small"
          pagination={paginationProps}
          ref={tableRef}
        ></Table>
        <Modal
          className={style.addModal}
          open={addModal}
          onOk={addOk}
          onCancel={handleCancel}
          width={600}
          cancelText={"取消"}
          centered={true}
          closable={false}
          maskClosable={false}
          okText={"下一步"}
          okType={"primary"}
          // okButtonProps={{ primary: true }}
        >
          <div className={style.addHeader}>新增告警</div>
          <div className={style.addBody}>
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              name="addform"
            >
              <Item
                name="name"
                label="方案名称 (必填)"
                rules={[{ required: true, message: "请输入方案名称" }]}
              >
                <Input placeholder="请输入告警方案名称" />
              </Item>
              <Item name="tag" label="备注信息">
                <Input />
              </Item>
            </Form>
          </div>
        </Modal>
        <Modal
          className={style.addModal}
          open={addAlarmModal}
          onOk={addAlarmOk}
          onCancel={handleCancel}
          width={600}
          centered={true}
          closable={true}
          maskClosable={false}
          okText={"完成"}
          okType={"primary"}
          // okButtonProps={{ primary: true }}
        >
          <div className={style.addHeader}>新增告警</div>
          <div className={style.addBody}>
            <p>方案名称：告警方案1</p>
            <p>方案备注：正泰物联杭州园区</p>
            <Divider dashed />
            <p>请配置项目需要推送的系统分析告警类型</p>
            <Button
              onClick={() => showAddAlarmEvent()}
              block
              icon={<PlusOutlined />}
              className={style.addAlarm}
            >
              新增系统告警类型
            </Button>
          </div>
        </Modal>
        <AlarmEventModal
          AddAlarmEventGive={addAlarmEvent}
          callBack={changeAddAlarmEvent}
        ></AlarmEventModal>
      </div>
    </div>
  );
}
