import React, {Component} from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

const {width, height} = Dimensions.get('window')
export default class Cell extends Component {
  constructor(props){
    super(props);
  }
  render(){
    console.log(this.props.item)
    return(
        <Image source={this.props.item.img} style={{height:(width-10)/3, width:(width-10)/3, resizeMode:'contain'}}>
          <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <View style={{flexDirection:'row', flex:0.5,}}>
                <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row'}}>
                  <Image source={this.props.item.thumb} style={{width:20, height:20, marginTop:10, resizeMode:'contain'}}/>
                  <TouchableOpacity style={{alignItems:'center', width:20, height:20, marginTop:10, justifyContent:'center'}}>
                    <Image source={require('../assets/images/menu1.png')} style={{resizeMode:'contain', width:15, height:15}}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Image>
    );
  }
}
