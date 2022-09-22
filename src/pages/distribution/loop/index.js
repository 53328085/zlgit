import React, { useState } from 'react'
import style from './style.module.less'
import { Select, Button, DatePicker } from 'antd'
import { SyncOutlined, UploadOutlined,RollbackOutlined, SearchOutlined } from '@ant-design/icons';
import LoopSelect from './loopSelect'
import ContentTable from './contentTable';
import LoopDetail from './loopDetail';

export default function Index() {
  const {Option} = Select;
  const { RangePicker } = DatePicker;
  const [showDetail, setShowDetail] = useState(false);

  const columns = [
    {
        title:'回路名称',
        dataIndex:'name',
        width:180,
        render:(text, record) => <span style={{color:'#237ae4',textDecoration:'underline',cursor:'pointer'}} onClick={()=>{showDetailPage(record)}}>{text}</span>
    },{
        title:'电压',
        children:[
            {
                title:'Ua(V)',
                dataIndex:'Ua',
                width:120
            },
            {
                title:'Ub(V)',
                dataIndex:'Ub',
                width:120
            },
            {
                title:'Uc(V)',
                dataIndex:'Uc',
                width:120
            },
        ]
    },{
        title:'电流',
        children:[
            {
                title:'Ia(V)',
                dataIndex:'Ia',
                width:120
            },
            {
                title:'Ib(V)',
                dataIndex:'Ib',
                width:120
            },
            {
                title:'Ic(V)',
                dataIndex:'Ic',
                width:120
            },
        ]
    },{
        title:'功率因数',
        dataIndex:'PF',
        width: 118
    },{
        title:'总用功功率(kW)',
        dataIndex:'TWP',
        width: 130
    },,{
        title:'总无功功率(kVar)',
        dataIndex:'TRP',
        width: 130
    },,{
        title:'总电度(kW·h)',
        dataIndex:'TED',
        width: 130
    }
  ]

  const tableData = [
      {   key:'1',
          name:'总进线1',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 12568.32
      },{   key:'1-1',
          name:'回路1-1',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 3668.32
      },{ 
          key:'1-2',
          name:'回路1-2',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 5645.32
      },{ 
          key:'1-2-1',
          name:'回路1-2-1',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 1568.32
      },{ 
          key:'1-2-2',
          name:'回路1-2-2',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 1228.97
      },{ 
          key:'2',
          name:'总出线2',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 2568.35
      },{ 
          key:'2-1',
          name:'回路2-1',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 2348.32
      },{ 
          key:'2-2',
          name:'回路2-2',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 1984.32
      },{ 
          key:'2-2-1',
          name:'回路2-2-1',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 3291.32
      },{ 
          key:'2-2-2',
          name:'回路2-2-2',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 1292.92
      },{ 
          key:'2-2-3',
          name:'回路2-2-3',
          Ua:42323.23,
          Ub: 233.31,
          Uc: 231.38,
          Ia: 235.36,
          Ib: 301.32,
          Ic: 302.21,
          PF: 0.98,
          TWP: 125.36,
          TRP: 53.36,
          TED: 3568.32
      }
  ]

  const showDetailPage = value => {
    console.log(value);
    setShowDetail(true);
  }

  const goBack = () => {
    setShowDetail(false);
  }


  return (
    <div>
       <div className={style.header}>
        <span style={{marginLeft: '12px'}}>区域选择</span>
        <Select
          placeholder="请选择区域"
          size="middle"
          style={{width: '330px', marginLeft: '12px'}}
        >
          <Option value="1">正泰物联全部园区</Option>
          <Option value="2">正泰物联滨江园区</Option>
          <Option value="3">正泰物联温州园区</Option>
        </Select>
        { showDetail ? (
        <>
          <RangePicker size='middle' style={{width:376, marginLeft:16, marginRight:16}}></RangePicker> 
          <Button size='middle' type='primary' icon={<SearchOutlined />} >查询</Button>
        </>): 
        <span className={style.collectionTime}>参量采集时间：2020-09-03 09:35:21</span> }
        <div className={style.buttonList}>
          {showDetail ? <Button className='refresh' type='primary' icon={<RollbackOutlined />} onClick={goBack} >返回</Button> : null}
          <Button className='refresh' type='primary' icon={<SyncOutlined />} >刷新</Button>
          <Button className='headerButton' type='primary' >回路拓扑图</Button>
          <Button className='headerButton' type='primary' icon={<UploadOutlined />} >导出</Button>
        </div>
      </div>
      <div className={style.content}>
        <LoopSelect></LoopSelect>
        <div className={style.contentRight}>
          {!showDetail ? <ContentTable  columns={columns} tableData={tableData}></ContentTable> : <LoopDetail></LoopDetail>}
        </div>
      </div>
    </div>
  )
}
