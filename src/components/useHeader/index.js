import React, { useState, useEffect, useCallback } from 'react'
import { useRequest } from 'ahooks';
import style from './style.module.less';
import { Select, DatePicker, Button, message, Radio } from 'antd';
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
import { eneryShift } from '@api/api.js'
//dayjs bug
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(weekday);
dayjs.extend(localeData);

export default function Index(props) {
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };
  const dispatch = useDispatch()
  const projectId = useSelector(selectProjectId);
  let areaList;
  let oneLevelDefaultId;
  if (props.allarea) {
    areaList = props.allarea
    oneLevelDefaultId = 0
  } else {
    areaList = useSelector(selectOneLevel)
    oneLevelDefaultId = useSelector(selectOneLevelDefaultId)
  }

  const areaName = useSelector(levelDefaultLabel) || '园区'

  const { queryShifts } = eneryShift
  //园区
  const [defaultArea, setDefaultArea] = useState(oneLevelDefaultId ? oneLevelDefaultId : undefined)
  const [areaId, setAreaId] = useState(oneLevelDefaultId ? oneLevelDefaultId : undefined)
  const changeArea = (value) => {
    console.log(value)
    areaList.map(item => {
      if (item.id == value) {
        dispatch(setCurrentlevel(item))
      }
    })

    setAreaId(value);
  };

  //能源类型
  const [energyType, setEnergyType] = useState(props.comprehensive ? 0 : 1)
  const changeEnergyType = val => {
    setEnergyType(val)
  }
  //日期选择
  const [type, setType] = useState("year");
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  month = month > 9 ? month : "0" + month;
  let day = time.getDate();
  day = day > 9 ? day : "0" + day;
  const [date, setDate] = useState(year.toString() + "-01-01");
  const changeDateType = (val) => {
    setType(val);
    if (val == "year") setDate(year.toString() + "-01-01");
    if (val == "month") setDate(year + "-" + month + "-01");
    if (val == "date") setDate(year + "-" + month + "-" + day);
  };
  const changeDate = (date, dateString) => {
    if (type == 'year') setDate(dateString + '-01-01')
    if (type == 'month') setDate(dateString + '-01')
    if (type == 'date') setDate(dateString)
  }

  const PickerWithType = useCallback(({ type, onChange }) => {
    if (type === 'date') return <DatePicker allowClear={false} picker={type} value={dayjs(date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={onChange} />;
    if (type === 'month') return <DatePicker allowClear={false} picker={type} value={dayjs(date, 'YYYY-MM')} format={'YYYY-MM'} onChange={onChange} />;
    if (type === 'year') return <DatePicker allowClear={false} picker={type} value={dayjs(date, 'YYYY')} format={'YYYY'} onChange={onChange} />;
  }, [date])
  //班次
  const [shift, setShift] = useState(0);
  const changeShift = (val) => {
    setShift(val);
  };
  const [shiftList, setShiftList] = useState([]);
  const getShifts = () => {
    return queryShifts(projectId).then((res) => {
      let { success, data } = res;
      if (success) {
        setShiftList(data);
      } else {
        messageContent("error", res.errMsg);
      }
    });
  };
  const { data: shiftsData, run: runShift } = useRequest(getShifts, {
    manual: true,
    onSuccess: (result, params) => { },
  });
  useEffect(() => {
    if (areaList.length == 0 || !areaList) {
      message.error('当前项目尚未创建园区!')
      return;
    }
    if (props.isShift) {
      runShift();
    } else {
      return;
    }
  }, []);
  //导出
  const handleExport = () => {
    props.export();
  };

  //数据类型
  const [tab, setTab] = useState("energy");
  const changeTab = (val) => {
    setTab(val);
  };

  useEffect(() => {
    if (props.allarea) {
      let params = {
        projectId,
        areaId,
        shift,
        energyType,
        type,
        date,
        tab,
      };
      props.getValues(params);
    } else {
      if (areaId == 0) {
        return;
      } else {
        let params = {
          projectId,
          areaId,
          shift,
          energyType,
          type,
          date,
          tab,
        };
        props.getValues(params);
      }
    }

  }, [areaId, shift, energyType, type, date, tab]);
  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <span style={{ marginLeft: "16px", marginRight: 16 }}>{areaName}选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          key={oneLevelDefaultId}
          defaultValue={oneLevelDefaultId}
          style={{ width: "200px" }}
          onChange={changeArea}
        >
          {areaList?.map((item) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
        {props.isEnergy ? (
          <>
            <div className={style.line}></div>
            <span>能源类型</span>
            <Select
              size="middle"
              style={{ width: '126px', marginLeft: '16px' }}
              defaultValue={1}
              onChange={changeEnergyType}
            >
              <Option value={1}>电</Option>
              <Option value={2}>水</Option>
              <Option value={3}>燃气</Option>
            </Select>
          </>) : null}
        {(props.isEnergy == false && props.comprehensive) ? <>
          <div className={style.line}></div>
          <span>能源类型</span>
          <Select
            size="middle"
            style={{ width: '126px', marginLeft: '16px' }}
            defaultValue={0}
            onChange={changeEnergyType}
          >
            <Option value={0}>综合能耗</Option>
            <Option value={1}>电</Option>
            <Option value={2}>水</Option>
            <Option value={3}>燃气</Option>
          </Select>
        </> : null}
        {
          props.isTab ? <>
            <Radio.Group onChange={changeTab} defaultValue="energy" buttonStyle="solid">
              <Radio.Button style={{ width: '96px', marginLeft: 16, textAlign: 'center', borderRadius: 16, borderTopRightRadius: 0, borderBottomRightRadius: 0 }} value="energy">能耗</Radio.Button>
              <Radio.Button style={{ width: '96px', textAlign: 'center', borderRadius: 16, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} value="cost">费用</Radio.Button>
            </Radio.Group>
          </>
            : null}
        {props.isDate ? (
          <>
            <div className={style.line}></div>
            <Select
              size="middle"
              style={{ width: "80px", marginRight: "16px" }}
              defaultValue={"year"}
              onChange={changeDateType}
            >
              <Option value="date">日</Option>
              <Option value="month">月</Option>
              <Option value="year">年</Option>
            </Select>
            <PickerWithType
              style={{ width: "160px", marginRight: "16px" }}
              type={type}
              onChange={changeDate}
            ></PickerWithType>
          </>
        ) : null}
        {props.isShift ? (
          <>
            <Select
              size="middle"
              style={{ width: "112px", marginLeft: 16, marginRight: "16px" }}
              defaultValue={0}
              onChange={changeShift}
            >
              <Option value={0}>全部班次</Option>
              {shiftList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </>
        ) : null}
        {props.isExport ? (
          <>
            <Button
              style={{
                marginRight: 16,
                marginLeft: "auto",
                borderRadius: 4,
                width: 96,
              }}
              size="middle"
              onClick={() => handleExport()}
            >
              导出
            </Button>
          </>
        ) : null}
        {props.isSearch ? (
          <>
            <Button
              style={{ marginRight: 16, borderRadius: 4, width: 96 }}
              size="middle"
            >
              查询
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
