import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'

export default class SkillView extends Component {
  render() {
      
    if(this.props.skills.length >= 3) {
        return (
        <View style={{flexDirection:'row'}}>
            <View style={{alignItems:'center', justifyContent:'center', borderColor:'black', borderWidth:0.5, borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>#{this.props.skills[0].name}</Text>
            </View>
            <View style={{alignItems:'center', marginLeft:10, justifyContent:'center', borderColor:'black', borderWidth:0.5, borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>#{this.props.skills[1].name}</Text>
            </View>
            <View style={{alignItems:'center', marginLeft:10, justifyContent:'center', borderColor:'black', borderWidth:0.5, borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>#{this.props.skills[2].name}</Text>
            </View>
        </View> 
        )
    }
    else if(this.props.skills.length == 2) {
        return (
        <View style={{flexDirection:'row'}}>
            <View style={{alignItems:'center', justifyContent:'center', borderColor:'black', borderWidth:0.5, borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>#{this.props.skills[0].name}</Text>
            </View>
            <View style={{alignItems:'center', marginLeft:10, justifyContent:'center', borderColor:'black', borderWidth:0.5, borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>#{this.props.skills[1].name}</Text>
            </View>
        </View>
        )
    }
    else if(this.props.skills.length == 1) {
        return (
        <View style={{flexDirection:'row'}}>
            <View style={{alignItems:'center', justifyContent:'center', borderColor:'black', borderWidth:0.5, borderRadius:20, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                <Text style={{color:'white', margin:5, fontSize:10,}}>#{this.props.skills[0].name}</Text>
            </View>
        </View>
        )
    }
  }
}

