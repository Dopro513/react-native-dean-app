import React, {Component} from 'react'
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
  Modal,
  StyleSheet,
  Picker,
} from 'react-native'
import moment from 'moment'
import Swiper from 'react-native-swiper'
import Drawer from 'react-native-drawer'
import CollectionView from 'react-native-collection'
import * as firebase from 'firebase'
import _ from 'lodash'
import Cell from '../components/collectionCell'

import CircleImage from '../components/circleImage'
import FacebookImage from '../components/facebookImage'
import Menu from './menu'
import BackButton from '../components/backButton'
import { ImagePicker } from 'expo'
import { NavigationActions } from 'react-navigation'
import DatePicker from 'react-native-datepicker'
import SelectItem from '../components/selectItem'
import Autocomplete from 'react-native-autocomplete-input'
import RoundedButton from '../components/roundedButton'
import PopupDialog from 'react-native-popup-dialog'
import {ActionSheet} from 'native-base'
import * as api from '../api/uploadAsync'

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


export default class EditProfile extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props);
    this.tapHandler = this.tapHandler.bind(this);
    this.rightHandler = this.rightHandler.bind(this);
    this.tapHandler = this.tapHandler.bind(this);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      showBio:false,
      showSkills:false,
      rootNav:this.props.navigation.state.params.rootNav,
      user: this.props.navigation.state.params.user,
      image: '',
      collection:0,
      age:'',
      date:this.props.navigation.state.params.user.birthday,
      isChecked:true,
      isCheckedUsername:true,
      modalVisible:false,
      dataSource: ds.cloneWithRows(require('../components/profileType.json')),
      db:require('../components/profileType.json'),
      selectedRole:this.props.navigation.state.params.user.type,
      userLocation:'London',
      stateVisuble:false,
      selectedStatus:'Signed',
      isSaved:true,
      genderVisible:false,
      selectedGender:this.props.navigation.state.params.user.gender,
      bio:this.props.navigation.state.params.user.bio,
      skills:this.props.navigation.state.params.user.skills||[],
      skillString:'',
      genres:this.props.navigation.state.params.user.genres,
      genresString:'',

      querySkills:require('../components/skills.json'),
      query:'',
      queryGenres:require('../components/genres.json'),
      queryG:'',

      username:this.props.navigation.state.params.user.username,
      firstname:this.props.navigation.state.params.user.first_name,
      lastname:this.props.navigation.state.params.user.last_name
    }
  }

  goBack =() => {
    const {navigation} = this.props;
    const {state} = navigation;
    let fetchUser = state.params.refresh;
    fetchUser();
    // console.log(fetchUser)
    navigation.goBack();
  }

  componentWillMount() {
    var userBirthday = moment(this.state.user.birthday, 'MM/DD/YYYY')
    var userAge = moment().diff(userBirthday, 'years')
    console.log(userAge)
    this.setState({
      age: userAge,
    })

    this.selectedItem(this.props.navigation.state.params.user.type)
    this.getSkills()
    this.getGenres()

    if(this.state.user.birthday == null) {
      this.setState({isChecked:false})
    }
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
        selectedRole:newArray[item.id],
      }
    )

    this.setState({
      db:newArray,
    })

    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newArray),
        modalVisible:false,
    });
  }

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

    let byteArray = this.convertToByteArray(result.base64);

    api.uploadAsByteArray(this.state.user.uid, byteArray, (progress) => {
      console.log(progress)
      this.setState({ progress })
    })

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

  uploadAsByteArray = async (pickerResultAsByteArray, progressCallback) => {
    
      try {
    
        var metadata = {
          contentType: 'image/jpeg',
        };
    
        let name = new Date().getTime() + "-media.jpg"
        var storageRef = firebase.storage().ref();
        var ref = storageRef.child('assets/' + name)
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
    
          // save a reference to the image for listing purposes
          var ref = firebase.database().ref('assets');
          ref.push({
            'URL': downloadURL,
            //'thumb': _imageData['thumb'],
            'name': name,
            //'coords': _imageData['coords'],
            'owner': firebase.auth().currentUser && firebase.auth().currentUser.uid,
            'when': new Date().getTime()
          })
        });
    
    
      } catch (ee) {
        console.log("when trying to load _uploadAsByteArray ", ee)
      }
    }

  profileStatus = (status) => {
      this.setState({ selectedStatus: status,
      stateVisuble: false })
   }

  GenderSelect = (gender) => {
      this.setState({ selectedGender: gender,
      genderVisible: false })
  }

  getSkills = () => {
    var skillString=''
    this.state.skills.map((skill) => {
      if(skillString == '') {
        skillString = '#'+skill.name
      } else {
        skillString = skillString+", #"+skill.name
      }
      
    })

    this.setState({
      skillString: skillString
    }) 
  }

  getGenres = () => {
    var genreString=''
    this.state.genres.map((genre) => {
      if(genreString == '') {
        genreString = '#'+genre.name
      } else {
        genreString = genreString+", #"+genre.name
      }
      
    })

    this.setState({
      genresString: genreString
    }) 
  }

  addSkills = (skill) => {
    var skillList = this.state.skills
    skill.selected = true
    skillList.push(skill)
    console.log(skillList)
    if(this.state.skillString == '') {
      var str = "#"+skill.name
      this.setState({
        skills:skillList,
        skillString: str,
        query: ''
      })
    }
    else {
      var str = this.state.skillString+", #"+skill.name
      this.setState({
        skills:skillList,
        skillString: str,
        query: ''
      })
    }
  }

  addGenres = (genre) => {
    var genreList = this.state.genres
    genre.selected = true
    genreList.push(genre)
    console.log(genreList)
    var str = this.state.genresString+", #"+genre.name
    this.setState({
      genres:genreList,
      genresString: str,
      queryG: ''
    })
  }

  saveUser = () => {
    if(this.state.selectedRole.name != 'Fan' && this.state.skills.length == 0) {
      //alert dialog
      this.popupDialog.show()
      return
    }

    const defaults = {
      skills:this.state.skills,
      genres:this.state.genres,
      bio:this.state.bio,
      status:this.state.selectedStatus,
      birthday:this.state.date,
      gender:this.state.selectedGender,
      location:this.state.userLocation,
      type:this.state.selectedRole,
      first_name:this.state.firstname,
      last_name:this.state.lastname,
      username:this.state.username,
    }
    firebase.database().ref('users').child(this.state.user.uid).update({...defaults})
    this.goBack()
  }

  static renderSkill(skill) {
    const { name } = skill;
    return (
      <View>
        <Text style={styles.titleText}>{name}</Text>
      </View>
    );
  }

  static renderGenre(genre) {
    const { name } = genre;
    return (
      <View>
        <Text style={styles.titleText}>{name}</Text>
      </View>
    );
  }
  findSkill(query) {
    if (query === '') {
      return [];
    }

    const { querySkills } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return querySkills.filter(skill => skill.name.search(regex) >= 0);
  }

  findGenre(query) {
    if (query === '') {
      return [];
    }

    const { queryGenres } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return queryGenres.filter(genre => genre.name.search(regex) >= 0);
  }

  onKeyPress = (key) => {
    console.log(key)
  }

  render() {
    const { query, queryG } = this.state;
    const skills = this.findSkill(query);
    const genres = this.findGenre(queryG);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
        <View style={{backgroundColor: 'rgb(83, 83, 83)', flex:1}}>
          <Modal animationType = {"slide"} transparent = {false}
               visible = {this.state.modalVisible}
               onRequestClose = {() => { console.log("Modal has been closed.") } }>
               <ListView
                    style={{flex: 1, marginLeft:25, marginRight:25, marginTop:20}}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(data) => <SelectItem {...data} onPress={() => this.selectedItem(data)} />}
                  />
          </Modal>
          <View style={{flexDirection: 'row', height:70, backgroundColor: 'rgb(83, 83, 83)'}}>
                <TouchableOpacity onPress={this.goBack} style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
                    <Image source={require('../assets/images/back.png')} style={{resizeMode:'contain', width:20, height:10}}/>
                </TouchableOpacity> 
                <View style={{flex:1, marginLeft:30, height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize: 20, color: 'white', fontFamily:'AbrilFatface-Regular'}}> My Profile </Text>
                </View>
                <TouchableOpacity style={{marginTop:20, height:50, width:70, alignItems:'center', marginRight:10, justifyContent:'center'}} onPress={this.saveUser}>
                  <Text style={{backgroundColor:'rgb(39,206,169)', textAlign:'center', fontFamily:'WorkSans-Light', overflow:'hidden', paddingTop:5, paddingBottom:5, width:70, borderRadius:13, fontSize:13, color:'white'}}>Save</Text>
                </TouchableOpacity>
            </View>
          <View style={{flex:1, backgroundColor:'white'}}>
            <ScrollView>
              <FacebookImage width={width} height={width} imageURI={this.state.image} facebookID={this.state.user.id} size={width}>
                <View style={{justifyContent:'flex-end', flex:1, }}>
                  <TouchableOpacity onPress={this._pickImage}><Image style={{width:40, height:40, marginLeft:10, marginBottom:10, resizeMode:'cover'}} source={require('../assets/images/upload.png')}/></TouchableOpacity>
                </View>
              </FacebookImage>
              <View style={{margin:15, backgroundColor:'white'}}>
                <View style={{flexDirection:'row', height:40, backgroundColor:'rgb(245,245,245)', paddingLeft:20, alignItems:'center'}}>
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)'}}>UserName:</Text>
                  <TextInput style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}} value={this.state.username} onChangeText={(text) => this.setState({username:text})} />
                </View>
                <View style={{flexDirection:'row', alignItems:'center', margin:10}}>
                  <TouchableOpacity onPress={() => this.setState({isCheckedUsername:!this.state.isCheckedUsername})} ><Image style={{width:15, height:15, resizeMode:'cover'}} source={this.state.isCheckedUsername? require('../assets/images/checked.png'):require('../assets/images/unchecked.png')}/></TouchableOpacity>
                  <View style={{width:10}}/>
                  <Text style={{flex:1, fontSize:10}}>Include on Profile</Text>
                </View>
                <View style={{flexDirection:'row', height:40, backgroundColor:'rgb(245,245,245)', paddingLeft:20, alignItems:'center'}}>
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)'}}>FirstName:</Text>
                  <TextInput style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}} value={this.state.firstname} onChangeText={(text) => this.setState({firstname:text})} />
                </View>
                <View style={{height:20}}/>
                <View style={{flexDirection:'row', height:40, backgroundColor:'rgb(245,245,245)', paddingLeft:20, alignItems:'center'}}>
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)'}}>LastName:</Text>
                  <TextInput style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}} value={this.state.lastname} onChangeText={(text) => this.setState({lastname:text})} />
                </View>
                <View style={{height:20}}/>
                <View style={{backgroundColor:'rgb(245,245,245)', height:40, flexDirection:'row'}}>
                  <TouchableOpacity style={{flex:1, height:40}} onPress={() => this.setState({modalVisible:true})}>
                    <View style={{flexDirection:'row', height:40, marginLeft:20, marginRight:20, alignItems:'center'}}>
                      <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)'}}>Role:</Text>
                      <Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}}>{this.state.selectedRole.name}</Text>
                      <Image source={require('../assets/images/rArrow_down.png')} style={{width:15, height:7, resizeMode:'cover'}} />
                    </View>
                  </TouchableOpacity>
                </View>
                {
                  this.state.selectedRole.name != 'Fan' ? <View style={{height:20}}/>:<View/>
                }
                {
                  this.state.selectedRole.name != 'Fan' && this.state.selectedRole.name != 'Business' ?
                  <View style={{backgroundColor:'rgb(245,245,245)', height:40, flexDirection:'row'}}>
                    <TouchableOpacity style={{flex:1, height:40}} onPress={() => this.setState({stateVisuble:!this.state.stateVisuble})}>
                      <View style={{flexDirection:'row', height:40, marginLeft:20, marginRight:20, alignItems:'center'}}>
                        <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)'}}>Profile Status:</Text>
                        <Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}}>{this.state.selectedStatus}</Text>
                        <Image source={require('../assets/images/rArrow_down.png')} style={{width:15, height:7, resizeMode:'cover'}} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  :<View/>
                }
                
                {this.state.stateVisuble?
                <View>
                  <Picker selectedValue = {this.state.selectedStatus} onValueChange={this.profileStatus}>
                    <Picker.Item label = "Signed" value = "Signed" />
                    <Picker.Item label = "Independent" value = "Independent" />
                    <Picker.Item label = "Staff" value = "Staff" />
                    <Picker.Item label = "Owner" value = "Owner" />
                  </Picker>
                </View>
                :
                <View/>
                }
                
                <View style={{height:20}}/>
                <View style={{flexDirection:'row', height:40, backgroundColor:'rgb(245,245,245)', paddingLeft:20, alignItems:'center'}}>
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)'}}>Home Location:</Text>
                  <TextInput style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}} value={this.state.userLocation} onChangeText={(text) => this.setState({userLocation:text})} />
                </View>
                <View style={{height:20}}/>
                <View style={{flexDirection:'row', backgroundColor:'rgb(245,245,245)', alignItems:'center', paddingLeft:20}}>
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)',}}>D.O.B:</Text>
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}}>{this.state.date}</Text>
                  <DatePicker
                    style={{height:40, width:25, marginRight:10}}
                    date={this.state.date}
                    mode="date"
                    placeholder="D.O."
                    format="MM/DD/YYYY"
                    minDate="01/01/1950"
                    maxDate="12/31/2000"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    iconSource={require('../assets/images/calendar.png')}
                    hideText={true}
                    customStyles={{
                      dateIcon: {
                        width: 20,
                        height: 20,
                        alignItems:'center'
                      },
                      dateInput: {
                        marginLeft: 10
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {this.setState({date: date})}}
                  />
                </View>
                <View style={{flexDirection:'row', alignItems:'center', margin:10}}>
                  <TouchableOpacity onPress={() => this.setState({isChecked:!this.state.isChecked})} ><Image style={{width:15, height:15, resizeMode:'cover'}} source={this.state.isChecked? require('../assets/images/checked.png'):require('../assets/images/unchecked.png')}/></TouchableOpacity>
                  <View style={{width:10}}/>
                  <Text style={{flex:1, fontSize:10}}>Include on Profile</Text>
                </View>
                <View style={{backgroundColor:'rgb(245,245,245)', height:40, flexDirection:'row'}}>
                  <TouchableOpacity style={{flex:1, height:40}} onPress={() => this.setState({genderVisible:!this.state.genderVisible})}>
                    <View style={{flexDirection:'row', height:40, marginLeft:20, marginRight:20, alignItems:'center'}}>
                      <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)'}}>Profile Type:</Text>
                      <Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)', flex:1}}>{this.state.selectedGender}</Text>
                      <Image source={require('../assets/images/rArrow_down.png')} style={{width:15, height:7, resizeMode:'cover'}} />
                    </View>
                  </TouchableOpacity>
                </View>
                {this.state.genderVisible?
                <View>
                  <Picker selectedValue = {this.state.selectedGender} onValueChange={this.GenderSelect}>
                    <Picker.Item label = "Male" value = "male" />
                    <Picker.Item label = "Female" value = "female" />
                  </Picker>
                </View>
                :
                <View/>
                }
                <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)', margin:10}}>Bio:</Text>
                <View style={{flexDirection:'row', padding:10, backgroundColor:'rgb(245,245,245)'}}>
                  <TextInput multiline={true} style={{flex:1, height:100, fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(83,83,83)',}} value={this.state.bio} onChangeText={(text) => this.setState({bio:text})}/>
                </View>
                <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)', margin:10}}>Genre:</Text>
                <View style={{flexDirection:'row', padding:10, backgroundColor:'rgb(245,245,245)'}}>
                  <TextInput editable={false} onKeyPress={this.onKeyPress} multiline={true} style={{flex:1, height:100, fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(209,16,56)'}} value={this.state.genresString}></TextInput>
                </View>
                <Autocomplete
                  autoCapitalize="none"
                  autoCorrect={false}
                  listStyle={{height:80}}
                  style={{padding:10, backgroundColor:'white', fontSize:11, borderWidth:0}}
                  data={genres.length === 1 && comp(queryG, genres[0].name) ? [] : genres}
                  defaultValue={queryG}
                  onChangeText={text => this.setState({ queryG: text })}
                  placeholder="Please enter to add keyword"
                  renderItem={(genre) => (
                    <TouchableOpacity onPress={() => this.addGenres(genre)}>
                      <Text style={styles.itemText}>
                        {genre.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {
                  this.state.selectedRole.name != 'Fan' ?
                  <Text style={{fontSize:14, fontFamily:'WorkSans-Bold', color:'rgb(83,83,83)', margin:10}}>Add Skills & Services:</Text>:<View/>
                }
                {
                  this.state.selectedRole.name != 'Fan' ?
                  <View style={{flexDirection:'row', padding:10, backgroundColor:'rgb(245,245,245)'}}>
                    <TextInput editable={false} onKeyPress={this.onKeyPress} multiline={true} style={{flex:1, height:100, fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(209,16,56)'}} value={this.state.skillString}></TextInput>
                  </View>:<View/>
                }
                {
                  this.state.selectedRole.name != 'Fan' ?
                  <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    listStyle={{height:80}}
                    style={{padding:10, backgroundColor:'white', fontSize:11, borderWidth:0}}
                    data={skills.length === 1 && comp(query, skills[0].name) ? [] : skills}
                    defaultValue={query}
                    onChangeText={text => this.setState({ query: text })}
                    placeholder="Please enter to add keyword"
                    renderItem={(skill) => (
                      <TouchableOpacity onPress={() => this.addSkills(skill)}>
                        <Text style={styles.itemText}>
                          {skill.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  /> : <View/>
                }
                
                
                <TouchableOpacity style={{height:40,
                  flex: 1,
                  backgroundColor:'transparent',
                  borderWidth: 1,
                  borderColor: '#D11038',
                  borderRadius: 50,
                  marginTop:20,
                  marginBottom: 30,}}>
                  <View style={{flex:1,
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'center',}}>
                    {/* <Icon name={'facebook-f'} size={18} color={'#D11038'} /> */}
                    <Text style={{fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(209,16,56)',}}>Upload Content</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{height:width}}>
                <CollectionView component={Cell}
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
          <PopupDialog width={width-30} height={200} ref={(popupDialog) => { this.popupDialog = popupDialog; }} >
              <View style={{flex: 1, alignItems:'center', justifyContent: 'center', margin:20,}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex:1}} />
                  <TouchableOpacity onPress={() => this.popupDialog.dismiss()}>
                  <Image source={require('../assets/images/close.png')} style={{width:15, height:15}} />
                  </TouchableOpacity>
                </View>
                <Text style={{fontSize:28, color:'rgb(83,83,83)', fontFamily:'AbrilFatface-Regular'}}>Wait</Text>
                
                <View style={{flexDirection:'row', alignItems:'center'}}>
                <Image source={require('../assets/images/lines.png')} style={{resizeMode: 'contain', height:7, margin:10,flex:0.8}} />
                </View>
                <Text style={{textAlign: 'center', fontSize:14, color: 'rgb(17,17,17)', fontFamily:'WorkSans-Light', marginBottom: 20}}> Select a minimum of 1 skill </Text>
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
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25
  },
  autocompleteContainer: {
    borderColor:'transparent'
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
    marginTop: 8
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  openingText: {
    textAlign: 'center'
  }
});
