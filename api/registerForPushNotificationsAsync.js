import { Permissions, Notifications } from 'expo';
import {AsyncStorage} from 'react-native';
import firebase from 'firebase';

// Example server, implemented in Rails: https://git.io/vKHKv
// const PUSH_ENDPOINT = 'https://expo-push-server.herokuapp.com/tokens';
const PUSH_ENDPOINT = 'https://muebox-server.herokuapp.com/tokens';

export default (async function registerForPushNotificationsAsync(profileUid) {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  console.log('device_token:',token)

  firebase.database().ref('users').child(profileUid)
        .update({token:token})
  // return token

  // POST the token to our backend so we can use it to send pushes from there
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
    }),
  });
});
