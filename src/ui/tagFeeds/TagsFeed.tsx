import * as React from 'react';
import {Text, View, StyleSheet, FlatList, Pressable, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlexSBContainer from '../../components/FlexSBContainer';
import WrapperContainer from '../../components/WrapperContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import {homeApiWithTag} from '../../redux/actions/home';
import colors from '../../theme/colors';
import commonStyles from '../../utils/commonStyles';
import {showError} from '../../utils/utils';
import FeedItem from '../home/FeedItem';
import HomeSkeltonView from '../home/HomeSkeltonView';
import BackButton from '../../components/BackButton';

interface TagsFeedProps {}

const TagsFeed = (props: TagsFeedProps) => {
  const {navigation} = props;
  console.log('====================================');
  console.log('props?.route?.params?.tag', JSON.stringify(props?.route?.params?.tag));
  console.log('====================================');
  const {name, image, description}: {tag: string} = props?.route?.params?.tag;
  const [isLoading, setLoading] = React.useState(false);
  const [homeListing, setHomeListing] = React.useState();

  React.useEffect(() => {
    apiCall();
  }, []);

  const apiCall = async () => {
    try {
      setLoading(true);
      const homeDetail: any = await homeApiWithTag(0, name);
      // console.log('homeDetailhomeDetail', homeDetail);
      if (Array.isArray(homeDetail?.listing)) {
        setHomeListing(homeDetail?.listing);
      }
      setLoading(false);
    } catch (error) {
      showError((error as Error)?.message);
    }
  };

  const renderItem = React.useCallback(({item, index}: any) => {
    return <FeedItem item={item} index={index} />;
  }, []);

  const Header = React.useCallback(() => {
    return (
      <>
        <View style={styles.notificationTextContainer}>
          <View style={{padding: 10}}>
            <BackButton />
          </View>
          <FlexSBContainer containerStyle={{justifyContent: 'flex-start', paddingHorizontal: 20}}>
            <Text style={commonStyles.fontBold24}>{name.toLocaleUpperCase()}</Text>
            <FastImage style={{width: 20, height: 20, marginStart: 10}} source={{uri: FILE_BASE_URL + image}} />
          </FlexSBContainer>
          <Text style={[commonStyles.fontSize14, {paddingBottom: 20, paddingHorizontal: 20}]}>{description}</Text>
          <FlexSBContainer
            onPress={() => navigation.navigate(navigationString.POST_TYPE, {type: name})}
            containerStyle={{
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <Image source={imagePath.u_images} />
            <Text style={styles.postSomething}>{'Post something...'}</Text>
          </FlexSBContainer>
        </View>
      </>
    );
  }, []);

  if (isLoading) {
    return <HomeSkeltonView />;
  }

  const ItemSeparatorComponent = () => {
    return <View style={styles.separator} />;
  };

  return (
    <WrapperContainer>
      <View style={styles.container}>
        <Header />
        <FlatList
          data={homeListing}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{flexGrow: 1}}
          renderItem={renderItem}
          extraData={homeListing}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ItemSeparatorComponent={ItemSeparatorComponent}
          removeClippedSubviews={true}
        />
      </View>
    </WrapperContainer>
  );
};

export default TagsFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationTextContainer: {backgroundColor: colors.white, marginBottom: 15},
  separator: {backgroundColor: colors.light_purple, width: '100%', height: 8, marginVertical: 10},
  postSomething: {...commonStyles.fontBold20, marginStart: 10, color: colors.e5},
});
