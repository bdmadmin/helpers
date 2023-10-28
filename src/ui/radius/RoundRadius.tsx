import * as React from 'react';
import {Text, View, StyleSheet, TextInput, DeviceEventEmitter, ScrollView, Platform} from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import {useDispatch} from 'react-redux';
import BackButton from '../../components/BackButton';
import Loader from '../../components/Loader';
import MainButton from '../../components/MainButton';
// import imagePath from '../../config/imagePath';
import {updateProfile} from '../../redux/actions/auth';
import {authSliceSelector, updateAuthUserData} from '../../redux/reducer/AuthSlice/authSlice';
import colors from '../../theme/colors';
import commonStyles from '../../utils/commonStyles';
import {getCurrentLocation} from '../../utils/helper';
import {setUserData, showError, showSuccess} from '../../utils/utils';
import WrapperContainer from '../../components/WrapperContainer';
import {useAppSelector} from '../../redux/store';

interface RoundRadiusProps {}

const RoundRadius = (props: RoundRadiusProps) => {
  const userData = useAppSelector(authSliceSelector);
  const dispatch = useDispatch();
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [radius, setRadius] = React.useState(userData?.radius ?? '50');
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const x = await getCurrentLocation();
        setRegion({
          latitude: x.coords.latitude,
          longitude: x.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {}
    })();
  }, []);

  const inc = () => {
    if (radius < 10000) {
      if (radius) {
        setRadius(parseInt(parseInt(radius, 10) + 1, 10));
      } else {
        setRadius(1);
      }
    }
  };

  const dec = () => {
    if (radius > 0) {
      setRadius(parseInt(radius - 1, 10));
    }
  };

  const save = async () => {
    try {
      setLoading(true);
      await updateProfile({radius: radius});
      setLoading(false);
      showSuccess('Radius Update');
      dispatch(updateAuthUserData({...userData, radius: radius?.toString()}));
      setUserData({...userData, radius: radius.toString()});
      DeviceEventEmitter.emit('addOwnPost', {apiCall: true});
      props?.exit();
    } catch (error) {
      setLoading(false);
      showError((error as Error).message);
    }
  };

  function isNumber(value: number): boolean {
    return /^\d+$/.test(value);
  }

  return (
    <WrapperContainer>
      <View style={styles.container}>
        <Loader modal={false} isLoading={isLoading} />
        <View style={styles.rowContainer}>
          <BackButton onCustomPress={() => props?.exit()} />
          <View style={styles._container}>
            <Text onPress={dec} style={{...commonStyles.fontBold36}}>
              {'-'}
            </Text>
            <TextInput
              value={radius.toString()}
              onChangeText={x => setRadius(x)}
              keyboardType="number-pad"
              style={{...commonStyles.fontBold16, padding: 10, flex: 0.4, textAlign: 'center'}}
              placeholderTextColor={'grey'}
              placeholder={'Enter km'}
              maxLength={10}
              returnKeyType="done"
            />
            <Text onPress={inc} style={{...commonStyles.fontBold36}}>
              {'+'}
            </Text>
          </View>
        </View>
        <MapView zoomEnabled={true} scrollEnabled={true} showsScale={true} provider={'google'} region={region} style={{flex: 1}}>
          <Circle center={region} radius={isNumber(radius) ? parseInt(radius, 10) * 1000 : 1 * 1000} strokeWidth={1} strokeColor={colors.blue_light} fillColor={'rgba(230,238,255,0.5)'} />
        </MapView>
        <MainButton btnText="Save" onPress={save} btnStyle={{marginBottom:Platform.OS=="ios"?20:0,borderRadius:0}}/>
      </View>
    </WrapperContainer>
  );
};

export default RoundRadius;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  rowContainer: {backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between'},
  _container: {backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', flex: 1},
});
