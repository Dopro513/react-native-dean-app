import React, {Component} from 'react'
import {
  View,
  Image,
  StyleSheet,
} from 'react-native'

export default class RatingView extends Component {
  
    render() {  
        if (this.props.rate == 0) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if(this.props.rate > 0 && this.props.rate < 1) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/half_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if (this.props.rate == 1) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if(this.props.rate > 1 && this.props.rate < 2) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/half_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if (this.props.rate == 2) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if(this.props.rate > 2 && this.props.rate < 3) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/half_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if (this.props.rate == 3) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if(this.props.rate > 3 && this.props.rate < 4) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/half_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if (this.props.rate == 4) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/white_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if(this.props.rate > 4 && this.props.rate < 5) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/half_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        } else if (this.props.rate == 5) {
            return (
            <View style={{flexDirection:'row'}}>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
                <Image source={require('../assets/images/red_star.png')} style={{width:15, marginLeft:5, height:15, resizeMode:'contain'}}/>
            </View>
            )
        }
    
  }
}
