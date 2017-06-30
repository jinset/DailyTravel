'use strict';
import {
  AppRegistry,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Alert
} from 'react-native';
import styles from '../style/baseStyles.js';
import * as firebase from 'firebase';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content, Form, Item, Input, Label, Button,Text,Body, Right, Switch, Icon  } from 'native-base';
import strings from '../common/local_strings.js';
import NewDiary from './dairy.js';
import DailyList from './dailyList.js';
import AddNewDaily from './dailyList.js';


  const firebaseConfig = {
  apiKey: "AIzaSyCdf_99OpPdugQPtnK6wh08P9QDlamdnG8",
 authDomain: "daily-travel-6ff5f.firebaseapp.com",
 databaseURL: "https://daily-travel-6ff5f.firebaseio.com",
 projectId: "daily-travel-6ff5f",
 storageBucket: "daily-travel-6ff5f.appspot.com",
 messagingSenderId: "651940849732"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class LoginView extends Component {

  static navigationOptions = {
    header: null,
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Aqui para ingresar </Text>
        <Button block light
        onPress={() => navigate('Chat', { user: 'Lucy' })}>
           <Text>Registrarme</Text>

         </Button>

        <Button block light
        onPress={() => navigate('NewDiary', { user: 'Lucy' })}>
        <Text>{strings.dairy}</Text>
        </Button>

       <Button block light
       onPress={() => navigate('DailyList', { user: 'Lucy' })}>
       <Text>{strings.daily}</Text>
       </Button>
      </View>
    );
  }
}


class NewAccount extends Component {
  add(){
    firebaseApp.auth().createUserWithEmailAndPassword('maasasssd@gads.com' , '1sadsdsasadadsdsad').catch(function(error){
      var errorCode = error.code;
       var errorMessage = error.message;
       if (errorCode == 'auth/weak-password') {
    alert('The password is too weak.');
  } else {
    alert(errorMessage);
  }
    }).then(function(firebaseUser){
      firebaseApp.database().ref().child('users/' + firebaseUser.uid).update({
        lastName: 'name'
      });
      Alert.alert("Cuenta agregada con exito ");
    })
  }


  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: 'Registrar una cuenta',
  };
  render() {
    return (
      <View>
       <Text>sadsad </Text>
       <Button block light
        onPress={() => this.add()}>
       <Text>Agregar </Text>
       </Button>
     </View>
    );
  }
}

const DailyTravel = StackNavigator({
  Home: { screen: LoginView },
  Chat: { screen: NewAccount },
    NewDiary: { screen: NewDiary },
     DailyList: {screen: DailyList},
    AddDaily: { screen: AddNewDaily },
});

AppRegistry.registerComponent('DailyTravel', () => DailyTravel);
