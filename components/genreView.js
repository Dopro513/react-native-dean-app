import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'

export default class GenreView extends Component {

    renderGen = () => {
        console.log(this.props.genres)
        this.props.genres.map((genre) => {
            var width = genre.name.length*12
            console.log(width)
            return(
                <View style={{alignItems:'center', justifyContent:'center', borderRadius:20, height:20, width:width, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                    <Text style={{color:'white', margin:5, fontSize:10,}}>{genre.name}</Text>
                </View>
            )
        })
    }

    render() {
        return (
            <Text style={{lineHeight:30}}>
                {
                    this.props.genres.map((genre, index) => {
                        var width = genre.name.length*6 + 20
                        return (
                            <View key={index} style={{width:width, height:20, flexDirection:'row'}}>
                                <View key={index} style={{alignItems:'center', justifyContent:'center', borderRadius:20, height:20, width:width-10, backgroundColor:'rgb(209, 16, 56)', overflow:'hidden'}}>
                                    <Text style={{color:'white', fontSize:10,}}>{genre.name}</Text>
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

