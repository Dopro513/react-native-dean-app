import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'

export default class SkillView extends Component {
  render() {
      return(
        <Text style={{lineHeight:30}}>
        {
            this.props.skills.map((skill, index) => {
                var width = skill.name.length*6 + 20
                return (
                    <View key={index} style={{width:width, height:20, flexDirection:'row'}}>
                        <View key={index} style={{alignItems:'center', justifyContent:'center', borderRadius:20, height:20, width:width-10, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                            <Text style={{color:'white', fontSize:10,}}>{skill.name}</Text>
                        </View>
                        <View style={{width:10, height:20}}/>
                    </View>
                )
            })
        }
        </Text> 
      )
    
    
  }
}

