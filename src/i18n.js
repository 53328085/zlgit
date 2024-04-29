import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector  from 'i18next-browser-languagedetector';
import moment from 'moment';
import Backend from 'i18next-http-backend'
import intervalPlural from 'i18next-intervalplural-postprocessor' //复数
i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(intervalPlural)
    .init({
        debug: true,
        fallbackLng: 'zh', // 默认当前环境的语言
        interpolation: {
            escapeValue: false,
        },
        ns: ["translation", "common","login","overview"," platformcig", "comm", "button","test"],
       
     /*    backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        } */
    })
i18n.services.formatter.add('DD/MM/YY', (value, lng, options) => {
   return moment(value).format('DD/MM/YY')
})
i18n.services.formatter.add('YYYY-MM-DD', (value, lng, options) => {
    return moment(value).format('YYYY-MM-DD')
 })
export default i18n;