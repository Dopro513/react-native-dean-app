import React, {Component} from 'react'
import Exponent, { Notifications, Font } from 'expo'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'

export default class FacebookButton extends Component {
  state = {
    fontLoaded:false
  }

  componentWillMount() {
    this.fontLoad()
  }

  async fontLoad() {
    await Font.loadAsync({
      'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
      'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf')
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onPress}>
        <View style={styles.buttonContainer}>
          {
            this.state.fontLoaded?<Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'#D11038'}}>Login with Facebook</Text>
            :<Text style={{fontSize:14, color:'#D11038'}}>Log in with Facebook</Text>
          }
          
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
    borderWidth: 1,
    borderColor: '#D11038',
    borderRadius: 50,
    marginBottom: 30,
  },
  buttonContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  buttonText: {
    color:'#D11038',
    fontSize:15,
    marginLeft:15,
  },
})
