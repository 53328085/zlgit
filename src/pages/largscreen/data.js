import React,{useState,useEffect} from 'react'

import dayjs from 'dayjs'
 
export const useTime = () => {
  const [time, setTime] = useState(dayjs())
  const timeformat = `${time.format('YYYY年MM月DD日')} 星期${['日', '一', '二', '三', '四', '五', '六'][time.day()]} ${time.format('HH:mm:ss')}`
  useEffect(() => { 
    let timer = setInterval(() => {
      setTime(dayjs())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return timeformat
}

export const colors=["#0475E6","#F88C28","#46C7FF","#46C7FF","#E182A7","#E182A7"]


