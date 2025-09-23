import React from 'react'
import Building from '@com/building'
import Pagecount from "@com/pagecontent";
import PhotovoltaicStation from './PhotovoltaicStation';
export default function Index({ pagename }) {
  return (
    // <div style={{flex: 1, display:"flex", justifyContent: 'center', alignContent: 'center'}}>
    //   <Building pagename={pagename} />
    // </div>
    <Pagecount pd={0} >
      <PhotovoltaicStation />
    </Pagecount>
  )
}
