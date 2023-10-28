import * as React from 'react';
import {Animated, Easing, Image, ImageBackground, Pressable, Text, View} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import AppIntroSlider from 'react-native-app-intro-slider';
import imagePath from '../../config/imagePath';
import styles from './styles';
import navigationString from '../../config/navigationString';
import FlexSBContainer from '../../components/FlexSBContainer';
import commonStyles from '../../utils/commonStyles';
import {moderateScale} from '../../theme/responsiveSize';
import {StackActions} from '@react-navigation/native';

interface OnBoardingProps {}

const OnBoarding = ({navigation}) => {
  const introRef = React.useRef<AppIntroSlider<{image: any}> | null>(null);
  const [currentPosition, setPosition] = React.useState<number>(0);
  const moveAnimation = React.useRef(new Animated.Value(0)).current;

  const slide = {
    transform: [
      {
        translateX: moveAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 280],
        }),
      },
    ],
  };

  const SLIDER_DATA = React.useMemo(() => {
    return [
      {
        image: imagePath.onBoarding_1,
      },
      {
        image: imagePath.onBoarding_2,
      },
      {
        image: imagePath.onBoarding_3,
      },
    ];
  }, []);

  const TEXT = React.useMemo(() => {
    return {
      0: 'Swipe left',
      1: 'Swipe right or left',
      2: 'Swipe right or left',
    };
  }, []);

  React.useEffect(() => {
    if (currentPosition === 1) {
      Animated.timing(moveAnimation, {
        toValue: 0,
        duration: 500,
        easing: Easing.elastic(0.5),
        useNativeDriver: true,
      }).start();
    } else if (currentPosition === 0) {
      Animated.timing(moveAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(0.5),
        useNativeDriver: true,
      }).start();
    }
  }, [currentPosition, moveAnimation]);

  const changeScreen = (goBack: boolean) => {
    if (goBack) {
      currentPosition !== 0 && introRef.current?.goToSlide(currentPosition - 1);
      currentPosition !== 0 && setPosition(currentPosition - 1);
    } else {
      currentPosition !== 2 && introRef.current?.goToSlide(currentPosition + 1);
      currentPosition !== 2 && setPosition(currentPosition + 1);
      currentPosition === 2 && navigation.dispatch(StackActions.replace(navigationString.LOGIN));
    }
  };

  const renderItem = ({item}: any) => {
    return (
      <Pressable>
        <ImageBackground source={item.image} style={styles.backgroundImage} />
      </Pressable>
    );
  };

  return (
    <WrapperContainer>
      <AppIntroSlider scrollEnabled={false} ref={introRef} dotStyle={styles.dotStyle} activeDotStyle={styles.dotStyle} showNextButton={false} showDoneButton={false} data={SLIDER_DATA} renderItem={renderItem} />
      <View style={{position: 'absolute', bottom: 20, width: '100%'}}>
        <FlexSBContainer>
          <Pressable onPress={() => changeScreen(true)}>{currentPosition !== 0 ? <Animated.Image style={{marginStart: moderateScale(20), ...slide}} source={imagePath.backward} /> : <View style={{flex: 1, width: 100}} />}</Pressable>
          <Animated.Text style={commonStyles.fontSize14}>{TEXT[currentPosition]}</Animated.Text>
          <Pressable onPress={() => changeScreen(false)}>
            <Animated.Image style={{marginEnd: moderateScale(20)}} source={imagePath.forward} />
          </Pressable>
        </FlexSBContainer>
      </View>
    </WrapperContainer>
  );
};

export default OnBoarding;
