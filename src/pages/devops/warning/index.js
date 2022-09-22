import React from 'react'
import DevopSearch from '@com/devopSearch/devopSearch'
import WarnContent from './warncontent'
import style from './style.module.less'
export default function Index() {

  return (
    <div className={style.warning}>
      <DevopSearch />
      <WarnContent style={style} />
    </div>
  )
}
