import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import CopyScreen from '../screens/CopyScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import OtherProfile from '../screens/OtherProfile'
import ChatScreen from '../screens/ChatScreen';
import SelectTypeScreen from '../screens/SelectTypeScreen';
import SelectSkillScreen from '../screens/SelectSkillScreen';
import GenresScreen from '../screens/GenresScreen';
import EditProfile from '../screens/EditProfile';

import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyD2iZCMNq6xNYtbhoL9G8uN0ReCei3jekg",
  databaseURL: "https://muebox-db8bf.firebaseio.com",
  storageBucket: "gs://muebox-db8bf.appspot.com",
}

firebase.initializeApp(firebaseConfig)


const RootStackNavigator = StackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Copy: {
      screen: CopyScreen,
    },
    Terms: {
      screen: TermsScreen,
    },
    Privacy: {
      screen: PrivacyScreen,
    },
    Main: {
      screen: MainTabNavigator,
    },
    Chat: {
      screen: ChatScreen,
    },
    SelectType: {
      screen: SelectTypeScreen,
    },
    Genres: {
      screen: GenresScreen,
    },
    SelectSkill: {
      screen: SelectSkillScreen,
    },
    EditProfile: {
      screen: EditProfile,
    },
    OtherProfile: {
      screen: OtherProfile,
    }
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default class RootNavigator extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    // registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}
