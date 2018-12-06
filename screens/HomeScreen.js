import Exponent from 'expo'
import React, {Component} from 'react'

import {View, TouchableOpacity, Image, Text} from 'react-native'
import * as firebase from 'firebase'
import GeoFire from 'geofire'

import Profile from './profile'
import Matches from './matches'

import Card from '../components/card'
import SimpleScroller from '../components/simpleScroller'

import filter from '../modules/filter'
import Drawer from 'react-native-drawer'
import Menu from './menu'


export default class HomeScreen extends Component {

  state = {
    profileIndex: 0,
    profiles: [],
    user: this.props.user,
  }

  static navigationOptions = {
    header: null,
  }

  closeDrawer = () => {
    this._drawer.close()
  };
  openDrawer = () => {
    this._drawer.open()
  };


  fetchUser = (uid) => {
    console.log('fetch data')
    firebase.database().ref('users').child(uid).on('value', (snap) => {
      console.log(snap.val())
      if(!this._mounted) return
      this.setState({
        user:snap.val()||{},
      })
    })
  }

  componentDidMount() { 
  this._mounted = true;
  }

  componentWillUnmount() {
  this._mounted = false;
  } 

  componentWillMount() {
    
    const {uid} = this.state.user
    this.updateUserLocation(uid)
    firebase.database().ref('users').child(uid).on('value', snap => {
      const user = snap.val()

      this.getProfiles(user.uid, user.distance)
    })

    this.fetchUser(uid)

  }

  getUser = (uid) => {
    return firebase.database().ref('users').child(uid).once('value')
  }

  getSwiped = (uid) => {
    return firebase.database().ref('relationships').child(uid).child('liked')
      .once('value')
      .then(snap => snap.val() || {})
  }

  getProfiles = async (uid, distance) => {
    // firebase.database().ref('geoData')
    const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
    const userLocation = await geoFireRef.get(uid)
    const swipedProfiles = await this.getSwiped(uid)
    // console.log('userLocation', userLocation)
    const geoQuery = geoFireRef.query({
      center: userLocation,
      radius: distance, //km
    })
    geoQuery.on('key_entered', async (uid, location, distance) => {
      // console.log(uid + ' at ' + location + ' is ' + distance + 'km from the center')
      const user = await this.getUser(uid)
      // if (user == null) return
      // console.log(user.val().first_name)
      const profiles = [...this.state.profiles, user.val()]
      // console.log('profile : ', profiles)
      const filtered = filter(profiles, this.state.user, swipedProfiles) || []
      console.log('filtered',filtered)
      if(filtered.length != 0) {
        if(this._mounted){
          this.setState({profiles: filtered})
        }
      }
    })
    
  }

  updateUserLocation = async (uid) => {
    const {Permissions, Location} = Exponent
    const {status} = await Permissions.askAsync(Permissions.LOCATION)
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
      // const {latitude, longitude} = location.coords
      const latitude = 37.39239 //demo lat
      const longitude = -122.09072 //demo lon

      const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
      geoFireRef.set(uid, [latitude, longitude])

      console.log('Permission Granted', location)
    } else {
      console.log('Permission Denied')
    }
  }

  relate = (userUid, profileUid, status) => {
    let relationUpdate = {}
    relationUpdate[`${userUid}/liked/${profileUid}`] = status
    relationUpdate[`${profileUid}/likedBack/${userUid}`] = status

    firebase.database().ref('relationships').update(relationUpdate)
  }

  nextCard = (swipedRight, profileUid) => {
    const userUid = this.state.user.uid
    var profile = this.state.profiles[this.state.profileIndex]
    this.setState({profileIndex: this.state.profileIndex + 1})
    if (swipedRight) {
      // this.relate(userUid, profileUid, true)
      this.props.rootNav.navigate('Chat', {user:this.props.user, profile:profile, invited:true})
    } else {
      this.relate(userUid, profileUid, false)
    }
  }

  cardStack = () => {
    const {profileIndex} = this.state
    return (
      <View style={{flex:1}}>
        {
          this.state.profiles.slice(profileIndex, profileIndex + 3).reverse().map((profile) => {
          return (
            <Card
              key={profile.id}
              profile={profile}
              user={this.state.user}
              navigation={this.props.rootNav}
              onSwipeOff={this.nextCard}
            />
          )
        })}
      </View>
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
      disabled={true}
      openDrawerOffset={(viewport) => {
        return 100
      }}
      closedDrawerOffset={() => 0}
      panOpenMask={0.2}
      negotiatePan
      >
      <View style={{flex:1, backgroundColor: 'rgb(83, 83, 83)'}}>
            <View style={{flexDirection: 'row', height:70, backgroundColor: 'rgb(83, 83, 83)'}}>
                {/* <TouchableOpacity onPress={() => this.state.drawerOpen ? this._drawer.close() : this._drawer.open()} style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                    <Image source={require('../assets/images/menu.png')} style={{resizeMode:'contain', width:20, height:20}}/>
                </TouchableOpacity>  */}
                <View style={{flex:1, height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize: 20, color: 'white', fontFamily:'AbrilFatface-Regular'}}> Feed </Text>
                </View>
                {/* <TouchableOpacity style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                  <Image source={require('../assets/images/search.png')} style={{resizeMode:'contain', width:20, height:20}}/>
                </TouchableOpacity> */}
            </View>
      <SimpleScroller
        screens={[
           <Profile user={this.state.user} />, 
           this.cardStack(), 
          //<Matches navigation={this.props.rootNav} user={this.state.user} />,
          ]}
      />
      </View>
      </Drawer>
    )
  }
}
