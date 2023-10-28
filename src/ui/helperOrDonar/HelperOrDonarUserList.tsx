import {useIsFocused} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, Image, FlatList, RefreshControl, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import BackButton from '../../components/BackButton';
import FlexSBContainer from '../../components/FlexSBContainer';
import MarkAsComplete from '../../components/MarkAsCompleteModal';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../config/imagePath';
import {getWhoMessageMe} from '../../redux/actions/home';
import commonStyles from '../../utils/commonStyles';
import HelperOrDonarListItem from './HelperOrDonarListItem';
import styles from './styles';

interface HelperDonarProps {}

const HelperOrDonarUserList = (props: HelperDonarProps) => {
  const {item: postItem, isPost} = props?.route.params;
  const [users, setUsers] = React.useState([]);
  const isFocused = useIsFocused();
  const markAsCompleteRef = React.useRef();

  React.useEffect(() => {
    (async () => {
      try {
        const {listing}: unknown = await getWhoMessageMe(postItem?.id);
        if (Array.isArray(listing) && listing.length > 0) {
          setUsers(listing[0]?.request);
          markAsCompleteRef.current.setUsers(listing[0]?.request, postItem?.id);
        }
      } catch (error) {}
    })();
  }, [postItem?.id, isFocused]);

  const renderHelperAndDonar = React.useCallback(
    ({item}: any) => {
      return <HelperOrDonarListItem item={item} postItem={postItem} />;
    },
    [postItem],
  );

  const onPressMarkAsSold = () => {
    postItem?.status !== 1 && markAsCompleteRef.current.setVisibility(true);
  };

  const Header = React.useCallback(() => {
    return (
      <View>
        <FlexSBContainer containerStyle={{padding: 10}}>
          <BackButton />
          <Text style={commonStyles.fontBold16}>{'Posted by you'}</Text>
          <Image source={imagePath.fi_more_vertical} />
        </FlexSBContainer>
        <FlexSBContainer containerStyle={{padding: 10}}>
          <FastImage style={styles.headerPostImage} source={isPost} />
          <View style={styles.descContainer}>
            <Text numberOfLines={3} style={{...commonStyles.fontSize13}}>
              {postItem?.description}
            </Text>
            <Text onPress={onPressMarkAsSold} style={styles.markAsComplete}>
              {postItem?.status === 0 ? 'Mark as completed' : 'Completed'}
            </Text>
          </View>
        </FlexSBContainer>
      </View>
    );
  }, [postItem, isPost]);

  return (
    <WrapperContainer>
      <Header />
      <View style={styles.flatList}>
        <FlatList data={users} renderItem={renderHelperAndDonar} refreshControl={<RefreshControl refreshing={false} />} keyExtractor={(_, index) => index.toString()} />
      </View>

      <MarkAsComplete
        onSubmit={() => {
          DeviceEventEmitter.emit('refresh');
          props?.navigation.goBack();
        }}
        ref={markAsCompleteRef}
      />
    </WrapperContainer>
  );
};

export default HelperOrDonarUserList;
