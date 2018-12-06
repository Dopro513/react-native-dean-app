import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import Swiper from 'react-native-swiper'
import Drawer from 'react-native-drawer'
import _ from 'lodash'
import * as firebase from 'firebase'
import Slider from 'react-native-multislider'
import CircleImage from '../components/circleImage'
import Autocomplete from 'react-native-autocomplete-input'

export default class Profile extends Component {

  state = {
    ageRangeValues: this.props.navigation.state.params.user.ageRange,
    distanceValue: [this.props.navigation.state.params.user.distance],
    showMen: this.props.navigation.state.params.user.showMen,
    showWomen: this.props.navigation.state.params.user.showWomen,
    people: require('../components/profile.json'),
    media: require('../components/media.json'),
    distance:this.props.navigation.state.params.user.unit == 'Km' ? Number((this.props.navigation.state.params.user.distance/805*100).toFixed(0))
    :Number((this.props.navigation.state.params.user.distance/500*100)),
    unit:this.props.navigation.state.params.user.unit,
    want:this.props.navigation.state.params.user.type.name == 'Fan' ? 'Media':'People',
    showAllDefault:true,
    showIndie:false,
    showSigned:false,
    showStaff:false,
    showOwner:false,
    genderAll:true,
    genderMale:false,
    genderFemale:false,
    genderBusiness:false,
    genderOther:false,
    controlAll:true,
    controlCustom:false,
    controlRecent:false,
    querySkills:require('../components/skills.json'),
    query:'',
    selectAll:false,
    selectAllMedia:false,
    skillString:'',
  }

  static navigationOptions = {
    header: null,
  }

  updateUser = (key, value) => {
    const {uid} = this.props.navigation.state.params.user
    firebase.database().ref('users').child(uid)
      .update({[key]:value})
  }

  selectedAll = (item) => {
    // console.log(item)
    item.allselected = !item.allselected
    // if(item.selectedAll) {
    //   item.selected = true
    // }
    for(var i=0;i<item.list.length;i++) {
      item.list[i].selected = item.allselected
    }
    if(this.state.want == 'Media') {
      var newArray = this.state.media
      newArray[item.id] = item
      this.setState({
        media:newArray
      })
    }
    else {
      var newArray = this.state.people
      newArray[item.id] = item
      this.setState({
        people:newArray
      })
    }
    
  }

  refreshData(arr) {
    if(this.state.want == 'Media'){
      // var arr = this.state.media
      var selectAllMedia = this.state.selectAllMedia

      for(var i=0;i<arr.length;i++) {
        var selectAll = arr[i].allselected
        for(var j=0;j<arr[i].list.length;i++) {
          if(arr[i].list[j].selected != selectAllMedia){
            selectAllMedia = !selectAllMedia
          }
          if(arr[i].list[j].selected != selectAll) {
            selectAll = !selectAll
          }
        }
        arr[i].allselected = selectAll
      }

      this.setState({
        selectAllMedia:selectAllMedia,
        media:arr,
      })
    }
    else {
      // var arr = this.state.people
      var selectAll = this.state.selectAll

      for(var i=0;i<arr.length;i++) {
        var selectAll = arr[i].allselected
        // console.log(arr[i])
        for(var j=0;j<arr[i].list.length;i++) {
          if(arr[i].list[j].selected != selectAll){
            selectAll = !selectAll
          }
          if(arr[i].list[j].selected != selectAll) {
            selectAll = !selectAll
          }
        }
        arr[i].allselected = selectAll
      }

      this.setState({
        selectAll:selectAll,
        people:arr,
      })
    }
    
  }

  goBack =() => {
    this.props.navigation.goBack()
    // const getProfiles = this.props.navigation.state.params.getProfiles;
    // getProfiles()
    
  }

  selectedCatetory = (item) => {

    // item.selected = !item.selected

    if(this.state.want == 'Media') {
      var newArray = this.state.media
      for(var i=0; i<newArray.length; i++) {
        newArray[i].selected = false
      }
      
      newArray[item.id].selected = !item.selected
      // console.log(newArray)
      
      this.setState({
        media:newArray
      })
    }
    else {
      var newArray = this.state.people
      for(var i=0; i<newArray.length; i++) {
        newArray[i].selected = false
      }
      newArray[item.id].selected = !item.selected
      // console.log(newArray)
      this.setState({
        people:newArray
      })
    }
    
  }

