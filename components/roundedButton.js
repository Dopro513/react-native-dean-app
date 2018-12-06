import React, {Component} from 'react'
import Exponent, { Notifications, Font } from 'expo'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'


export default class RoundedButton extends Component {
  state={
    fontLoaded:false
  }

  componentWillMount() {
    this.fontLoad()
  }

  async fontLoad() {
    await Font.loadAsync({
      'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
      'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
      'AbrilFatface-Regular': require('../assets/fonts/AbrilFatface-Regular.ttf')
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
            this.state.fontLoaded?<Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(209,16,56)'}}>{this.props.text}</Text>
            :<Text style={{fontSize:14, color:'rgb(209,16,56)'}}>{this.props.text}</Text>
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
    borderColor: 'rgb(209,16,56)',
    borderWidth: 1,
    borderRadius: 50,
    marginLeft: 30,
    marginRight:30,
  },
  buttonContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  buttonText: {
    fontSize:15,
  },
})
