const padRul = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[_~!@#$%^&*])[\da-zA-Z_~!@#$%^&*]{6,18}$/ // 密码校验规则

const mobilePhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/  // 移动手机号码

export const pwdValidator = (_, value)  => {
   if(!value?.trim()) return Promise.reject(new Error(''))
   return  padRul.test(value) ? Promise.resolve() : Promise.reject(new Error('密码格式必须包含数字、大小写字母、特殊字符选其三[6~18位]'))
}

export const phoneValidator = (_, value)  => {
   if(!value?.trim()) return Promise.reject(new Error(''))
    return  mobilePhone.test(value) ? Promise.resolve() : Promise.reject(new Error('请输入正确的手机号'))
 }
 export const codeValidator = (_, value) => {
    if( value?.length !== 4) return Promise.reject(new Error('验证码必须是4位'))
   
    if ( Number.isNaN(Number(value))) return Promise.reject(new Error('验证码必须是数字'))
    return Promise.resolve()
 }