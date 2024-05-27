import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Input,
  Space,
  Form,
  message,
  Typography,
  Select,
  InputNumber,
  Drawer,
  Cascader,
  Upload,
  Popconfirm 
} from "antd";
 
import styled from "styled-components";
import UserTable from "@com/useTable";
import { Area } from "@api/api.js";
import upCloud from './upcloud.png'
import { useAntdTable, useLatest } from "ahooks";
 
import { CustButton } from "@com/useButton";
import { custMsg } from "@com/usehandler";
import Mapcom from "@com/useMap/indexset";
import {selectOneLevel, selectOneLevelDefaultId, getOnelevel, publishState, currProject} from '@redux/systemconfig.js'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from "react-i18next"

const { Dragger } = Upload;
const Mainbox = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: 48px 1fr;
  row-gap: 16px;
  flex: 1;
`;
const Formbox = styled(Form)`
  display: grid;
  grid-template-columns: ${(p) => (p.islngLat ? "1fr 584px;" : "1fr")};
  grid-template-rows: ${(p) =>
    isNaN(p.rowes)
      ? "repeat(8, 32px)"
      : p.islngLat
      ? `repeat(${p.rowes + 5}, 32px)`
      : `repeat(${p.rowes}, 32px)`};
  column-gap: 32px;
  row-gap: 20px;
  grid-auto-flow: ${(p) => (p.islngLat ? "column" : "row")};
  .address {
    grid-column: 2;
  }
  .map {
    grid-column: 2;
    grid-row: 2 /-1;
    display: flex;
  }
`;
const Drawerbox = styled(Drawer)`
  && {
    .ant-drawer-content-wrapper {
      width: 100% !important;
    }
    .ant-drawer-wrapper-body {
      background-color: #003366;
      .ant-drawer-body {
        display: grid;
        grid-template-columns: 692px 1fr 714px;
        column-gap: 32px;
        .title {
          padding-left: 16px;
          border-left: 4px #237ae4 solid;
          color: #333;
          display: flex;
          align-items: center;
        }
        .selected {
          display: grid;
          grid-template-rows: 1fr 1fr;
          row-gap: 32px;

          .ant-table {
            height: 100%;
          }
          .total {
            display: grid;
            grid-template-rows: 32px 1fr;
            row-gap: 16px;
            padding: 16px;
            background-color: #fff;
          }
          .sub {
            display: grid;
            grid-template-rows: 32px 32px 1fr;
            padding: 16px;
            row-gap: 16px;
            background-color: #fff;
          }
        }
        .unselected {
          display: grid;
          grid-template-rows: 32px 32px 1fr;
          padding: 16px;
          row-gap: 16px;
          background-color: #fff;
        }
        .optab {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 0;
          > div {
            .ant-typography {
              color: #fff;
            }
            .ant-btn-icon-only {
              width: 64px;
              height: 46px;
            }
          }
        }
      }
    }
  }
`;
const Inptserach = styled(Input.Search)`
  && {
    width: 256px;
    .ant-input-search
      .ant-input-group
      .ant-input-affix-wrapper:not(:last-child) {
      border-radius: 16px 0 0 16px !important;
    }
  }
