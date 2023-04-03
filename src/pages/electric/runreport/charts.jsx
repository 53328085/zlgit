import { Pie ,Line} from '@ant-design/plots';
//饼图
export let PieCharts = () => {
    const data = [
      {
        type: '分类一',
        value: 27,
      },
      {
        type: '分类二',
        value: 25,
      },
      {
        type: '分类三',
        value: 18,
      },
      {
        type: '分类四',
        value: 15,
      },
      {
        type: '分类五',
        value: 10,
      },
  
    ];
    const config = {
      appendPadding: 10,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      width: 512,
      height: 360,
      label: {
        type: 'outer',
      },
      legend: {
        position: 'bottom',
        flipPage: false,
        itemSpacing: 15
      },
      interactions: [
        {
          type: 'element-active',
        },
      ],
    };
    return <Pie {...config} />;
  }

//折线图
export let LineCharts=()=>{
    const data =[
        
            {
              "Date": "2010-01",
              "scales": 1998,
              "key":'用电量'
            },
            {
              "Date": "2010-02",
              "scales": 1850,
              "key":'用电量'
            },
            {
              "Date": "2010-03",
              "scales": 1720,
              "key":'用电量'
            },
            {
              "Date": "2010-04",
              "scales": 1818,
              "key":'用电量'
            },
            {
              "Date": "2010-05",
              "scales": 1920,
              "key":'用电量'
            },
            {
              "Date": "2010-06",
              "scales": 1802,
              "key":'用电量'
            },
            {
              "Date": "2010-07",
              "scales": 1945,
              "key":'用电量'
            },
            {
              "Date": "2010-08",
              "scales": 1856,
              "key":'用电量'
            },
            {
              "Date": "2010-09",
              "scales": 2107,
              "key":'用电量'
            },
    ]
    const config = {
      data,
      padding: 'auto',
      xField: 'Date',
      yField: 'scales',
      seriesField:'key',
      lineStyle:{
        lineWidth:1
      },
      paddingTop:64,
      legend:{
        position: 'top',

      },
      point: {
        size: 3,
        shape: 'cycle',
        style: {
          fill: '#5B8FF9',
          borderColor: '#fff'
        },
      },
      xAxis: {
        // type: 'timeCat',
        tickCount: 5,
      },
    }
    return <Line {...config} />;
  }