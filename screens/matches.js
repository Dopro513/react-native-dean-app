import React, {Component} from 'react'
import Exponent, { Notifications, Font } from 'expo'
import {
  ListView,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native'

import Swiper from 'react-native-swiper'
import Drawer from 'react-native-drawer'
import * as firebase from 'firebase'
import _ from 'lodash'

import CircleImage from '../components/circleImage'
import Menu from './menu'
import BackButton from '../components/backButton'
// import AtoZListView from 'react-native-atoz-listview';

const {width, height} = Dimensions.get('window')
export default class MatchesScreen extends Component {

  static navigationOptions = {
    header: null,
  }
  
  componentWillUnmount() {
    console.log('unmounted')
  this._mounted = false;
  } 

  state = {
    matchdataSource: new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow !== newRow }),
    chatdataSource: new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow !== newRow }),
    contactdataSource: new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow !== newRow }),
    matches: [],
    messages: [],
    contacts: [],
    data:[],
    swipRef: null,
    isChat: true,
    fontLoaded:false,
    // rootNav:this.props.navigation.state.params.rootNav,
  }

  closeDrawer = () => {
    this._drawer.close()
  };
  openDrawer = () => {
    this._drawer.open()
  };
  async fontLoad() {
    await Font.loadAsync({
      'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
      'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
      'AbrilFatface-Regular': require('../assets/fonts/AbrilFatface-Regular.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  componentWillMount() {
    this._mounted = true;
    this.getMatches(this.props.user.uid)
    this.fontLoad()
  }

  getOverlap = (liked, likedBack) => {
    const likedTrue = _.pickBy(liked, value => value)
    const likedBackTrue = _.pickBy(likedBack, value => value)

    return _.intersection(_.keys(likedTrue), _.keys(likedBackTrue))
  }

  getMatchess = (liked, likedBack) => {
    const likedTrue = _.pickBy(liked, value => value)
    const likedBackTrue = _.pickBy(likedBack, value => value)

    var matches = []
    var arr1 = _.keys(likedTrue)
    var arr2 = _.keys(likedBackTrue)

    
    for (var j=0; j<arr2.length; j++) {

      var equal = false

      for(var i=0; i< arr1.length; i++) {

        if(arr1[i] == arr2[j]) {
          equal = true
          break
        }

      }

      if (!equal) {
        matches.push(arr2[j])
      }

    }

    return matches
  }

  getUser = (uid) => {
    console.log(firebase.database().ref('users').child(uid).once('value')
      .then(snap => snap.val()))
    return firebase.database().ref('users').child(uid).once('value')
      .then(snap => snap.val())
  }

  getLastMesssages() {
    // firebase.database().ref('lastmessages').on('value', snap =>) {

    // }
  }

  getMatches = (uid) => {
    firebase.database().ref('relationships').child(uid).on('value', snap => {
    // firebase.database().ref('users').on('value', snap => {
      if(!this._mounted) return
      const relations = snap.val() || []
      const contacts = this.getOverlap(relations.liked, relations.likedBack)||[]
      const matches = this.getMatchess(relations.liked, relations.likedBack)||[]
      // console.log('allMatches', matches)

      if(contacts.length != 0) {
        console.log('allMatches', contacts)
        const promises = contacts.map(profileUid => {
          const foundProfile = _.find(this.state.contacts, profile => profile.uid === profileUid)
          return foundProfile ? foundProfile : this.getUser(profileUid)
        })

        // console.log('promises',promises)
        Promise.all(promises).then(data => this.setState({
          contactdataSource: this.state.contactdataSource.cloneWithRows(data),
          contacts: data,
        }))
      }

      if(matches.length != 0) {
        console.log('allMatches', matches)
        const promises1 = matches.map(profileUid => {
          const foundProfile = _.find(this.state.matches, profile => profile.uid === profileUid)
          return foundProfile ? foundProfile : this.getUser(profileUid)
        })
        // console.log('promises1', promises1)
        Promise.all(promises1).then(data => this.setState({
          matchdataSource: this.state.matchdataSource.cloneWithRows(data),
          matches: data,
        }))
      }
      
    })
    // console.log(uid)

    firebase.database().ref('lastmessages').child(uid).on('value', snap => {
      const values = _.values(snap.val() || [])
      const messages = []

      for (var i=0; i<values.length; i++) {
        if (values[i].text != null) {
          messages.push(values[i])
        }
      }

      if(!this._mounted) return
      this.setState({
        chatdataSource: this.state.chatdataSource.cloneWithRows(messages),
        messages: messages,
      })

    })
    
  }

  renderRow1 = (rowData) => {
    const {id, first_name, last_name, work, uid} = rowData.profile
    // const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    const {text} = rowData
    const {name} = rowData.user
    return (
      
        <View style={{flex:1,marginTop:5,paddingLeft:10, flexDirection:'row', backgroundColor:'white', height:70, alignItems:'center', borderWidth:1, borderColor:'rgb(240,240,240)'}} >
          <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', {userId:uid, currentUser:this.props.user})}>
          <CircleImage size={50} facebookID={id} imageURI={''} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1}}
          onPress={() => this.props.navigation.navigate('Chat', {user:this.props.user, profile:rowData.profile,})} >
            <View style={{justifyContent:'center', marginLeft:10}} >
              <Text style={{color: 'rgb(209,16,56)', fontFamily:'WorkSans-SemiBold', fontSize:14,}} >{first_name} {last_name}</Text>
              <Text multiline={false} style={{fontSize:10, lineHeight:18, color:'rgb(83,83,83)', marginTop:5}} >{text}</Text>
            </View>
          </TouchableOpacity>
        </View>
      
    )
  }

  renderRow2 = (rowData) => {
    const {id, first_name, last_name, bio, uid} = rowData
    // const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    return (
      
        <View style={{flex:1, paddingLeft:10, marginTop:5, flexDirection:'row', backgroundColor:'white', height:70, alignItems:'center', borderWidth:1, borderColor:'rgb(240,240,240)'}} >
          <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', {userId:uid, currentUser:this.props.user})}>
          <CircleImage size={50} facebookID={id} imageURI={''} />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1}}
          onPress={() => this.props.navigation.navigate('Chat', {user:this.props.user, profile:rowData,})} >
            <View style={{justifyContent:'center', marginLeft:10}} >
              <Text style={{color: 'rgb(209,16,56)', fontFamily:'WorkSans-SemiBold', fontSize:14,}} >{first_name} {last_name}</Text>
              <Text multiline={false} style={{fontSize:10, lineHeight:18, color:'rgb(83,83,83)', marginTop:5}}>{bio}</Text>
            </View>
          </TouchableOpacity>
        </View>
      
    )
  }

  accept(rowData) {
    console.log(rowData)
    const {uid} = rowData
    this.relate(this.props.user.uid, uid, true)
  }

  relate = (userUid, profileUid, status) => {
    let relationUpdate = {}
    relationUpdate[`${userUid}/liked/${profileUid}`] = status
    relationUpdate[`${profileUid}/likedBack/${userUid}`] = status

    firebase.database().ref('relationships').update(relationUpdate)
  }

  renderColumn = (rowData) => {
    const {id, first_name, last_name, uid} = rowData
    // const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    return (
      
          <View style={{justifyContent:'center', alignItems: 'center', width:90, height:100, padding:5}} >
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', {userId:uid, currentUser:this.props.user})}>
            <CircleImage size={50} facebookID={id} imageURI={''} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.accept(rowData)} >
              <Text style={{fontSize:10, paddingTop:5, color:'rgb(83,83,83)', fontFamily:'WorkSans-Regular'}} >{first_name} {last_name}</Text>
            </TouchableOpacity>
          </View>
      
    )
  }

  renderSeparator = (sectionID, rowID) => {
    return (
      <View key={rowID} style={{height:1, backgroundColor:'whitesmoke', marginLeft:100}} />
    )
  }

  changeSearch = (text) => {
    // console.log(text)
    // this.setState({searchText:text,})
    this.setState((prevState, props) => ({
      searchText: text,
    }));
    // this.searchText(text)
  }

  search() {
    var rows = [];
    console.log(this.state.searchText.toLowerCase())
    var newArray = this.state.db.slice();
    for(var i=0; i<newArray.length; i++) {
      
      var str = newArray[i].name.toLowerCase()
      
      if(str.indexOf(this.state.searchText.toLowerCase()) > -1) {

        rows.push(newArray[i])

      }
    }
  }

  onChats() {
    if (this.state.isChat) return

    this.swipRef.scrollBy(-1, false)
    this.setState(
      {
        isChat:true
      }
    )
  }

  onContacts() {
    if (!this.state.isChat) return
    this.swipRef.scrollBy(1, false)
        this.setState(
      {
        isChat:false
      }
    )
  }

  render() {
    return (

      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={
          <Menu closeDrawer={this.closeDrawer} />
        }
        acceptDoubleTap
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15}}}
        onOpen={() => {
          console.log('onopen')
          this.setState({drawerOpen: true})
        }}
        onClose={() => {
          console.log('onclose')
          this.setState({drawerOpen: false})
        }}
        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.08}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => {
          return 100
        }}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
        negotiatePan
        >
        {
          this.state.fontLoaded?
          <View style={{flex:1, backgroundColor: 'rgb(83, 83, 83)'}}>
            <View style={{flexDirection: 'row', height:70, backgroundColor: 'rgb(83, 83, 83)'}}>
                <TouchableOpacity onPress={() => this.state.drawerOpen ? this._drawer.close() : this._drawer.open()} style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                    <Image source={require('../assets/images/menu.png')} style={{resizeMode:'contain', width:20, height:20}}/>
                </TouchableOpacity> 
                <View style={{flex:1, height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize: 20, color: 'white', fontFamily:'AbrilFatface-Regular'}}> Chat </Text>
                </View>
                <TouchableOpacity style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                  <Image source={require('../assets/images/search.png')} style={{resizeMode:'contain', width:20, height:20}}/>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', height: 40, paddingLeft:20,}}>
                <TextInput 
                    underlineColorAndroid='transparent' 
                    multiline={false} 
                    onSubmitEditing={() => this.search()} 
                    returnKeyType='search' 
                    placeholder='Search...' 
                    autoCapitalize='none' 
                    placeholderTextColor={'rgb(83,83,83)'}
                    style={{flex:1,fontSize:14, fontFamily:'WorkSans-Light'}} 
                    onChangeText={this.changeSearch} />
            </View>
            <View style={{flexDirection: 'row', backgroundColor: 'white', paddingLeft: 20, paddingBottom:5,}}><Text style={{color: 'rgb(17,17,17)', fontSize:14, fontFamily:'WorkSans-Light'}}>Connection requests</Text><Text style={{color: 'rgb(209,16,56)', fontSize:14, fontFamily:'WorkSans-SemiBold', marginLeft:5,}}>({this.state.matches.length})</Text></View>
            <View style = {{height:100}}>
              <ListView
                style={{backgroundColor:'white',paddingLeft: 20, flex:1}}
                horizontal={true}
                dataSource={this.state.matchdataSource}
                renderRow={this.renderColumn}
                enableEmptySections={true} />
            </View>
            <View style={{flexDirection: 'row', padding:10, backgroundColor: 'white', padding: 10}}>
              <TouchableOpacity onPress={() => this.onChats()} style={{flex:1, justifyContent: 'center', alignItems:'center'}}><Text style={this.state.isChat ? {color: 'rgb(209,16,56)', fontFamily:'WorkSans-SemiBold', fontSize:14}:{color: 'rgb(17,17,17)', fontFamily:'WorkSans-Light', fontSize:14}}>Chats</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => this.onContacts()} style={{flex:1, justifyContent: 'center', alignItems:'center'}}><Text style={this.state.isChat ? {color: 'rgb(17,17,17)', fontFamily:'WorkSans-Light', fontSize:14}:{color: 'rgb(209,16,56)', fontFamily:'WorkSans-SemiBold', fontSize:14}}>Contacts</Text></TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', backgroundColor: 'white', paddingLeft: 20, paddingTop:15, paddingBottom:15}}><Text style={{color: 'rgb(17,17,17)', fontSize:14, fontFamily:'WorkSans-Light'}}>{this.state.isChat ? 'Messages' : 'Contacts'}</Text><Text style={{color: '#D11038', fontFamily:'WorkSans-SemiBold', marginLeft: 5}}>({this.state.isChat ? this.state.messages.length : this.state.contacts.length})</Text></View>
            <View style={{backgroundColor: 'white', paddingBottom:50,}}>
              <Swiper ref={(ref) => this.swipRef=ref} style={{backgroundColor:'white',}} height={height-300} showsButtons={false} scrollEnabled={false} dotColor='transparent' activeDotColor='transparent'>
                <View style={{flex: 1,}}>
                  <ListView
                    style={{backgroundColor:'white', paddingLeft: 10, paddingRight:10}}
                    dataSource={this.state.chatdataSource}
                    renderRow={this.renderRow1}
                    enableEmptySections={true}/>
                </View>
                <View style={{flex: 1,}}>
                  <ListView
                    style={{backgroundColor:'white', paddingLeft: 10, paddingRight:10}}
                    dataSource={this.state.contactdataSource}
                    renderRow={this.renderRow2}
                    enableEmptySections={true}/>
                </View>
              </Swiper>
              
            </View>
            
          </View>
          :<View/>
        }
        
        
      </Drawer>
      
    )
  }
}