  selectedItem =(item) => {
    item.selected = !item.selected
    if(this.state.want == 'Media') {
      var newArray = this.state.media
      for(var i=0; i<newArray.length;i++) {
        for(var j=0; j<newArray[i].list.length; j++) {
          if(newArray[i].list[j].name == item.name) {
            newArray[i].list[j].selected = item.selected
          }
        }
      }
      var selectAllMedia = this.state.selectAllMedia
      
      for(var i=0;i<newArray.length;i++) {
        for(var j=0;j<newArray[i].list.length;j++) {
          if(newArray[i].list[j].selected == false){
            selectAllMedia = false
            newArray[i].allselected = false
          }
        }
      }

      this.setState({
        selectAllMedia:selectAllMedia,
        media:newArray,
      })
    }
    else {
      var newArray = this.state.people
      for(var i=0; i<newArray.length;i++) {
        for(var j=0; j<newArray[i].list.length; j++) {
          if(newArray[i].list[j].name == item.name) {
            newArray[i].list[j].selected = item.selected
          }
        }
      }

      var selectAll = this.state.selectAll
      
      for(var i=0;i<newArray.length;i++) {
        for(var j=0;j<newArray[i].list.length;j++) {
          if(newArray[i].list[j].selected == false){
            selectAll = false
            newArray[i].allselected = false
          }
        }
      }

      this.setState({
        selectAll:selectAll,
        people:newArray,
      })
    }
  }

  findSkill(query) {
    if (query === '') {
      return [];
    }

    const { querySkills } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return querySkills.filter(skill => skill.name.search(regex) >= 0);
  }

  addSkills = (skill) => {

    if(this.state.skillString == '') {
      var str = "#"+skill.name
      this.setState({
        skillString: str,
        query: ''
      })
    }
    else {
      var str = this.state.skillString+", #"+skill.name
      this.setState({
        skillString: str,
        query: ''
      })
    }
  }

  selectAll = () => {

    if(this.state.want == 'Media') {
      var newArray = this.state.media
      
          for(var i=0; i<newArray.length;i++) {
            newArray[i].allselected = !this.state.selectAllMedia
            for(var j=0; j<newArray[i].list.length; j++) {
              newArray[i].list[j].selected = !this.state.selectAllMedia
            }
          }
      
          this.setState({
            media:newArray,
            selectAllMedia:!this.state.selectAllMedia,
          })
    }
    else {
      var newArray = this.state.people
      
          for(var i=0; i<newArray.length;i++) {
            newArray[i].allselected = !this.state.selectAll
            for(var j=0; j<newArray[i].list.length; j++) {
              newArray[i].list[j].selected = !this.state.selectAll
            }
          }
      
          this.setState({
            people:newArray,
            selectAll:!this.state.selectAll,
          })
    }
    
  }

  changeUnit = (unit) => {
    if(this.state.unit == unit) return
    if(unit == 'Km'){
      this.setState({
        unit:unit,
      })
      this.updateUser('unit', 'Km')
      this.updateUser('distance', Number((this.state.distance*8.05).toFixed(0)))
    } else {
      this.setState({
        unit:unit,
      })
      this.updateUser('unit', 'Mi')
      this.updateUser('distance', this.state.distance*5)
    }
  }

