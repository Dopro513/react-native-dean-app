import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'


export default class BackButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}>
        <View style={styles.buttonContainer}>
          <Image source={require('../assets/images/rBack.png')} style={styles.buttonImg} />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height:50,
    width:50,
    backgroundColor:'transparent',
  },
  buttonContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  buttonImg: {
    width:20,
    height:10,
    resizeMode: 'contain',
  },
})
