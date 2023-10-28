import React from 'react';
// import {useSelector} from 'react-redux';
import navigationString from '../config/navigationString';
import * as screens from '../ui/index';

export default function (Stack: StackNavigater, splashAndBoarding: boolean) {
  // const splashAndBoarding = useSelector(state => state.logout.splashAndBoarding);

  const showHeader = {headerShown: false};
  return (
    <>
      {splashAndBoarding && <Stack.Screen name={navigationString.ON_BOARDING} component={screens.OnBoarding} options={showHeader} />}
      <Stack.Screen name={navigationString.LOGIN} component={screens.Login} options={showHeader} />
      <Stack.Screen name={navigationString.VERIFY_OTP} component={screens.OtpVerification} options={showHeader} />
      <Stack.Screen name={navigationString.REGISTER} component={screens.CreateProfile} options={showHeader} />
      <Stack.Screen name={navigationString.TERMS_AND_PRIVACY} component={screens.TermsAndPrivacy} options={showHeader} />
      <Stack.Screen name={navigationString.WEBVIEW_SCREEN} component={screens.WebViewScreen} options={showHeader} />
    </>
  );
}
