/* eslint-disable @typescript-eslint/no-unused-vars */
import { StackActions } from "@react-navigation/native";
import * as React from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import BackButton from "../../components/BackButton";
import MainButton from "../../components/MainButton";
import WrapperContainer from "../../components/WrapperContainer";
import { DEVICE_TYPE } from "../../config/constant";
import strings from "../../config/lang";
import navigationString from "../../config/navigationString";
import { loginUserApi, verifyOtpApi } from "../../redux/actions/auth";
import { updateAuthUserData } from "../../redux/reducer/AuthSlice/authSlice";
import colors from "../../theme/colors";
import { moderateScaleVertical } from "../../theme/responsiveSize";
import commonStyles from "../../utils/commonStyles";
import { showError, showSuccess } from "../../utils/utils";
import { OtpSchema } from "../../validation/validations";
import CodeFiledInput from "./CodeFieldInput";
import Counter from "./Counter";
import styles from "./styles";
import SuccessMessageModal from "./SuccessMesasageModal";
import {
  getHash,
  removeListener,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';

interface componentNameProps {
  navigation: unknown;
  route: unknown;
}

export interface DataHandler {
  getValue: (otp: number) => void;
  resendOtp: () => void;
}

const OtpVerification = (props: componentNameProps) => {
  const { navigation, route } = props;
  const { loginDetail } = route?.params ?? {};
  const enterOtp = React.useRef<number>();
  const handler = React.useRef();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [sendCode, setSendCode] = React.useState<boolean>(false);
  const successModalRef = React.useRef();
  const dispatch = useDispatch();
  let platformType = Platform.OS === "android" ? 2 : 1;


  React.useEffect(() => {
    getHash().then(hash => {
      console.log("hash====",hash)
      // Alert.alert(`hash====${hash}`)
    }).catch(console.log);
  
    startOtpListener(message => {
      console.log("message otp ====",message)
      // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
      const otp = message?/(\d{4})/g.exec(message)[1]:null
      console.log("otp======",otp)
      // setOtp(otp);
      if (otp!=null) {
        enterOtp.current = otp
        verifyOtp()
      }
    });
    return () => removeListener();
  }, []);

  React.useImperativeHandle(handler, (): any => ({
    getValue: (otp: number) => {
      enterOtp.current = otp;
    },
    timeStop: () => {
      setSendCode(true);
    },
  }));

  const resendOtp = async () => {
    try {
      setLoading(true);
      await loginUserApi({
        mobile: loginDetail?.mobile,
        platformType: platformType,
        deviceType: platformType?.toString(),
        deviceToken: "l",
        loginType: DEVICE_TYPE,
      });
      setLoading(false);
      setSendCode(false);
      showSuccess("Otp sent successfully");
    } catch (error) {
      setLoading(false);
      showError((error as Error).message);
    }
  };

  const verifyOtp = async () => {
    console.log("enterOtp.current--",enterOtp.current)
    try {
      const otpValidate = await OtpSchema.validate({
        otp: enterOtp.current,
        mobile: loginDetail?.mobile,
      });
      setLoading(true);
      const result = await verifyOtpApi(otpValidate);
      setLoading(false);
      successModalRef.current?.setVisibleModal();
      setTimeout(() => {
        if (!result?.firstName) {
          navigation?.navigate(navigationString.REGISTER);
        } else {
          dispatch(updateAuthUserData({ ...loginDetail, otpVerified: true }));
        }
        successModalRef.current?.setCloseModal();
      }, 4000);
    } catch (error) {
      setLoading(false);
      showError(error?.message);
    }
  };



  return (
    <WrapperContainer isLoading={isLoading}>
      <View style={{ flex: 1, padding: 15 }}>
        <BackButton />
        <Text
          style={{
            ...commonStyles.fontBold28,
            marginTop: moderateScaleVertical(40),
          }}
        >
          {"Enter the phone\nverification code"}
        </Text>
        <Text
          onPress={resendOtp}
          style={{
            ...commonStyles.fontSize16,
            color: colors.grey,
            marginTop: moderateScaleVertical(10),
          }}
        >
          {`We sent a code to (+91) ${loginDetail?.mobile}. \n Didn't receive the code?`}
          {sendCode && (
            <Text style={{ ...commonStyles.fontSize15BlueBold }}>
              {" Send again"}
            </Text>
          )}
        </Text>
        <View style={{marginTop: moderateScaleVertical(60)}}>
          <CodeFiledInput ref={handler} />
          <Counter start={sendCode} ref={handler} />
        </View>
       
      </View>
      <View style={styles.btnContainer}>
        <MainButton onPress={verifyOtp} btnText="Verify" />
      </View>
      <SuccessMessageModal ref={successModalRef} />
    </WrapperContainer>
  );
};

export default OtpVerification;