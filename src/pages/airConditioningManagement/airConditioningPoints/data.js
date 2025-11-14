export  const initialValues={
    ioState:1,
    temperature:16,
    workMode:1,
    windSpeed:1,
  }
export const marks={
    16: '16',
    31: '31'
}
export const rules=[
     {
        required: true,
        
      }
]
export const optobj= {
    1: {
        "开":1,
        "关":2
    },
    2: {
        "制冷":1,
        "制热":2,
        "送风":3,
        "除湿":4,
    },
    3: {
        "自动":0,
        "低速":1,
        "中速":2,
        "高速":3,
 
    },
    
}