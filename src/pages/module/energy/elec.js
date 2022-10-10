import React, { useState }from "react";
import style from './style.module.less'
import { Tree, Transfer, Table, Button, Modal, Form, Input, message, Upload } from "antd";
import difference from 'lodash/difference';
import uploadImg from "./upload.png";
import deleteImg from "./warning.png";

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: (item) => ({
          // disabled: listDisabled || item.disabled,
        }),

        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },

        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },

        selectedRowKeys: listSelectedKeys,
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          pagination={false}
          rowKey='id'
          onRow={({id}) => ({
            onClick: () => {
              
              onItemSelect(id);
            },
          })}
        />
      );
    }}
  </Transfer>
);

const mockData = [{
  deviceNumber:'5632655632323',
  deviceType:'智能电表',
  id:2,
},{
  deviceNumber:'5632655632324',
  deviceType:'智能电表',
  id:3,
},{
  deviceNumber:'5632655632325',
  deviceType:'智能电表',
  id:4,
},{
  deviceNumber:'5632655632326',
  deviceType:'智能电表',
  id:5,
},{
  deviceNumber:'5632655632327',
  deviceType:'智能电表',
  id:6,
},];
const originTargetKeys = [5, 6];
const leftTableColumns = [
  {
    dataIndex: 'deviceNumber',
    title: '设备编号',
  },
  {
    dataIndex: 'deviceType',
    title: '设备类型',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'deviceNumber',
    title: '设备编号',
  },
  {
    dataIndex: 'deviceType',
    title: '设备类型',
  },
];

