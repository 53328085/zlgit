 
import {useMemo} from 'react'
 
  const cols =[ //   用电量  
    {
      title: '时间',
      dataIndex: 'time', 
      key:'time',
      width: 100,
      sorter: (a, b) => parseFloat(a.time) - parseFloat(b.time)
    },
    {
      title: '总用电量 (kWh)',
      dataIndex: 'total', 
      key:'total',
      width:250,
      sorter: (a, b) => parseFloat(a.total) - parseFloat(b.total)
    },
    {
      title: '市用电量(kWh)',
      dataIndex: 'cu', 
      key:'cu',
      width:250,
      sorter: (a, b) => parseFloat(a.cu) - parseFloat(b.cu)
    },
    {
      title: '市电占比(%)',
      dataIndex: 'curate', 
      key:'curate',
      sorter: (a, b) => parseFloat(a.curate) - parseFloat(b.curate)
    },
    {
      title: '绿用电量(kWh)',
      dataIndex: 'su', 
      key:'su',
      width:250,
      sorter: (a, b) => parseFloat(a.su) - parseFloat(b.su)
    },
    {
      title: '绿电占比(%)',
      dataIndex: 'surate', 
      key:'surate',
      sorter: (a, b) => parseFloat(a.surate) - parseFloat(b.surate)
    },
  ]
  const ucols =[  // 发电量
    {
      title: '时间',
      dataIndex: 'time', 
      key:'time',
      width: 200,
      sorter: (a, b) => parseFloat(a.time) - parseFloat(b.time)
    },
    {
      title: '发电量(kWh)',
      dataIndex: 'ec', 
      key:'ec', 
      sorter: (a, b) => parseFloat(a.ec) - parseFloat(b.ec)
    },
  ]
  const incols =[  // 收益
    {
      title: '时间',
      dataIndex: 'time', 
      key:'time',
      width: 200,
      sorter: (a, b) => parseFloat(a.time) - parseFloat(b.time)
    },
    {
      title: '收益(元)',
      dataIndex: 'income', 
      key:'income', 
      sorter: (a, b) => parseFloat(a.income) - parseFloat(b.income)
    },
  ]
  const effect =[  // 社会效益
    {
      title: '时间',
      dataIndex: 'time', 
      key:'time',
      width: 200,
      sorter: (a, b) => parseFloat(a.time) - parseFloat(b.time)
    },
    {
      title: '减少标煤（t）',
      dataIndex: 'coal', 
      key:'coal', 
      sorter: (a, b) => parseFloat(a.income) - parseFloat(b.income)
    },
    {
      title: '减少CO2排放（t）',
      dataIndex: 'co2', 
      key:'co2', 
      sorter: (a, b) => parseFloat(a.income) - parseFloat(b.income)
    },
  ]
  export function useColumns(type){
     const columns =useMemo(()=> {
       return [cols, ucols, incols,effect][type]
     },[type])
     return columns
  }
  export const tabs =[
    {
     label: "地图",
     value: "map"
  },
  {
    label: "卡片",
    value: "card"
 },
]
 const Pieoption = {
  type: 3,
  title: "",
  pieData: { data: [], total: "100%", radius: ["40%",  "50%"],  center: ['50%', '50%'], labelLine: {
    length: 5,
    length2: 1,
  } },
  legend: {
    bottom: 5,
    top: 'auto'
  },

}
const testStyle = {
   textStyle: {
     fontSize: 14
   }
}
export function useBaroption(data){
   let options = useMemo(()=> {
    return {
         
          series: [{ type: "bar", seriesLayoutBy: 'row', stack: 'x'
           }, { type: "bar", seriesLayoutBy: 'row', stack: 'x',label: {
            show:true,
            formatter: (params)=> {
               let total = params.value?.slice(1).reduce((a, b)=> parseFloat(a)+parseFloat(b), 0)
               
              return  total
            },
            position: "top"
          }        }],
          grid: {
            left: "0px",
            right: "0",
            top: "46px",
            bottom: "0px",
            containLabel: true,
          },
          legend: {
            top: 0,
            type: "scroll"
          },
          dataset: {
            dimensions: [
              {name: "时间", type: "time"},
              {name: "市电"},
              {name: "绿电"}
          ],
            source: [data.x, data.y, data.y1]
          }
       
    }
   }, [data])
   return options
}

