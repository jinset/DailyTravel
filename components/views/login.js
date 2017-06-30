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
import CameraComponent from './CameraComponent'


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
        <Button
        onPress={() => navigate('Chat', { user: 'Lucy' })}
        title="Registrarme"
        />
      <CameraComponent></CameraComponent>
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
       <Button
        onPress={() => this.add()}
        title="Agregar"
       />
     </View>
    );
  }
}

const DailyTravel = StackNavigator({
  Home: { screen: LoginView },
  Chat: { screen: NewAccount },
});

AppRegistry.registerComponent('DailyTravel', () => DailyTravel);
