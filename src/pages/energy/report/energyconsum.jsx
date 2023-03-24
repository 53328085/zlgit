import React, { useRef, forwardRef, useImperativeHandle, useState, useContext, useEffect, useCallback, useMemo } from 'react'
// import Comp from './comp'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { energyReport } from '@api/api'
import { Form, Select, Button, Divider, DatePicker, Input, message } from 'antd'
import Table from '@com/useTable'
import style from './style.module.less'
import CustContext from '@com/content'



function Energyconsum({ areavalue = 0, arealistRef }) {
  const contentRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const cols =[
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
    }, {
      title: '设备编号',
      dataIndex: 'sn',
      width: 100,
      fixed: 'left',
    }, {
      title: '测点',
      dataIndex: 'type',
      width: 100,
      fixed: 'left',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 100,
      fixed: 'left',
    }, {
      title: '合计',
      dataIndex: 'total',
      width: 100,
      fixed: 'left',
    },
    
  ]
  const [columns,setColumns] = useState([])
 
  const times = []
  for (let i = 0; i < 24; i++) {
        if (i < 10) {
          times.push({
            title: `0${i}:00`,
            dataIndex: `0${i}:00`,
    
          })
        } else if (i == 23) {
          times.push({
            title: `${i}:00`,
            dataIndex: 'i',
    
          })
        } else {
          times.push({
            title: `${i}:00`,
            dataIndex: 'i',
    
          })
        }
      }


  useEffect(() => {
    setColumns([...cols,...times])
  }, [])
  const compProps = {
    columns,
  
    ref: contentRef,
    api: energyReport.QueryConsume,
    setColumns,
    cols
  }
  return (
    <div>
      <Comp {...compProps} />
    </div>
  )
}

export default Energyconsum


