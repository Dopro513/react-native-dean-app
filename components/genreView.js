import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'

export default class GenreView extends Component {
  render() {
      
    if(this.props.genres.length >= 3) {
        return (
        <View style={{flexDirection:'row'}}>
            <View style={{alignItems:'center', justifyContent:'center', borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>{this.props.genres[0].name}</Text>
            </View>
            <View style={{alignItems:'center', marginLeft:10, justifyContent:'center', borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>{this.props.genres[1].name}</Text>
            </View>
            <View style={{alignItems:'center', marginLeft:10, justifyContent:'center', borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>{this.props.genres[2].name}</Text>
            </View>
        </View> 
        )
    }
    else if(this.props.genres.length == 2) {
        return (
        <View style={{flexDirection:'row'}}>
            <View style={{alignItems:'center', justifyContent:'center', borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>{this.props.genres[0].name}</Text>
            </View>
            <View style={{alignItems:'center', marginLeft:10, justifyContent:'center', borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>{this.props.genres[1].name}</Text>
            </View>
        </View>
        )
    }
    else if(this.props.genres.length == 1) {
        return (
        <View style={{flexDirection:'row'}}>
            <View style={{alignItems:'center', justifyContent:'center', borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>{this.props.genres[0].name}</Text>
            </View>
        </View>
        )
    }
  }
}

