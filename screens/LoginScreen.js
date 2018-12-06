import Exponent, { Notifications, Font } from 'expo'
import firebase from 'firebase'
import React, {Component} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Image, AsyncStorage} from 'react-native'
import { NavigationActions } from 'react-navigation'
import FacebookButton from '../components/facebookButton'
import BackgroundImage from '../components/backgroundImage'
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
// import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm'

export default class LoginScreen extends Component {

  state = {
    showSpinner: true,
    deviceToken: '',
    fontLoaded: false,
  }

  static navigationOptions = {
    header: null,
  }

  componentWillMount() {
    // firebase.auth().signOut()
    firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.firebaseRef = firebase.database().ref('users')
        registerForPushNotificationsAsync(auth.uid);
        this.firebaseRef.child(auth.uid).on('value', snap => {
          const user = snap.val()
          
          if (user != null) {
            this.firebaseRef.child(auth.uid).off('value')
            this.goHome(user)
          }
        })
      } else {
        this.setState({showSpinner:false})
      }
    })
    this.fontLoad()
  }

  async fontLoad() {
    await Font.loadAsync({
      'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
      'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  goHome(user) {


    if(user.type == null) {
      this.props.navigation.navigate('SelectType', {user: user,})
    } 
    else if(user.skills == null && user.type.name != 'Fan') {
      this.props.navigation.navigate('SelectType', {user: user,})
    } else {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Main', params:{user: user}})
        ]
      })
      this.props.navigation.dispatch(resetAction)
      // this.props.navigation.navigate('Main', {user: user, rootNav:this.props.navigation,})
    }
  }

  updateUser = (key, value) => {
    const {uid} = this.state.user
    firebase.database().ref('users').child(uid)
      .update({[key]:value})
  }

  authenticate = (token) => {
    const provider = firebase.auth.FacebookAuthProvider
    const credential = provider.credential(token)
    return firebase.auth().signInWithCredential(credential)
  }

  createUser = (uid, userData) => {
    const defaults = {
      uid,
      distance: 500,
      unit:'Mi',
      ageRange: [18, 24],
      posts:0,
      followers:0,
      contacts:0,
      following:0,
      feedback:0,
      bio:'',
      ageShow:true,
      status:'Independent',
      location: 'London',
      imgURL:'',
      username: userData.first_name+' '+userData.last_name
    }
    firebase.database().ref('users').once('value', (snap) =>{
      if (snap.hasChild(uid)) {
        firebase.database().ref('users').child(uid).update({...userData})
      } else {
        firebase.database().ref('users').child(uid).update({...userData, ...defaults})
      }
    })
    
  }

  login = async () => {
    this.setState({showSpinner:true})
    const APP_ID = '152258698672829'
    const options = {
      permissions: ['public_profile', 'user_birthday', 'user_work_history', 'email'],
    }
    const {type, token} = await Exponent.Facebook.logInWithReadPermissionsAsync(APP_ID, options)
    if (type === 'success') {
      const fields = ['id', 'first_name', 'last_name', 'gender', 'birthday', 'work']
      const response = await fetch(`https://graph.facebook.com/me?fields=${fields.toString()}&access_token=${token}`)
      const userData = await response.json()
      const {uid} = await this.authenticate(token)
      this.createUser(uid, userData)
      
    }
  }

  render() {
    return (
      <BackgroundImage>
        <View style={{flex:0.5, justifyContent:'flex-end', alignItems:'center', flexDirection: 'row'}}>
          <View style={{flex:0.35}} />
          <Image source={require('../assets/images/logo.png')} style={{flex:0.3, resizeMode:'contain', marginTop: 50,}}/>
          <View style={{flex:0.35}} />
        </View>
        {
          this.state.fontLoaded?<Text style={{color: 'rgb(83,83,83)', backgroundColor: 'transparent', textAlign: 'center', fontSize: 14, fontFamily:'WorkSans-SemiBold'}}>Meet the music industry</Text>
          :<Text style={{color: 'rgb(83,83,83)', backgroundColor: 'transparent', textAlign: 'center', fontSize: 14}}>Meet the music industry</Text>
        }
        
        <View style={styles.container}>
          <View style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:0.15}}></View>
                <FacebookButton onPress={this.login} />
              <View style={{flex:0.15}}></View>
            </View>
            {
              this.state.fontLoaded?<Text style={{color:'rgb(17,17,17)', fontFamily:'WorkSans-Light', fontSize:14, backgroundColor:'transparent'}}> We don't post anything to your Facebook</Text>
              :<Text style={{color:'rgb(17,17,17)', fontSize:14, backgroundColor:'transparent'}}> We don't post anything to your Facebook</Text>
            }
            
          </View>
          {
            this.state.fontLoaded?
            <View style={{flex:0.5, justifyContent:'flex-end', alignItems:'center'}}>
              <Text style={{fontFamily:'WorkSans-SemiBold', color:'rgb(83,83,83)', fontSize:14, backgroundColor:'transparent'}}> By signing in, you agree to our </Text>
              <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center',}}>
                <TouchableOpacity style={styles.touch}>
                  <Text style={{fontFamily:'WorkSans-Light', color:'#D11038', fontSize:14, backgroundColor:'transparent'}} onPress={() => this.props.navigation.navigate('Terms')}>Terms of service, </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch}>
                  <Text style={{fontFamily:'WorkSans-Light', color:'#D11038', fontSize:14, backgroundColor:'transparent'}} onPress={() => this.props.navigation.navigate('Privacy')}>Privacy policy</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('Copy')}>
                <Text style={{fontFamily:'WorkSans-Light', color:'#D11038', fontSize:14, backgroundColor:'transparent'}}>& Copyright agreement</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={{flex:0.5, justifyContent:'flex-end', alignItems:'center'}}>
              <Text style={{color:'rgb(83,83,83)', fontSize:14, backgroundColor:'transparent'}}> By signing in, you agree to our </Text>
              <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center',}}>
                <TouchableOpacity style={styles.touch}>
                  <Text style={{color:'#D11038', fontSize:14, backgroundColor:'transparent'}} onPress={() => this.props.navigation.navigate('Terms')}>Terms of service, </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touch}>
                  <Text style={{color:'#D11038', fontSize:14, backgroundColor:'transparent'}} onPress={() => this.props.navigation.navigate('Privacy')}>Privacy policy</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.touch} onPress={() => this.props.navigation.navigate('Copy')}>
                <Text style={{color:'#D11038', fontSize:14, backgroundColor:'transparent'}}>& Copyright agreement</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </BackgroundImage>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:0.5,
    marginBottom: 20,
    flexDirection: 'column'
  },
  touch: {
    alignItems: 'center',
  },
  label: {
    color: '#4A4A4A',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
  bylabel: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  terms: {
    color: '#D11038',
    fontSize: 14,
    backgroundColor: 'transparent',
    marginTop:3,
  },

})
