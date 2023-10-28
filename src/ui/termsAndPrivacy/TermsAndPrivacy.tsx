import * as React from 'react';
import {View, ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview';
import BackButton from '../../components/BackButton';
import WrapperContainer from '../../components/WrapperContainer';
import colors from '../../theme/colors';
import styles from './styles';

interface TermsAndPrivacyProps {
  link: string;
}

const TermsAndPrivacy = (props: TermsAndPrivacyProps) => {
  const {link} = props;
  const renderLoading = () => {
    return <ActivityIndicator />;
  };
  return (
    <WrapperContainer>
      <View style={styles.container}>
        <BackButton />
        <View style={styles.container}>
          <WebView source={{uri: link}} style={{backgroundColor: colors.white}} renderLoading={renderLoading} startInLoadingState={true} />
        </View>
      </View>
    </WrapperContainer>
  );
};

export default TermsAndPrivacy;