`;
const { Link, Text, Paragraph } = Typography;
const { Item } = Form;
export default function Index({ projectId, level, CModal, name,  allLevel }) {
 
  const dispatch = useDispatch();
  const {projectName} = useSelector(currProject)
  
  const oneLevel = useSelector(selectOneLevel) // 一级 
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId) // 一级默认id
  const ispublish = useSelector(publishState) 
  const [levelone] = useState(allLevel[0]);

  const limitlevle = allLevel.slice(0, level - 1);
  const fields = allLevel?.find(item => item.level == level)?.fields || [];
  const currenName = allLevel?.find(item => item.level == level)?.name
  const preName = level > 1 ? allLevel?.find(item => item.level == level - 1)?.name : null
  const sheetName = projectName+'_'+currenName
  const {t} =useTranslation("common","comm")
  /* 
{title: '名称', dataIndex: '名称', key: '名称'} 
// 第一列 本级， 第二列 备注， 第三列 [父级] ...其他

*/

  const [tempcolums, tempdata] =  useMemo(() => {
    let getcol = (name) => ({title: name, dataIndex: name, key: name});
    let colums = [
      getcol(currenName),
      getcol('备注'),
     
    ];
    if(preName) {
      colums.push(getcol(preName));
     }
     if(Array.isArray(fields)) {
        fields.forEach(f => {
          colums.push(getcol(f.name))
        })

     }
     let tbdata = colums.map(c => ({[c.title]:''}))
     return [colums, tbdata]
  }, [level, allLevel])
  const [form] = Form.useForm();
  const [nform] = Form.useForm();

  const nref = useRef(); // 新增，编辑
  const dref = useRef(); // 删除
  
  const mapref = useRef();
  const boxref = useRef();
  const [Record, setRecord] = useState({});
  const [isAdd, setIsAdd] = useState(true);

  
  const [tabelData, setTableData] = useState([])
  const [columns, setColumns] = useState([]);
  //const [topAreaId, setTopAreaId] = useState(() => level == 1 ? 0 : leveloption[0]?.id)
  const [topAreaId, setTopAreaId] = useState(oneLevelDefaultId)
/*   const [fields, setFields] = useState({
    field: [],
    type: [],
  }); */

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
 

 
  const islngLat = fields?.find(item => item.type == 1);
  const address = useRef("");
  const title = isAdd ? `${t("common:add")}${name}` : `${t("common:Edit")}${name}`; // 当前层级名称  defaultParams
 
  let params = {
    //查询
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    level,
    topAreaId: 0,
    name: "",
    projectId,
  };
  const defaultParams = {
    // 新增，修改
    level,
    projectId,
    parentId: 0,
    name: "",
    remark: "",
    id: 0,
    fields: [],
  };
  const upateOneLevel = async () => {
     if(level !=1) return
     try {
      let {success: lsuccess, data: levelData} = await  Area.QueryAll({projectId,level: 1,parentId: 0})  
      lsuccess && dispatch(getOnelevel(levelData || []));
      !lsuccess && dispatch(getOnelevel([]));
     } catch (error) {
       console.log(error)
     }
  }

  const  CascaderSct = () => {
   // let levels =oneLevel.map(i => ({...i, children: [], isLeaf:  level - 1 == 1}))
   // console.log(levels)
    const [leveloptions, setLevelOption] = useState(() => oneLevel.map(i => ({...i, children: [], isLeaf:  level - 1 == 1})) )
     // level = 2 显示前一级， = 3 显示前两两级, 依次类推
   
    const fieldNames = {
      label: 'name',
      value: 'id',
      children: 'children'
    }
    const loadData = async (selectedOptions) => {
    
      try {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        console.log(targetOption)
        targetOption.loading = true;
        let {id, level: curlevel} = targetOption // level:3 , curlevel: 2, 1
        
        if ((level - curlevel) == 1)  {
          targetOption.children = [];
          targetOption.isLeaf = true
          setLevelOption([...leveloptions])
          console.log(setLevelOption);
          return
        } else {
        const params = {
          projectId,
          level: curlevel + 1,
          parentId: id,
        }
        console.log(setLevelOption);
      let {data, success} =  await Area.QueryAll(params) 
       targetOption.loading = false
       if (success && Array.isArray(data)) {
        let cardata = data.map(i => ({...i,  children: [], isLeaf: level - curlevel == 1}))
        targetOption.children = cardata;
        setLevelOption([...leveloptions])
        /* setLevelOption(arr => {
          let i = arr.findIndex(ar => ar.id == id);
          if (i > -1) {

          }
          arr.splice(i,1, targetOption)
          return arr
        }) */
       } else {
        targetOption.children = [];
        targetOption.isLeaf = true
        setLevelOption([...leveloptions])
       }
      }
       // targetOption.loading = false;
       
      } catch (error) {
        console.log(error)
      }
    

    }
   const onChagne =(value, selectedOptions) => {
     console.log(value)
     console.log(selectedOptions)
   }
   
    const labelName = (Array.isArray(leveloptions) && leveloptions.length > 0) ? leveloptions[0].levelName : '';
    return (
      <Item label={labelName}  name="parentId" rules={[
        {
          required: true,
          message: `请选择${labelName}`
        }
      ]}>
         <Cascader options={leveloptions} fieldNames={fieldNames} loadData={loadData} onChange={onChagne}   />
      </Item>
    )


  }
 //   级联选择 end
  const del = (record) => {
    setRecord({...record});
    dref.current.onOpen();
  };
  const delOk = async () => {
    let { areaId } = Record;
    let { success, errMsg } = await Area.DeleteArea({ projectId, areaId });
    success &&
      message.success({
        content: "删除成功",
        onClose: () => {
          dref.current.onCancel();
          getTableData();
          upateOneLevel()
        },
        duration: 0.3
      });
    !success && custMsg({ success, content: errMsg || "数据出错" });
  };

  const getTableData = () => {    
    // 列表查询
    if (isNaN(level)) return;
    
    let value = form.getFieldsValue()
    //setTopAreaId(value.topAreaId)
    params = {...params, ...value } 
     Area.QueryByPage(params)
      .then((res) => {
        let { success, data, total } = res;
        let {
          body = [],
          header = [],
          idGroup = [],
          type = [],
          parentIdGroup = [],
        } = data || {};
        let cols = [];
       // let index = header.findIndex(h => h == '备注')
        // if(index > -1) header.splice(index,1)
       /*  if(index > -1){
          header.splice(index,'备注')
        } */
        for (let k of header) {
          let col = {
            title: k,
            dataIndex: k,
            key: k,
          };
          cols.push(col);
        }     
        let colums = ispublish ? [...cols] :  [
          ...cols,
          // index > -1 ?   {title: '备注', dataIndex: '备注', key: '备注'}: {},
          {
            title: t("common:Operation"),
            key: "action",
            align: "center",
            render: (_, record) => (
              <Space size={32}>
              
                <Link underline onClick={() => edit(record)}>
                  {t("common:Edit")}
                </Link>
                <Link underline type="danger" onClick={() => del(record)}>
                  {t("common:Delete")}
                </Link>
              </Space>
            ),
          },
        ];
          
        setColumns(colums);       
        let formart = body.map((r, i) => {
          let row = {
            areaId: idGroup[i],
            parentId: parentIdGroup[i],
            type: type,
          };
          header.forEach((e, i) => {
            row[e] = r[i];
            // row.id= nanoid()
          });
          return row;
        });
       
        if (success && data) {
          setTableData([...formart])         
          setPagination({
            ...pagination,
            total: total,
          })
         /*  return {
            total: colums.length,
            list: formart,
          }; */
        } else {
          setTableData([])
        /*   return {
            total: 0,
            list: [],
          }; */
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //   生成模板 /批量导入start

  const tableRef = useRef();
  const multref = useRef()
  const upfile = useRef();
  const createTemp = () => {  
    tableRef.current.downTemp()
  }

 const multimport = () => {
    multref.current.onOpen();
 }

const okImport = async() => {
   const formData = new FormData();
   formData.append("file", upfile.current);
   formData.append("projectId", projectId)
   formData.append("level", level)
   try {
     const {data, success, errMsg} = await  Area.Import(formData)
     if(success) {
       let {success: suc, errMsg:err, data: info} = data;
       if(!suc) {
         let errs = info.map(i => <p>第{i.row}行:{i.cause}</p>)
         const el = <div><strong>{err}</strong>{errs}</div>
         message.warning(el)
       }else {
         message.success("上传成功");
         multref.current.onCancel()
         getTableData()
       }
       
     }else {
        message.warning(errMsg || '数据出错')
     }
   } catch (error) {
    
   }
}
const beforeUpload = (file, fileList) => { 
   upfile.current = file;
   return false
}
 //   生成模板/批量导入 end
  const [lngLat, setLnglat] = useState()
  const curlnglat = useLatest(lngLat)


 
  const add = () => {
    address.current = "";
    setLnglat(null);
    setIsAdd(true);
    nref.current.onOpen();
    
  };
 
  const onOk = async () => {
    // 新增、编辑
     console.log(Record)
    try {
      let values = await nform.validateFields();
      console.log(values)
      let { remark, name, parentId, lngLat={} } = values; // 编辑时 parentId=Record.parentId
       
      let id = Array.isArray(parentId) ? parentId.pop() : parentId;
     
      let parent_id = isAdd && level > 1 ?  id : Record.parentId;
      let other = [];
      for (let key of fields) {
        let obj = {}
        if (key.type == 1) {
          obj = {
            name: key.name,
            value: lngLat[key.name]
          }
        }else {
          obj = {
            name: key.name,
            value: values[key.name],
         }
         
        };
        other.push(obj);
      } 
      let methods = isAdd ? "Insert" : "UpdateArea";
      let params = {
        ...defaultParams,
        remark,
        name,
        parentId: parent_id,
        id: isAdd ? 0 : Record.areaId,
        fields: other,
      };    
      let { success, errMsg } = await Area[methods](params);

      if(success) {
           let msg =  isAdd ? "新增成功" : "编辑成功";
          message.success(msg)
          getTableData();
          upateOneLevel();
          if(isAdd) nform.resetFields()
          if(!isAdd)  nref.current.onCancel();
         
         
      } else {
         message.warning(errMsg || "数据出错") 
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const edit = (record) => {
    console.log(record)
    let lngLat = fields.filter(f => f.type == 1)?.map(i => i.name);
    if(Array.isArray(lngLat) && lngLat.length > 0) {
       for(let name of lngLat) {
          if(record[name]) {
            setLnglat(record[name])
            break
          }else {

          }
       }
    }
    setIsAdd(false);
    setRecord({...record});
    let { 名称, 备注, areaId, parentId,...keys } = record;
     
    nform.setFieldsValue({
      name: record["名称"],
      remark: record["备注"],
      ...keys,
    });
    for(let key of fields) {
      if(key.type == 1) {
         nform.setFieldValue(['lngLat', `${key.name}`], record[key.name]);
       }else {
         nform.setFieldValue(key.name, record[key.name]);
       }

     }
    nref.current.onOpen();
  };
  const setAaddress = (adr) => {
   let {lngLat} = nform.getFieldsValue();
   //console.log(lngLat)
   //nform.setFieldValue(['lngLat', '经纬度'], `${adr.lng},${adr.lat}`);
   let keys = Object.keys(lngLat)
   
   for(let key in lngLat) {   
    
     if(!lngLat[key] && keys.length > 1){
        nform.setFieldValue(['lngLat', `${key}`], `${adr.lng},${adr.lat}`);
        break
     }else {
        nform.setFieldValue(['lngLat', `${key}`], `${adr.lng},${adr.lat}`);
     }
     
   }
    nform.setFieldsValue({
     // 'lngLat.经纬度': `${adr.lng},${adr.lat}`,
      address: adr.address,
    });
  };
  const inputType = (f, type) => {
    switch (type) {
      case 0:
        return (
          <Item label={f} name={f}>
            <Input />
          </Item>
        );
      case 1:
        return (
          <Item label={f} name={['lngLat', f]} tooltip="有多个坐标点,先清空后再重新获取" rules={[{
            required: true,
          }]} >
            <Input allowClear placeholder="坐标点请从地图上点击获取" />
          </Item>
        );
      case 2:
        return (
          <Item label={f} name={f} tooltip="面积类数据保留两位小数" key={f} rules={[{
            required: true,
          }]}>
            <InputNumber
              step="0.01"
              precision={2}
              style={{ width: "100%" }}
              min={0}
              addonAfter="㎡"
            />
          </Item>
        );

      case 3:
        return (
          <Item label={f} name={f} tooltip="楼层数据为整数" key={f}>
            <InputNumber precision={0} style={{ width: "100%" }} />
          </Item>
        );
      default:
        return (
          <Item label={f} name={f}>
            <Input />
          </Item>
        );
    }
  };
  const tableOnchange = (e) => {
   
    let {current} = e
      setPagination({
        ...pagination,
        current,
      })
   
  }
 
 useEffect(() => {
      getTableData()
    
  }, [pagination.current])
  useEffect(() => {
   // getLevelOption();
    if (level == 1) {
      form.setFieldsValue({
        topAreaId: null,
      });
      getTableData()
    }else if (level > 1) {
      form.setFieldsValue({
        topAreaId: 0,
      });
      getTableData()
    }
  
  }, [level]);
  
  return (
    <Mainbox ref={boxref}>
      <Form form={form} layout="inline" initialValues={{name: ""}}>
        <Space size={16}>
          {level == 1 && (
            <Form.Item name="name" label={`${name}${t("common:Query")}`}>
              <Input.Search
                placeholder={`请输入${name}名称`}
                allowClear
                enterButton={t("common:Query")}
                style={{ width: "550px" }}
                onSearch={getTableData}
              />
            </Form.Item>
          )}
          {level > 1 && (
            <>
              <Item label={`${levelone.name}${t("common:name")}`} name="topAreaId">
                <Select
                options={[...oneLevel, {name: '全部', id: 0}]}
                
                  fieldNames={{
                    label: "name",
                    value: "id",
                    options: "options",
                  }}
                  style={{ width: "200px" }}
                  onChange={getTableData}
                ></Select>
              </Item>
              <Form.Item name="name" label={`${name}${t("common:Query")}`}>
                <Input.Search
                  placeholder={`请输入${name}名称`}
                  allowClear
                  enterButton={t("common:Query")}
                  style={{ width: "550px" }}
                  onSearch={getTableData}
                />
              </Form.Item>
            </>
          )}
         {!ispublish && <Form.Item>
            <CustButton style={{ justifyContent: "center" }} onClick={add}>
              +{t("common:Add")}
            </CustButton>         
          </Form.Item>
         }
         <Form.Item>
           <Popconfirm title={t("common:CreateGenerateTemplate")} onConfirm={createTemp}><CustButton  style={{ width:"auto"}} >{t("common:GenerateTemplate")}</CustButton></Popconfirm>
         </Form.Item>
         <Form.Item>
             <CustButton onClick={multimport}>{t("common:BatchImport")}</CustButton>
         </Form.Item>
        </Space>
      </Form>
      <UserTable columns={columns}  dataSource={tabelData} pagination={pagination} onChange={tableOnchange} rowKey="areaId" ref={tableRef} istemp={'istemp'} tempcolums={tempcolums} tempName={sheetName} tempdata={tempdata} />
      {/*    <UserTable columns={columns} {...tableProps} rowKey='areaId'  style={{display: level==1 ?'block' : 'none' }} /> 
          <UserTable columns={columns} {...tableProps} rowKey='areaId' style={{display: level>1 ?'block' : 'none' }} />   */}
 
      {/* 新增 / 编辑*/}
      <CModal
width={islngLat ? 1024 : 554}
title={title}
ref={nref}
onOk={onOk}
custft={isAdd}
mold="cust"
>
<Formbox
  islngLat={islngLat}
  rowes={limitlevle.length + 2 + fields.length}
  form={nform}
  size="middle"
  labelCol={{ flex: "7em" }}
  labelAlign="left"
  preserve={false}
  validateMessages={{
    required: "'${label}' 是必选字段",
  }}
>
  {isAdd
    ?  
      
     level > 1 && <CascaderSct /> 
    : limitlevle?.map((lv, index, array) => {
        return (
          <Item label={`${lv?.name}名称`} name={lv?.name}>
            <Input disabled={!isAdd} />
          </Item>
        );
      })}

  <Item
    label={`${name}${t("common:name")}`}
    name="name"
    rules={[
      {
        required: true,
      },
    ]}
  >
    <Input />
  </Item>

  {fields?.map((f, index) => inputType(f.name, f.type))}
  <Item
    label={t("common:Note")}
    name="remark"
  >
    <Input />
  </Item>
  {islngLat && (
    <>
      <Item
        label="地址"
        className="address"
        name="address"
        tooltip="请从地图获取地址"
      >
        <Input
          placeholder="请从地图获取地址"
          allowClear
          onChange={(e) => mapref.current.serachMap(e.target.value)}
          value={address.current}
        />
      </Item>
      <div className="map">
        <Mapcom setAaddress={setAaddress} ref={mapref} lngLat={curlnglat.current} />
      </div>
    </>
  )}
</Formbox>
</CModal>
      {/* 删除 */}
      <CModal
        width={554}
        title={`${t("common:Delete")}${name}`}
        ref={dref}
        onOk={delOk}
        type="warn"
        mold="cust"
      >
         <> 是否确认删除 <Text type="danger">{Record["名称"]}</Text>和相关信息?</>
      </CModal>

      <CModal mold='cust' ref={multref}  title='批量导入' onOk={okImport}>
      
      <Dragger  accept=".xlsx" maxCount={1} beforeUpload={beforeUpload}>
        <img src={upCloud}></img>
        <p style={{ margin: '32px 0', fontSize: 16 }}>将文件拖到此处，或<span style={{ color: '#237ae4', textDecoration: 'underline', }}>点击上传</span></p>      
      </Dragger>  
    </CModal>
    </Mainbox>
  );
}
