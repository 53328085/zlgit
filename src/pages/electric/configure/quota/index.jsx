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
import { selectProjectId, publishState } from "@redux/systemconfig.js";
import { useRequest } from "ahooks";

import { useSelector } from "react-redux";
export default function Index() {
  const ispublish = useSelector(publishState);
  const {
    QueryAlarmPage,
    QueryAddAlarm,
    DeletePlanAlarm,
    UpdatePlanAlarm,
    QueryAlarmEvents,
    AddAlarmEventInterval,
    AddAlarmEventOverrun,
    AddAlarmEventDeflection,
    AddAlarmEventSOE,
    AddAlarmEventCommunication,
    DeleteAlarmEvent,
    UpdateAlarmEventOverrun,
    UpdateAlarmEventInterval,
    UpdateAlarmEventDeflection,
    UpdateAlarmEventSOE,
    UpdateAlarmEventCommunication,
  } = AlarmManagement;
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
  const [addModalTitle, setAddModalTitle] = useState("");
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  //表格展示数据
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceType, setDataSourceType] = useState([]);
  const [noDataInForm, setNoDataInForm] = useState();
  const getAlarmData = () => {
    return QueryAlarmPage(projectId, pageNum, pageSize).then((res) => {
      if (res.success) {
        if (res.data) {
          setDataSource(res.data);
          setTotal(res.total);
        }
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

  const columns = ispublish
    ? [
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
      ]
    : [
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
  //删除弹窗
  const [deleteModal, setDeleteModal] = useState(false);
  //删除告警类型弹窗
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  //删除确认
  const deleteOk = () => {
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
        message.error(res.errMsg ? res.errMsg : "删除失败,请重试！");
      }
    });
    setDeleteModal(false);
  };
  const handleDelete = () => {
    setDeleteModal(false);
  };
  //删除告警类型确认
  const deleteTypeOk = () => {
    DeleteAlarmEvent(projectId, deleteTypeId).then((res) => {
      if (res.success) {
        message.success("告警类型删除成功！");
        setDeleteTypeModal(false);
        //刷新告警类型数据
        runEdit();
      } else {
        message.error(res.errMsg ? res.errMsg : "删除失败！");
        setDeleteTypeModal(false);
      }
    });
    setDeleteTypeModal(false);
  };
  const handleTypeDelete = () => {
    setDeleteTypeModal(false);
  };

  // 删除
  const [deleteId, setDeleteId] = useState();
  const deleteRecord = (record) => {
    setDeleteId(record.id);
    setDeleteModal(true);
  };
  //编辑
  const [editId, setEditId] = useState();
  const [editType, setEditType] = useState(false);
  const edit = (record) => {
    setEditId(record.id);
    setDataSourceType();
    QueryAlarmEvents(record.id).then((res) => {
      if (res.success) {
        if (res.data) {
          setDataSourceType(JSON.parse(res.data));
          console.log(JSON.parse(res.data));
        }
      } else {
        messageApi.open({
          type: "error",
          content: res.errMsg,
        });
      }
    });

    setEditType(true);
    setModalTitle("编辑告警方案");
    setaddAlarmModal(true);
    form.setFieldsValue(record);
  };
  //用于告警类型  新增、修改、删除后调用
  const alarmTypeTable = () => {
    setDataSourceType();
    QueryAlarmEvents(editId).then((res) => {
      if (res.success) {
        if (res.data) {
          setDataSourceType(JSON.parse(res.data));
          console.log(JSON.parse(res.data));
        }
      } else {
        messageApi.open({
          type: "error",
          content: res.errMsg,
        });
      }
    });
  };
  const { run: runEdit } = useRequest(alarmTypeTable, {
    manual: true,
  });
  const columnsType = [
    {
      align: "center",
      title: "告警事件",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "数据标识",
      dataIndex: "PointIdentifier",
      key: "PointIdentifier",
      align: "center",
    },
    {
      align: "center",
      title: "告警描述",
      dataIndex: "Content",
      key: "Content",
      width: 300,
    },
    // {
    //   align: "center",
    //   title: "告警类型",
    //   dataIndex: "AlarmCondition",
    //   key: "AlarmCondition",
    // },
    // {
    //   title: "APP推送",
    //   dataIndex: "tag",
    //   key: "tag",
    //   align: "center",
    // },
    // {
    //   align: "center",
    //   title: "微信推送",
    //   dataIndex: "name",
    //   key: "name",
    // },

    {
      title: "是否连续推送",
      dataIndex: "Push",
      key: "Push",
      align: "center",
      width: 80,
      render: (text) => {
        return <>{text === true ? <span>是</span> : <span>否</span>}</>;
      },
    },
    {
      title: "是否启用",
      dataIndex: "Enable",
      key: "Enable",
      align: "center",
      width: 80,
      render: (text) => {
        return <>{text === true ? <span>是</span> : <span>否</span>}</>;
      },
    },
    {
      title: "持续时间/秒",
      dataIndex: "Time",
      key: "Time",
      align: "center",
      width: 100,
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <span
            className={style.editText}
            onClick={() => editAlarmInfo(record)}
          >
            编辑
          </span>
          <span
            className={style.deleteText}
            onClick={() => deleteAlarmInfo(record)}
          >
            删除
          </span>
        </Space>
      ),
    },
  ];
  //删除告警配置
  const [deleteTypeId, setDeleteTypeId] = useState();
  const deleteAlarmInfo = (record) => {
    setDeleteTypeId(record.Id);
    setDeleteTypeModal(true);
  };
  //编辑告警类型配置
  const [giveChildFormRecord, setGiveChildFormRecord] = useState({});
  const [editTypeId, setEditTypeId] = useState({});
  const editAlarmInfo = (record) => {
    setGiveChildFormRecord(record);
    setEditTypeId(record.Id);
    setAddAlarmEvent(true);
    setNoDataInForm(false); //区分新增编辑
    setAddModalTitle("编辑告警事件");
  };
  //新增告警
  const showAdd = () => {
    form.resetFields();
    setModalTitle("新增告警方案");
    setAddModal(true);
  };
  //下一步
  const addOk = async () => {
    setEditType(false);
    try {
      const values = await form.validateFields();
      setName(values.name);
      setTag(values.tag);
      let params = {
        projectId: projectId,
        name: values.name,
        tag: values.tag,
      };
      QueryAddAlarm(params).then((res) => {
        if (res.success) {
          setDataSourceType();
          setEditId(res.data);
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
    let params = {
      id: editId,
      name: values.name,
      tag: values.tag,
    };
    UpdatePlanAlarm(params).then((res) => {
      if (res.success) {
        message.success("告警方案编辑成功！");
        getAlarmData();
        setaddAlarmModal(false);
      } else {
        message.error(res.errMsg ? res.errMsg : "告警方案编辑失败！");
      }
    });
  };
  const showAddAlarmEvent = () => {
    setAddAlarmEvent(true);
    setNoDataInForm(true);
    setAddModalTitle("新增告警事件");
  };
  const changeAddAlarmEvent = () => {
    setAddAlarmEvent(false);
  };

  //新增告警事件《新增告警事件》表单数据
  const [childFormInfo, setChildFormInfo] = useState({});
  const getFromChild = (data) => {
    setChildFormInfo(data);
  };
  const childformInfo = () => {
    if (addModalTitle === "新增告警事件") {
      childFormInfo.planId = editId;
      if (childFormInfo.alarmRule === 1) {
        return AddAlarmEventOverrun(childFormInfo).then((res) => {
          if (res.success) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 2) {
        return AddAlarmEventInterval(childFormInfo).then((res) => {
          if (res.success) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 3) {
        return AddAlarmEventDeflection(childFormInfo).then((res) => {
          if (res.success) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 4) {
        return AddAlarmEventSOE(childFormInfo).then((res) => {
          if (res.success) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 5) {
        return AddAlarmEventCommunication(childFormInfo).then((res) => {
          if (res.success) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      }
    } else if (addModalTitle === "编辑告警事件") {
      childFormInfo.planId = editId;
      childFormInfo.id = editTypeId;
      if (childFormInfo.alarmRule === 1) {
        return UpdateAlarmEventOverrun(childFormInfo).then((res) => {
          if (res.success) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 2) {
        return UpdateAlarmEventInterval(childFormInfo).then((res) => {
          if (res.success) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 3) {
        return UpdateAlarmEventDeflection(childFormInfo).then((res) => {
          if (res.success) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 4) {
        return UpdateAlarmEventSOE(childFormInfo).then((res) => {
          if (res.success) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 5) {
        return UpdateAlarmEventCommunication(childFormInfo).then((res) => {
          if (res.success) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      }
    }
  };
  const { run: runChildformInfo } = useRequest(childformInfo, {
    manual: true,
  });
  //获取子组件
  useEffect(() => {
    getAlarmData();
  }, [pageNum]);
  useEffect(() => {
    runChildformInfo();
  }, [childFormInfo]);
  return (
    <div className={style.box}>
      <div className={style.content}>
        <div className={style.contentTitle}>告警管理</div>
        <div className={style.line}>
          <img className={style.lineImg} src={dashed}></img>
        </div>
        {ispublish ? null : (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showAdd()}
          >
            新增方案
          </Button>
        )}
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
            <span>是否确认删除告警类型？</span>
          </div>
        </Modal>

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
          width={1000}
          centered={true}
          closable={true}
          maskClosable={false}
          okText={"完成"}
          okType={"primary"}
          footer={editType === true ? undefined : null}
        >
          <div className={style.addHeader}>{modalTitle}</div>
          <div className={style.addBody}>
            {editType === true ? (
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                name="addform"
                className={style.addForm}
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
            ) : (
              <div>
                <p>方案名称：{name}</p>
                <p>方案备注：{tag}</p>
              </div>
            )}
            <Divider dashed />
            <p>请配置项目需要推送的系统分析告警类型</p>
            <Table
              style={{ marginTop: "16px" }}
              columns={columnsType}
              dataSource={dataSourceType}
              rowKey={(record) => record.Id}
              bordered
              size="small"
              className={style.addSourceTypeTable}
              pagination={false}
              scroll={{ y: 240 }}
            ></Table>
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
          getValues={getFromChild}
          giveChildForm={giveChildFormRecord}
          giveFormType={noDataInForm}
          giveModalTitle={addModalTitle}
        ></AlarmEventModal>
      </div>
    </div>
  );
}
