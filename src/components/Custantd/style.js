import {Slider} from 'antd'
import styled from 'styled-components'
export const CSlider = styled(Slider)`
&&{
  .ant-slider-mark {
    .ant-slider-mark-text{
     font-size: 12px;
}
  }
 
    .ant-slider-rail,.ant-slider-handle:focus,.ant-slider-track{
        background-color: transparent;
    }
    .ant-slider-handle {
      height: 20px;
      width: 20px;
    }
}
`