'use strict';
import {
  Text,
  Alert
} from 'react-native';

import * as firebase from 'firebase';
import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Content,Form, Item, Input, Label, Button} from 'native-base';
const firebaseConfig = {
  apiKey: "AIzaSyCdf_99OpPdugQPtnK6wh08P9QDlamdnG8",
  authDomain: "daily-travel-6ff5f.firebaseapp.com",
  databaseURL: "https://daily-travel-6ff5f.firebaseio.com",
  projectId: "daily-travel-6ff5f",
  storageBucket: "daily-travel-6ff5f.appspot.com",
  messagingSenderId: "651940849732"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default class signup extends Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: 'Registrar una cuenta',
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      name: '',
      lastName: '',
      email: '',
      password: ''
    }
  }

  add() {
  //  this.setState({
  //    visible: !this.state.visible
  //  });
    var that = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(this.state.email,
      this.state.password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
    }).then(function(firebaseUser) {
      firebaseApp.database().ref().child('users/' + firebaseUser.uid).update({
        Status: 'act',
        Name: that.name,
        LastName: that.lastName,
        Email: that.email,
        Admin: false,
        BirthPlace: '',
        BirthDay: ''
      });
      Alert.alert("Cuenta agregada con exito ");
    //  that.visible = false;
    })
  }

  render() {
    return (
      <Container>
             <Content>
             <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
             <Form>
              <Item floatingLabel>
                  <Label>Email Address</Label>
                  <Input
                   onChangeText = {(text) => this.setState({email: text})}
                   value = {this.state.email}/>
              </Item>
              <Item floatingLabel>
                  <Label>Name</Label>
                  <Input
                  onChangeText = {(text) => this.setState({name: text})}
                  value = {this.state.name}/>
              </Item>
              <Item floatingLabel>
                  <Label>Last Name</Label>
                  <Input
                  onChangeText = {(text) => this.setState({lastName: text})}
                  value = {this.state.lastName}/>
              </Item>
              <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                  onChangeText = {(text) => this.setState({password: text})}
                  value = {this.state.password}
                  secureTextEntry = {true}/>
              </Item>
             </Form>
               <Button block info onPress = {this.add.bind(this)} style={{marginTop:15}}>
                  <Text style={{color:'white'}}>Agregar</Text>
               </Button>
             </Content>
           </Container>

    );
  }
}
