import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector  from 'i18next-browser-languagedetector';
import moment from 'moment';
import Backend from 'i18next-http-backend'
i18n
   .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'zh', // 默认当前环境的语言
        interpolation: {
            escapeValue: false,
        },
    })
i18n.services.formatter.add('DD/MM/YY', (value, lng, options) => {
   return moment(value).format('DD/MM/YY')
})
i18n.services.formatter.add('YYYY-MM-DD', (value, lng, options) => {
    return moment(value).format('YYYY-MM-DD')
 })
export default i18n;