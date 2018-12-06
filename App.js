import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

export default class App extends React.Component {
  state = {
    assetsAreLoaded: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  render() {
    if (!this.state.assetsAreLoaded && !this.props.skipLoadingScreen) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' &&
            <View style={styles.statusBarUnderlay} />}
          <RootNavigation />
        </View>
      );
    }
  }

  async _loadAssetsAsync() {
    try {
      await Promise.all([
        Asset.loadAsync([
          require('./assets/images/robot-dev.png'),
          require('./assets/images/robot-prod.png'),
          require('./assets/icons/home.png'),
          require('./assets/icons/alert.png'),
          require('./assets/icons/play.png'),
          require('./assets/icons/chat.png'),
          require('./assets/icons/profile.png'),
          require('./assets/icons/home_sel.png'),
          require('./assets/icons/alert_sel.png'),
          require('./assets/icons/play_sel.png'),
          require('./assets/icons/chat_sel.png'),
          require('./assets/icons/profile_sel.png')
        ]),
        Font.loadAsync([
          // This is the font that we are using for our tab bar
          Ionicons.font,
          // We include SpaceMono because we use it in HomeScreen.js. Feel free
          // to remove this if you are not using it in your app
          { 
            'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
            'WorkSans-Light': require('./assets/fonts/WorkSans-Light.ttf'),
            'WorkSans-SemiBold': require('./assets/fonts/WorkSans-SemiBold.ttf'),
            'AbrilFatface-Regular': require('./assets/fonts/AbrilFatface-Regular.ttf'),
            'WorkSans-Regular': require('./assets/fonts/WorkSans-Regular.ttf'),
            'WorkSans-Bold': require('./assets/fonts/WorkSans-Bold.ttf'),
         },
          
        ]),
      ]);
    } catch (e) {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e);
    } finally {
      this.setState({ assetsAreLoaded: true });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
