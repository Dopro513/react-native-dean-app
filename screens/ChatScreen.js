console.ignoredYellowBox = ['Warning: Failed prop type: Invalid prop `keyboardShouldPersistTaps`']
import Exponent, { Notifications, Font } from 'expo'
import { NavigationActions } from 'react-navigation'
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  Keyboard,
  Dimensions,
  TouchableOpacity,
} from 'react-native'

import * as firebase from 'firebase'
import PushNotificationsAsync from '../api/pushNotificationAsync';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat'
import BackButton from '../components/backButton'
import RoundedButton from '../components/roundedButton'
import BlackRoundedButton from '../components/blackRoundedButton'
import RedRoundedButton from '../components/redRoundedButton'
import PopupDialog from 'react-native-popup-dialog'
import CircleImage from '../components/circleImage'
import EmojiPicker from 'react-native-simple-emoji-picker'
import dismissKeyboard from 'react-native-dismiss-keyboard'
const {width, height} = Dimensions.get('window')

export default class ChatScreen extends Component {

  static navigationOptions = {
    header: null,
  }
  state={
    messages:[],
    user: this.props.navigation.state.params.user,
    profile: this.props.navigation.state.params.profile,
    invited: this.props.navigation.state.params.invited,
    accepted: this.props.navigation.state.params.accepted,
    notificationID: this.props.navigation.state.params.notificationID,
    messageText:'',
    emoji: false,
    visibleHeight: Dimensions.get('window').height,
    visibleWidth: Dimensions.get('window').width,
    fontLoaded: false,
  }

  async fontLoad() {
    await Font.loadAsync({
      'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
      'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
      'AbrilFatface-Regular': require('../assets/fonts/AbrilFatface-Regular.ttf'),
      'WorkSans-Regular': require('../assets/fonts/WorkSans-Regular.ttf'),
      'WorkSans-Bold': require('../assets/fonts/WorkSans-Bold.ttf'),
    });

    if (!this._mounted) return
    this.setState({ fontLoaded: true });
  }

  componentWillUnmount() {
    this._mounted = false;
    this.fontLoad()
  } 

  constructor(props) {
    super(props)

    this.renderFooter = this.renderFooter.bind(this);
  }

  componentDidMount() {
    
    if (this.state.invited) {
      this.inviteDialog()
    }

    if (this.state.accepted) {
      this.acceptDialog.show()
    }
  }

  componentWillMount() {

    this._mounted = true;
    const {user, profile} = this.state
    this.chatID = user.uid > profile.uid ? user.uid + '-' + profile.uid : profile.uid + '-' + user.uid
    this.watchChat()
    // Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    // Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
  }

  inviteDialog =() => {
    this.popupDialog.show()
  }

  watchChat = () => {
    firebase.database().ref('messages').child(this.chatID).on('value', snap => {
      let messages = []

      if (!this._mounted) return
      snap.forEach(message => {
        messages.push(message.val())
      })

      if(!this.state.invited) {
        firebase.database().ref('lastmessages').child(this.state.user.uid).child(this.state.profile.uid)
        .update({
          readed: true
        })
      }
      
      messages.reverse()


      this.setState({messages:messages})
    })
  }

  onSend = (message) => {
    
    if(this.state.messages.length == 2 && this.state.invited) {
      return
    }

    if (!this.state.invited) {
      firebase.database().ref('messages').child(this.chatID)
        .push({
          ...message[0],
          createdAt: new Date().getTime(),
        })
      firebase.database().ref('lastmessages').child(this.state.user.uid).child(this.state.profile.uid)
        .set({
          ...message[0],
          createdAt: new Date().getTime(),
          readed: true,
          profile: this.state.profile
        })

      firebase.database().ref('lastmessages').child(this.state.profile.uid).child(this.state.user.uid)
        .set({
          ...message[0],
          createdAt: new Date().getTime(),
          readed: false,
          profile: this.state.user
        })
        PushNotificationsAsync(this.state.profile.token)
    } else {
      firebase.database().ref('messages').child(this.chatID)
      .push({
        ...message[0],
        invited:true,
        createdAt: new Date().getTime(),
      })

      
    }
    
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  setCustomText = (text) => {
    console.log(text)
    if (!this._mounted) return
    this.setState(
      {
        messageText:text
      }
    )  
  }

  setCustomEmoji = (emoji) => {
    console.log(emoji)
    if (!this._mounted) return
    this.setState(
      {
        messageText:{emoji}
      }
    )
  }

  toggleEmoji() {
    const oldEmoji = this.state.emoji;
    dismissKeyboard();
    console.log(oldEmoji)
    if (!this._mounted) return
    this.setState({emoji: !oldEmoji});
  }

  // componentWillMount () {
  //   Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
  //   Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
  // }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height
    console.log(newSize)
    if (!this._mounted) return
    this.setState({visibleHeight: newSize})
    this.setState({emoji: false});
  }

