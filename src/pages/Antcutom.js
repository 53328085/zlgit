import React, {useState} from 'react'
import {SketchPicker} from 'react-color'
import antdconfg from '../antdconfig'
import {Button, ConfigProvider} from 'antd'
export default function Antcutom() {
 const [color, setColor] = useState({
    primaryColor: '#1890ff',
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
    successColor: '#52c41a',
    infoColor: '#1890ff',
 })
 const onColorChange = (nextColor) => {
     console.log(nextColor)
    const mergedNextColor = { ...color, ...nextColor };
     setColor(mergedNextColor)
     ConfigProvider.config({
        theme: mergedNextColor,
      })
     antdconfg.theme = Object.assign({}, antdconfg.theme, mergedNextColor)
    
 }
  return (
    <div>
        <SketchPicker
            presetColors={['#1890ff', '#25b864', '#ff6f00']}
            color={color.primaryColor}
            onChange={({ hex }) => {
              onColorChange({
                primaryColor: hex,
              });
            }}
          />
          <div>
              <Button type="primary">priimary</Button>
          </div>
    </div>
  )
}
