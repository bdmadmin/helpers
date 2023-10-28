import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import colors from '../theme/colors';
import {moderateScaleVertical} from '../theme/responsiveSize';
import commonStyles from '../utils/commonStyles';

const error = (stack: string, component: string) => `Please let us know what happened. What steps we can take to reproduce the issue here._______________________________ Stacktrace: In ${component}::${stack}`;

class ExceptionHandler extends React.Component<{
  children: React.ReactNode;
  component: string;
}> {
  state: {
    error: {
      title: string;
      stack: string;
    } | null;
    hasError: boolean;
  } = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error: error};
  }

  componentDidCatch(_error: Error) {
    this.setState({hasError: true});
  }

  componentDidMount() {
    // RNBootSplash.hide();
  }

  render() {
    return this.state.hasError ? (
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text style={styles.errorText}>{this.state?.error?.title || 'Unknown Error'}</Text>
          <ScrollView>
            <Text style={styles.error}>{this.state.error?.stack || 'Unknown Error'}</Text>
          </ScrollView>
        </View>
      </SafeAreaProvider>
    ) : (
      this.props.children
    );
  }
}

export const withErrorBoundary = (Element: React.ElementType, name: string) => {
  return function ErrorBoundary() {
    return (
      <ExceptionHandler component={name}>
        <Element />
      </ExceptionHandler>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  errorText: {...commonStyles.fontSize14, alignSelf: 'center', marginVertical: moderateScaleVertical(20)},
  error: {...commonStyles.fontSize14, alignSelf: 'center'},
});
