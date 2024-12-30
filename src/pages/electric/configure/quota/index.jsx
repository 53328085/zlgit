import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import { useTranslation } from 'react-i18next'
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import Mask from '@com/mask.jsx'
import UseTransfer from './transfer';
import { ExportExcel } from '@com/useButton'
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Divider,
  message,
  Typography
} from "antd";
import AlarmEventModal from "./alarmEventModal";
import { AlarmManagement } from "@api/api.js";
import { selectProjectId, publishState } from "@redux/systemconfig.js";
import { useRequest, useAntdTable } from "ahooks";

import { useSelector } from "react-redux";
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import CModal from '@com/useModal'
import Usetable from '@com/useTable'
const { Link } = Typography
export default function Index() {
  const ispublish = useSelector(publishState);
  const { t } = useTranslation(["button"])
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
    CopyPlan,
    QueryValveDevicePage,
    GetAlarmValveDevice
  } = AlarmManagement;
  const projectId = useSelector(selectProjectId);
  const [messageApi] = message.useMessage();
  const tableRef = useRef();

  const Item = Form.Item;
  //告警管理数据
  const [pageNum, setPageNum] = useState(1);
  const [modalTitle, setModalTitle] = useState("");
  const [addModalTitle, setAddModalTitle] = useState("");

  //表格展示数据

  const [dataSourceType, setDataSourceType] = useState([]);
  const [noDataInForm, setNoDataInForm] = useState();
  const getAlarmData = ({ current, pageSize }) => {
    if (!projectId) return new Promise((resolve) => {

      resolve({
        list: [],
        total: 0
      })
    })
    return QueryAlarmPage(projectId, current, pageSize).then((res) => {
      let { success, data, total } = res
      if (success) {
        if (Array.isArray(data) && data?.length > 0) {
          const data = res.data.map(item => ({ ...item, tag: item?.remark }))
          return {
            list: data,
            total
          }
          //setDataSource(data);
          //setTotal(res.total);
        } else {
          return {
            list: [],
            total: 0
          }
        }
      } else {
        messageApi.open({
          type: "error",
          content: res.errMsg,
        });
      }
    });
  };
  const { tableProps, refresh } = useAntdTable(getAlarmData, {
    defaultPageSize: 14,
    refreshDeps: [projectId]
  });

  const copyRecord = async (record) => {
    try {
      let { id } = record
      let { success, data = NaN } = await CopyPlan({ projectId, id })
      if (success && parseInt(data) > 0) {
        refresh()
        message.success("复制成功")

      } else {
        message.warning(errMsg || "数据错误")
      }


    } catch (error) {

    }


  }

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
            <Link underline className={style.editText} onClick={() => edit(record)}>
              {t("button:edit")}
            </Link>
            <Link
              underline
              onClick={() => copyRecord(record)}
            >
              复制
            </Link>
            <Link
              type="danger"
              underline
              onClick={() => deleteRecord(record)}
            >
              {t("button:delete")}
            </Link>
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
      if (res.success === true) {
        message.success("告警方案删除成功！");
        refresh()
      } else {
        message.error(res.errMsg ? res.errMsg : "删除失败,请重试！");
      }
    });
    setDeleteModal(false);
  };
  const handleDelete = () => {
    setDeleteModal(false);
  };

  const [deleteFlag, setDeleteFlag] = useState(false);
  //删除告警类型确认
  const deleteTypeOk = () => {
    DeleteAlarmEvent(projectId, deleteTypeId).then((res) => {
      if (res.success === true) {
        message.success("告警类型删除成功！");
        setDeleteTypeModal(false);
        //删除调用清空告警类型table数据
        setDeleteFlag(true);
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
    console.log(record)
    setDataSourceType();
    setEditId(record.id);
    QueryAlarmEvents(record.id).then((res) => {
      if (res.success === true) {
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
    form.setFieldsValue({ ...record, tag: record?.remark });
  };
  //用于告警类型  新增、修改、删除、取消后调用
  const alarmTypeTable = () => {
    //删除调用清空告警类型table数据
    if (deleteFlag === true) {
      setDataSourceType();
      setDeleteFlag(false);
    } else {
    }
    QueryAlarmEvents(editId).then((res) => {
      if (res.success === true) {
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
      width: 60,
      render: (text) => {
        return <>{text === true ? <span>是</span> : <span>否</span>}</>;
      },
    },
    {
      title: "是否启用",
      dataIndex: "Enable",
      key: "Enable",
      align: "center",
      width: 60,
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
      title: "告警类型",
      dataIndex: "AlarmRule",
      key: "AlarmRule",
      align: "center",
      width: 80,
      render: (text) => {
        return (

          <>
            {['', '越限告警', '区间告警', '变位告警', 'SOE告警', '离线告警'][text] || ''}
            {/*   {text === "Empty " ? (
              <span>-</span>
            ) : text === "Overrun" ? (
              <span>越限告警</span>
            ) : text === "Interval" ? (
              <span>区间告警</span>
            ) : text === "Deflection" ? (
              <span>变位告警</span>
            ) : text === "SOE" ? (
              <span>SOE告警</span>
            ) : text === "Communication" ? (
              <span>离线告警</span>
            ) : (
              ""
            )} */}
          </>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 160,
      render: (_, record) => {
        console.log(record)
        return (
          <Space size="middle">
            <span
              className={style.editText}
              onClick={() => editAlarmInfo(record)}
            >
              {t("button:edit")}
            </span>
            <span
              className={style.deleteText}
              onClick={() => deleteAlarmInfo(record)}
            >
              {t("button:delete")}
            </span>
            <span
              className={style.editText}
              onClick={() => associationAlarmInfo(record)}
            >
              {t("button:association")}
            </span>
          </Space>
        )
      }
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

    console.log('record', record)
    setGiveChildFormRecord({ ...record, HourRange: [moment(record.HourStart, 'HH'), moment(record.HourEnd, 'HH')] });
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
        remark: values.tag ? values.tag : '',
      };
      console.log(params)
      QueryAddAlarm(params).then((res) => {
        if (res.success === true) {
          setDataSourceType();
          setEditId(res.data);
          setAddModal(false);
          setaddAlarmModal(true);
        } else {
          message.error(res.errMsg ? res.errMsg : "新增告警方案失败！");
        }
      });
    } catch (errorInfo) { }
  };
  //取消告警
  const handleCancel = () => {
    setAddModal(false);
    setaddAlarmModal(false);
    if (addAlarmModal === true) {
      refresh();
    }
  };
  //新增保存--编辑告警方案
  const addAlarmOk = async () => {
    const values = await form.validateFields();
    let params = {
      id: editId,
      name: values.name,
      remark: values.tag,
    };
    UpdatePlanAlarm(params).then((res) => {
      if (res.success === true) {
        message.success("告警方案编辑成功！");
        refresh();
        setaddAlarmModal(false);
      } else {
        message.error(res.errMsg ? res.errMsg : "编辑告警方案失败！");
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
    runEdit();
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
          if (res.success === true) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 2) {
        return AddAlarmEventInterval(childFormInfo).then((res) => {
          if (res.success === true) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 3) {
        return AddAlarmEventDeflection(childFormInfo).then((res) => {
          if (res.success === true) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 4) {
        return AddAlarmEventSOE(childFormInfo).then((res) => {
          if (res.success === true) {
            runEdit();
            message.success("新增告警事件成功！");
            setAddAlarmEvent(false);
          } else {
            message.error(res.errMsg ? res.errMsg : "新增告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 5) {
        return AddAlarmEventCommunication(childFormInfo).then((res) => {
          if (res.success === true) {
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
          if (res.success === true) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 2) {
        return UpdateAlarmEventInterval(childFormInfo).then((res) => {
          if (res.success === true) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 3) {
        return UpdateAlarmEventDeflection(childFormInfo).then((res) => {
          if (res.success === true) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 4) {
        return UpdateAlarmEventSOE(childFormInfo).then((res) => {
          if (res.success === true) {
            setAddAlarmEvent(false);
            runEdit();
            message.success("修改告警事件成功！");
          } else {
            message.error(res.errMsg ? res.errMsg : "修改告警事件失败！");
          }
        });
      } else if (childFormInfo.alarmRule === 5) {
        return UpdateAlarmEventCommunication(childFormInfo).then((res) => {
          if (res.success === true) {
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

  const [transTag, setTransTag] = useState(false)
  const [transferTitle, setTransferTitle] = useState({})
  const [Sns, setSns] = useState([])
  const [unknownTable, setUnknownTable] = useState([])
  const [alarmOpenTable, setAlarmOpenData] = useState([])
  const [alarmCloseTable, setAlarmCloseTable] = useState([])
  const [noalarmOpenTable, setNoalarmOpenTable] = useState([])
  const [noalarmCloseTable, setNoalarmCloseTable] = useState([])
  const getCloseValue = () => {
    setTransTag(false)
  }


  const columnsAssociation = [
    {
      align: "center",
      title: "设备编号",
      dataIndex: "sn",
      key: "sn",
    }, {
      align: "center",
      title: "设备名称",
      dataIndex: "name",
      key: "name",
    }, {
      align: "center",
      title: "安装地址",
      dataIndex: "address",
      key: "address",
    }, {
      align: "center",
      title: "设备型号",
      dataIndex: "category",
      key: "category",
    },
  ]
  const [planItemId, setPlanItemId] = useState();
  //关联告警配置
  const associationAlarmInfo = async (record) => {
    console.log(record)
    setPlanItemId(record.Id)
    setTransferTitle({
      unknownTitle: '未选中设备',
      alarmOpenTitle: '告警后：分闸/开阀/打开',
      alarmCloseTitle: '告警后：合闸/关阀/关闭',
      noalarmOpenTitle: '消警后：分闸/开阀/打开',
      noalarmCloseTitle: '消警后：合闸/关阀/关闭',
    })
    const resp = await QueryValveDevicePage({ projectId })
    if (resp.success && Array.isArray(resp.data)) {
      setUnknownTable(resp.data || [])
    } else {
      message.error(resp.errMsg)
    }

    const resNo = await GetAlarmValveDevice(projectId, record.Id)
    if (resNo.success && Array.isArray(resNo.data)) {
      let left1 = resNo?.data.filter((item) => {
        return item.alarmState == 1 && item.valveState == 1;
      });
      let left2 = resNo?.data.filter((item) => {
        return item.alarmState == 1 && item.valveState == 2;
      });
      let left3 = resNo?.data.filter((item) => {
        return item.alarmState == 2 && item.valveState == 1;
      });
      let left4 = resNo?.data.filter((item) => {
        return item.alarmState == 2 && item.valveState == 2;
      });
      setAlarmOpenData(left1)
      setAlarmCloseTable(left2)
      setNoalarmOpenTable(left3)
      setNoalarmCloseTable(left4)
      console.log(left1, alarmOpenTable)
    } else {
      message.error(resp.errMsg)
    }
    setTransTag(true);
  };

  const getSaveValue = values => {
    let snData = []
    console.log(values)

    values.alarmOpenData.map(item => {
      snData.push(item.sn)
    })
    setSns(snData)
  }
  useEffect(() => {
    runChildformInfo();
  }, [childFormInfo]);

  return (
    <Pagecont showserach={false} custserach pd="0px" >
      <Titlelayout title="告警管理" layout="flex" dr="column">
        <Divider style={{ margin: "16px 0" }} />
        {ispublish ? null : (
          <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showAdd()}
            >
              新增方案
            </Button>
            {/* <div style={{ display: 'flex', alignItems: "center" }}>
              <Button
                type="primary"
                style={{ width: "96px", marginRight: "16px" }}
                onClick={() => showAdd()}
              >
                导入方案
              </Button>
              <ExportExcel tb={tableRef} />
            </div> */}
          </div>
        )}
        <Usetable
          style={{ marginTop: "16px" }}
          columns={columns}

          rowKey={(record) => record.id}

          ref={tableRef}
          {...tableProps}
        ></Usetable>
        <CModal
          open={deleteTypeModal}
          onOk={deleteTypeOk}
          onCancel={handleTypeDelete}
          width={512}
          title="删除提示"
          centered={true}
          closable={false}
          type="warn"
          mold="cust"
        >
          是否确认删除告警类型？
        </CModal>

        <CModal
          title="删除提示"
          open={deleteModal}
          onOk={deleteOk}
          onCancel={handleDelete}
          width={512}
          closable={false}
          type="warn"
          mold="cust"
        >
          是否确认删除告警方案？
        </CModal>
        <CModal
          title="新增告警"
          open={addModal}
          onOk={addOk}
          onCancel={handleCancel}
          width={600}
          closable
          okText={t("button:next")}
          okType={"primary"}
          mold="cust"
        // okButtonProps={{ primary: true }}
        >

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

        </CModal>
        <CModal
          zIndex="600"
          title={modalTitle}
          className={style.addModal}
          open={addAlarmModal}
          onOk={addAlarmOk}
          onCancel={handleCancel}
          width={1000}
          okText={t("button:finish")}
          okType={"primary"}
          closable
          mold="cust"
          footer={editType === true ? undefined : null}
        >
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
                <Item name="tag" label="方案备注">
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
        </CModal>
        <AlarmEventModal
          AddAlarmEventGive={addAlarmEvent}
          callBack={changeAddAlarmEvent}
          getValues={getFromChild}
          giveChildForm={giveChildFormRecord}
          giveFormType={noDataInForm}
          giveModalTitle={addModalTitle}
        ></AlarmEventModal>

        <Mask task={transTag}>
          {transTag && <UseTransfer transferTitle={transferTitle} columns={columnsAssociation} planItemId={planItemId}
            alarmOpenTable={alarmOpenTable} alarmCloseTable={alarmCloseTable} noalarmOpenTable={noalarmOpenTable} noalarmCloseTable={noalarmCloseTable} unknownTable={unknownTable} saveValue={getSaveValue} closeValue={getCloseValue}></UseTransfer>}
        </Mask>
      </Titlelayout>
    </Pagecont>
  );
}
