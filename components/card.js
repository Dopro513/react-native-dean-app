import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  PanResponder,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

import moment from 'moment'
import CircleImage from '../components/circleImage'

const {width, height} = Dimensions.get('window')

export default class Card extends Component {
  componentWillMount() {

    console.log('card',this.props.profile)
    this.pan = new Animated.ValueXY()

    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: Animated.event([
        null,
        {dx:this.pan.x, dy:this.pan.y},
      ]),
      onPanResponderRelease: (e, {dx}) => {
        const absDx = Math.abs(dx)
        const direction = absDx / dx
        const swipedRight = direction > 0

        if (absDx > 120) {
          Animated.decay(this.pan, {
            velocity: {x:3 * direction, y:0},
            deceleration: 0.995,
          }).start(() => this.props.onSwipeOff(swipedRight, this.props.profile.uid))
        } else {
          Animated.spring(this.pan, {
            toValue: {x:0, y:0},
            friction: 4.5,
          }).start()
        }
      },
    })
  }

  render() {
    const {birthday, first_name, last_name, work, id, type, username, imgURL} = this.props.profile
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    const profileBday = moment(birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBday, 'years')
    const fbImage = imgURL == ''?`https://graph.facebook.com/${id}/picture?height=500`:imgURL

    const rotateCard = this.pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['10deg', '0deg', '-10deg'],
    })
    const animatedStyle = {
      transform: [
        {translateX: this.pan.x},
        {translateY: this.pan.y},
        {rotate: rotateCard},
      ],
    }

    return (
      <Animated.View
        {...this.cardPanResponder.panHandlers}
        style={[styles.card, animatedStyle]}>
        
        <Image
          style={{flex:1}}
          source={{uri: fbImage}}
        >
        <View style={{flex:1, justifyContent:'flex-end'}}>
          <View style={{flexDirection:'row', height:40, justifyContent:'flex-end'}}>
            <TouchableOpacity style={{backgroundColor:'rgb(83,83,83)', width:30, height:40, justifyContent:'center', alignItems:'center'}}>
              <Image source={require('../assets/images/menu1.png')} style={{width:15, height:15, resizeMode:'contain'}} />
            </TouchableOpacity>
          </View>
          <View style={{flex:1}}/>
          <View style={{borderRadius:20, marginLeft:5, marginRight:5, padding:15, height:80, backgroundColor: 'white', flexDirection:'row'}} >
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', {userId:this.props.profile.uid, currentUser:this.props.user})}>
            <CircleImage size={36} facebookID={id} imageURI={this.props.profile.imgURL} /> 
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <View style={{flex:1, flexDirection:'row', marginLeft: 15,}} >
                <View>
                  <Text style={{fontSize: 14, color:'rgb(17,17,17)',fontFamily:'WorkSans-Light'}}> {username} </Text>
                  <Text style={{fontSize:20, color:'rgb(17,17,17)',fontFamily:'AbrilFatface-Regular'}}> {type?type.name:''} </Text>
                  {type.name != 'Fan' ? <Text style={{fontSize:10, color:'rgb(39,206,169)',fontFamily:'WorkSans-Bold'}}> Visual Arts & Design </Text> : <View/>}
                </View>
                <View style={{flex: 1, flexDirection:'row', justifyContent:'flex-end'}}>
                  <Image source={require('../assets/images/img0.png')} style={{width:20, height:18, resizeMode:'contain'}} />
                  <Image source={require('../assets/images/menu_dots.png')} style={{width:15, height:15, resizeMode:'contain'}} />
                </View>
              </View>
              
            </View>
          </View>
          <TouchableOpacity>
            <View style={{borderRadius:20, height:40, margin:5, backgroundColor:'rgb(39,206,169)', flexDirection:'row', alignItems:'center'}}>
              <Image source={require('../assets/images/wind.png')} style={{width:20, height:18, marginLeft:10, resizeMode:'contain'}} />
              <Text style={{flex:1, textAlign:'center', fontSize:14, fontFamily:'WorkSans-Light', color:'white'}}>Rewind</Text>
              <Image style={{width:20, height:18, marginLeft:10, resizeMode:'contain'}} />
            </View>
          </TouchableOpacity>
        </View>
        </Image>
        
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.7,
    top: (height * 0.1) / 2,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 20,
  },
})
