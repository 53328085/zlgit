import React, { useState, useEffect, useRef, createRef } from 'react'
import style from './style.module.less'
import { Input, Button, Space, Modal, Form, Select, message } from 'antd'
import Icon, { PlusOutlined } from '@ant-design/icons';
import UserTable from '@com/useTable'
import {Backstage} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import {useSelector} from 'react-redux'
import {useAntdTable} from 'ahooks'
import warningImg from '@imgs/warning.png'

export default function Index() {
  const { Search } = Input;
  const { Option } = Select;
  const [searchInput, setSearchInput] = useState('');
  const defaultStyle = {
    width:232
  };
  const [search, setSearch] = useState('');
  const onSearch = (value) => setSearch(value);
  const projectId = useSelector(selectCurProject)?.id;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('新增建筑')
  const [regionOption, setRegionOption] = useState([]);
  const [dialogType, setDialogType] = useState('')
  const inputValue = createRef();

  useEffect(() =>{
    Backstage.GetProjectRegionList(projectId).then(res => {
      if(res.success && Array.isArray(res.data)){
        setRegionOption(res.data);
      }
    })
  },[])

  let params = {
    pageNum:1,
    pageSize: 15,
    region:0,
    projectId: projectId,
    buildingName:search,
  }

  const columns = [
    {
        title:'园区名称',
        dataIndex:'regionName',
    },{
        title:'建筑号',
        dataIndex:'buildingNo',
    },{
      title:'建筑名称',
      dataIndex:'name',
    },{
        title:'楼层范围',
        dataIndex:'floorRange',
    },{
      title:'备注',
      dataIndex:'remark',
    },{
      title:'操作',
      key:'action',
      render: (_,record) => <Space>
        <span style={{textDecoration:'underline',cursor:'pointer',color:'#237ae4'}} onClick={()=>editItem(record)}>编辑</span>
        <span style={{textDecoration:'underline',cursor:'pointer',color:'#f00'}} onClick={()=>deleteItem(record)}>删除</span>
      </Space>
    }
  ]

  const getTableData = ({ current, PageSize}) => {
    params = Object.assign({}, params, {PageNum: current, PageSize})
    return Backstage.GetProjectBuilding(params).then(res => {
      let {success, data, totalNum} = res;
      console.log(data)
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }

  const {tableProps} = useAntdTable(getTableData,{
    refreshDeps: [projectId,search],
    defaultPageSize:15,
  })

  const [bmap, setBmap] = useState(null);
  const addBuildiing = () =>{
    setIsModalOpen(true);
    setDialogTitle('新增建筑');
    setTimeout(()=>{
      let map = new window.BMapGL.Map('mapFrame');
      setBmap(map);
      var scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
      map.addControl(scaleCtrl);
      var zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
      map.addControl(zoomCtrl);
      var cityCtrl = new window.BMapGL.CityListControl();  // 添加城市列表控件
      map.addControl(cityCtrl);
      // 设置中心点坐标
      const point = new window.BMapGL.Point(120.228177 , 30.212296)
      // 初始化地图  15是放大级别
      map.centerAndZoom(point, 12);
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      map.addEventListener('click', function (e) {
        form.setFieldValue('lng', e.latlng.lng)
        form.setFieldValue('lat',e.latlng.lat)
    });
      let ac = new window.BMapGL.Autocomplete({
        'input':'suggestId',
        'location':map
      })
      ac.addEventListener('onconfirm',function(e){
        setSearchInput(e.item.value.business);
      })
    },500)
  }

  const changeInput = (e) => {
    setSearchInput(e.target.value);
  }

  const getSearchList = () =>{
    // map.clearOverlays();    //清除地图上所有覆盖物
    // let map = new window.BMapGL.Map('mapFrame');
    let map = bmap;
    map.clearOverlays();    //清除地图上所有覆盖物
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			map.centerAndZoom(pp, 15);
			map.addOverlay(new window.BMapGL.Marker(pp));    //添加标注
		}
		var local = new window.BMapGL.LocalSearch(map, { //智能搜索
		  onSearchComplete: myFun
		});
		local.search(searchInput);
		// var local = new window.BMapGL.LocalSearch(map, {
    //   renderOptions:{map: map}
    // });
    // local.search(searchInput);
  }

  const onChangeRegion = (value) => {
    console.log(value)
  }

  const onFinish = (value) => {
   console.log(value);
    form.resetFields();
    setIsModalOpen(false);
}

const cancel = () =>{
  form.resetFields();
  setIsModalOpen(false);
}
  const validateMode = (rule, value, callback) => {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(value)) {
     callback('请输入正确手机号');
    } else {
        callback();
    }
  };

  const editItem = (record) => {
    setDialogType('edit');
    setDialogTitle('编辑建筑');
    setIsModalOpen(true);
    form.setFieldsValue(record);
    setTimeout(()=>{
      let map = new window.BMapGL.Map('mapFrame');
      setBmap(map);
      var scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
      map.addControl(scaleCtrl);
      var zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
      map.addControl(zoomCtrl);
      var cityCtrl = new window.BMapGL.CityListControl();  // 添加城市列表控件
      map.addControl(cityCtrl);
      // 设置中心点坐标
      const point = new window.BMapGL.Point(record.lng,record.lat)
      // 初始化地图  15是放大级别
      map.centerAndZoom(point, 15);
      var marker = new window.BMapGL.Marker(point);        // 创建标注   
      map.addOverlay(marker);                     // 将标注添加到地图中
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      map.addEventListener('click', function (e) {
        form.setFieldValue('lng', e.latlng.lng)
        form.setFieldValue('lat',e.latlng.lat)
    });
      let ac = new window.BMapGL.Autocomplete({
        'input':'suggestId',
        'location':map
      })
      ac.addEventListener('onconfirm',function(e){
        setSearchInput(e.item.value.business);
      })
    },500)
  }

  const [deleteModal, setDeleteModal] = useState(false);
  const cancelDelete = () => {
    setDeleteModal(false);
  }
  const confirmDelete = () => {
    setDeleteModal(false);
    message.success('删除成功！');
  }
  const deleteItem = (record) => {
    setDeleteModal(true);
  }

    return (
      <div className={style.content}>
        <div className={style.contentHeader}>
          <span >建筑查询</span>
          <Search
            placeholder="请输入建筑名称"
            allowClear
            enterButton="查询"
            size="middle"
            onSearch={onSearch}
            style={{width:533,marginLeft:12}}
          />
          <Button onClick={addBuildiing} type='primary' size='middle' style={{width:96,marginLeft:'auto',marginRight:0}} icon={<PlusOutlined />}>新增</Button>
        </div>
        <UserTable columns={columns} {...tableProps} rowKey='id' />
        <Modal getContainer={false} width={1072} className='dialogModal' footer={null} closable={false} maskClosable={false} open={isModalOpen}>
          <div className={style.modalTitle}>{dialogTitle}</div>
          <div className='modalContent'>
            <Form form={form} className={style.dialogForm} onFinish={onFinish} requiredMark={false} >
              <Form.Item name='regionId' label='所属园区' rules={[{required: true,message:'请选择园区'}]}>
                <Select size='middle' style={defaultStyle}  placeholder='请选择园区' onChange={onChangeRegion}>
                  {regionOption.map((item,index)=>{
                    return <Option key={index} value={item.id}>{item.name}</Option>
                  })}
                </Select>
              </Form.Item>
              <Form.Item name='buildingNo' label='建筑号' rules={[{required: true,message:'请输入建筑号'}]}>
                <Input size='middle' style={defaultStyle} placeholder='请输入建筑号'></Input>
              </Form.Item>
              <Form.Item name='name' label='建筑名称' rules={[{required: true,message:'请输入建筑名称'}]}>
                <Input size='middle' style={defaultStyle} placeholder='请输入建筑名称'></Input>
              </Form.Item>
              <Form.Item name='upFloor' label='地上层数' rules={[{required: true,message:'请输入地上层数'}]}>
                <Input size='middle' type='number' style={defaultStyle} placeholder='请输入地上层数'></Input>
              </Form.Item>
              <Form.Item name='downFloor' label='地下层数' rules={[{required: true,message:'请输入地下层数'}]}>
                <Input size='middle' type='number' style={defaultStyle} placeholder='请输入地下层数'></Input>
              </Form.Item>
              <Form.Item name='lng' label='坐标经度' rules={[{required: true,message:'请点击地图获取坐标经度'}]}>
                <Input size='middle' disabled style={defaultStyle} placeholder='请点击地图获取坐标经度'></Input>
              </Form.Item>
              <Form.Item name='lat' label='坐标纬度' rules={[{required: true,message:'请点击地图获取坐标纬度'}]}>
                <Input size='middle' disabled style={defaultStyle} placeholder='请点击地图获取坐标纬度'></Input>
              </Form.Item>
              <Form.Item name='remark' label='备注信息'>
                <Input size='middle' style={defaultStyle} ></Input>
              </Form.Item>
              <Form.Item style={{display:'flex',justifyContent:'flex-end',marginTop:184}}>
                <Button className='submitButton' size="middle"  style={{marginLeft:'auto',marginRight:12}} onClick={cancel}>取消</Button>
                <Button className='submitButton' size="middle" type="primary" htmlType="submit" >保存</Button>
              </Form.Item>
            </Form>
            <div className='mapDiv'>
              <Input id='suggestId' value={searchInput} name='searchInput' onChange={e =>changeInput(e)} placeholder="请输入地址信息" allowClear size="middle" style={{width:544}}></Input>
              <Button size='middle' type='primary' onClick={getSearchList}>查询</Button>
              {/* <Search placeholder="请输入地址信息" allowClear enterButton="查询" size="middle" onSearch={getSearchList} style={{width:640}} /> */}
              <div className='mapFrame' id='mapFrame'></div>
            </div>
          </div>
        </Modal>
        <Modal className={style.deleteModal} footer={null} closable={false} maskClosable={false} open={deleteModal}>
          <div className={style.deleteTitle}>删除园区</div>
          <div className={style.deleteContent}>
            <img src={warningImg} className={style.deleteImg} alt='danger'></img>
              <span>是否确认删除选中建筑和相关信息？</span>
          </div>
          <div className={style.deleteFooter}>
            <Button size="middle" danger  style={{marginLeft:'auto',marginRight:12}} onClick={cancelDelete}>取消</Button>
            <Button size="middle" type="primary" danger  onClick={confirmDelete}>确认</Button>
          </div>
        </Modal>
      </div>
    )
  }