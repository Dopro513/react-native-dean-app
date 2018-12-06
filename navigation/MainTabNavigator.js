import firebase from 'firebase'
import Exponent, { Notifications, Font } from 'expo'
import React, {Component} from 'react'
import {View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Image, ScrollView, Dimensions} from 'react-native'
import { NavigationActions } from 'react-navigation'

import Tabbar from 'react-native-tabbar'
// import Home from './home'
// import Matches from './matches'
import SimpleScroller from '../components/simpleScroller'
import Notification from '../screens/notification'
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Matches from '../screens/matches';
import ProfileScreen from '../screens/ProfileScreen'
import _ from 'lodash'
const {width, height} = Dimensions.get('window')
export default class MainTabNavigator extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props);
        this.tabarRef = null
        this.state = {
            badge: 7,
            user:this.props.navigation.state.params.user,
            tab: 'item1',
            noti:0,
            chatNoti:0,
        }
    }
    
    async fontLoad() {
        await Font.loadAsync({
        'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
        'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
        'AbrilFatface-Regular': require('../assets/fonts/AbrilFatface-Regular.ttf')
        });

        this.setState({ fontLoaded: true });
    }
    componentWillMount() {
        this.fetchUser()
        this.noti = 0
        firebase.database().ref('notifications').child(this.state.user.uid).on('value', (snap) => {
            var arr = _.values(snap.val())||[]
            var notify = 0
            arr.map((noti) => {
                if(noti.readed == false) notify ++
            })

            console.log(notify)
            this.setState({
                noti:notify
            })
        })

        firebase.database().ref('lastmessages').child(this.state.user.uid).on('value', (snap) => {
            var arr = _.values(snap.val())||[]
            var notify = 0
            arr.map((noti) => {
                if(noti.readed == false) notify ++
            })

            this.setState({
                chatNoti:notify,
            })
        })

        this.fontLoad()
    }

    fetchUser = () => {
        console.log('fetch data')
        firebase.database().ref('users').child(this.state.user.uid).on('value', (snap) => {
        console.log(snap.val())
        this.setState({
            user:snap.val()||{},
        })
        })
    }

    onScroll = (evt) => {
        // const y = evt.nativeEvent.contentOffset.y
        // this.tabarRef.updateHeight(y)
    }

    onTabSelect(tab) {
        this.setState({ tab })
    }

    renderTabs() {
        const { tab } = this.state
        var home_icon = require('../assets/icons/home.png')
        var alert_icon = require('../assets/icons/alert.png')
        var play_icon = require('../assets/icons/play.png')
        var chat_icon = require('../assets/icons/chat.png')
        var profile_icon = require('../assets/icons/profile.png')

        switch(tab) {
        case 'item1':
            home_icon = require('../assets/icons/home_sel.png')
            break
        case 'item2':
            alert_icon = require('../assets/icons/alert_sel.png')
            break
        case 'item3':
            play_icon = require('../assets/icons/play_sel.png')
            break
        case 'item4':
            chat_icon = require('../assets/icons/chat_sel.png')
            break
        case 'item5':
            profile_icon = require('../assets/icons/profile_sel.png')
            break
        }

        return (
            <View style={{ flex: 1, flexDirection: 'row', borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.05)', }}>
                <TouchableOpacity style={styles.tabItem} onPress={() => this.onTabSelect('item1')}>
                <View>
                    <Image source={home_icon} style={{width:20, height:20,}}/>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}  onPress={() => this.onTabSelect('item2')}>
                <View style={{flexDirection:'row'}}>
                    <Image source={alert_icon} style={{width:20, height:20,}}/>
                    {
                        this.state.noti != 0 ? 
                        <View style={{backgroundColor:'#D11038', width:20, height:20, borderRadius:10,marginLeft:-10, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white'}}>{this.state.noti}</Text>
                        </View>
                        :<View/>
                    }
                    
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}  onPress={() => this.onTabSelect('item3')}>
                    <Image source={play_icon} style={{width:20, height:20,}} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}  onPress={() => this.onTabSelect('item4')}>
                <View style={{flexDirection:'row'}}>
                    <Image source={chat_icon} style={{width:20, height:20,}}/>
                    {
                        this.state.chatNoti != 0 ? 
                        <View style={{backgroundColor:'#D11038', width:20, height:20, borderRadius:10,marginLeft:-10, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white'}}>{this.state.chatNoti}</Text>
                        </View>
                        :<View/>
                    }
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}  onPress={() => this.onTabSelect('item5')}>
                <View>
                    <Image source={profile_icon} style={{width:20, height:22, resizeMode:'contain'}}/>
                </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderContent() {
        const { tab } = this.state
        let content
        switch(tab) {
        case 'item1':
            content = <HomeScreen user={this.state.user} rootNav={this.props.navigation}/>
            break
        case 'item2':
            content = <Notification user={this.state.user} rootNav={this.props.navigation}/>
            break
        case 'item3':
            content = <Text style={{textAlign:'center', marginTop:150,}}>This is the content 3</Text>
            break
        case 'item4':
            content = <Matches navigation={this.props.navigation} user={this.state.user} />
            // content = <Text style={{textAlign:'center', marginTop:150,}}>This is the content 3</Text>
            break
        case 'item5':
            content = <ProfileScreen navigation={this.props.navigation} user={this.state.user} />
            break
        }

        return content
    }


    render() {
        return (

            <View style={styles.container}>
                {/* <ScrollView
                    contentContainerStyle={styles.scrollViewContainer}
                    style={styles.scrollView}
                    onScroll={this.onScroll}
                    scrollEventThrottle={16}> */}
                <View >
                     {this.renderContent()}
                </View>
                {/* </ScrollView> */}
                <Tabbar show={true}
                        disable={false}
                        ref={(ref) => this.tabarRef = ref}
                        style={{ backgroundColor: 'white' }}>
                {this.renderTabs()}
                </Tabbar>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    text: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollViewContainer: {
        height: null,
    },
    scrollView: {
        backgroundColor: 'white'
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
