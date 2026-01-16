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
        "制热":4,
        "送风":3,
        "除湿":2,
    },
    3: {
        "自动":5,
        "低速":3,
        "中速":2,
        "高速":1,
 
    },
    
}