 

export const cols = {  
 0:{
    title: '区域名称',
    dataIndex: 'nodeName',
    key: "nodeName",
    fixed:'left',
    ellipsis:true,
    width:140,
    hideInSetting: true
  },
 1: {
    title: '设备名称',
    dataIndex: 'name',
    key: "name",
    fixed:'left',
    ellipsis:true,
    width:140,
  }, 
  2:{
    title: '设备编号',
    dataIndex: 'sn',
    key: "sn",
    ellipsis:true,
    fixed:'left',
    width:140,
    
  },
  3: {
    title: '抄读时间',
    dataIndex: 'LastSampleTime',
    key: "LastSampleTime",
    fixed:'left',
    ellipsis:true,
    width:100,
  },
  length: 4
}
export const extendcols ={
    1:{
0: {
    title: 'A相电压(V)',
    dataIndex: 'Ua',
    key: "Ua", 
    ellipsis:true,
    width:100,
},
1: {
    title: 'B相电压(V)',
    dataIndex: 'Ub',
    key: "Ub", 
    ellipsis:true,
    width:100,
},
2: {
    title: 'C相电压(V)',
    dataIndex: 'Uc',
    key: "Uc", 
    ellipsis:true,
    width:100,
},
3: {
    title: 'A相电流(A)',
    dataIndex: 'Ia',
    key: "Ia", 
    ellipsis:true,
    width:100,
},
4: {
    title: 'B相电流(A)',
    dataIndex: 'Ib',
    key: "Ib", 
    ellipsis:true,
    width:100,
},
5: {
    title: 'c相电流(A)',
    dataIndex: 'Ic',
    key: "Ic", 
    ellipsis:true,
    width:100,
},
6: {
    title: '正向有功总电能（kWh）',
    dataIndex: 'ImpEp',
    key: "ImpEp", 
    ellipsis:true,
    width:100,
},
7: {
    title: '反向有功总电能（kWh）',
    dataIndex: 'ExpEp',
    key: "ExpEp", 
    ellipsis:true,
    width:100,
},
8: {
    title: '总有功功率（kW）',
    dataIndex: 'Pt',
    key: "Pt", 
    ellipsis:true,
    width:100,
},
9: {
    title: '总无功功率（kW）',
    dataIndex: 'Qt',
    key: "Qt", 
    ellipsis:true,
    width:100,
},
10: {
    title: '正向有功总需量（kW）',
    dataIndex: 'MaxDemand',
    key: "MaxDemand", 
    ellipsis:true,
    width:100,
},
11: {
    title: '反向有功总需量（kW）',
    dataIndex: 'ExpMaxDemand',
    key: "ExpMaxDemand", 
    ellipsis:true,
    width:100,
},
12:  {
    title: '总功率因数',
    dataIndex: 'PFt',
    key: "PFt", 
    ellipsis:true,
    width:100,
},
length:13

},
2:{ // 冷水
0: {
    title: '瞬时流量（m³）',
    dataIndex: 'InstantFlow',
    key: "InstantFlow", 
    ellipsis:true,
    
},
1: {
    title: '累计流量（m³）',
    dataIndex: 'Flow',
    key: "Flow", 
    ellipsis:true,
   
},
2: {
    title: '电池电压（V）',
    dataIndex: 'Battery',
    key: "Battery", 
    ellipsis:true,
    
},
3: {
    title: '阀门状态',
    dataIndex: 'Relay1',
    key: "Relay1", 
    ellipsis:true,
   
},
length:4
},
7:{ // 热水
0: {
    title: '瞬时流量（m³）',
    dataIndex: 'InstantFlow',
    key: "InstantFlow", 
    ellipsis:true,
    
},
1: {
    title: '累计流量（m³）',
    dataIndex: 'Flow',
    key: "Flow", 
    ellipsis:true,
    
},
2: {
    title: '电池电压（V）',
    dataIndex: 'Battery',
    key: "Battery", 
    ellipsis:true,
    
},
3: {
    title: '阀门状态',
    dataIndex: 'Relay1',
    key: "Relay1", 
    ellipsis:true,
     
},
length:4
},
3:{ // 燃气表
0: {
    title: '瞬时流量（Nm³/h）',
    dataIndex: 'FlowR',
    key: "FlowR", 
    ellipsis:true,
    
},
1: {
    title: '累计流量（Nm³）',
    dataIndex: 'Flow',
    key: "Flow", 
    ellipsis:true,
    
},
2: {
    title: '压力（kPa）',
    dataIndex: 'Pressure',
    key: "Pressure", 
    ellipsis:true,
    
},
3: {
    title: '温度（℃）',
    dataIndex: 'Temp',
    key: "Temp", 
    ellipsis:true,
    
},
length:4
}
}

export const setcols ={
  1:{    name: {
       disable:true,
    
     },
    sn:{
    disable:true,
    
    },
    LastSampleTime:{
        show:false
    },
    Ua:{
        show:false
    },
     Ub:{
        show:false
    },
     Uc:{
        show:false
    },
     Ia:{
        show:false
    },
      Ib:{
        show:false
    },
      Ic:{
        show:false
    },
    ImpEp:{
        show:false
    },
     ExpEp:{
        show:false
    },
     Pt:{
        show:false
    },
     Qt:{
        show:false
    },
     MaxDemand:{
        show:false
    },
     ExpMaxDemand:{
        show:false
    },
     PFt:{
        show:false
    },    
}
    
}