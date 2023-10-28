import * as React from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import colors from '../../theme/colors';
import commonStyles from '../../utils/commonStyles';
import FeedItem from '../home/FeedItem';
import BackButton from '../../components/BackButton';
import {getFeedById} from '../../redux/actions/home';

interface SinglePostProps {}

const SinglePost = (props: SinglePostProps) => {
  const {postData: post} = props?.route?.params;

  const renderItem = React.useCallback(({item, index}: any) => {
    return <FeedItem item={item} index={index} />;
  }, []);

  const Header = React.useCallback(() => {
    return (
      <>
        <View style={{padding: 10}}>
          <BackButton />
        </View>
        <View style={styles.notificationTextContainer}>
          <Text style={commonStyles.fontBold24}>{'Post'}</Text>
        </View>
      </>
    );
  }, []);

  return (
    <WrapperContainer>
      <View style={styles.container}>
        <Header />
        <FlatList data={post} keyExtractor={(_, index) => index.toString()} contentContainerStyle={{flexGrow: 1}} renderItem={renderItem} extraData={post} initialNumToRender={10} maxToRenderPerBatch={10} removeClippedSubviews={true} />
      </View>
    </WrapperContainer>
  );
};

export default SinglePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationTextContainer: {paddingBottom: 20, paddingStart: 20, backgroundColor: colors.white},
});
