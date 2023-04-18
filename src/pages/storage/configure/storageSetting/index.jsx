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
  levelDefaultLabel
} from "@redux/systemconfig.js";
import { SiteManagerDesigner } from '@api/api.js'
import { cloneDeep } from "lodash";

export default function Index() {
  const tableRef = useRef();
  const [form] = Form.useForm();
  const Item = Form.Item;
  const projectId = useSelector(selectProjectId);
  const ispublish = useSelector(publishState);
  const oneLevel = useSelector((state) => state.system.onelevel);
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'

  const { GetSites, AddSite, UpdateSite, DeleteSite } = SiteManagerDesigner
  //表格展示数据
  const [dataSource, setDataSource] = useState([]);
  const getTableData = () => {
    GetSites(projectId, pageNum, pageSize).then(res => {
      let {success, data} = res
      if(success){
        if(data && data.length > 0){
          setDataSource(data)
          setTotal(res.total)
        }else{
          setDataSource([])
        }
      }else{
        message.error(res.errMsg)
      }
    })
  }
  //分页
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 15;
  const [total, setTotal] = useState(0);
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    total, // 总条数
    onChange: (page) => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
    showTotal: (total) => `共${total}条记录`,
  };
  const handlePageChange = (page) => {
    setPageNum(page);
  };
  useEffect(()=> {
    getTableData()
  }, [pageNum])
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

  const columns = ispublish
    ? [
      {
        align: "center",
        title: areaFirstName + "名称",
        dataIndex: "areaName",
        key: "areaName",
      },
      {
        align: "center",
        title: "站点编号",
        dataIndex: "no",
        key: "no",
      },
      {
        align: "center",
        title: "站点名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "站点地址",
        dataIndex: "address",
        key: "address",
        align: "center",
      },
      {
        title: "站点容量 (kVA)",
        dataIndex: "capacity",
        key: "capacity",
        align: "center",
      },
      {
        title: "投运时间",
        dataIndex: "deliveryTime",
        key: "deliveryTime",
        align: "center",
      },
      {
        title: "投资性质",
        dataIndex: "investmentNature",
        key: "investmentNature",
        align: "center",
        render: (_, record) => (
          <span>{record.investmentNature == 1? '业主自投': record.investmentNature == 2 ? '运营商投资' : record.investmentNature == 3 ?'建设投资':'/' }</span>
        )
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
        align: "center",
      },
    ]
    : [
      {
        align: "center",
        title: areaFirstName + "名称",
        dataIndex: "areaName",
        key: "areaName",
      },
      {
        align: "center",
        title: "站点编号",
        dataIndex: "no",
        key: "no",
      },
      {
        align: "center",
        title: "站点名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "站点地址",
        dataIndex: "address",
        key: "address",
        align: "center",
      },
      {
        title: "站点容量 (kVA)",
        dataIndex: "capacity",
        key: "capacity",
        align: "center",
      },
      {
        title: "投运时间",
        dataIndex: "deliveryTime",
        key: "deliveryTime",
        align: "center",
      },
      {
        title: "投资性质",
        dataIndex: "investmentNature",
        key: "investmentNature",
        align: "center",
        render: (_, record) => (
          <span>{record.investmentNature == 1? '业主自投': record.investmentNature == 2 ? '运营商投资' : record.investmentNature == 3 ?'建设投资':'/' }</span>
        )
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
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
    setFileList([]);
    setImageUrl();
    setModalTitle("新增站点");
    setAddModal(true);
  };
  //编辑
  const [selectId, setSelectId] = useState(0)
  const editRecord = (record) => {
    console.log(record);
    record.deliveryTime = moment(record.deliveryTime)
    form.setFieldsValue(record)
    setSelectId(record.id)
    setImageUrl(record.image)
    setFileList([{url: record.image}])
    setModalTitle("编辑站点");
    setAddModal(true);
  };
  //删除
  const deleteRecord = (record) => {
    setSelectId(record.id)
    setDeleteTypeModal(true);
  };
  //删除站点确认
  const deleteOk = async () => {
    let res = await DeleteSite(projectId, selectId)
    if(res.success){
      message.success('站点删除成功!')
      if(pageNum > 1 && dataSource.length  == 1){
        setPageNum(pageNum - 1)
      }else{
        getTableData()
      }
    }else{
      message.error(res.errMsg)
    }
    setDeleteTypeModal(false);
  };
  //删除站点取消
  const deleteCancel = () => {
    setDeleteTypeModal(false);
  };
  //新增 确认
  const addOk = async () => {
    const values = await form.validateFields();
    let params = {
      areaId: values.areaId,
      name: values.name,
      no: values.no,
      capacity: values.capacity,
      deliveryTime: moment(values.deliveryTime).format('YYYY-MM-DD'),
      investmentNature: values.investmentNature,
      remark: values.remark,
      image: imageUrl,
      address: values.address
    }
    if (modalTitle === "新增站点") {
      AddSite(projectId, params).then(res => {
        if(res.success){
          setAddModal(false);
          message.success('新增站点成功!')
          getTableData();
        }else{
          message.error(res.errMsg)
        }
      })
    } else if (modalTitle === "编辑站点") {
      params.id = selectId
      UpdateSite(projectId, params).then(res => {
        if(res.success){
          setAddModal(false);
          message.success('站点信息修改成功!')
          getTableData();
        }else{
          message.error(res.errMsg)
        }
      })
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
  const normFile =  (e) => {
    return  getBase64(e.file);
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

  useEffect(()=>{
    getTableData()
  },[])

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
            labelCol={{ flex: "110px" }}
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
              name="no"
              label="站点编号"
              rules={[{ required: true, message: "请输入站点编号" }]}
            >
              <Input placeholder="请输入站点编号" />
            </Item>
            <Item
              name="name"
              label="站点名称"
              rules={[{ required: true, message: "请输入站点名称" }]}
            >
              <Input placeholder="请输入站点名称"></Input>
            </Item>
            <Item
              name="address"
              label="站点地址"
              rules={[{ required: true, message: "请输入站点地址" }]}
            >
              <Input placeholder="请输入站点地址" />
            </Item>
            <Item
              name="capacity"
              label="站点容量 (KVA)"
              rules={[{ required: true, message: "请输入站点容量" }]}
            >
              <Input placeholder="请输入站点容量" />
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
                maxCount={1}
              >
                {/* <img src={imageUrl} style={{width: 104, height: 104}}></img> */}
                {imageUrl ? 
                 null : (
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
