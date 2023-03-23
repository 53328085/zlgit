import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import dashed from "@imgs/dashed.png";
import { PlusOutlined } from "@ant-design/icons";
import firstwarn from "@imgs/warning.png";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Divider,
  message,
} from "antd";
import AlarmEventModal from "./alarmEventModal";
import { AlarmManagement } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import { useRequest } from "ahooks";
export default function Index() {
  const { QueryAlarmPage, QueryAddAlarm, DeletePlanAlarm, UpdatePlanAlarm } =
    AlarmManagement;
  const projectId = useSelector(selectProjectId);
  const [messageApi] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };
  const tableRef = useRef();

  const Item = Form.Item;
  //告警管理数据
  const [pageNum, setPageNum] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  // const [total, setTotal] = useState(0);
  const pageSize = 10;
  //表格展示数据
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceType, setDataSourceType] = useState([]);
  const getAlarmData = () => {
    return QueryAlarmPage(projectId, pageNum, pageSize).then((res) => {
      if (res.success) {
        if (res.data) {
          setDataSource(JSON.parse(res.data));
        }
        // setTotal(res.total);
        console.log(dataSource);
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
    // total, // 总条数
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
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "备注",
      dataIndex: "Tag",
      key: "Tag",
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <span className={style.editText} onClick={() => edit(record)}>
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
  const columnsType=[
    {
      align: "center",
      title: "告警事件",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "数据标识",
      dataIndex: "Tag",
      key: "Tag",
      align: "center",
    },{
      align: "center",
      title: "告警描述",
      dataIndex: "Name",
      key: "Name",
      width:300
    },
    {
      title: "APP推送",
      dataIndex: "Tag",
      key: "Tag",
      align: "center",
    },
    {
      align: "center",
      title: "微信推送",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "短信推送",
      dataIndex: "Tag",
      key: "Tag",
      align: "center",
    },{
      align: "center",
      title: "是否推送",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "间隔时间",
      dataIndex: "Tag",
      key: "Tag",
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width:120,
      render: (_, record) => (
        <Space size="middle">
          <span className={style.editText} onClick={() => edit(record)}>
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
    }
  ]

  //  新增告警声明初始化
  const [Name, setName] = useState();
  const [Tag, setTag] = useState();

  //新增告警事件
  const [addAlarmEvent, setAddAlarmEvent] = useState(false);
  //新增告警
  const [addModal, setAddModal] = useState(false);
  //新增告警方案
  const [addAlarmModal, setaddAlarmModal] = useState(false);
  const [form] = Form.useForm();
  //删除弹窗
  const [deleteModal, setDeleteModal] = useState(false);
  //删除确认
  const deleteOk = () => {
    // return
    DeletePlanAlarm(projectId, deleteId).then((res) => {
      if (res.success) {
        message.success("告警方案删除成功！");
        getAlarmData();
        // if(dataSource.length == 1 && pageNum > 1){
        //   setPageNum(pageNum - 1)
        // }else{
        //   getAlarmData()
        // }
      } else {
        message.error("删除失败,请重试！");
      }
    });
    setDeleteModal(false);
  };
  const handleDelete = () => {
    setDeleteModal(false);
  };
  // 删除
  const [deleteId, setDeleteId] = useState();
  const deleteRecord = (record) => {
    setDeleteId(record.Id);
    setDeleteModal(true);
  };
  //编辑
  const [editId, setEditId] = useState();
  const [editType, setEditType] = useState(false);
  const edit = (record) => {
    // UpdatePlanAlarm(record.Id,Name,Tag).then(res=>{

    //   console.log(record);
    // })
    setEditType(true);
    setEditId(record.Id);
    setModalTitle("编辑告警方案");
    setaddAlarmModal(true);
    form.setFieldsValue(record);
  };

  //新增告警
  const showAdd = () => {
    form.resetFields();
    setModalTitle("新增告警方案");
    setAddModal(true);
  };
  //下一步
  const addOk = async () => {
    // setAddModal(false);
    // setaddAlarmModal(true);
    setEditType(false);
    // return
    try {
      const values = await form.validateFields();
      setName(values.Name);
      setTag(values.Tag);
      console.log(values, Name, Tag);
      let params = {
        projectId: projectId,
        name: values.Name,
        tag: values.Tag,
      };
      QueryAddAlarm(params).then((res) => {
        if (res.success) {
          // messageApi.open({
          //   type: "success",
          //   content: "告警方案新增成功！",
          // });
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
    if (addAlarmModal === true) {
      getAlarmData();
    }
  };
  //新增保存--编辑告警方案
  const addAlarmOk = async () => {
    const values = await form.validateFields();
    console.log(values.Name,typeof(values.Name));
    let params = {
      id: editId,
      name: values.Name,
      tag: values.Tag,
    };
    // return
    UpdatePlanAlarm(params).then((res) => {
      if (res.success) {
        message.success("告警方案编辑成功！");
        getAlarmData();
        setaddAlarmModal(false);
      } else {
        message.error("告警方案编辑失败！");
      }
    });
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
          rowKey="key"
          size="small"
          pagination={paginationProps}
          ref={tableRef}
          bordered
        ></Table>
        <Modal
          className={style.deleteModal}
          open={deleteModal}
          onOk={deleteOk}
          onCancel={handleDelete}
          width={512}
          cancelText={"取消"}
          centered={true}
          closable={false}
          maskClosable={false}
          okText={"确认"}
          okType={"primary"}
          okButtonProps={{ danger: true }}
        >
          <div className={style.deleteHeader}>删除提示</div>
          <div className={style.deleteBody}>
            <img className={style.warnIcon} src={firstwarn}></img>
            <span>是否确认删除告警方案？</span>
          </div>
        </Modal>
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
                name="Name"
                label="方案名称 (必填)"
                rules={[{ required: true, message: "请输入方案名称" }]}
              >
                <Input placeholder="请输入告警方案名称" />
              </Item>
              <Item name="Tag" label="备注信息">
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
          width={1000}
          centered={true}
          closable={true}
          maskClosable={false}
          okText={"完成"}
          okType={"primary"}
          // okButtonProps={{ primary: true }}
        >
          <div className={style.addHeader}>{modalTitle}</div>
          <div className={style.addBody}>
            {editType === true ? (
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                name="addform"
              >
                <Item
                  name="Name"
                  label="方案名称 (必填)"
                  rules={[{ required: true, message: "请输入方案名称" }]}
                >
                  <Input placeholder="请输入告警方案名称" />
                </Item>
                <Item name="Tag" label="备注信息">
                  <Input />
                </Item>
              </Form>
            ) : (
              <div>
                <p>方案名称：{Name}</p>
                <p>方案备注：{Tag}</p>
              </div>
            )}
            <Divider dashed />
            <p>请配置项目需要推送的系统分析告警类型</p>
            <Table style={{marginTop:'16px'}} columns={columnsType} dataSource={dataSourceType} rowKey='key' bordered></Table>
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