  keyboardWillHide (e) {
    console.log('hide')
    if (!this._mounted) return
    this.setState({visibleHeight: Dimensions.get('window').height})
  }

  render() {
    const avatar = `https://graph.facebook.com/${this.state.user.id}/picture?height=80`
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <View style={{flexDirection: 'row', height:70, backgroundColor: 'rgb(83, 83, 83)'}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                <Image source={require('../assets/images/back.png')} style={{resizeMode:'contain', width:20, height:20}}/>
            </TouchableOpacity> 
            <View style={{flex:1, height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize: 20, color: 'white', fontFamily:'AbrilFatface-Regular'}}> {this.state.profile.first_name+" "+this.state.profile.last_name} </Text>
            </View>
            <TouchableOpacity style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
              <Image source={require('../assets/images/menu1.png')} style={{resizeMode:'contain', width:20, height:20}}/>
            </TouchableOpacity>
        </View>
        <GiftedChat
        text={this.state.messageText}
        onInputTextChanged={(text) => this.setCustomText(text)}
        messages={this.state.messages}
        user={{_id: this.state.user.uid, avatar, name:this.state.user.first_name+" "+this.state.user.last_name}}
        onSend={this.onSend}
       
        showUserAvatar={true}/>
        {this.state.emoji ? <EmojiPicker onPick={emoji => this.setCustomEmoji(emoji)}/> : <View/>}

        <PopupDialog height={290} width={width-30} ref={(popupDialog) => { this.popupDialog = popupDialog; }} >
          <View style={{flex: 1, alignItems:'center', justifyContent: 'center', margin:10,}}>
            <View style={{flexDirection: 'row', marginBottom:10}}>
              <View style={{flex:1}} />
              <TouchableOpacity onPress={() => this.popupDialog.dismiss()}>
                <Image source={require('../assets/images/close.png')} style={{width:15, height:15}} />
              </TouchableOpacity>
            </View>
            
            <Text style={{fontSize:28, fontFamily:'AbrilFatface-Regular', color:'rgb(83,83,83)'}}>Invite</Text>
            <Image source={require('../assets/images/lines.png')} style={{resizeMode: 'contain', width:width*0.7, height:10, margin:10,}} />
            <Text style={{textAlign: 'center', fontSize:14, color: 'rgb(17,17,17)', marginBottom: 10, fontFamily:'WorkSans-Light'}}> Send up to 1 invitation to </Text>
            <View style={{flexDirection:'row', alignItems:'center'}}> 
              <CircleImage imageURI={''} size={73} facebookID={this.state.profile.id} />
            </View>
            <Text style={{textAlign: 'center', fontSize:14, color: 'rgb(209,16,56)', lineHeight:24, fontFamily:'WorkSans-SemiBold', marginBottom: 10}}> {this.state.profile.first_name + " " + this.state.profile.last_name} </Text>
            <View style={{height:40, paddingLeft: 10, paddingRight: 10, flexDirection:'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} >
              <BlackRoundedButton style={{flex:0.5}} text={'Continue'} onPress={() => this.continue(true)}/>
              <View style={{width:25}}/>
              <RedRoundedButton style={{flex:0.5}} text={'No'} onPress={() => this.continue(false)}/>
            </View>
          </View>
        </PopupDialog>
        <PopupDialog height={320} width={width-30} ref={(acceptDialog) => { this.acceptDialog = acceptDialog; }} >
          <View style={{flex: 1, alignItems:'center', justifyContent: 'center', margin:10,}}>
            <View style={{flexDirection: 'row', marginBottom:10}}>
              <View style={{flex:1}} />
              <TouchableOpacity onPress={() => this.acceptDialog.dismiss()}>
              <Image source={require('../assets/images/close.png')} style={{width:15, height:15}} />
              </TouchableOpacity>
            </View>
            
            <Text style={{fontSize:28, fontFamily:'AbrilFatface-Regular', color:'rgb(83,83,83)'}}>Connection Request</Text>
            <Image source={require('../assets/images/lines.png')} style={{resizeMode: 'contain', width:width*0.7, height:10, margin:10,}} />
            <Text style={{textAlign: 'center', lineHeight:20, fontSize:14, color: 'rgb(17,17,17)', fontFamily:'WorkSans-Light', marginBottom: 10}}> Do you want to connect{'\n'}and collaborate with </Text>
            <View style={{flexDirection:'row', alignItems:'center'}}> 
              <CircleImage imageURI={''} size={73} facebookID={this.state.profile.id} />
            </View>
            <Text style={{textAlign: 'center', fontSize:14, color: 'rgb(209,16,56)', marginBottom: 10, fontFamily:'WorkSans-SemiBold', lineHeight:24}}> {this.state.profile.first_name + " " + this.state.profile.last_name} </Text>
            <View style={{height:40, paddingLeft: 10, paddingBottom:10, paddingRight: 10, flexDirection:'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} >
              <BlackRoundedButton style={{flex:0.5}} text={'Yes'} onPress={() => this.accepted(true)}/>
              <View style={{width:25}}/>
              <RedRoundedButton style={{flex:0.5}} text={'No'} onPress={() => this.accepted(false)}/>
            </View>
          </View>
        </PopupDialog>
      </View>
      
    )
  }

  

  continue = (state) => {
    this.popupDialog.dismiss()
    if (state) {
      firebase.database().ref('notifications').child(this.state.profile.uid)
      .push({
        type:'Invited',
        readed: false,
        user:this.state.user,
        createdAt: new Date().getTime(),
      })

      console.log('device_token:',this.state.profile.token)
      PushNotificationsAsync(this.state.profile.token)

      this.relate(this.state.user.uid, this.state.profile.uid, true)
      
    } else {
      this.props.navigation.dispatch(NavigationActions.back())
    }
    
  }

  accepted = (state) => {

    if (!this._mounted) return
    console.log(this.state.notificationID)
    this.acceptDialog.dismiss()
    if(state) {
      firebase.database().ref('notifications').child(this.state.user.uid).child(this.state.notificationID)
      .update({
        readed: true,
      })

      this.relate(this.state.user.uid, this.state.profile.uid, true)
    } else {
      this.props.navigation.dispatch(NavigationActions.back())
    }
  }

  relate = (userUid, profileUid, status) => {
    if (!this._mounted) return
    let relationUpdate = {}
    relationUpdate[`${userUid}/liked/${profileUid}`] = status
    relationUpdate[`${profileUid}/likedBack/${userUid}`] = status

    firebase.database().ref('relationships').update(relationUpdate)
  }

  // render() {
  //   return (
  //     <GiftedChat
  //       messages={demoMessages}
  //       user={{_id:'123test'}}
  //     />
  //   )
  // }
}

const demoMessages = [
  {
    text: 'Hell yeah! #winning',
    createdAt: 1489091435797,
    _id: '10046a73-59c9-4a2a-93fe-aohgpwerg034',
    user: {
      _id: '123test',
      avatar: 'https://graph.facebook.com/09615623515/picture?height=80',
    },
  },
  {
    text: 'Sure Penguin Man!',
    createdAt: 1489091437797,
    _id: '6f36d879-43de-4853-bcf4-4810dcad1e9a',
    user: {
      _id: '-KcEv8h7GrwAvAf4VTnW',
      avatar: 'https://graph.facebook.com/259389830744794/picture?height=80',
    },
  },
  {
    text: 'Coffee?',
    createdAt: 1489091435797,
    _id: '10046a73-59c9-4a2a-93fe-edaf8da815d2',
    user: {
      _id: '123test',
      avatar: 'https://graph.facebook.com/09615623515/picture?height=80',
    },
  },
  {
    text: 'My hero ❤️️',
    createdAt: 1489091433016,
    _id: '0d053339-227c-44d2-a030-4c12e4087d2d',
    user: {
      _id: '-KcEv8h7GrwAvAf4VTnW',
      avatar: 'https://graph.facebook.com/259389830744794/picture?height=80',
    },
  },
  {
    text: 'I once saved a baby penguin 🐧 from drowning',
    createdAt: 1489091430713,
    _id: '33dafbde-5be7-4268-ae55-f474e42368b5',
    user: {
      _id: '123test',
      avatar: 'https://graph.facebook.com/09615623515/picture?height=80',
    },
  },
]