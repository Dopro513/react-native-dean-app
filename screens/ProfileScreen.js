import React, {Component} from 'react'
import Exponent, { Notifications, Font } from 'expo'
import {
  ListView,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import moment from 'moment'
import Swiper from 'react-native-swiper'
import Drawer from 'react-native-drawer'
import CollectionView from 'react-native-collection'
import * as firebase from 'firebase'
import _ from 'lodash'
import Cell from '../components/collectionCell'
import PopupDialog from 'react-native-popup-dialog'
import CircleImage from '../components/circleImage'
import FacebookImage from '../components/facebookImage'
import Menu from './menu'
import BackButton from '../components/backButton'
import RatingView from '../components/ratingView'
import GenreView from '../components/genreView'
import SkilView from '../components/skillView'
import * as api from '../api/uploadAsync'

import { ImagePicker } from 'expo'

const {width, height} = Dimensions.get('window')
var dataSource = [
  {img:require('../assets/images/tmp2.png'),
  thumb:require('../assets/images/photo.png')},
  {img:require('../assets/images/tmp3.png'),
  thumb:require('../assets/images/music.png')},
  {img:require('../assets/images/tmp4.png'),
  thumb:require('../assets/images/camera.png')},
  {img:require('../assets/images/tmp2.png'),
  thumb:require('../assets/images/photo.png')},
  {img:require('../assets/images/tmp3.png'),
  thumb:require('../assets/images/music.png')},
  {img:require('../assets/images/tmp4.png'),
  thumb:require('../assets/images/camera.png')},
  {img:require('../assets/images/tmp2.png'),
  thumb:require('../assets/images/photo.png')},
  {img:require('../assets/images/tmp3.png'),
  thumb:require('../assets/images/music.png')},
  {img:require('../assets/images/tmp4.png'),
  thumb:require('../assets/images/camera.png')},
];


export default class ProfileScreen extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props);
    this.tapHandler = this.tapHandler.bind(this);
    this.rightHandler = this.rightHandler.bind(this);
    this.tapHandler = this.tapHandler.bind(this);
  }

  async fontLoad() {
    await Font.loadAsync({
      'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
      'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
      'AbrilFatface-Regular': require('../assets/fonts/AbrilFatface-Regular.ttf'),
      'WorkSans-Regular': require('../assets/fonts/WorkSans-Regular.ttf'),
      'WorkSans-Bold': require('../assets/fonts/WorkSans-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  state = {
    showBio:false,
    showSkills:false,
    showGenres:false,
    rootNav:this.props.navigation.state.params.rootNav,
    user: this.props.user,
    image: '',
    collection:0,
    age:'',
    fetched:false,
  }
  componentWillUnmount() {
  this._mounted = false;
  } 

  componentWillMount() {
    this._mounted = true;
    var userBirthday = moment(this.state.user.birthday, 'MM/DD/YYYY')
    var userAge = moment().diff(userBirthday, 'years')
    console.log(userAge)
    this.setState({
      age: userAge,
    })
    this.fetchUser()
    this.fontLoad()
    
  }

  fetchUser = () => {
    console.log('fetch data')
    firebase.database().ref('users').child(this.state.user.uid).on('value', (snap) => {
      console.log(snap.val())
      if(!this._mounted) return
      this.setState({
        user:snap.val()||{},
        fetched:true,
      })
    })

    firebase.database().ref('profile').child(this.state.user.uid).on('value', (snap) => {
      var img = snap.val()
      if (img == null || !this._mounted) return
      this.setState({
        image: img.URL,
      })
    })        
  }

  closeDrawer = () => {
    this._drawer.close()
  };

  openDrawer = () => {
    this._drawer.open()
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  showBio = () => {
    this.setState({
      showBio:!this.state.showBio,
    })
  }

  showSkills = () => {
    this.setState({
      showSkills:!this.state.showSkills,
    })
  }

  showGenres = () => {
    this.setState({
      showGenres:!this.state.showGenres,
    })
  }

  tapHandler(param){
    console.log('item tapped'+ param);
  }

  eftHandler(param){
    console.log('left button clicked');
  }
  rightHandler(param){
    console.log('right button clicked: ' + param);
  }

  _pickImage = async () => {

    console.log('sample test')

    // if (useCamera) {
    //   result = await ImagePicker.launchCameraAsync({
    //     allowsEditing: (Platform.OS === 'ios'),
    //     quality: .8,
    //     aspect: [1, 1],
    //     base64: true
    //   });
    // } else {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: .8, base64: true });
    // }


    console.log(result)

    if (!result.cancelled) {
      this.setState({image: result.uri})
    }

    // this._uploadAsByteArray(this.convertToByteArray(result.base64), (progress) => {
    //   console.log(progress)
    //   // this.setState({ progress })
    // })
  }

  _uploadAsByteArray = async (pickerResultAsByteArray, progressCallback) => {

    try {

      var metadata = {
        contentType: 'image/jpeg',
      };

      var storageRef = firebase.storage().ref();
      var ref = storageRef.child('images/mountains.jpg')
      let uploadTask = ref.put(pickerResultAsByteArray, metadata)

      uploadTask.on('state_changed', function (snapshot) {

        progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

      }, function (error) {
        console.log("in _uploadAsByteArray ", error)
      }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log("_uploadAsByteArray ", uploadTask.snapshot.downloadURL)
      });


    } catch (ee) {
      console.log("when trying to load _uploadAsByteArray ", ee)
    }
  }

  convertToByteArray = (input) => {
    var binary_string = this.atob(input);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes
  }
  
  _pickImageSource() {
    try {
      ActionSheet.show({
        options: [
          "Take Photo", "Pick From Album", "Cancel"
        ],
        cancelButtonIndex: 2,
        title: "Testing ActionSheet"
      }, buttonIndex => {
        // this 'buttonIndex value is a string on android and number on ios :-(
        console.log(buttonIndex)
        if (buttonIndex + "" === '0') {
          this._pickImage(true)
        } else if (buttonIndex + "" === '1') {
          this._pickImage(false)
        } else {
          console.log('nothing')
        }
      })
    } catch (ee) {
      console.log(ee)
    }
  }

  atob = (input) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }

  selectCell = (item) => {
    console.log(item)
  }

  collectionCell = (item) => {
    console.log(item)
    return(
      <View>
        <Image source={item.img} style={{height:(width-10)/3, width:(width-10)/3, resizeMode:'contain'}}>
          <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <View style={{flexDirection:'row', flex:0.5,}}>
                <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row'}}>
                  <Image source={item.thumb} style={{width:20, height:20, marginTop:10, resizeMode:'contain'}}/>
                  <TouchableOpacity style={{alignItems:'center', width:20, height:20, marginTop:10, justifyContent:'center'}}>
                    <Image source={require('../assets/images/menu1.png')} style={{resizeMode:'contain', width:15, height:15}}/>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Image>
      </View>
    )
  }

  render() {
    return (

    this.state.fetched?
          <Drawer
          ref={(ref) => this._drawer = ref}
          type="static"
          content={
            <Menu closeDrawer={this.closeDrawer} />
          }
          acceptDoubleTap
          styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15}}}
          onOpen={() => {
            console.log('onopen')
            this.setState({drawerOpen: true})
          }}
          onClose={() => {
            console.log('onclose')
            this.setState({drawerOpen: false})
          }}
          captureGestures={false}
          tweenDuration={100}
          panThreshold={0.08}
          disabled={this.state.drawerDisabled}
          openDrawerOffset={(viewport) => {
            return 100
          }}
          closedDrawerOffset={() => 0}
          panOpenMask={0.2}
          negotiatePan
          >
          {
            this.state.fontLoaded?
            <View style={{backgroundColor: 'rgb(83, 83, 83)', flex:1}}>
              <View style={{flexDirection: 'row', height:70, backgroundColor: 'rgb(83, 83, 83)'}}>
                  <TouchableOpacity onPress={() => this.state.drawerOpen ? this._drawer.close() : this._drawer.open()} style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                      <Image source={require('../assets/images/menu.png')} style={{resizeMode:'contain', width:20, height:20}}/>
                  </TouchableOpacity> 
                  <View style={{flex:1, height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
                      <Text style={{fontSize: 20, color: 'white', fontFamily:'AbrilFatface-Regular'}}> My Profile </Text>
                  </View>
                  <TouchableOpacity style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                    <Image source={require('../assets/images/menu1.png')} style={{resizeMode:'contain', width:20, height:20}}/>
                  </TouchableOpacity>
              </View>
              <View style={{backgroundColor:'white', height:height-120}}>
                <ScrollView style={{height:height-120}}>
                <FacebookImage width={width} height={width} imageURI={this.state.image} facebookID={this.state.user.id} size={width}>
                  <View style={{width:40, height: 40, backgroundColor:'rgba(83,83,83,0.2)', borderRadius:20, marginTop:20, marginLeft:10,
                    alignItems:'center', justifyContent:'center'}} >
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile', {user:this.state.user, refresh: this.fetchUser})}><Image style={{width:20, height:20, resizeMode:'cover'}} source={require('../assets/images/pen.png')}/></TouchableOpacity>
                      {/* <TouchableOpacity><Image style={{width:20, height:20, resizeMode:'cover', marginTop:20}} source={require('../assets/images/edit.png')}/></TouchableOpacity> */}
                  </View>
                  
                </FacebookImage>
                
                <View style={{
                  borderRadius:20, marginLeft:20, marginRight:20, padding:10, height:105, marginTop:-30, 
                  backgroundColor: 'white', flexDirection:'row', shadowColor:'#000', shadowOffset:{width:0, height:2}, shadowOpacity:0.8, shadowRadius:2}} >
                  <CircleImage size={40} facebookID={this.state.user.id} imageURI={this.state.image} /> 
                  <View style={{flex: 1}}>
                    <View style={{flex:1, flexDirection:'row', marginLeft: 15,}} >
                      <View>
                        <Text style={{fontSize: 14, color:'rgb(17,17,17)',fontFamily:'WorkSans-Light'}}> {this.state.user.first_name} {this.state.user.last_name} </Text>
                        <Text style={{fontSize:20, color:'rgb(17,17,17)',fontFamily:'AbrilFatface-Regular'}}> {this.state.user.type?this.state.user.type.name:''} </Text>
                        {this.state.user.type.name != 'Fan' ? <Text style={{fontSize:10, color:'rgb(39,206,169)',fontFamily:'WorkSans-Bold'}}> Visual Arts & Design </Text> : <View/>}
                      </View>
                      <View style={{flex: 1, flexDirection:'row', justifyContent:'flex-end'}}>
                        
                        <Image source={require('../assets/images/menu_dots.png')} style={{width:15, height:15, resizeMode:'contain'}} />
                      </View>
                    </View>
                    <View style={{flexDirection:'row', marginLeft:15,}}> 
                      <View style={{flex:1, backgroundColor:'rgba(200, 200, 200, 0.5)', height: 1.0,}} />
                    </View>
                    <View style={{flexDirection:'row',marginLeft: 15, marginTop:5}} >
                      <Text style={{fontSize: 10, margin:3, fontFamily:'WorkSans-Regular', color:'rgb(83,83,83)'}}> {this.state.user.gender} </Text>
                      <Text style={{fontSize: 10, margin:3, color:'rgb(39,206,169)', fontFamily:'WorkSans-Regular'}}> {this.state.age} </Text>
                      <Text style={{fontSize: 10, margin:3, fontFamily:'WorkSans-Regular', color:'rgb(83,83,83)'}}> {this.state.user.location?this.state.user.location:''} </Text>
                
                      {this.state.user.type.name != 'Fan' && this.state.user.type.name != 'Business' ?<Text style={{fontSize: 10, margin:3, fontFamily:'WorkSans-Regular', color:'rgb(83,83,83)'}}> {this.state.user.status?this.state.user.status:'Signed'} </Text>:<View/>}
                    </View>
                  </View>
                </View>
                {
                  this.state.user.type.name != 'Fan' ? 
                  <View style={{flexDirection: 'row', justifyContent:'center', margin: 20}}>
                    <RatingView rate={this.state.user.feedback?this.state.user.feedback:0}/>
                    <Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(17,17,17)'}}> {this.state.user.feedback?this.state.user.feedback:0}/5</Text>
                    <TouchableOpacity><Text style={{color: 'rgb(39,206,169)', fontSize:14, fontFamily:'WorkSans-Light', marginLeft: 30}}> View Feedback </Text></TouchableOpacity>
                  </View>
                  : <View/>
                }

                {
                  this.state.user.type.name != 'Fan' ?
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1, marginLeft:20, marginRight:20, height:0.5, backgroundColor:'rgba(200, 200, 200, 0.5)'}} />
                  </View>
                  :<View/>
                }
                
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                  <View/>
                  <View style={{alignItems:'center'}}>
                    <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(74,74,74)'}}>{this.state.user.posts?this.state.user.posts:0}</Text>
                    <Text style={{fontSize:10, fontFamily:'WorkSans-Regular', color:'rgb(209,16,56)'}}>Posts</Text>
                  </View>
                  <View style={{alignItems:'center'}}>
                    <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(74,74,74)'}}>{this.state.user.contacts?this.state.user.contacts:0}</Text>
                    <Text style={{fontSize:10, fontFamily:'WorkSans-Regular', color:'rgb(209,16,56)'}}>Contacts</Text>
                  </View>
                  <View style={{alignItems:'center'}}>
                    <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(74,74,74)'}}>{this.state.user.followers?this.state.user.followers:0}</Text>
                    <Text style={{fontSize:10, fontFamily:'WorkSans-Regular', color:'rgb(209,16,56)'}}>Followers</Text>
                  </View>
                  <View style={{alignItems:'center'}}>
                    <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(74,74,74)'}}>{this.state.user.following?this.state.user.following:0}</Text>
                    <Text style={{fontSize:10, fontFamily:'WorkSans-Regular', color:'rgb(209,16,56)'}}>Following</Text>
                  </View>
                  <View/>
                </View>
                <View style={{flexDirection:'row', marginTop:20, marginBottom:10}}>
                  <View style={{flex:1, marginLeft:20, marginRight:20, height:0.5, backgroundColor:'rgba(200, 200, 200, 0.5)'}} />
                </View>
                <View style={{alignItems:'center', flexDirection:'row'}}>
                  <TouchableOpacity style={{flex:1, marginLeft:30, marginRight:30, marginTop:10, marginBottom:10}} onPress={() => this.showBio()}>
                    <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                      <Text style={{fontSize:20, fontFamily:'AbrilFatface-Regular', color:'rgb(74,74,74)'}}>Bio</Text>
                      {
                        !this.state.showBio ? <Image source={require('../assets/images/arrow_up.png')} style={{width:15, height:10, resizeMode:'contain'}}/>
                        : <Image source={require('../assets/images/arrow_down.png')} style={{width:15, height:10, resizeMode:'contain'}}/>
                      }
                      
                    </View>
                  </TouchableOpacity>
                </View>
                
                {  !this.state.showBio ? 
                  <View/> :
                  <View style={{marginLeft:30, marginRight:30, marginTop:10,}}>
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(17,17,17)'}}>
                    {this.state.user.bio}  
                  </Text>
                </View>
                }
                
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:1, marginLeft:20, marginRight:20, marginTop:10, height:0.5, backgroundColor:'rgba(200, 200, 200, 0.5)'}} />
                </View>
                
                <View style={{alignItems:'center', flexDirection:'row'}}>
                  <TouchableOpacity style={{flex:1, marginLeft:30, marginRight:30, marginTop:20, marginBottom:10}} onPress={() => this.showGenres()}>
                    <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                      <Text style={{fontSize:20, fontFamily:'AbrilFatface-Regular', color:'rgb(74,74,74)'}}>Genres</Text>
                      {
                        !this.state.showGenres ? <Image source={require('../assets/images/arrow_up.png')} style={{width:15, height:10, resizeMode:'contain'}}/>
                        : <Image source={require('../assets/images/arrow_down.png')} style={{width:15, height:10, resizeMode:'contain'}}/>
                      }
                    </View>
                  </TouchableOpacity>
                </View>
                {
                  !this.state.showGenres ? <View/> :
                  <View style={{marginLeft:30, marginRight:30, marginTop:10}}>
                  <GenreView genres={this.state.user.genres?this.state.user.genres:[]}/>
                  </View>
                }
                {
                  this.state.user.type.name != 'Fan' ?
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1, marginLeft:20, marginRight:20, marginTop:10, height:0.5, backgroundColor:'rgba(200, 200, 200, 0.5)'}} />
                  </View>
                  :<View/>
                }
                {
                  this.state.user.type.name != 'Fan' ?
                  <View style={{alignItems:'center', flexDirection:'row'}}>
                  <TouchableOpacity style={{flex:1, marginLeft:30, marginRight:30, marginTop:20, marginBottom:10}} onPress={() => this.showSkills()}>
                      <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={{fontSize:20, fontFamily:'AbrilFatface-Regular', color:'rgb(74,74,74)'}}>Skills & Services</Text>
                        {
                          !this.state.showSkills ? <Image source={require('../assets/images/arrow_up.png')} style={{width:15, height:10, resizeMode:'contain'}}/>
                          : <Image source={require('../assets/images/arrow_down.png')} style={{width:15, height:10, resizeMode:'contain'}}/>
                        }
                      </View>
                    </TouchableOpacity>
                  </View>
                  :
                  <View/>
                }
                
                {
                  !this.state.showSkills ? <View/> :
                  <View style={{marginLeft:30, marginRight:30, marginTop:10}}>
                  <SkilView skills={this.state.user.skills?this.state.user.skills:[]}/>
                  </View>
                }
                
                <View style={{flexDirection:'row', marginTop:10, marginBottom:10}}>
                  <View style={{flex:1, marginLeft:20, marginRight:20, height:0.5, backgroundColor:'rgba(200, 200, 200, 0.5)'}} />
                </View>
                <View style={{flexDirection:'row', marginLeft:50, marginBottom:15}}>
                  <TouchableOpacity onPress={() => this.setState({collection:0})}><Image source={this.state.collection==0?require('../assets/images/sel_collection.png'):require('../assets/images/collection.png')} style={{width:25, height:25, resizeMode:'contain'}}/></TouchableOpacity>
                  <View style={{width:50}}/>
                  <TouchableOpacity onPress={() => this.setState({collection:1})}><Image source={this.state.collection==1?require('../assets/images/sel_list.png'):require('../assets/images/list.png')} style={{width:25, height:25, resizeMode:'contain'}}/></TouchableOpacity>
                  <View style={{width:50}}/>
                  <TouchableOpacity onPress={() => this.setState({collection:2})}><Image source={this.state.collection==2?require('../assets/images/sel_users.png'):require('../assets/images/users.png')} style={{width:25, height:25, resizeMode:'contain'}}/></TouchableOpacity>
                </View>
                <View style={{height:width}}>
                  <CollectionView component={this.collectionCell}
                    dataSource={dataSource}
                    selectionMode={false}
                    cellSize={
                              {
                                height:(width-10)/3,
                                width:(width-10)/3
                              }
                            }
                    editMode={false}
                    actions={
                            {cancel:
                              {
                                type:'text',
                                title:'Dismiss',
                                handler:this.leftHandler,
                                //icon:require('/send.png')
                              },
                              done:
                                {
                                  //type:'text',
                                  //title:'Done',
                                  handler:this.rightHandler,
                                  //icon:require('./send.png')
                                }
                            }
                            }
                    />
                </View>            
                </ScrollView>
              </View>
            </View>
            :<View/>
          }

        </Drawer>
        :
        <ActivityIndicator/>
    )
    
  }
}

