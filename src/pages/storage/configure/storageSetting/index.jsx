import React, { useRef, useState } from "react";
import style from "./style.module.less";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAntdTable } from 'ahooks'
import Usetable from '@com/useTable'
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import {
  InputNumber,
  Space,
  Form,
  Input,
  message,
  Select,
  DatePicker,
  Upload,
  Typography
} from "antd";
import {
  selectProjectId,
  publishState,
  selectOneLevel,
  levelDefaultLabel
} from "@redux/systemconfig.js";
import { SiteManagerDesigner } from '@api/api.js'
import Pagecont from "@com/pagecontent"
import Titlelayout from '@com/titlelayout'
import CModal from '@com/useModal'
import { CustButtonT, CustLink } from '@com/useButton'
const { Link } = Typography

const Formbox = styled.div`
  && {
    
    .ant-form-item {
      margin-bottom: ${props => props.theme.laptop ? "8px" : "24px"};
    }
  }
`
export default function Index() {
  const tableRef = useRef();
  const [form] = Form.useForm();
  const Item = Form.Item;
  const projectId = useSelector(selectProjectId);
  const ispublish = useSelector(publishState);
  const oneLevel = useSelector((state) => state.system.onelevel);
  const areaFirstName = useSelector(levelDefaultLabel) || '园区'

  const { GetSites, AddSite, UpdateSite, DeleteSite } = SiteManagerDesigner

  const totalItem = useRef();
  const curPage = useRef();
  const PageSize = 14

  const getTableData = ({ current, pageSize }) => {
    curPage.current = current
    if (!projectId) return new Promise((resolve) => {
      resolve({
        list: [],
        total: 0
      })
    })
    return GetSites(projectId, current, pageSize).then(res => {
      let { success, data, total } = res
      totalItem.current = Number.isInteger(total) ? total : 0
      if (success) {
        if (Array.isArray(data) && data?.length > 0) {
          //setDataSource(data)
          //setTotal(res.total)
          return {
            list: data,
            total
          }
        } else {
          return {
            list: [],
            total: 0
          }
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const { tableProps, refresh, run } = useAntdTable(getTableData, {
    defaultPageSize: PageSize,
    refreshDeps: [projectId]
  })

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
  //新增 true 修改 false
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
        align: "center",
        title: "站点编号",
        dataIndex: "no",
        key: "no",
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
          <span>{record.investmentNature == 1 ? '业主自投' : record.investmentNature == 2 ? '运营商投资' : record.investmentNature == 3 ? '建设投资' : '/'}</span>
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
        align: "center",
        title: "站点编号",
        dataIndex: "no",
        key: "no",
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
          <span>{record.investmentNature == 1 ? '业主自投' : record.investmentNature == 2 ? '运营商投资' : record.investmentNature == 3 ? '建设投资' : '/'}</span>
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
            <CustLink
              text="edit"
              onClick={() => editRecord(record)}
            />

            <CustLink
              type="danger"
              text="delete"
              onClick={() => deleteRecord(record)}
            />

          </Space>
        ),
      },
    ];


  const ref = useRef()
  //点击新增 打开弹框
  const showAdd = () => {

    setFileList([]);
    setImageUrl();
    setModalTitle("新增站点");
    setAddModal(true);
    ref.current.onOpen()
  };
  //编辑
  const [selectId, setSelectId] = useState(0)
  const editRecord = (record) => {

    record.deliveryTime = moment(record.deliveryTime)
    form.setFieldsValue(record)
    setSelectId(record.id)
    if (record.image) {
      setImageUrl(record.image)
      setFileList([{ url: record.image }])
    } else {
      setImageUrl('')
      setFileList([])
    }
    setModalTitle("编辑站点");
    setAddModal(false);
    ref.current.onOpen()
  };
  //删除
  const deleteRecord = (record) => {
    setSelectId(record.id)
    setDeleteTypeModal(true);
  };
  //删除站点确认
  const deleteOk = async () => {
    let res = await DeleteSite(projectId, selectId)
    if (res.success) {
      message.success('站点删除成功!')
      try {
        let current = Math.ceil((totalItem.current - 1) / PageSize) < curPage.current

        if (current) {
          let values = form.getFieldsValue()
          run({ current: curPage.current - 1, pageSize: PageSize }, values)
        } else {
          refresh()
        }

      } catch (error) {

      }
    } else {
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
        if (res.success) {

          message.success('新增站点成功!')
          //  form.resetFields();
          refresh();
        } else {
          message.error(res.errMsg || "请求出错")
        }
      })
    } else if (modalTitle === "编辑站点") {
      params.id = selectId
      UpdateSite(projectId, params).then(res => {
        if (res.success) {
          ref.current.onCancel()
          message.success('站点信息修改成功!')
          refresh();
        } else {
          message.error(res.errMsg)
        }
      })
    }
  };
  //新增 取消
  const addCancel = () => {
    // setAddModal(false);
    ref.current.onCancel()
    setImageUrl();
  };
  const [fileList, setFileList] = useState([]); //文件列表
  const [imageUrl, setImageUrl] = useState(""); //上传的图片
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const normFile = (e) => {
    return getBase64(e.file);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
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

  const Title = (
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
      <span>站点管理</span>
      {ispublish ? null : (
        <CustButtonT
          text="new"
          src="new"
          onClick={showAdd}
        >

        </CustButtonT>
      )}
    </div>
  )

  return (
    <Pagecont showserach={false} custserach pd="0px" >
      <Titlelayout title={Title} layout="flex" dr="column">
        <Usetable
          rowKey={(record) => record.id}
          ref={tableRef}
          columns={columns}
          {...tableProps}
        ></Usetable>
        <CModal
          open={deleteTypeModal}
          onOk={deleteOk}
          onCancel={deleteCancel}
          width={512}
          closable={false}
          type="warn"
          mold="cust"
          title="删除提示"
          key="ma"
        >
          是否确认删除站点？
        </CModal>
        <CModal
          ref={ref}
          title={modalTitle}
          onOk={addOk}
          onCancel={addCancel}
          width={640}
          closable={false}
          custft={addModal}
          mold="cust"
          key="mb"
        >
          <Formbox>
            <Form
              name="addform"
              form={form}
              requiredMark={false}
              autoComplete="off"
              labelAlign="left"
              colon={false}
              labelCol={{ flex: "110px" }}
              wrapperCol={{ flex: 1 }}
              preserve={false}
            >
              <Item
                name="areaId"
                label={
                  oneLevel[0]?.levelName ? '所属' + oneLevel[0]?.levelName : "所属园区"
                }
                rules={[
                  { required: true, message: `请选择${oneLevel[0]?.levelName}` },
                ]}
                key="areaId"
              >
                <Select
                  disabled={modalTitle === "编辑站点"}
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
                key="no"
              >
                <Input placeholder="请输入站点编号" disabled={modalTitle === "编辑站点"} />
              </Item>
              <Item
                name="name"
                label="站点名称"
                rules={[{ required: true, message: "请输入站点名称" }]}
                key="name"
              >
                <Input placeholder="请输入站点名称"></Input>
              </Item>
              <Item
                name="address"
                label="站点地址"
                rules={[{ required: true, message: "请输入站点地址" }]}
                key="address"
              >
                <Input placeholder="请输入站点地址" />
              </Item>
              <Item
                name="capacity"
                label="站点容量 (KVA)"
                rules={[{ required: true, message: "请输入站点容量" }]}
                key="capacity"
              >
                <InputNumber placeholder="请输入站点容量" />
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
                key="deliveryTime"
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
                key="investmentNature"
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
              <Item name="remark" label="备注信息" key="remark">
                <Input placeholder="请输入备注信息" />
              </Item>
              <Item name="image" label="站点图片" getValueFromEvent={normFile} key="image">
                <Upload
                  listType="picture-card"
                  //  className={style.uploader}
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
          </Formbox>
        </CModal>
        <CModal open={previewOpen} footer={null} mold="cust" onCancel={handleCancel} key="del">
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </CModal>
      </Titlelayout>
    </Pagecont>
  );
}
