export const   columns = [
    {
        title: '日期',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        width: '186px'
    },
    {
        title: '充电电量(kWh)',
        dataIndex: 'chargeE',
       
    },
    {
        title: '充电成本(元)',
        dataIndex: 'chargeCost',
    },
   
    {
        title: '放电电量(kWh)',
        dataIndex: 'dischargeE',
    },
    {
        title: '放电收益(元)',
        dataIndex: 'dischargeCost',
       
    },
    {
        title:  "系统累计收益(元)",
        dataIndex: 'inCome',
        key: 'inCome',
        align: 'center'

    }
   ]
   export const options =[
    {
        label:"图表模式",
        value:"1"
    },
    {
        label:"列表模式",
        value:"2"
    }
   ]