  render() {
    const {first_name, work, id} = this.props.navigation.state.params.user
    const {ageRangeValues, distanceValue, showMen, showWomen, distance, unit, want} = this.state
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    const { query } = this.state;
    const skills = this.findSkill(query);
    
    // console.log(this.state.distance)
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', height:70, backgroundColor: 'rgb(83, 83, 83)'}}>
          <TouchableOpacity onPress={this.goBack} style={{alignItems:'center', width:50, height:50, marginTop:20, justifyContent:'center'}}>
              <Image source={require('../assets/images/back.png')} style={{resizeMode:'contain', width:20, height:10}}/>
          </TouchableOpacity> 
          
          <View style={{flex:1, height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize: 20, color: 'white', fontFamily:'AbrilFatface-Regular'}}> Filter </Text>
          </View>
          <View style={{width:50, height:50}}/>
        </View>
        <ScrollView style={{flex:1}}>
          <Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30, marginLeft:20, marginTop:20, color:'rgb(74,74,74)'}}> Swiping in: </Text>
          <Text style={{fontFamily:'WorkSans-Light', fontSize:14, lineHeight:20, marginLeft:20, marginTop:10, color:'rgb(209,16,56)'}}> My Current Location </Text>
          <View style={{height:1, marginTop:15, flexDirection:'row', marginLeft:20, marginRight:20}}>
            <View style={{height:1, flex:1, backgroundColor:'rgb(242,242,242)'}}/>
          </View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30,marginTop:15, marginLeft:20, color:'rgb(74,74,74)'}}>Search Distance:</Text>
            <Text style={{fontFamily:'WorkSans-SemiBold', fontSize:14, lineHeight:24, marginTop:21, color:'rgb(213,213,213)'}}> {this.state.unit == 'Mi'?(distance*5):Number((distance*8.05).toFixed(0))}{unit}</Text>
          </View>
          <Slider
            min={0}
            max={100}
            values={[distance]}
            onValuesChange={val => this.setState({distance:val[0]})}
            onValuesChangeFinish={val => this.updateUser('distance', this.state.unit == 'Mi'?(distance*5):Number((distance*8.05).toFixed(0)))}
            defaultTrackColor='red'
            rangeColor={'pink'}
            leftThumbColor={'blue'}
          />

          <View style={{height:1, marginTop:20, flexDirection:'row', marginLeft:20, marginRight:20}}>
            <View style={{height:1, flex:1, backgroundColor:'rgb(242,242,242)'}}/>
          </View>
          <Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30, marginLeft:20, marginTop:20, color:'rgb(74,74,74)'}}> Search Distance in: </Text>
          <View style={{flexDirection:'row', height:40, justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity onPress={() => this.changeUnit('Km')}>
              {
                this.state.unit != 'Km' ?
                <Text style={{fontFamily:'WorkSans-Light', textAlign:'center', textAlignVertical:'center', fontSize:14, width:100, lineHeight:20, color:'rgb(17,17,17)'}}>Km</Text>
                : <Text style={{fontFamily:'WorkSans-SemiBold', textAlign:'center', textAlignVertical:'center', borderBottomColor:'rgb(209,16,56)', borderBottomWidth:1, fontSize:14, width:100, lineHeight:20, color:'rgb(209,16,56)'}}>Km</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.changeUnit('Mi')}>
              {
                this.state.unit == 'Mi'?
                <Text style={{fontFamily:'WorkSans-SemiBold', textAlign:'center', textAlignVertical:'center', borderBottomColor:'rgb(209,16,56)', borderBottomWidth:1, fontSize:14, width:100, lineHeight:20, color:'rgb(209,16,56)'}}>Mi</Text>
                : <Text style={{fontFamily:'WorkSans-Light', textAlign:'center', textAlignVertical:'center', fontSize:14, width:100, lineHeight:20, color:'rgb(17,17,17)'}}>Mi</Text>
              }
            </TouchableOpacity>
          </View>
          <View style={{height:1, flexDirection:'row', marginLeft:20, marginRight:20}}>
            <View style={{height:1, flex:1, backgroundColor:'rgb(242,242,242)'}}/>
          </View>
          <Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30, marginLeft:20, marginTop:20, color:'rgb(74,74,74)'}}> Looking for: </Text>
          <View style={{flexDirection:'row', height:40, justifyContent:'center', alignItems:'center'}}>
            {
              this.props.navigation.state.params.user.type.name == 'Fan' ? <View/>:
              <TouchableOpacity onPress={() => this.setState({want:'People'})}>
              {
                this.state.want == 'People'?
                <Text style={{fontFamily:'WorkSans-SemiBold', textAlign:'center', textAlignVertical:'center', borderBottomColor:'rgb(209,16,56)', borderBottomWidth:1, fontSize:14, width:100, lineHeight:20, color:'rgb(209,16,56)'}}>People</Text>
                : <Text style={{fontFamily:'WorkSans-Light', textAlign:'center', textAlignVertical:'center', fontSize:14, width:100, lineHeight:20, color:'rgb(17,17,17)'}}>People</Text>
              }
              
            </TouchableOpacity>
            }
            
            <TouchableOpacity onPress={() => this.setState({want:'Media'})}>
              {
                this.state.want == 'Media'?
                <Text style={{fontFamily:'WorkSans-SemiBold', textAlign:'center', textAlignVertical:'center', borderBottomColor:'rgb(209,16,56)', borderBottomWidth:1, fontSize:14, width:100, lineHeight:20, color:'rgb(209,16,56)'}}>Media</Text>
                : <Text style={{fontFamily:'WorkSans-Light', textAlign:'center', textAlignVertical:'center', fontSize:14, width:100, lineHeight:20, color:'rgb(17,17,17)'}}>Media</Text>                
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Warning','Oops, we haven’t finished this yet, we’ll let you know as soon as we launch this feature')}>
              {
                this.state.want == 'Things'?
                <Text style={{fontFamily:'WorkSans-SemiBold', textAlign:'center', textAlignVertical:'center', borderBottomColor:'rgb(209,16,56)', borderBottomWidth:1, fontSize:14, width:100, lineHeight:20, color:'rgb(209,16,56)'}}>{this.props.navigation.state.params.user.type.name == 'Fan' ? 'Events':'Classifieds'}</Text>
                : <Text style={{fontFamily:'WorkSans-Light', textAlign:'center', textAlignVertical:'center', fontSize:14, width:100, lineHeight:20, color:'rgb(17,17,17)'}}>{this.props.navigation.state.params.user.type.name == 'Fan' ? 'Events':'Classifieds'}</Text>                                
              }
              
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.selectAll()}>
              <View style={styles.container1}>
                {
                  this.state.want == 'Media'?
                  this.state.selectAllMedia ? (
                    <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                    <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                    :
                    this.state.selectAll ? (
                    <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                    <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}> All </Text> 
              </View>
            </TouchableOpacity>
            <View style={{flexDirection:'row'}}>
              <View style={{height:1, flex:1, marginLeft:15, marginRight:15, backgroundColor:'rgb(209,16,56)'}}/>
            </View>
          </View>
          {
            this.state.want == 'Media' ?
            <View>
            {
              this.state.media.map((item, index) => {
                
                if(item.selected == true) {
                  return(
                    <View key={item.id}>
                    
                      <View>
                      <View style={styles.container1}>
                        {
                          item.allselected ? (
                            <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                            ) : (
                              <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                            )
                        }
                        {
                          <TouchableOpacity onPress={() => this.selectedCatetory(item)}>
                            <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                              {`${item.name}`}
                            </Text>
                          </TouchableOpacity>
                        }       
                        <View style={{flex:1}}/>
                        {
                          <Image source={require('../assets/images/arrow_down.png')} style={{width:10, height:6, resizeMode:'contain', marginRight:30}}/>
                        }    
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <View style={{height:1, flex:1, marginLeft:15, marginRight:15, backgroundColor:'rgb(213,213,213)'}}/>
                      </View>
                      </View>
                    
                    {
                      item.list.map((item, index) => {
                        return(
                          <TouchableOpacity key={item.id} onPress={() => this.selectedItem(item)}>
                            <View style={styles.container2}>
                              {
                                item.selected ? (
                                    <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                                  ) : (
                                    <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                                  )
                              }
                              {
                                <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                                  {`${item.name}`}
                                </Text>
                              }          
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    }
                    </View>
                    
                  )
                  
                  
                }
                else {
                  return(
                    
                      <View key={item.id}>
                        <View style={styles.container1}>
                          {
                            item.allselected ? (
                              <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                              ) : (
                              <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                              )
                          }
                          {
                            <TouchableOpacity onPress={() => this.selectedCatetory(item)}>
                              <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                                {`${item.name}`}
                              </Text>
                            </TouchableOpacity>
                          }         
                          <View style={{flex:1}}/>
                          {
                            <Image source={require('../assets/images/arrow_up.png')} style={{width:10, height:6, resizeMode:'contain', marginRight:30}}/>
                          } 
                        </View>
                        <View style={{flexDirection:'row'}}>
                          <View style={{height:1, flex:1, marginLeft:15, marginRight:15, backgroundColor:'rgb(213,213,213)'}}/>
                        </View>
                      </View>
                  )
                  
                }
              })
            }
            </View>
            :
            <View>
            {
              this.state.people.map((item, index) => {
                
                if(item.selected == true) {
                  return(
                    <View key={item.id}>
                    
                      <View>
                      <View style={styles.container1}>
                        {
                          item.allselected ? (
                            <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                            ) : (
                              <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                            )
                        }
                        {
                          <TouchableOpacity onPress={() => this.selectedCatetory(item)}>
                            <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                              {`${item.name}`}
                            </Text>
                          </TouchableOpacity>
                        }       
                        <View style={{flex:1}}/>
                        {
                          <Image source={require('../assets/images/arrow_down.png')} style={{width:10, height:6, resizeMode:'contain', marginRight:30}}/>
                        }    
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <View style={{height:1, flex:1, marginLeft:15, marginRight:15, backgroundColor:'rgb(213,213,213)'}}/>
                      </View>
                      </View>
                    
                    {
                      item.list.map((item, index) => {
                        return(
                          <TouchableOpacity key={item.id} onPress={() => this.selectedItem(item)}>
                            <View style={styles.container2}>
                              {
                                item.selected ? (
                                    <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                                  ) : (
                                    <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                                  )
                              }
                              {
                                <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                                  {`${item.name}`}
                                </Text>
                              }          
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    }
                    </View>
                    
                  )
                  
                  
                }
                else {
                  return(
                    
                      <View key={item.id}>
                        <View style={styles.container1}>
                          {
                            item.allselected ? (
                              <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                              ) : (
                              <TouchableOpacity onPress={() => this.selectedAll(item)}><Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/></TouchableOpacity>
                              )
                          }
                          {
                            <TouchableOpacity onPress={() => this.selectedCatetory(item)}>
                              <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                                {`${item.name}`}
                              </Text>
                            </TouchableOpacity>
                          }         
                          <View style={{flex:1}}/>
                          {
                            <Image source={require('../assets/images/arrow_up.png')} style={{width:10, height:6, resizeMode:'contain', marginRight:30}}/>
                          } 
                        </View>
                        <View style={{flexDirection:'row'}}>
                          <View style={{height:1, flex:1, marginLeft:15, marginRight:15, backgroundColor:'rgb(213,213,213)'}}/>
                        </View>
                      </View>
                  )
                  
                }
              })
            }
            </View>
          }

          <Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30, marginLeft:20, marginTop:20, color:'rgb(74,74,74)'}}> Profile Status: </Text>
          <View>
            <TouchableOpacity onPress={() => this.setState({showAllDefault:true, showIndie:false, showSigned:false, showStaff:false, showOwner:false})}>
              <View style={styles.container1}>
                {
                  this.state.showAllDefault ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                    All - default
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({showAllDefault:false, showIndie:true, showSigned:false, showStaff:false, showOwner:false})}>
              <View style={styles.container1}>
                {
                  this.state.showIndie ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                   Indie
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({showAllDefault:false, showIndie:false, showSigned:true, showStaff:false, showOwner:false})}>
              <View style={styles.container1}>
                {
                  this.state.showSigned ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                   Signed
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({showAllDefault:false, showIndie:false, showSigned:false, showStaff:true, showOwner:false})}>
              <View style={styles.container1}>
                {
                  this.state.showStaff ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                   Staff
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({showAllDefault:false, showIndie:false, showSigned:false, showStaff:false, showOwner:true})}>
              <View style={styles.container1}>
                {
                  this.state.showOwner ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                   Owner
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View style={{height:1, flexDirection:'row', marginLeft:20, marginRight:20}}>
            <View style={{height:1, flex:1, backgroundColor:'rgb(242,242,242)'}}/>
          </View>
          <Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30, marginLeft:20, marginTop:20, color:'rgb(74,74,74)'}}> Gender: </Text>
          <View>
            <TouchableOpacity onPress={() => this.setState({genderAll:true, genderFemale:false, genderMale:false, genderBusiness:false, genderOther:false})}>
              <View style={styles.container1}>
                {
                  this.state.genderAll ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                    All - default
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({genderAll:false, genderFemale:true, genderMale:false, genderBusiness:false, genderOther:false})}>
              <View style={styles.container1}>
                {
                  this.state.genderFemale ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                   Female
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({genderAll:false, genderFemale:false, genderMale:true, genderBusiness:false, genderOther:false})}>
              <View style={styles.container1}>
                {
                  this.state.genderMale ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                    Male
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({genderAll:false, genderFemale:false, genderMale:false, genderBusiness:true, genderOther:false})}>
              <View style={styles.container1}>
                {
                  this.state.genderBusiness ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                    Business
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({genderAll:false, genderFemale:false, genderMale:false, genderBusiness:false, genderOther:true})}>
              <View style={styles.container1}>
                {
                  this.state.genderOther ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                    Other
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          {
            this.state.want == 'Media' || this.props.navigation.state.params.user.type.name=='Fan'?<View/>:
            <View style={{height:1, flexDirection:'row', marginLeft:20, marginRight:20}}>
              <View style={{height:1, flex:1, backgroundColor:'rgb(242,242,242)'}}/>
            </View>
          }
          
          {
            this.state.want == 'Media' || this.props.navigation.state.params.user.type.name=='Fan'?<View/>:<Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30, marginLeft:20, marginTop:20, color:'rgb(74,74,74)'}}> Skills & Services: </Text>
          }
          {
            this.state.want == 'Media' || this.props.navigation.state.params.user.type.name=='Fan'?<View/>
            :<View style={{margin:20}}>
            <Autocomplete
              autoCapitalize="none"
              autoCorrect={false}
              listStyle={{height:80}}
              style={{padding:10, backgroundColor:'rgb(250,250,250)', fontSize:14, borderWidth:0}}
              data={skills.length === 1 && comp(query, skills[0].name) ? [] : skills}
              defaultValue={query}
              onChangeText={text => this.setState({ query: text })}
              placeholder="Search by Skills & Services..."
              renderItem={(skill) => (
                <TouchableOpacity onPress={() => this.addSkills(skill)}>
                  <Text style={styles.itemText}>
                    {skill.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          }
          
          <View style={{flexDirection:'row', margin:20, backgroundColor:'transparent'}}>
            <TextInput editable={false} onKeyPress={this.onKeyPress} multiline={true} style={{flex:1, fontSize:14, fontFamily:'WorkSans-Light', color:'rgb(209,16,56)'}} value={this.state.skillString}></TextInput>
          </View>
          <View style={{height:1, flexDirection:'row', marginLeft:20, marginRight:20}}>
            <View style={{height:1, flex:1, backgroundColor:'rgb(242,242,242)'}}/>
          </View>
          <Text style={{fontFamily:'AbrilFatface-Regular', fontSize:20, lineHeight:30, marginLeft:20, marginTop:20, color:'rgb(74,74,74)'}}> Control Who You See: </Text>
          <View>
            <TouchableOpacity onPress={() => this.setState({controlAll:true, controlCustom:false, controlRecent:false})}>
              <View style={styles.container1}>
                {
                  this.state.controlAll ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                    All - default
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({controlAll:false, controlCustom:true, controlRecent:false})}>
              <View style={styles.container1}>
                {
                  this.state.controlCustom ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                   Custom Search Settings
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.setState({controlAll:false, controlCustom:false, controlRecent:true})}>
              <View style={styles.container1}>
                {
                  this.state.controlRecent ? (
                      <Image source={require('../assets/images/checked.png')} style={{width:16, height:16}}/>
                    ) : (
                      <Image source={require('../assets/images/unchecked.png')} style={{width:16, height:16}}/>
                    )
                }
                {
                  <Text style={{fontFamily:'WorkSans-Light', fontSize:14, color:'rgb(17,17,17)', paddingLeft:35}}>
                    Recently Active
                  </Text>
                }          
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.profile}>
            <CircleImage imageURI={''} facebookID={id} size={120} />
            <Text style={{fontSize:20}}>{first_name}</Text>
            <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
          </View>
          <View style={styles.label}>
            <Text>Distance</Text>
            <Text style={{color:'darkgrey'}}>{distanceValue}km</Text>
          </View>
          <Slider
            min={1}
            max={30}
            values={distanceValue}
            onValuesChange={val => this.setState({distanceValue:val})}
            onValuesChangeFinish={val => this.updateUser('distance', val[0])}
          />
          <View style={styles.label}>
            <Text>Age Range</Text>
            <Text style={{color:'darkgrey'}}>{ageRangeValues.join('-')}</Text>
          </View>
          <Slider
            min={18}
            max={70}
            values={ageRangeValues}
            onValuesChange={val => this.setState({ageRangeValues:val})}
            onValuesChangeFinish={val => this.updateUser('ageRange', val)}
          />
          <View style={styles.switch}>
            <Text>Show Men</Text>
            <Switch
              value={showMen}
              onValueChange={val => {
                this.setState({showMen:val})
                this.updateUser('showMen', val)
              }}
            />
          </View>
          <View style={styles.switch}>
            <Text>Show Women</Text>
            <Switch
              value={showWomen}
              onValueChange={val => {
                this.setState({showWomen:val}) 
                this.updateUser('showWomen', val)
              }}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'white',
  },
  profile: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  label: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginLeft:20,
    marginRight:20,
  },
  switch: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    margin:10,
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height:50,
    marginLeft:40,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height:50,
    backgroundColor:'rgb(242,242,242)',
    paddingLeft:40,
  },
  text1: {
    flex: 1,
    paddingLeft: 35,
    fontSize: 14,
  },
})
