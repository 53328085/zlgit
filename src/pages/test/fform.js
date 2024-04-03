import React, {useRef, useEffect, useState} from 'react'
import {Typography} from 'antd'
import moment from 'moment';
import {useTranslation, Trans, Translation} from 'react-i18next';
import i18t from '../../i18n'
import styled, {keyframes} from 'styled-components';
 
console.log(i18t.resolvedLanguage);
const {Paragraph} = Typography
const rota = keyframes`
  from {
    transform: translate3d(0 0 0);
  }
  to {
    transform: translate3d(0, -210px, 0);
  }
`
const Animation=styled.div`
  position: relative;
  animation:  ${rota} 1.75s 1s  linear infinite ;
  
  font-size: 1.2rem;
  background-color: turquoise;
  height: inherit;
  &:hover {
    animation-play-state: paused;
  }
  & p { 
    padding: 2px;
    height: 30px;
    background-color: antiquewhite;
    &:nth-of-type(2n) {
      background-color: aquamarine;
    }
  }
`
function Mycom() {
  const {t} = useTranslation("test");
  return <Trans t={t}><Paragraph>hello world</Paragraph></Trans>
}
export default function Index() {
  const [ltr, setLtr] = useState('ltr')
  const {t, i18n} = useTranslation(["test"]);
  const de = i18n.getFixedT('de', 'zd');
  const transform = () => {
     i18t.dir("ar")
     setLtr(i18t.dir())
  }
  const lngs = {
    en: { nativeName: 'English' },
    zh: { nativeName: '中文' }
  };
  const ref = useRef()
  useEffect(() => {
   // console.log(ref.current.offsetHeight);
  })
  const p ={
    name: '朱正林',
    age: 46
  }
  return (
    <div dir={ltr}>
      <header>
      <select onChange={(evt) => {
          i18n.changeLanguage(evt.target.value)
        }}>
          {Object.keys(lngs).map((lng) => (
            <option key={lng} value={lng} label={lngs[lng].nativeName}
              style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} />
          ))}
        </select>
      </header>
      <main>
         <button onClick={transform}>英文</button>
        <p>{t("welcome", {ns: 'test'})}</p>
        
           <Translation ns={["test"]}>
              {
                (t) => <h2>{t("currentTime")}</h2>
              }
           </Translation>
         
         <h1>
          {t('currentTime', {time: moment()})}
         </h1>
         <ul>
            <li>
              {t('public.go', '可以设置默认值')}
            
            </li>
            <li>
              <button>{t("comm:button.save")}</button>
            </li>
            <li>
                <strong>
                  {t(["comm:error.404", "comm:error.unspecific"])}
                </strong>
            </li>
            <li>
                <strong>
                  {t(["comm:error.504", "comm:error.unspecific"])}
                </strong>
            </li>
            <li>
               {t("test:friend", {male: "男"})}
            </li>
            <li>{t("test:key", {p})}</li>
            <li>
              {t('keyEscaped', { myVar: '<img />' })}
            </li>
            <li>
             {t('intlNumber', { val: 100.2220 })} 
            </li>
            <li>{t('intlNumber', { val: 10001, minimumFractionDigits: 3 })}</li>
            <li>
              {t('intlNumber', { val: 1000.1, formatParams: { val: { minimumFractionDigits: 3 } } })}
            </li>

         </ul>
             <Paragraph>{t('key1_interval', { postProcess: 'interval', count: 100 })}</Paragraph>
         <div style={{height: "105px", overflow:"hidden"}}>
          <Mycom></Mycom>
        {/*  <Animation ref={ref}>
         
            {Array.from({length: 7}, (c,i) => <p>{i}</p>)}
             <div style={{height: '105px', overflow: "hidden"}}>
              {Array.from({length: 7}, (c,i) => <p>{i}</p>)}
             </div>
          
         </Animation> */}
         </div>
      </main>
    </div>
  )
}