const { Dragger } = Upload;
const props = {
  name: 'file',
  action: '#',

  onChange(info) {
    const { status } = info.file;

    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },

  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export default function Index(){
    const treeData = [
        {
          title: '照明插座用电',
          key: '1',
          children: [
            {
              title: '照明与插座',
              key: '1-1',
            },
            {
              title: '照明',
              key: '1-2',
            },{
              title: '插座',
              key: '1-3',
            },{
              title: '公共区域照明(含应急)',
              key: '1-4',
            },{
              title: '室外景观照明',
              key: '1-5',
            },
          ],
        },{
          title: '空调用电',
          key: '2',
          children: [
            {
              title: '冷热站',
              key: '2-1',
            },
            {
              title: '空调末端',
              key: '2-2',
            },{
              title: '净化系统',
              key: '2-3',
            },{
              title: '大型独立空调',
              key: '2-4',
            }
          ],
        },{
          title: '动力用电',
          key: '3',
        },{
          title: '特殊区域用电',
          key: '4',
        },
    ];

    const onSelectTree = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    
    const onCheckTree = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };

    const addCategory = (data,e)=>{
      e.stopPropagation();
      console.log(data);
      setAddModal(true);
    }
    const eidtCategory = (data,e)=>{
      e.stopPropagation();
      console.log(data);
      setAddModal(true);
    }

    const configCategory = (data, e) => {
      e.stopPropagation();
      console.log(data);
      setConfigTransfer(true);
    }

    const deleteCategory = (data, e) => {
      e.stopPropagation();
      console.log(data);
      setDeleteModal(true);
    }

    const cancelDelete = () => {
        setDeleteModal(false);
    }
    const confirmDelete = () => {
        setDeleteModal(false);
        message.success('删除成功！');
    }

    const titleRender = (data)=>{
        return <div className={style.treeNode}>{data.title}
            <div className={style.operation} >
              <span onClick={(e)=>addCategory(data,e)}>新增</span>
              <span onClick={(e)=>eidtCategory(data,e)}>编辑</span>
              <span onClick={(e)=>configCategory(data,e)}>配置</span>
              <span className={style.deletebutton} onClick={(e)=>deleteCategory(data,e)}> 删除</span>
            </div>
        </div>
    }

  const [targetKeys, setTargetKeys] = useState(originTargetKeys);

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
    console.log(nextTargetKeys, direction, moveKeys);
  };
  
  const [configTransfer, setConfigTransfer] = useState(false);
  
  const [form] = Form.useForm();
  const [addModal, setAddModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const showModal = () => {
    setAddModal(true);
  }

  const showUpLoad = () => {
    setUploadModal(true);
  }

  const onFinish = (value) => {
    console.log(value);
    form.resetFields();
    setAddModal(false);
  }

  const cancel = () =>{
    form.resetFields();
    setAddModal(false);
  }

  const cancelTransfer = () => {
    setConfigTransfer(false);
  }

  const cancelUpload = () =>{
    setUploadModal(false);
  }
  const confirmUpload = () =>{
    setUploadModal(false);
  }
  const downLoadtem = (e) => {
    e.stopPropagation();
    console.log('下载模板');
  }

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div className={style.addButton} onClick={showModal}>新增能耗分类</div>
        <div className={style.batchImport} onClick={showUpLoad}>批量导入配置</div>
      </div>
      <div className={style.content}>
        <div className={style.treeList}>
          <Tree
            checkable
            defaultExpandAll={true}
            onSelect={onSelectTree}
            onCheck={onCheckTree}
            treeData={treeData}
            titleRender={titleRender}
          />
        </div>
        { configTransfer ? <div className={style.transferList}>
          <TableTransfer
            dataSource={mockData}
            targetKeys={targetKeys}
            showSelectAll={false}
            selectAllLabels={['照明用电','未选中的表']}
            onChange={onChange}
            rowKey={record => record.id}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />
          <div className={style.transferSave}>
            <Button type="primary" style={{width:146,marginBottom:12}}>保存</Button>
            <Button style={{width:146,marginBottom:12}} onClick={()=> cancelTransfer()}>取消</Button>
          </div>
        </div> : null}
      </div>
      <Modal className="addmodal" footer={null} closable={false} maskClosable={false} open={addModal}>
        <div className='modalTitle'>新增能耗分类</div>
        <Form form={form}   className={style.dialogForm} onFinish={onFinish} requiredMark={false} >
          <Form.Item name='addCategoryName' label='新增分类名称' rules={[{required: true,message:'请输入分类名称'}]}>
            <Input size="middle" style={{width: '295px', marginLeft: '12px'}} placeholder='请输入能耗分类名称'></Input>
          </Form.Item>
          <Form.Item style={{display:'flex',justifyContent:'flex-end',marginTop:24,marginRight:12}}>
            <Button size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancel}>取消</Button>
            <Button size="middle" type="primary" htmlType="submit" >保存</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal className="addmodal" footer={null} closable={false} maskClosable={false} open={uploadModal}>
        <div className='modalTitle'>批量导入</div>
        <Dragger {...props} className='dragUpload'>
          <p className="ant-upload-drag-icon">
            <img src={uploadImg} alt='upload'></img>
          </p>
          <p className="ant-upload-text">将文件拖到此处，或<span style={{color:'#237ae4',textDecoration:'underline'}}>点击上传</span></p>
          <p className="ant-upload-hint" style={{color:'#237ae4',textDecoration:'underline'}} onClick={e=>downLoadtem(e)}>
            下载模板
          </p>
        </Dragger>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:24,marginRight:12}}>
          <Button size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancelUpload}>取消</Button>
          <Button size="middle" type="primary" onClick={confirmUpload} >确认</Button>
        </div>
      </Modal>
      <Modal className={style.deleteModal} footer={null} closable={false} maskClosable={false} open={deleteModal}>
        <div className={style.deleteTitle}>删除能耗分类</div>
        <div className={style.deleteContent}>
          <img src={deleteImg} className={style.deleteImg} alt='danger'></img>
            <span>是否要删除选中的能耗分类名称？</span>
        </div>
        <div className={style.deleteFooter}>
          <Button size="middle" danger  style={{marginLeft:'auto',marginRight:12}} onClick={cancelDelete}>取消</Button>
          <Button size="middle" type="primary" danger  onClick={confirmDelete}>确认</Button>
        </div>
      </Modal>
    </div>
)

    
}