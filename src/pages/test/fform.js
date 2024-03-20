import React, {useRef, useEffect} from 'react'
import moment from 'moment';
import {useTranslation, Trans, Translation} from 'react-i18next';
import styled, {keyframes} from 'styled-components';
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
export default function Index() {
  const {t, i18n} = useTranslation();
  const lngs = {
    en: { nativeName: 'English' },
    zh: { nativeName: '中文' }
  };
  const ref = useRef()
  useEffect(() => {
    console.log(ref.current.offsetHeight);
  })
  return (
    <div>
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

        <p>{t('welcome')}</p>
         <h1>{t('author')}</h1>
         <h1>
          {t('currentTime', {time: moment()})}
         </h1>
         <div style={{height: "105px", overflow:"hidden"}}>
         <Animation ref={ref}>
         
            {Array.from({length: 7}, (c,i) => <p>{i}</p>)}
             <div style={{height: '105px', overflow: "hidden"}}>
              {Array.from({length: 7}, (c,i) => <p>{i}</p>)}
             </div>
          
         </Animation>
         </div>
      </main>
    </div>
  )
}
