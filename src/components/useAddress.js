import React, {useState, useEffect, useMemo} from 'react'
import provinces from "china-division/dist/provinces.json";
 import cities from "china-division/dist/cities.json";
 import areas from "china-division/dist/areas.json";
import {Cascader} from 'antd'; 
export default function Address({value, onChange}) {
  const getAdrees = () => { 
    const Cities = [].concat(cities).map((c => ({...c, value: c.name})))
    const Areas = [].concat(areas).map((a) => ({...a, value:a.name}))
    const Provinces = [].concat(provinces).map((p) => ({...p, value: p.name}))
 
    Cities.forEach(c => {
      let children = Areas.filter(a => a.cityCode == c.code);
      c.children = children || [];
    })
    Provinces.forEach(p => {
      const children = Cities.filter(c =>c.provinceCode ==p.code )
      p.children = children || [];
    })  
   return Provinces    
 }
  const [options] = useState(getAdrees())
  const changeaddress = (value) => {
    onChange?.(value?.join())
  }
  return (
    <Cascader
        options={options} 
        onChange={changeaddress} 
        fieldNames={{label: 'name', value: 'value', children: 'children'}}
        placeholder="请选择或输入省/市/区" 
        style={{
        marginBottom: "16px",
        }}
  />
  )
}
