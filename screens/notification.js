import Expo, { Notifications, Font } from 'expo'
import firebase from 'firebase'
import React, {Component} from 'react'
import {View, StyleSheet, TextInput, Text, TouchableOpacity, ListView, Alert, Dimensions, Image} from 'react-native'
import { NavigationActions } from 'react-navigation'
import BackButton from '../components/backButton'
import RoundedButton from '../components/roundedButton'
import _ from 'lodash'
import CircleImage from '../components/circleImage'
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import Swiper from 'react-native-swiper'

const {width, height} = Dimensions.get('window')
export default class Notification extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      notifications:[],
      isNewUsers:true,
    };
  }

  componentWillMount() {
      this._mounted = true;
  }
  componentWillUnmount() {
  this._mounted = false;
  } 
  componentDidMount() {
      
      this.getNotifications(this.props.user.uid)
  }

  getNotifications = (uid) => {

      firebase.database().ref('notifications').child(uid).on('value', snap => {
          var notifications = snap.val() || []
          console.log(notifications)
          if(!this._mounted) return
          this.setState({
              dataSource:this.state.dataSource.cloneWithRows(notifications),
              notifications:notifications,
          })
          var notiArr = _.values(notifications)
          for(var i=0; i<notiArr.length; i++) {
              var noti = notiArr[i]
              if (!noti.readed) {
                //   registerForPushNotificationsAsync();
                //   const localNotification = {
                //         title: 'Muebox',
                //         body: 'You received a notification', // (string) — body text of the notification.
                //         ios: { // (optional) (object) — notification configuration specific to iOS.
                //         sound: true // (optional) (boolean) — if true, play a sound. Default: false.
                //         },
                //     android: // (optional) (object) — notification configuration specific to Android.
                //         {
                //         sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
                //         //icon (optional) (string) — URL of icon to display in notification drawer.
                //         //color (optional) (string) — color of the notification icon in notification drawer.
                //         priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
                //         sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
                //         vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
                //         // link (optional) (string) — external link to open when notification is selected.
                //         }
                //     };
                //     console.log('LocalNotificatino:', localNotification)
                //     let t = new Date();
                //     t.setSeconds(t.getSeconds() + 10);
                //     const schedulingOptions = {
                //         time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
                //         repeat: false
                //     };        
                // //   Expo.Notifications.presentLocalNotificationAsync(localNotification)
                // Expo.Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
                  break
              }
          }
      })
  } 

  selectedItem = (rowData, rowId) => {
    //   var item = _.values(rowData)
    console.log(rowId)
    // if (rowData.readed) return
    this.props.rootNav.navigate('Chat', {user:this.props.user, profile:rowData.user, accepted:!rowData.readed, notificationID:rowId})
  }

  notificationRow = (rowData, sectionId, rowId)=> {
      const {user} = rowData
      return(
                <View style={{flex: 1, paddingLeft:15, paddingRight:5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height:66, borderBottomWidth:0.5, borderBottomColor:'rgb(230,230,230)'}}>
                    <TouchableOpacity onPress={() => this.props.rootNav.navigate('OtherProfile', {userId:user.uid, currentUser:this.props.user})}>
                    <CircleImage imageURI={''} size={40} facebookID={user.id} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1}} onPress={() => this.selectedItem(rowData, rowId)}>
                        
                        <View style={{marginLeft:10, flexDirection:'row'}}>
                        {
                            this.state.fontLoad?
                            <Text style={{fontSize:10, fontFamily:'WorkSans-Regular', flex:1, lineHeight:18}}>
                                <Text style={{color:'rgb(209,16,56)'}}>{`${user.first_name+ " " +user.last_name+" "}`}</Text> 
                                <Text numberOfLines={2} style={{color:'rgb(83,83,83)'}}> wants to collaborate and has sent you a connect request. Tap here to read 
                            {`${" "+user.first_name+ " " +user.last_name}`} message</Text>
                            </Text>
                            :
                            <Text style={{fontSize:10, flex:1, lineHeight:18}}>
                                <Text style={{color:'rgb(209,16,56)'}}> {`${user.first_name+ " " +user.last_name}`}</Text> 
                                <Text style={{color:'rgb(83,83,83)'}}> wants to collaborate and has sent you a connect request. Tap here to read 
                            {`${" "+user.first_name+ " " +user.last_name}`} message</Text>
                            </Text>
                        }
                        </View>
                    
                    </TouchableOpacity>
                </View>
            
      )
  }

  onNewUsers = () => {
    if (this.state.isNewUsers) return

    this.swipRef.scrollBy(-1, false)
    this.setState(
      {
        isNewUsers:true
      }
    )
  }

  onNotifications = () => {
    if (!this.state.isNewUsers) return
    this.swipRef.scrollBy(1, false)
        this.setState(
      {
        isNewUsers:false
      }
    )
  }

  render() {
    return (
        <View style={{backgroundColor: 'white',}}>
            <View style={{flexDirection: 'row', height:70, backgroundColor: 'rgb(83, 83, 83)'}}>
                <TouchableOpacity style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                    <Image source={require('../assets/images/menu.png')} style={{resizeMode:'contain', width:20, height:20}}/>
                </TouchableOpacity> 
                <View style={{flex:1, height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize: 20, color: 'white', fontFamily:'AbrilFatface-Regular'}}> Notifications </Text>
                </View>
                <View style={{width:50}}/>
            </View>
            <View style={{flexDirection: 'row', height:40, backgroundColor: 'white',}}>
                <TouchableOpacity onPress={() => this.onNewUsers()} style={{flex:0.5, justifyContent: 'center', alignItems:'center'}}><Text style={this.state.isNewUsers ? {color: 'rgb(209,16,56)', fontFamily:'WorkSans-SemiBold', fontSize:14}:{color: 'rgb(17,17,17)', fontFamily:'WorkSans-Light', fontSize:14}}>Following</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => this.onNotifications()} style={{flex:0.5, justifyContent: 'center', alignItems:'center'}}><Text style={this.state.isNewUsers ? {color: 'rgb(17,17,17)', fontFamily:'WorkSans-Light', fontSize:14}:{color: 'rgb(209,16,56)', fontFamily:'WorkSans-SemiBold', fontSize:14}}>You</Text></TouchableOpacity>
            </View>
            <View style={{height:0.5, backgroundColor:'rgb(230, 230, 230)'}}/>
            <View style={{backgroundColor: 'white', paddingBottom:50,}}>
                <Swiper ref={(ref) => this.swipRef=ref} style={{backgroundColor:'white',}} height={height-210} showsButtons={false} scrollEnabled={false} dotColor='transparent' activeDotColor='transparent'>
                <View style={{flex: 1,}}>
                    <ListView
                    style={{flex: 1,}}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={this.notificationRow} />
                </View>
                <View style={{flex: 1,}}>
                    <ListView
                    style={{flex: 1,}}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={this.notificationRow} />
                </View>
                </Swiper>
                
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,  
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
})