function Comp({ api,setColumns,cols, ...other }, ref) {
  const [dataSource, setDataSource] = useState([])
  const [pickertype, setPickertype] = useState(0)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const { areavalue, arealistRef } = useContext(CustContext)
  const tableRef = useRef()
  const projectId = useSelector(state => state.system.menus.projectId)
  const [scroll,setscroll]=useState( { x: 3022 })
  // let   scroll =  { x: 3022 }
  const btncss = {
    width: 96,
    height: 32
  }
  const energyoptions = [
    {
      label: '电',
      value: 1
    }, {
      label: '水',
      value: 2
    }, {
      label: '燃气',
      value: 3
    }
  ]
  //日期选项
  const dateOptions = [{
    label: '时', value: 0
  }, {
    label: '天',
    value: 1
  }, {
    label: '月',
    value: 2
  }, {
    label: '年',
    value: 3
  }]
//计算天数
const   enumerateDaysBetweenDates =(startDate, endDate)=> { // 假定你已经保证了startDate 小于endDate，且二者不相等
  let daysList = [];
  let SDate=moment(startDate);
  let EDate=moment(endDate);
  let xt;
  daysList.push(SDate.format("YYYY-MM-DD"));
  while( SDate.add(1,"days").isBefore( EDate) ){  // 注意这里add方法处理后SDate对象已经改变。      
      daysList.push( SDate.format("YYYY-MM-DD") );
  } 
  console.log(EDate.format("YYYY-MM-DD"))
  // daysList.push( EDate.format("YYYY-MM-DD") );
  return daysList;
}
//计算月份
const enumeratemonthBetweenDates=(startDate, endDate)=>{
  let daysList = [];
  let SDate=moment(startDate);
  let EDate=moment(endDate);
  let xt;
  daysList.push(SDate.format("YYYY-MM"));
  while( SDate.add(1,"month").isBefore( EDate) ){  // 注意这里add方法处理后SDate对象已经改变。      
      daysList.push( SDate.format("YYYY-MM") );
  } 
  // daysList.push( EDate.format("YYYY-MM") );
  return daysList;
}
  //日期类型改变
  const changeTime = (v) => {
    let timelist=[]
    const date = moment().endOf('month').format('DD')
    const month = moment().format('MM')
    const year = moment().format('YYYY')
    console.log(date,month,year)
    setPickertype(v)
    if(v===1){
      form.setFieldsValue({
        starttime:moment().startOf('month'),
        endtime:moment().endOf('month')
      })
      for(let i=1;i<=date;i++){
        timelist.push({
          title:`${year}-${month}-${i}`,
          dataIndex:`${year}-${month}-${i}`,
          width:100
        })
      }
      setscroll({x:parseInt(date)*100+600})
      setColumns([...cols,...timelist])
    }else if(v===2){
      form.setFieldsValue({
        starttime:moment().startOf('year'),
        endtime:moment().endOf('year')
      })
      for(let i=1;i<=12;i++){
        timelist.push({
          title:`${year}-${i}`,
          dataIndex:`${year}-${i}`,
          width:100
        })
      }
      setscroll({x:1800})
      setColumns([...cols,...timelist])
    }else if(v===3){
      form.setFieldsValue({
        starttime:moment(),
        endtime:moment()
      })
      setColumns([...cols,{title:year,dataIndex:year}])
      setscroll({x:0})
    }else if(v===0){
      const times = []
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          times.push({
            title: `0${i}:00`,
            dataIndex: `0${i}:00`,
    
          })
        } else if (i == 23) {
          times.push({
            title: `${i}:00`,
            dataIndex: 'i',
    
          })
        } else {
          times.push({
            title: `${i}:00`,
            dataIndex: 'i',
    
          })
        }
      }
      setColumns([...cols,...times])
    }

  }
  //查询
  const search = () => {
   let timelist=[]
   if(pickertype===1){
    const dd= enumerateDaysBetweenDates(form.getFieldValue('starttime'), form.getFieldValue('endtime'))
    const daydiff = form.getFieldValue('endtime').diff(form.getFieldValue('starttime'),'days')
    console.log(dd,daydiff)
    for(let i=0;i<=daydiff;i++){
      timelist.push({title:dd[i],dataIndex:dd[i]})
    }
    setColumns([...cols,...timelist])
    setscroll({x:(600+parseInt(daydiff)*100)})
   }
   if(pickertype===2 ){
    const dd= enumeratemonthBetweenDates(form.getFieldValue('starttime'), form.getFieldValue('endtime'))
    const daydiff = form.getFieldValue('endtime').diff(form.getFieldValue('starttime'),'month')
    console.log(dd,daydiff)
    for(let i = 0; i <=daydiff;i++){
      timelist.push({title:dd[i],dataIndex:dd[i]})
    }
    setColumns([...cols,...timelist])
    setscroll({x:(600+parseInt(daydiff)*100)})
   }
   if(pickertype===3){
    const startyear = moment(form.getFieldValue('starttime')).format('YYYY')
    const endyear = moment(form.getFieldValue('endtime')).format('YYYY')
    const daydiff=endyear-startyear
    console.log(startyear,endyear,endyear-startyear)
    for(let i = startyear; i <=endyear;i++){
      timelist.push({title:i,dataIndex:i})
    }
    setColumns([...cols,...timelist])
    setscroll({x:(600+parseInt(daydiff)*100)})
   }
    getTableData(areavalue)
  }

  //开始时间禁用
  const disabledStartDate = (current) => {
    return current && current > form.getFieldValue('endtime');
  }
  //结束时间禁用
  const disabledEndDate = (current) => {
    return current && current < form.getFieldValue('starttime');
  }
  //获取数据
  const getTableData = async (areaId = 0) => {
    try {
      const formvalues = form.getFieldValue()
      const startstyle = pickertype === 3 ?'YYYY-01-01' :pickertype === 2?'YYYY-MM-01':'YYYY-MM-DD'  
      const endDate = pickertype === 1 ? moment(formvalues.endtime).format('YYYY-MM-DD')
        : pickertype === 2 ? moment(formvalues.endtime).format('YYYY-MM-01')
          : moment(formvalues.endtime).format('YYYY-01-01')
      let parmas = {
        projectId,
        meterType: formvalues.energytype,
      }

      //能耗用量

      if (pickertype === 0) {
        parmas = {
          ...parmas,
          type: 0,
          startDate: moment(formvalues.day).format('YYYY-MM-DD'),
          endDate: moment(formvalues.day).format('YYYY-MM-DD'),
        }
      } else {
        parmas = {
          ...parmas,
          type: formvalues.time,
          startDate: formvalues.starttime.format(startstyle),
          endDate,
        }
      }

      let arrs = []
      let list = [...arealistRef]
      if (areaId === 0) {
        list?.shift()
        arrs = list?.map(it => it.id)
      } else {
        arrs = [areaId]
      }
      const res = await api(parmas, arrs)
      setLoading(false)
      if (res.success) {
        if (Array.isArray(res.data)) {
          setDataSource([...res.data])
        } else {
          setDataSource([])
        }
      } else {
        message.error(res.errMsg)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    areavalue&&getTableData(areavalue)
  }, [areavalue])

  return (
    <div>
      <Form
        form={form}
        layout="inline"
        initialValues={
          {
            energytype: 1,
            time: 0,
            starttime:moment(),
            endtime:moment(),
            day: moment(),
          }
        }
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item label="能源类型" style={{ marginBottom: 0 }} name="energytype">
            <Select style={{ width: 112 }} options={energyoptions}></Select>
          </Form.Item>
          <Divider type="vertical" style={{ height: 30, margin: '0 32px' ,borderColor:'#d7d7d7'  }} dashed></Divider>

          {
            <>
              <Form.Item label="时间" style={{ marginBottom: 0, marginRight: 16 }} name="time">
                <Select style={{ width: 80 }} options={dateOptions} onChange={changeTime}></Select>
              </Form.Item>
              {
                pickertype === 0 ? (
                  <>
                    <Form.Item style={{ marginBottom: 0 }} name="day">
                      <DatePicker
                        picker='date'
                      />
                    </Form.Item>
                  </>
                )
                  :
                  (
                    <>
                      <Form.Item style={{ marginBottom: 0 }} name="starttime">
                        <DatePicker
                          disabledDate={disabledStartDate}
                          picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
                        />
                      </Form.Item>
                      <p style={{ margin: '0 16px' }}>至</p>
                      <Form.Item style={{ marginBottom: 0 }} name="endtime">
                        <DatePicker
                          picker={pickertype === 1 ? 'date' : pickertype === 2 ? 'month' : 'year'}
                          disabledDate={disabledEndDate}
                        />
                      </Form.Item>
                    </>
                  )
              }
            </>
          }

        </div>
        <div>
          <Button style={btncss} onClick={search}>查询</Button>
          <Button style={{ ...btncss, marginLeft: 16 }} onClick={() => { tableRef.current.download() }}>导出</Button>
        </div>

      </Form>
      <Divider dashed style={{borderColor:'#d7d7d7' }}></Divider>
      <div style={{ width: 1645 }} className={style.tablecss}>
        <Table dataSource={dataSource} scroll={scroll} {...other} ref={tableRef} loading={loading} ></Table>

      </div>

    </div>

  )
}


