import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';

export default function useSocialLogin() {
  GoogleSignin.configure();

  const googleLogin = async () => {
    try {
      GoogleSignin.signOut();
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        return userInfo;
      } catch (error) {
        if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
          return error;
        } else if (error?.code === statusCodes.IN_PROGRESS) {
          console.log(error);
          return error;
        } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log(error);
          return error;
        } else {
          console.log(error);
          return error;
        }
      }
    } catch (error) {}
  };

  return {googleLogin};
}
