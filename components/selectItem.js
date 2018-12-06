import React, {Component} from 'react'
import Exponent, { Notifications, Font } from 'expo'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height:60,
  },
  text: {
    flex: 1,
    paddingLeft: 35,
    fontSize: 14,
  },
});

export default class Row extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded:false,
    };
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
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.container}>
          {
            this.props.selected ? (
                <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
              ) : (
                <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
              )
          }
          {
            this.state.fontLoaded?
            <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
              {`${this.props.name}`}
            </Text>
            :
            <Text style={styles.text}>
              {`${this.props.name}`}
            </Text>
          }          
        </View>
        {
          this.props.name=='Fan'?
          <View style={{height:0.5, flex:1, marginLeft:10, marginRight:10, backgroundColor:'rgb(209,16, 56)'}}/>
          :<View/>
        }

      </TouchableOpacity>
    )
  }
}