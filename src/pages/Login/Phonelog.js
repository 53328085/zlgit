import React, { useEffect, useState, useMemo, memo} from "react";
import {  useSelector} from "react-redux";
import {
  selectMemoPhone,
  memorizePhone,
  selectUser,
} from "@redux/user";
 
import {  useCountDown, useRequest } from "ahooks";
 
import { Form,  message, Space, } from "antd";
import {useTranslation, Trans, Translation} from 'react-i18next';
 
import {  phoneValidator, codeValidator, } from "@pages/rule";
import { Login as Logapi} from "@api/api";
import {Logselect, Itembox, Ipticon, Logipt, Logck, Logbtn} from '@com/comstyled'
import imgurl from "./icon";

export default  memo(({onSubmit})=> {
  const {t} = useTranslation('login')
    const { GetVerification } = Logapi;
    const [phoneform] = Form.useForm();
    let initPhone = useSelector(selectMemoPhone);
    let { mobile } = useSelector(selectUser);
    let [loading, setLoading] = useState(false);
    const auto = useMemo(() => (initPhone ? "on" : "off"), [initPhone]);
    const initMobile = useMemo(() => (initPhone ? mobile : ""), [initPhone]);
    const ckchange = (e) => {
      dispatch(memorizePhone(e.target.checked));
    };
    const [targetDate, setTargetDate] = useState(0);
    const [countdown] = useCountDown({
      targetDate,
    });
    const { run } = useRequest(GetVerification, {
      // 获取验证码
      manual: true,
      onSuccess: (res) => {
        let { success, data,  errMsg} = res;
        if (success) {
          phoneform.setFieldValue("code", data.code);
        }else {
           message.warning(errMsg)
           setTargetDate(0)
        }

      },
      onError: (error) => {
        console.log(error);
      },
    });
    const getCode = () => {
      const phone = phoneform.getFieldValue("mobile");
      phoneform
        .validateFields(["mobile"])
        .then((res) => {
          setTargetDate(Date.now() + 1000 * 60);
          run(phone);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const Countdown = () => {
      return (
        <Logbtn
          style={{ height: "42px", width: "112px", fontSize: "14px", padding: 0 }}
          onClick={() => getCode()}
          disabled={countdown !== 0}
        >
          {countdown === 0 ?  t("GetVerCode") : ` ${Math.round(countdown / 1000)}s`}
        </Logbtn>
      );
    };
    
    let options = [
      {
         label: t("Time15m"),
         value: 15
      },
      {
         label: t("Time30m"),
         value: 30
      },
      {
         label: t("Time1h"),
         value: 60
      },
      {
         label: t("Time2h"),
         value: 120
      },
      {
         label: t("Time4h"),
         value: 240
      }
    ]
    useEffect(() => {
      return setLoading(false);
    }, [])
    return (
      <Form
        layout="horizontal"
        labelCol={{ flex: "4em" }}
        wrapperCol={{ flex: 1 }}
        labelWrap
        form={phoneform}
        name="phonelogin"
        onFinish={(e) => onSubmit(e, 1, undefined, setLoading)}        
        initialValues={{
          mobile: initMobile,
          remember: initPhone,
        }}
      >
        <Itembox
          name="mobile"
          hasFeedback
          rules={[
            {
              required: true,
              message:  t("Enphnum"),
            },
            {
              validator: phoneValidator,
            },
          ]}
        >
          <Logipt
            prefix={<Ipticon />}
            url={imgurl.phone}
            aurl={imgurl.phonea}
            placeholder={ t("Enphnum")}
            autoComplete={auto}
          />
        </Itembox>
       <Itembox
          name="span" 
        >
          <Logselect
             url={imgurl.time}
             aurl={imgurl.timea}
             suffixIcon={<Ipticon />}
             w="402px"
             h="42px"
             placeholder={t("Selogindur")}
            options={options}
          />
        </Itembox> 
        <Itembox>
          <Space size={16}>
            <Form.Item
              name="code"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t("Envercode"),
                },
                {
                  validator: codeValidator,
                },
              ]}
              noStyle
            >
              <Logipt
                prefix={<Ipticon />}
                url={imgurl.code}
                aurl={imgurl.codea}
                placeholder={ t("Envercode")}
                style={{ width: "275px" }}
              />
            </Form.Item>
            <Form.Item noStyle>               
              <Countdown />
            </Form.Item>
          </Space>
        </Itembox>
        <Itembox name="remember" valuePropName="checked">
          <Logck onChange={ckchange}>{t("RePhoneNum")}</Logck>
        </Itembox>
        <Itembox>
          <Logbtn
            htmlType="submit"
            block
            loading={loading}
            style={{ height: "56px" }}
          >
          {t("Login")}
          </Logbtn>
        </Itembox>
      </Form>
    );
  })