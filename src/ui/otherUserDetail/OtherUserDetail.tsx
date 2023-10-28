import * as React from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';
import BackButton from '../../components/BackButton';
import FlexSBContainer from '../../components/FlexSBContainer';
import ReportBottomSheet from '../../components/ReportBottomSheet';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../config/imagePath';
import {otherUserDetail} from '../../redux/actions/home';
import colors from '../../theme/colors';
import {showError} from '../../utils/utils';
import FeedItem from '../home/FeedItem';
import HomeSkeltonView from '../home/HomeSkeltonView';
// import StoriesSlide from '../stories/StoriesSlide';
import ProfileHeaderDetail from './ProfileHeaderDetail';

interface ProfileProps {}

const OtherUserDetail = (props: ProfileProps) => {
  const {id, profilePic, firstName, lastName, gender} = props?.route?.params?.user?.user ?? {};

  const [profileDetail, setProfileDetail] = React.useState();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    getProfileDetail();
  }, []);

  const getProfileDetail = async () => {
    try {
      setLoading(true);
      const detail = await otherUserDetail(id);
      
      setProfileDetail(detail);
      setLoading(false);
    } catch (error) {
      showError((error as Error).message);
    }
  };

  const renderPost = React.useCallback(({item, index}: any) => {
    return <FeedItem key={index} item={item} index={index} />;
  }, []);

  const ItemSeparatorComponent = React.useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const EmptyComponent = React.useCallback(() => {
    return isLoading ? <HomeSkeltonView /> : <></>;
  }, [isLoading]);

  return (
    <WrapperContainer>
      <View style={{flex: 1}}>
        <FlexSBContainer containerStyle={{padding: 10}}>
          <BackButton />
          <Image source={imagePath.fi_more_vertical} />
        </FlexSBContainer>
        <FlatList
          ListEmptyComponent={EmptyComponent}
          data={profileDetail?.feeds}
          initialNumToRender={4}
          ItemSeparatorComponent={ItemSeparatorComponent}
          renderItem={renderPost}
          ListHeaderComponent={<ProfileHeaderDetail userId={id} gender={gender} detail={profileDetail} userName={`${firstName} ${lastName}`} picture={profilePic} />}
        />
      </View>
    </WrapperContainer>
  );
};

export default OtherUserDetail;

const styles = StyleSheet.create({
  container: {},
  separator: {backgroundColor: colors.light_purple, width: '100%', height: 8, marginVertical: 10},
});
