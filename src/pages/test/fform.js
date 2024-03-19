import React from 'react'
import moment from 'moment';
import {useTranslation, Trans, Translation} from 'react-i18next';
export default function Index() {
  const {t, i18n} = useTranslation();
  const lngs = {
    en: { nativeName: 'English' },
    zh: { nativeName: '中文' }
  };
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
      </main>
    </div>
  )
}
