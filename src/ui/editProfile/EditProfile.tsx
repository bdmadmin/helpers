import * as React from 'react';
import {Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import FlexSBContainer from '../../components/FlexSBContainer';
import MainButton from '../../components/MainButton';
import TextInputCustom from '../../components/TextInputCustom';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../config/imagePath';
import {updateProfile} from '../../redux/actions/auth';
import colors from '../../theme/colors';
import {moderateScale, moderateScaleVertical} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import {registerSchema} from '../../validation/validations';
import styles from './styles';
import useUploadImage from '../../hooks/userUploadImage';
import {setUserData, showError, showSuccess} from '../../utils/utils';
import {updateAuthUserData} from '../../redux/reducer/AuthSlice/authSlice';
import BackButton from '../../components/BackButton';

interface CreateProfileProps {}

const EditProfile = (_: CreateProfileProps) => {
  const userData = useSelector(state => state.authUser.authUser);
  const valueOfGender = userData?.gender === '1' ? 1 : 0;
  const [genderType, setGenderType] = React.useState<number>(valueOfGender);
  const [name, setName] = React.useState<string>(userData?.firstName);
  const [lastName, setLastName] = React.useState<string>(userData?.lastName);
  const [email, setEmail] = React.useState<string>(userData?.email);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = React.useState(false);
  const {openDialog, image: uploaded, baseImage} = useUploadImage(userData?.profilePic);

  const createProfile = async () => {
    try {
      setLoading(true);
      const validateData = await registerSchema.validate({email: email, gender: genderType, firstName: name, lastName: lastName});
      const formData = new FormData();
      validateData.email && formData.append('email', validateData.email);
      formData.append('gender', validateData.gender);
      formData.append('firstName', validateData.firstName);
      formData.append('lastName', validateData.lastName);
      if (uploaded?.path) {
        formData.append('profilePic', {
          uri: uploaded?.path,
          type: 'images/jpeg',
          name: 'image.jpg',
        });
      }
      const update = await updateProfile(formData);
      dispatch(updateAuthUserData({...update, accessToken: userData?.accessToken}));
      setUserData({...update, accessToken: userData?.accessToken});
      setLoading(false);
      showSuccess('Profile update successfully');
      _.navigation.goBack();
    } catch (error) {
      setLoading(false);
      showError((error as Error).message);
    }
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View style={{flex: 1, padding: 15}}>
            <BackButton />
            <Text style={{...commonStyles.fontBold24, marginTop: moderateScaleVertical(40), marginBottom: moderateScaleVertical(20)}}>{'Edit profile'}</Text>
            <Pressable onPress={openDialog} style={styles.imageContainer}>
              <Image style={styles.userImage} source={baseImage ? {uri: baseImage} : imagePath.user} />
              <View style={styles.penBackground}>
                <Image style={styles.penIcon} source={imagePath.edit} />
              </View>
            </Pressable>

            <TextInputCustom
              onChangeText={setName}
              textInputStyle={{
                marginTop: moderateScaleVertical(40),
              }}
              placeHolderString={'Enter first name'}
              value={name}
              maxLength={20}
            />
            <TextInputCustom
              onChangeText={setLastName}
              textInputStyle={{
                marginTop: moderateScaleVertical(40),
              }}
              placeHolderString={'Enter last name'}
              value={lastName}
              maxLength={20}
            />
            <TextInputCustom
              value={email}
              onChangeText={setEmail}
              textInputStyle={{
                marginVertical: moderateScaleVertical(30),
              }}
              keyboardType="email-address"
              placeHolderString={'Enter Email'}
            />
            <Text style={commonStyles.fontSize13}>{'Select Gender'}</Text>
            <FlexSBContainer containerStyle={style.flexContainer}>
              <FlexSBContainer onPress={() => setGenderType(1)} containerStyle={{...styles.genderContainer, marginEnd: 10, borderColor: genderType === 1 ? colors.themeColor : colors.grey}}>
                <Image style={{...styles.genderIcon, tintColor: genderType === 1 ? colors.themeColor : colors.black}} source={imagePath.male} />
                <Text style={{...commonStyles.fontSize14, color: genderType === 1 ? colors.themeColor : colors.black, marginStart: moderateScale(10)}}>{'Male'}</Text>
              </FlexSBContainer>
              <FlexSBContainer onPress={() => setGenderType(2)} containerStyle={{...styles.genderContainer, borderColor: genderType === 2 ? colors.themeColor : colors.grey}}>
                <Image style={{...styles.genderIcon, tintColor: genderType === 2 ? colors.themeColor : colors.black}} source={imagePath.femenine} />
                <Text style={{...commonStyles.fontSize14, color: genderType === 2 ? colors.themeColor : colors.black, marginStart: moderateScale(10)}}>{'Female'}</Text>
              </FlexSBContainer>
            </FlexSBContainer>
            <MainButton btnStyle={style.letGo} onPress={createProfile} btnText={"Let's Go"} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperContainer>
  );
};
export default EditProfile;

const style = StyleSheet.create({
  letGo: {marginTop: moderateScaleVertical(30)},
  flexContainer: {flex: 1, marginVertical: moderateScaleVertical(20)},
});