export function useBaroptionEC(data){
  let options = useMemo(()=> {
   return {
        
         series: [{ type: "bar", seriesLayoutBy: 'row' } ],
         grid: {
           left: "0px",
           right: "0",
           top: "46px",
           bottom: "0px",
           containLabel: true,
         },
         legend: {
           show:false
         },
         dataset: {
           dimensions: [
             {name: "时间", type: "time"},
             {name: "发电量"},
              
         ],
           source: [data.x, data.y]
         }
      
   }
  }, [data])
  return options
}

export function useBaroptionIncome(data){
  let options = useMemo(()=> {
   return {
        
         series: [{ type: "bar", seriesLayoutBy: 'row' } ],
         grid: {
           left: "0px",
           right: "0",
           top: "46px",
           bottom: "0px",
           containLabel: true,
         },
         legend: {
           show:false
         },
         yAxis: {
          axisLabel: {
            formatter: (v) => v+'元'
          }
         },
         dataset: {
           dimensions: [
             {name: "时间", type: "time"},
             {name: "收益"},
              
         ],
           source: [data.x, data.y]
         },
         tooltip: {
         /*  formatter: function (params) {
            console.log(params)
            var tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value + '元';
          } */
        },

      
   }
  }, [data])
  return options
}
export  function useOption(lightdata) {
    let options = useMemo(()=> {
         return {
           day: {...Pieoption, title: {text:"日用电量（kWh）", ...testStyle}, pieData: {...Pieoption.pieData, data: [
            {
            value:lightdata?.eucDay,
            name: "市电"
             },
             {
              value:lightdata?.eusDay,
              name: "绿电"
               }
          ],
          label: {
            formatter: (params)=> {
              return params?.data?.value
            },
            width:100,
            fontSize:9
          },
          total: parseFloat(lightdata?.eucDay)+parseFloat(lightdata?.eusDay)
        }},
          month: {...Pieoption, title: {text:"月用电量（kWh）", ...testStyle}, pieData: {...Pieoption.pieData, data: [
            {
            value:lightdata?.eucDay,
            name: "市电"
             },
             {
              value:lightdata?.eusDay,
              name: "绿电"
               }
          ],
          label: {
            formatter: (params)=> {
              return params?.data?.value
            },
            width:100,
            fontSize:9
          },
          total: parseFloat(lightdata?.eucDay)+parseFloat(lightdata?.eusDay)
        }},
          year: {...Pieoption, title: {text: "年用电量（kWh）", ...testStyle}, pieData: {...Pieoption.pieData, data: [
            {
            value:lightdata?.eucYear,
            name: "市电"
             },
             {
              value:lightdata?.eusYear,
              name: "绿电"
               }
          ],
           label: {
            formatter: (params)=> {
              return params?.data?.value
            },
            width:100,
            fontSize:9
          },
          total: parseFloat(lightdata?.eucDay)+parseFloat(lightdata?.eusDay)
        }}
         }
  
  
  
     }, [lightdata])
    return options
    
}
export  function usedOption(data) {
  let options = useMemo(()=> {
        return {
          ...Pieoption,
          pieData: {...Pieoption.pieData, 
           
            data: [
            {
            value:data?.euc,
            name: "市电"
             },
             {
              value:data?.eus,
              name: "绿电"
               }
          ],
          radius: ["40%",  "65%"],
          label: {
            show:false
          },
          total: parseFloat(data?.euc) + parseFloat(data?.eus),
        },
        
        }
   }, [data])
  return options
  
}
export function useBaroptionEfc(data){
  let options = useMemo(()=> {
   return {
        
         series: [{ type: "bar", seriesLayoutBy: 'row', 
          }, { type: "bar", seriesLayoutBy: 'row' }],
         grid: {
           left: "0px",
           right: "0",
           top: "46px",
           bottom: "0px",
           containLabel: true,
         },
         legend: {
           top: 0,
           type: "scroll"
         },
         dataset: {
           dimensions: [
             {name: "时间", type: "time"},
             {name: "减少标煤"},
             {name: "减少Co2排放"}
         ],
           source: [data.x, data.y, data.y1]
         }
      
   }
  }, [data])
  return options
}

export const timeoption = [{
  label: "日",
  value: "date"
},{
  label: "月",
  value: "month"
},{
  label: "年",
  value: "year"
}
]
export const viewoption = [{
  label: "图表模式",
  value: 1
},{
  label: "列表模式",
  value: 2
}]