'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ToolbarAndroid,
  ActivityIndicator,
  Button,
  Alert
} from 'react-native';

import styles from '../style/baseStyles.js';
import * as firebase from 'firebase';
import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
  const firebaseConfig = {
  apiKey: "AIzaSyCdf_99OpPdugQPtnK6wh08P9QDlamdnG8",
 authDomain: "daily-travel-6ff5f.firebaseapp.com",
 databaseURL: "https://daily-travel-6ff5f.firebaseio.com",
 projectId: "daily-travel-6ff5f",
 storageBucket: "daily-travel-6ff5f.appspot.com",
 messagingSenderId: "651940849732"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);


export default class Login extends Component {

  static navigationOptions = {
    header: null,
    title: 'Welcome',
  };
  render() {
    return (
      <View>
        <Text>Aqui para ingresar </Text>
        <Button
        onPress={() => navigate('Chat', { user: 'Lucy' })}
        title="Registrarme"
        />
      </View>
    );
  }
}

{/*const Login = StackNavigator({
  Home: { screen: LoginView },
  Chat: { screen: NewAccount },
});*/}

module.export = Login;
