import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'


export default class RedRoundedButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height:35,
    flex: 1,
    backgroundColor:'transparent',
    borderColor: 'rgb(209,16,56)',
    borderWidth: 1,
    borderRadius: 50,
  },
  buttonContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  buttonText: {
    fontSize:14,
    borderColor: 'rgb(209,16,56)',
    color:'rgb(209,16,56)'
  },
})
