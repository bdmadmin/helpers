import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  ScrollView,
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
} from "react-native";
import FlexSBContainer from "../../components/FlexSBContainer";
import MainButton from "../../components/MainButton";
import { getCausesList, homeApi } from "../../redux/actions/home";
import colors from "../../theme/colors";
import fontFamily from "../../theme/fontFamily";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from "../../theme/responsiveSize";
import commonStyles from "../../utils/commonStyles";
import { getCurrentLocation } from "../../utils/helper";
import { setItem, showError } from "../../utils/utils";
import FeedItem from "./FeedItem";
import HomeSkeltonView from "./HomeSkeltonView";
import { openSettings } from "react-native-permissions";
import { updateProfile } from "../../redux/actions/auth";
import {
  locationUpdateSliceSelector,
  updateLocation,
} from "../../redux/reducer/LocationSlice/locationUpdateSlice";
import navigationString from "../../config/navigationString";
import FastImage from "react-native-fast-image";
import { FILE_BASE_URL } from "../../config/constant";
import { ActivityIndicator } from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { FlashList } from "@shopify/flash-list";
import {
  setcurrentIndex,
  setpause,
  setsugProfile,
} from "../../redux/reducer/AudioVideoList/audioVideoList";
import { useSelector } from "react-redux";
import SuggestedProfile from "../../components/SuggestedProfile";
interface FeedListProps {}
const viabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

const FeedHeaderComponent = ({ causes, showOwnPost, navigation }: any) => {
  return (
    <View style={{}}>
      <View style={styles.containerI}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {causes?.map((item: any, index: number) => {
            return (
              <FlexSBContainer
                onPress={() =>
                  navigation.navigate(navigationString.TAGS_FEED, { tag: item })
                }
                key={index}
                containerStyle={styles.categoryContainer}
              >
                <FastImage
                  style={styles.categoryImage}
                  source={{ uri: FILE_BASE_URL + item?.image }}
                />
                <Text
                  style={{
                    ...commonStyles.fontSize12,
                    fontFamily: fontFamily.bold,
                    marginHorizontal: moderateScale(10),
                  }}
                >
                  {item?.name}
                </Text>
              </FlexSBContainer>
            );
          })}
        </ScrollView>
      </View>
      {showOwnPost && Object.keys(showOwnPost).length > 0 && (
        <FeedItem item={showOwnPost} index={0} />
      )}
    </View>
  );
};

const MemoFeedHeaderComponent = React.memo(FeedHeaderComponent);

