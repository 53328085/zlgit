import React, {memo} from 'react'

export default  function SvgIcon({href,color, width, height}){
  return (
    <svg aria-hidden="true" width={width} height={height}  >
      <use href={href}   x={width} y={height}  />
    </svg>
  );
}
