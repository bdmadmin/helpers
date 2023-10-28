/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
import * as React from "react";
import { Text, View, FlatList } from "react-native";
import FastImage from "react-native-fast-image";
import { RefreshControl, TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import FlexSBContainer from "../../components/FlexSBContainer";
import WrapperContainer from "../../components/WrapperContainer";
import { FILE_BASE_URL } from "../../config/constant";
import imagePath from "../../config/imagePath";
import navigationString from "../../config/navigationString";
import { notificationApi } from "../../redux/actions/home";
import { notificationTabCount } from "../../redux/reducer/DotSlice/dotSlice";
import colors from "../../theme/colors";
import { moderateScale } from "../../theme/responsiveSize";
import commonStyles from "../../utils/commonStyles";
import MessageShimmer from "../message/MessageShimmer";
import styles from "./styles";
import { FlashList } from "@shopify/flash-list";
dayjs.extend(relativeTime);

interface NotificationProps {}

const Notification = (_: NotificationProps) => {
  const { navigation } = _;
  const [notificationsList, setNotificationList] = React.useState<
    Array<unknown>
  >([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getNotificationListing();
  }, []);

  React.useEffect(() => {
    navigation?.addListener("focus", async () => {
      await AsyncStorage.setItem("notificationCount", "false");
      dispatch(notificationTabCount({ notificationTabCount: 0 }));
    });
  }, []);

  const getNotificationListing = async () => {
    try {
      setLoading(true);
      const notifications = await notificationApi();
      setNotificationList(notifications?.listing);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onPressNotification = (item: any) => {
    let { post, type } = item;
    if (type === 3) {
      navigation?.navigate(navigationString.CHAT, {
        item: { ...post, status: 1, roomId: item.room },
      });
    } else {
      navigation.navigate(navigationString.SINGLE_POST, {
        postData: [{ ...post, hideBottom: true, post_info: { id: post?.id } }],
      });
    }
  };

  const renderNotification = ({ item, _ }: any) => {
    return (
      <TouchableOpacity
        onPress={() => onPressNotification(item)}
        style={styles.notificationItemContainer}
      >
        <FlexSBContainer containerStyle={{ justifyContent: "flex-start" }}>
          <FastImage
            style={styles.userImage}
            source={
              item?.otherUser?.profilePic
                ? { uri: FILE_BASE_URL + item?.otherUser?.profilePic }
                : imagePath.placeholder
            }
          />
          <View
            style={{
              flex: 1,
              marginStart: moderateScale(20),
            }}
          >
            <Text style={{ ...commonStyles.fontSize13 }}>
              {item?.otherUser?.firstName + " " + item?.otherUser?.lastName}
            </Text>
            <Text style={{ ...commonStyles.fontSize13 }}>
              {item?.description}
            </Text>
          </View>
          <Text style={{ ...commonStyles.fontSize12, color: colors.grey_95 }}>
            {dayjs().to(item?.updatedAt)}
          </Text>
        </FlexSBContainer>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = React.useCallback(() => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={commonStyles.fontBold16}>{"No Notification found "}</Text>
      </View>
    );
  }, []);

  const Header = React.useCallback(() => {
    return (
      <>
        <View style={styles.notificationTextContainer}>
          <Text style={commonStyles.fontBold24}>{"Notification"}</Text>
        </View>
      </>
    );
  }, []);

  if (isLoading) {
    return (
      <WrapperContainer>
        <Header />
        <MessageShimmer />
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer bodyColor={colors.e5}>
      <Header />
      <FlashList
        estimatedItemSize={100}
        contentContainerStyle={{ flexGrow: 1 }}
        data={notificationsList}
        style={{ flexGrow: 1 }}
        renderItem={renderNotification}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={getNotificationListing}
          />
        }
      />
    </WrapperContainer>
  );
};

export default Notification;
// import * as React from 'react';
// import {View, StyleSheet, FlatList, Text, Keyboard, TextInput, Pressable} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {updateChipState} from '../../redux/reducer/Seach/SearchSlice';
// import colors from '../../theme/colors';

// const TEXT_INPUT_HEIGHT = 60;
// const MARGIN_WITH_CHIP = 20;
// const DropDown = ({}) => {
//   const [list, setList] = React.useState<any>([]);
//   const [isKeyboardDisplay, setIsKeyBoardDisplayed] = React.useState<boolean>(false);
//   const chipList = useSelector(state => state.chip.chipsList);
//   const dispatch = useDispatch();
//   const saveRef = React.useRef([
//     {name: 'CORONA SUNBREW 0 0', sku: '1601_3654'},
//     {name: 'CORONA', sku: '1116_3654'},
//     {name: 'CORONA SUNBREW 0 0', sku: '1601_3654'},
//     {name: 'MILLER LITE', sku: '173_3654'},
//     {name: 'MILLER HIGH LIFE', sku: '157_3654'},
//     {name: 'CORONA LIGHT', sku: '1598_3654'},
//   ]);

//   React.useEffect(() => {
//     const keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyBoardDisplayed(true));
//     const keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', () => {
//       setIsKeyBoardDisplayed(false);
//     });
//     return () => {
//       keyboardWillShowListener.remove();
//       keyboardWillHideListener.remove();
//     };
//   }, []);

//   const debounce = (callback: () => {}, wait: number) => {
//     let timeoutId = null;
//     return (...args) => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         callback.apply(null, args);
//       }, wait);
//     };
//   };

//   const searchHandler = debounce((searchItem: string) => {
//     if (searchItem) {
//       let text = searchItem.toLowerCase();
//       let filteredName = saveRef.current.filter((truck: string) => {
//         return truck?.name?.toLowerCase().match(text);
//       });

//       if (!text || text === '') {
//         setList(saveRef.current);
//       } else if (!Array.isArray(filteredName) && !filteredName.length) {
//         setList([]);
//       } else if (Array.isArray(filteredName)) {
//         setList(filteredName);
//       }
//     } else {
//       setList([]);
//     }
//   }, 200);

//   const onPressDelete = (selectedIndex: number) => {
//     const filter = chipList.filter((_, index: number) => index !== selectedIndex);
//     dispatch(updateChipState(filter));
//   };

//   const storeSelectedItem = (name: string) => {
//     if (!chipList.includes(name)) {
//       const addNewChip = [...chipList];
//       addNewChip.push(name);
//       dispatch(updateChipState(addNewChip));
//     }
//   };

//   const renderChip = ({item, index}: any) => {
//     return (
//       <View key={index} style={styles.chipContainer}>
//         <Text style={styles.chipText}>{item}</Text>
//         <Text style={styles.chipCross} onPress={() => onPressDelete(index)}>
//           {'X'}
//         </Text>
//       </View>
//     );
//   };

//   const renderList = ({item}: any) => {
//     return (
//       <Pressable onPress={() => storeSelectedItem(item?.name)} key={item} style={{padding: 10}}>
//         <Text style={{color: colors.black}}>{item?.name}</Text>
//       </Pressable>
//     );
//   };

//   const renderFooterComponent = React.useCallback(() => {
//     return (
//       <>
//         {chipList.length > 0 && (
//           <View style={styles.chipListContainer}>
//             {chipList.map((item: any, index: number) => {
//               return renderChip({item, index});
//             })}
//           </View>
//         )}
//       </>
//     );
//   }, [chipList]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.textInputAndListWrapper}>
//         <TextInput placeholderTextColor={'grey'} placeholder="Search" onChangeText={searchHandler} style={styles.textInputStyle} />
//         {isKeyboardDisplay && (
//           <View style={{position: 'absolute', top: TEXT_INPUT_HEIGHT + MARGIN_WITH_CHIP - 1, width: '100%'}}>
//             <FlatList data={list} renderItem={renderList} keyboardShouldPersistTaps={'always'} keyExtractor={(_, index) => index.toString()} contentContainerStyle={styles.contextContainerStyle} ListFooterComponent={renderFooterComponent} />
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default DropDown;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.themeColor,
//     flex: 1,
//   },
//   chipCross: {marginEnd: 20, fontSize: 15, color: 'black'},
//   chipText: {padding: 10, fontSize: 10, color: 'black'},
//   chipContainer: {backgroundColor: 'grey', alignItems: 'center', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginEnd: 10, marginBottom: 20},
//   textInputAndListWrapper: {flex: 1, marginHorizontal: MARGIN_WITH_CHIP},
//   textInputStyle: {color: colors.black, backgroundColor: 'white', height: TEXT_INPUT_HEIGHT, borderTopEndRadius: 10, borderTopStartRadius: 10, marginTop: 20},
//   chipListContainer: {marginHorizontal: 20, marginTop: 20, flexGrow: 1, flexWrap: 'wrap', flexDirection: 'row'},
//   contextContainerStyle: {backgroundColor: 'white', borderBottomEndRadius: 4, borderBottomStartRadius: 4},
// });
