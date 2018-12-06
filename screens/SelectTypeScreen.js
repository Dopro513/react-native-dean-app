import Exponent, { Notifications, Font } from 'expo'
import firebase from 'firebase'
import React, {Component} from 'react'
import {View, StyleSheet, TextInput, Text, TouchableOpacity, ListView, Alert, Image, Dimensions} from 'react-native'
import { NavigationActions } from 'react-navigation'
import SelectItem from '../components/selectItem'
import BackButton from '../components/backButton'
import RoundedButton from '../components/roundedButton'
import PopupDialog from 'react-native-popup-dialog'

const {width, height} = Dimensions.get('window')
export default class SelectType extends Component {

  static navigationOptions = {
    header: null,
  }
  
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(require('../components/profileType.json')),
      db:require('../components/profileType.json'),
      searchText: '',
      selected: null,
      fontLoaded:false,
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params.user)
    this.setState({
      user: this.props.navigation.state.params.user,
    })
    if (this.props.navigation.state.params.user.type != null) {
      this.selectedItem(this.props.navigation.state.params.user.type)
    }

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

  search() {
    var rows = [];
    console.log(this.state.searchText.toLowerCase())
    var newArray = this.state.db.slice();
    for(var i=0; i<newArray.length; i++) {
      
      var str = newArray[i].name.toLowerCase()
      
      if(str.indexOf(this.state.searchText.toLowerCase()) > -1) {

        rows.push(newArray[i])

      }
    }

    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rows),
    });
  }

  changeSearch = (text) => {
    // console.log(text)
    // this.setState({searchText:text,})
    this.setState((prevState, props) => ({
      searchText: text,
    }));
    this.searchText(text)
  }

  searchText(text) {
    var rows = [];
    console.log(text)
    var newArray = this.state.db.slice();
    for(var i=0; i<newArray.length; i++) {
      
      var str = newArray[i].name.toLowerCase()
      
      if(str.indexOf(text.toLowerCase()) > -1) {

        rows.push(newArray[i])

      }
    }

    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rows),
    });
  }

  selectedItem(item) {
    
    var newArray = this.state.db.slice();
    for(var i=0; i<newArray.length; i++) {
      newArray[i] = {
        id:i,
        name: newArray[i].name,
        selected: false,
      };
    }

    newArray[item.id] = {
      id:item.id,
      name: newArray[item.id].name,
      selected: newArray[item.id].selected == false ? true:false,
    };

    this.setState(
      {
        selected:newArray[item.id],
      }
    )

    this.setState({
      db:newArray,
    })

    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newArray),
    });
  }

  next() {
    if(this.state.selected == null) {
      this.popupDialog.show()
      // alert('Please select profile type!')
    } else {
      console.log(this.state.user)
      this.updateUser('type', this.state.selected)
      var user = this.state.user
      user.type=this.state.selected
      this.setState({
        user: user,
      })
      this.props.navigation.navigate('Genres', {user: this.state.user})
    }
  }

  updateUser = (key, value) => {
    const {uid} = this.state.user
    firebase.database().ref('users').child(uid)
      .update({[key]:value})
  }

  render() {
    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', justifyContent: 'space-around', flex: 1,}}>
                <View style={styles.topbar}>
                    <BackButton onPress={() => this.props.navigation.dispatch(NavigationActions.back())} /> 
                      {
                        this.state.fontLoaded?<Text style={{fontSize: 20, fontFamily:'AbrilFatface-Regular', color: 'rgb(74,74,74)', textAlign: 'center', flex:1,}}> Profile Type </Text>
                        :<Text style={{fontSize: 20, color: 'rgb(74,74,74)', textAlign: 'center', flex:1,}}> Profile Type </Text>
                      }
                    
                    <View style={{width: 50}}/>
                </View>
                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', height: 40, padding: 15,}}>
                  {
                    this.state.fontLoaded?
                    <TextInput 
                      underlineColorAndroid='transparent' 
                      multiline={false} 
                      onSubmitEditing={() => this.search()} 
                      returnKeyType='search' 
                      placeholder='Search...' 
                      autoCapitalize='none' 
                      placeholderTextColor={'rgb(83,83,83)'}
                      style={{flex:1,fontSize:14, fontFamily:'WorkSans-Light'}} 
                      onChangeText={this.changeSearch} />
                      :
                    <TextInput 
                      underlineColorAndroid='transparent' 
                      multiline={false} 
                      onSubmitEditing={() => this.search()} 
                      returnKeyType='search' 
                      placeholder='Search...' 
                      autoCapitalize='none' 
                      placeholderTextColor={'rgb(83,83,83)'}
                      style={{flex:1,fontSize:14,}} 
                      onChangeText={this.changeSearch} />
                  }
                </View>
                
                <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                  <ListView
                    style={{flex: 1, marginLeft:25, marginRight:25,}}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(data) => <SelectItem {...data} onPress={() => this.selectedItem(data)} />}
                  />
                </View>
            </View>
            <View style={{height:70, paddingBottom:25,flexDirection:'row', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center',}} >
              <RoundedButton color={'#D11038'} onPress={() => this.next()} text={'Continue'} />
            </View>
            <PopupDialog width={width-30} height={200} ref={(popupDialog) => { this.popupDialog = popupDialog; }} >
              <View style={{flex: 1, alignItems:'center', justifyContent: 'center', margin:20,}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex:1}} />
                  <TouchableOpacity onPress={() => this.popupDialog.dismiss()}>
                  <Image source={require('../assets/images/close.png')} style={{width:15, height:15}} />
                  </TouchableOpacity>
                </View>
                {
                  this.state.fontLoaded?<Text style={{fontSize:28, color:'rgb(83,83,83)', fontFamily:'AbrilFatface-Regular'}}>Wait</Text>
                  :<Text style={{fontSize:28, color:'rgb(83,83,83)',fontWeight: 'bold'}}>Wait</Text>
                }
                <View style={{flexDirection:'row', alignItems:'center'}}>
                <Image source={require('../assets/images/lines.png')} style={{resizeMode: 'contain', height:7, margin:10,flex:0.8}} />
                </View>
                {
                  this.state.fontLoaded?<Text style={{textAlign: 'center', fontSize:14, color: 'rgb(17,17,17)', fontFamily:'WorkSans-Light', marginBottom: 20}}> Select a minimum of 1 </Text>
                  :<Text style={{textAlign: 'center', fontSize:14, color: 'rgb(17,17,17)', marginBottom: 20}}> Select a minimum of 1 </Text>
                }
                
                <View style={{height:40, paddingLeft: 10, paddingRight: 10, flexDirection:'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} >
                  <RoundedButton color={'#D11038'} text={'Continue'} onPress={() => this.popupDialog.dismiss()}/>
                </View>
              </View>
            </PopupDialog>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,  
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  topbar: { 
    paddingTop:20,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
})
