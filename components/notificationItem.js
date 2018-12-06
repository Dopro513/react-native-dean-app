import React from 'react';
import Exponent, { Notifications, Font } from 'expo'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CircleImage from './circleImage'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height:80,
  },
  text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
  },
});

const Row = (props) => (

  <TouchableOpacity onPress={props.onPress}>
    <View style={styles.container}>
      <CircleImage imageURI={''} size={40} facebookID={props.user.id} />
      <Text style={styles.text}>
        {`${props.user.first_name+ " " +props.user.last_name}`} wants to collaborate and has sent you a connect request. Tap here to read {`${props.user.first_name+ " " +props.user.last_name}`} message
      </Text>
    </View>
  </TouchableOpacity>
);

export default Row;