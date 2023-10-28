/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Alert, Platform, BackHandler, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import {TextInput} from 'react-native-gesture-handler';
// import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';

const screenSize = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default class Radius extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 200,
      widthSeekBar: 0,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  handleBackButtonClick = () => {
    this.props.closeClicked();
    return true;
  };

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UserData.accessToken = this.props.userData.data.accessToken;
    try {
      let locationObject = await Utility.GetCurrentLocation();
      console.log('aaaaaaaaa', locationObject);
      this.setState({
        region: {
          latitude: locationObject?.coords?.latitude,
          longitude: locationObject?.coords?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      });
    } catch (error) {
      console.log('location get err : ', error);
    }
    this.UserDetailsApi();
  }

  saveClick = () => {
    let body = {radius: this.state.value};
    this.radiusUpdate(body);
  };

  UserDetailsApi = async () => {
    this.props.loading(true);
    let response = await fetchData(AUTH_APIS.USER_DETAIL, null, METHODS.GET);
    if (response.statusCode === APIStatusCodes.SUCCESS) {
      // console.log('user response ', response);
      let {radius, latitude} = response.data.user;
      if (!latitude) {
        setTimeout(async () => {
          let permission = await Utility.Location_Permissions();
          if (permission == 'granted') {
            let locationObject = await Utility.GetCurrentLocation();
            let body = {
              latitude: locationObject.coords.latitude,
              longitude: locationObject.coords.longitude,
            };
            this.locationUpdate(body);
          }
        }, 1);
      }
      if (radius != null) {
        console.log('check radius ', radius);
        this.setState({value: radius});
      }
    } else {
      this.props.loading(false);
      if (response) {
        let {message} = response;
        console.log('radius err message ', message);
      }
    }
    this.props.loading(false);
  };

  locationUpdate = async body => {
    this.props.loading(true);
    let response = await fetchData(AUTH_APIS.PROFILE_UPDATE, body, METHODS.PUT);
    if (response.statusCode === APIStatusCodes.SUCCESS) {
      console.log('---check---locationUpdate---- in radius', response);
    } else {
      let {message} = response;
      setTimeout(() => {
        Alert.alert('', message);
      }, 100);
    }
    this.props.loading(false);
  };

  radiusUpdate = async body => {
    this.props.loading(true);
    let response = await fetchData(AUTH_APIS.PROFILE_UPDATE, body, METHODS.PUT);
    if (response && response.statusCode === APIStatusCodes.SUCCESS) {
      console.log('---check---radiusUpdate----', response);
      this.props.loading(false);
      Alert.alert(
        'Success',
        'Radius updated successfully',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
          {
            text: 'OK',
            onPress: () => {
              this.props.closeClicked();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      this.props.loading(false);
      if (response) {
        let {message} = response;
      }
    }
  };

  renderAboveView = () => {
    return (
      <>
        <View
          style={{
            height: (screenSize.height * 6) / 812,
            width: (screenSize.width * 60) / 375,
            alignSelf: 'center',
            // backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 6,
            marginTop: 0,
          }}
        />
        <View
          style={{
            width: '100%',
            // backgroundColor: 'white',
            paddingTop: (screenSize.height * 50) / 812,
            paddingBottom: (screenSize.height * 16) / 812,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginLeft: (screenSize.width * 14) / 375,
              marginBottom: (screenSize.height * 20) / 812,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  marginLeft: 6,
                  width: null,
                  textAlign: 'left',
                  textAlignVertical: 'center',
                  fontSize: 24,
                  color: '#474B4E',
                  fontFamily: Platform.OS === 'ios' ? fontFamily.regular : fontFamily.bold,
                  fontWeight: Platform.OS === 'ios' ? '700' : 'normal',
                  lineHeight: 32,
                  letterSpacing: 0.5,
                }}>
                {'Set the radius'}
              </Text>
            </View>
            <TextInput
              value={this.state.value.toString()}
              onChangeText={e => {
                this.setState({
                  value: e.toString() || '0',
                });
              }}
              style={{
                marginTop: (screenSize.height * 10) / 812,
                marginLeft: 6,
                width: null,
                textAlign: 'left',
                textAlignVertical: 'center',
                fontSize: 18,
                color: '#474B4E',
                fontFamily: fontFamily.regular,
                fontWeight: Platform.OS === 'ios' ? 'normal' : 'normal',
                lineHeight: 16.86,
                letterSpacing: 1.5,
              }}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
            />
          </View>
        </View>
      </>
    );
  };

  render() {
    let {state} = this;
    let {value} = state;
    const sliderStyle = {
      container: {
        height: screenSize.height,
        width: screenSize.width,
        backgroundColor: 'white',
      },
    };
    return (
      <View style={sliderStyle.container}>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}>
          <MapView liteMode provider={'google'} region={this.state.region} style={{flex: 1}} />
        </View>
      </View>
    );
  }
}