const FeedList = (_: FeedListProps) => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = React.useState(false);
  const [homeListing, setHomeListing] = React.useState([]);
  const [sugProfile, setsugProfile] = React.useState<any[]>([]);
  const [causes, setCausesList] = React.useState<Array<any>>([]);
  const handler = React.useRef();
  const locationUpdated = useAppSelector(locationUpdateSliceSelector);
  const dispatch = useAppDispatch();
  const [showOwnPost, setShowOwnPost] = React.useState<any>();
  const onRefreshRef = React.useRef<any>();
  const [onEndLoading, setOnEndLoading] = React.useState<boolean>(false);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [skip, setSkip] = React.useState<number>(0);

  const viewableItemChanged = React.useRef((viewableItem: any) => {
    if (viewableItem.viewableItems[0] != undefined) {
      dispatch(setcurrentIndex(viewableItem.viewableItems[0]?.index));
    }
  });

  React.useImperativeHandle(handler, (): any => {
    return {
      apiCall,
    };
  });

  onRefreshRef.current = React.useCallback(async () => {
    if (skip !== 0) {
      const homeDetail: any = await homeApi(0, skip - 50);
      if (Array.isArray(homeDetail?.listing)) {
        const sugProfileData = homeDetail?.listing?.filter(
          (e: any) => e.url != "" && e.url != null && e.isAdmin == 1
        );
        const adminpost = homeDetail?.listing?.filter(
          (e: any) => (e.url == "" ||e.url == null)&&e.isAdmin == 1 
        );
        console.log("adminpost=====",adminpost)
        setsugProfile(sugProfileData);
        const listingData = homeDetail?.listing?.filter(
          (e: any) => e.isAdmin == 0 && e.url == "" || e.url == null
        );
        let inum = 0;
        listingData.forEach(function (_:any, i:number) {
          if (inum == i && adminpost.length != 0) {
            listingData.splice(i, 0, adminpost[0]);
            adminpost.splice(0, 1);
            inum = inum + 5;
          }
        });
        listingData.splice(4, 0, { sugProfile: true, data: sugProfileData });
        setHomeListing(listingData);
      }
      const cList: any = await getCausesList();
      setCausesList(cList?.listing);
      setShowOwnPost({});
      DeviceEventEmitter.emit("emergencyPost");
    }
  }, [skip]);

  React.useEffect(() => {
    const appState = AppState.addEventListener(
      "change",
      async (listener: AppStateStatus) => {
        if (!locationUpdated && listener === "active") {
          try {
            const getLocation = await getCurrentLocation();
            updateProfile({
              latitude: getLocation?.coords.latitude,
              longitude: getLocation?.coords.longitude,
            });
            await setItem("LocationUpdated", true);
            onRefreshRef.current();
            dispatch(updateLocation(true));
          } catch (error) {
            await setItem("LocationUpdated", false);
          }
        }
      }
    );
    return () => {
      appState?.remove();
    };
  }, [locationUpdated, dispatch]);

  React.useEffect(() => {
    const addOwnPost = DeviceEventEmitter.addListener("addOwnPost", (data) => {
      if (data?.apiCall) {
        apiCall();
        return;
      }
      if (!data?.apiCall && data && Object.keys(data).length > 0) {
        setTimeout(() => {
          setShowOwnPost(data);
        }, 3000);
      }
    });
    return () => {
      addOwnPost.remove();
    };
  }, []);

  const apiCall = async () => {
    try {
      setLoading(true);
      const homeDetail: any = await homeApi(skip);
      if (Array.isArray(homeDetail?.listing)) {
        const sugProfileData = homeDetail?.listing?.filter(
          (e: any) => e.url != "" && e.url != null && e.isAdmin == 1
        );
        const listingData = homeDetail?.listing?.filter(
          (e: any) => e.url == "" || e.url == null || e.isAdmin == 0
        );
        {
          skip == 0 &&
            listingData.splice(4, 0, {
              sugProfile: true,
              data: [...sugProfile, ...sugProfileData],
            });
        }
        setsugProfile([...sugProfile, ...sugProfileData]);
        setHomeListing([...homeListing, ...listingData]);
        setSkip((next) => next + 50);
      }
      const tagList: any = await getCausesList();
      setCausesList(tagList?.listing);
      setLoading(false);
    } catch (error) {
      showError((error as Error)?.message);
    }
  };

  const renderItem = React.useCallback(({ item, index }: any) => {
    if (item.sugProfile && item.data.length != 0) {
      return <SuggestedProfile profileList={item.data} />;
    } else {
      return <FeedItem ref={handler} item={item} index={index} />;
    }
  }, []);

  const ItemSeparatorComponent = React.useCallback((item: any) => {
    return <View style={styles.separator} />;
  }, []);

  const listEmptyComponent = React.useCallback(() => {
    return (
      <View style={styles.locationContainer}>
        {!locationUpdated && (
          <>
            <Text
              style={[
                commonStyles.fontSize13,
                { textAlign: "center", marginHorizontal: moderateScale(30) },
              ]}
            >
              {
                "By allowing location permission you are able to see nearby posts of who needs help or who wants to help"
              }
            </Text>
            <MainButton
              onPress={openSettings}
              btnStyle={styles.enablePermission}
              btnText={"Enable location permission"}
            />
          </>
        )}
        {locationUpdated && (
          <Text style={styles.help}>
            {
              "We currently do not have any helper or needy at the near-by location try increasing the area"
            }
          </Text>
        )}
      </View>
    );
  }, [locationUpdated]);

  const headerComponent = React.useCallback(() => {
    return (
      <MemoFeedHeaderComponent
        causes={causes}
        navigation={navigation}
        showOwnPost={showOwnPost}
      />
    );
  }, [causes, navigation, showOwnPost]);

  if (isLoading) {
    return <HomeSkeltonView />;
  }

  const renderFooter = () => {
    if (!onEndLoading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.themeColor} />
      </View>
    );
  };

  const onEndReached = async () => {
    if (onEndLoading || !hasMore) {
      return;
    }
    try {
      setOnEndLoading(true);
      const homeDetail: any = await homeApi(skip);
      if (Array.isArray(homeDetail?.listing)) {
        const sugProfileData = homeDetail?.listing?.filter(
          (e: any) => e.url != "" && e.url != null && e.isAdmin == 1
        );
        const listingData = homeDetail?.listing?.filter(
          (e: any) => e.url == "" || e.url == null || e.isAdmin == 0
        );
        {
          skip == 0 &&
            listingData.splice(4, 0, {
              sugProfile: true,
              data: [...sugProfile, ...sugProfileData],
            });
        }
        setsugProfile((prev) => [...prev, ...sugProfileData]);
        setOnEndLoading(false);
        setHomeListing((prev) => [...prev, ...listingData]);
        setSkip((next) => next + 50);
        if (homeDetail?.listing?.length === 0) {
          setHasMore(false);
        }
        {
          skip == 0 && onRefreshRef.current();
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setOnEndLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        estimatedItemSize={500}
        data={homeListing}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        extraData={homeListing}
        ListHeaderComponent={headerComponent}
        removeClippedSubviews={true}
        viewabilityConfig={viabilityConfig}
        ListEmptyComponent={listEmptyComponent}
        onViewableItemsChanged={viewableItemChanged.current}
        onEndReachedThreshold={0.8}
        onEndReached={onEndReached}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            onRefresh={onRefreshRef.current}
            refreshing={false}
            colors={[colors.themeColor, colors.black]}
          />
        }
      />
    </View>
  );
};

export default React.memo(FeedList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 2,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    marginEnd: moderateScale(20),
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.grey_95,
  },
  uImage: { justifyContent: "flex-start", marginStart: moderateScale(10) },
  separator: {
    backgroundColor: "#B0B0B0", //light_purple,
    width: "100%",
    height: 7,
    marginVertical: 10,
  },
  containerI: { backgroundColor: colors.light_purple, padding: 15 },
  categoryImage: { width: 20, height: 20 },
  enablePermission: { width: "90%", marginTop: moderateScaleVertical(20) },
  locationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  help: {
    ...commonStyles.fontSize13,
    marginHorizontal: moderateScale(30),
    textAlign: "center",
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
