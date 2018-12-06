import React, {Component} from 'react'
import {
  Image,
  StyleSheet,
} from 'react-native'

export default class TopBar extends Component {
  render() {
    return (
    <Image source={require('../assets/images/topbar.png')} style={styles.backgroundImage}>
      {this.props.children}
    </Image>
    )
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
        height: 60,
        resizeMode: 'cover'
    },
})
