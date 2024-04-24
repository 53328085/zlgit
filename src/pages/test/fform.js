import { message, Typography } from 'antd';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next'
const {Link} = Typography
function MyComponent({person, messages}) {
 const {name}=person;
 const count = messages.length;
 const {t}= useTranslation(["translation"])
 console.dir(t)
return <Trans i18nKey="userMessagesUnread" values={{name: 'zzl', count: 12}} components={['',<strong></strong>,'', '','',<a></a>]} >

</Trans>
}
export default function Index() {
  
 
  return (
    <div>
      <h1>国际化</h1>      
      <MyComponent person={{name: "author"}} messages={["浙江杭州市滨江区"]} />
    </div>
  )
}