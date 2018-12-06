import React, {Component} from 'react'
import {Image, PixelRatio} from 'react-native'

export default class FacebookImage extends Component {
  render() {
    const {size, facebookID, width, height, imageURI} = this.props
    const imageSize = PixelRatio.getPixelSizeForLayoutSize(size)
    const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`
    return (
      <Image
        source={{uri: imageURI == '' ? fbImage:imageURI}}
        style={{width:width, height:height, resizeMode:'contain'}}
      >
      {this.props.children}
      </Image>
    )
  }
}
