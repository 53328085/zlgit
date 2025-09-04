import React, { useEffect, useRef } from 'react';
import { DatePicker, Table, Checkbox, Space, Radio, Divider, Select, Tree, Button, message } from "antd";
const HistoricalDataModal = () => {
    return (
        <div className='content'>
            <div className='searchBox'>
                <div className='physical'>
                    <Select defaultValue="1" style={{ width: 96, marginRight: 16 }} onChange={changeTime}
                        options={[
                            { value: '1', label: '电压', },
                            { value: '2', label: '电流', }, ,
                        ]}
                    />
                </div>
                <div>
                    <Select defaultValue="1" style={{ width: 96, marginRight: 16 }} onChange={changeTime}
                        options={[
                            { value: '1', label: '日', },
                            { value: '2', label: '月', },
                            { value: '3', label: '年' },
                            // { value: '4', label: '自定义' },
                        ]}
                    />
                    {params.type == 1 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={moment(today)} disabledDate={disabledDate} /> :
                        params.type == 2 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={moment(tmonth)} picker='month' disabledDate={disabledDate} /> :
                            params.type == 3 ? <DatePicker style={{ width: 240 }} onChange={onChangeDate} picker='year' defaultValue={moment(tyear)} disabledDate={disabledDate} /> : null
                        // <RangePicker style={{ width: 240 }} onChange={onChangeDate} defaultValue={[moment(today), moment(today)]} disabledDate={disabledDate} />
                    }
                </div>
                <Radio.Group
                    block
                    options={options}
                    optionType="button"
                    buttonStyle="solid"
                    value={state.timeType}
                    onChange={(e) => {
                        state.timeType = e.target.value
                    }}
                    style={{ marginRight: "16px" }}
                />
                {/* tb={tableRef} */}
                {/* <ExportExcel ></ExportExcel> */}
                <ExportButton onClick={onexprot} disabled={state.timeType == 1} />
            </div>
            <div className='echarts'></div>
            <div className='table'></div>
        </div>
    )
}
export default HistoricalDataModal;