import * as React from 'react';
import {Text, View, StyleSheet, Animated, Easing} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import {moderateScale, moderateScaleVertical, width} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import Calling from './Calling';
import ChatList from './ChatList';
import {TabView, SceneMap} from 'react-native-tab-view';
import FlexSBContainer from '../../components/FlexSBContainer';
import colors from '../../theme/colors';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useDispatch} from 'react-redux';
// import {messageTabCount} from '../../redux/reducer/DotSlice/dotSlice';
// import {useNavigation} from '@react-navigation/native';

interface MessageProps {}

const FirstRoute = () => <ChatList />;

const SecondRoute = () => <Calling />;

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const Message = (props: MessageProps) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);
  const moveAnimation = React.useRef(new Animated.Value(0)).current;
  // const dispatch = useDispatch();
  // const navigation = useNavigation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slide = {
    transform: [
      {
        translateX: moveAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 50],
        }),
      },
    ],
  };

  // React.useEffect(() => {
  //   Animated.timing(showAndHidArchive, {
  //     toValue: wantToArchive ? 1 : 0,
  //     duration: 200,
  //     easing: Easing.elastic(0.5),
  //     useNativeDriver: true,
  //   }).start();
  // }, [wantToArchive, showAndHidArchive]);

  React.useEffect(() => {
    Animated.timing(moveAnimation, {
      toValue: index,
      duration: 200,
      easing: Easing.elastic(0.5),
      useNativeDriver: true,
    }).start();
  }, [index, moveAnimation]);

  // React.useEffect(() => {
  //   navigation.addListener('focus', async () => {
  //     await AsyncStorage.setItem('messageCount', 'false');
  //     dispatch(messageTabCount({messageTabCount: false}));
  //   });
  // }, [dispatch, navigation]);

  const TabHeader = React.useCallback(() => {
    return (
      <View>
        <FlexSBContainer containerStyle={styles.flexContainer}>
          <Animated.View
            style={{
              ...styles.animatedView,
              ...slide,
            }}
          />
          <Text onPress={() => setIndex(0)} style={{...styles.messageText, color: index === 0 ? colors.themeColor : colors.grey}}>
            {'Chat'}
          </Text>
          <Text onPress={() => setIndex(1)} style={{...styles.callText, color: index === 1 ? colors.themeColor : colors.grey}}>
            {'Calls'}
          </Text>
        </FlexSBContainer>
      </View>
    );
  }, [index, slide]);

  return (
    <WrapperContainer>
      <View style={{flex: 1}}>
        <Text style={{...commonStyles.fontBold24, paddingHorizontal: 15, marginTop: moderateScaleVertical(20)}}>{'Messages'}</Text>
        <TabView
          renderTabBar={props => {
            return <TabHeader />;
          }}
          swipeEnabled={false}
          onIndexChange={() => {}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          // on={() => setIndex(index === 0 ? 1 : 0)}
          // initialLayout={{width: 100}}
        />
      </View>
    </WrapperContainer>
  );
};

export default Message;

const styles = StyleSheet.create({
  messageText: {paddingVertical: 10, ...commonStyles.fontBold16, borderRadius: 10, textAlign: 'center', color: colors.white},
  callText: {paddingVertical: 10, ...commonStyles.fontBold16, borderRadius: 10, textAlign: 'center', marginStart: moderateScale(22)},
  animatedView: {
    backgroundColor: colors.themeColor,
    position: 'absolute',
    width: '14%',
    marginStart: 5,
    height: 5,
    bottom: 0,
  },
  flexContainer: {justifyContent: 'flex-start', padding: 5, marginHorizontal: moderateScale(24), borderRadius: 10},
  archiveContainer: {position: 'absolute', end: 20, bottom: 20, padding: 15, borderRadius: 25, overflow: 'hidden'},
});
