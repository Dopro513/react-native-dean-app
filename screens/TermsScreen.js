import firebase from 'firebase'
import React, {Component} from 'react'
import {View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ScrollView} from 'react-native'
import { NavigationActions } from 'react-navigation'
// import BackButton from '../components/backButton'
// import TopBar from '../components/topbar'

export default class TermsScreen extends Component {
  state = {
    showSpinner: true,
  }

  static navigationOptions = {
    title: 'Terms of service',
  };
  render() {
      const { navigate } = this.props.navigation;      
    return (
        <View style={styles.container}>
          <ScrollView style={{margin: 20}}>
            <Text style={{color:'#111111', fontSize: 14,}}>Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern [business name]’s relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.{"\n"}{"\n"}
The term ‘[business name]’ or ‘us’ or ‘we’ refers to the owner of the website whose registered office is [address]. Our company registration number is [company registration number and place of registration]. The term ‘you’ refers to the user or viewer of our website.{"\n"}{"\n"}
The use of this website is subject to the following terms of use:{"\n"}{"\n"}
The content of the pages of this website is for your general information and use only. It is subject to change without notice.{"\n"}{"\n"}
This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: [insert list of information].{"\n"}{"\n"}
Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.{"\n"}{"\n"}
Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.{"\n"}{"\n"}
This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.{"\n"}{"\n"}
All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.{"\n"}{"\n"}
Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.{"\n"}{"\n"}
From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).{"\n"}{"\n"}
Your use of this website and any dispute arising out of such use of the website is subject to the laws of England, Northern Ireland, Scotland and Wales.{"\n"}{"\n"}{"\n"}</Text>
          </ScrollView>
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

  topbar: { 
    paddingTop:20,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth:1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  }
  
})
