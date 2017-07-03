'use strict';
import {
  AppRegistry,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';

import Countries from '../common/countries.json';
import {getAuth, getDatabase} from '../common/database';

import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Container, Content,Form, Item, Input, Label, Button} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';


export default class Signup extends Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = {
    title: 'Registrar una cuenta',
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      country: '',
      birthDay: ''
    }
  }

  add() {
    var that = this.state;
    getAuth().createUserWithEmailAndPassword(this.state.email,
      this.state.password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
    }).then(function(firebaseUser) {
      getDatabase().ref().child('users/' + firebaseUser.uid).update({
        Status: 'act',
        Name: that.name,
        LastName: that.lastName,
        Email: that.email,
        Admin: false,
        BirthPlace: that.country,
        BirthDay: that.birthDay
      });
      Alert.alert("Cuenta agregada con exito ");
    })
  }
  render() {

    return (
      <Container>
             <Content>
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
              <ModalDropdown
                  defaultValue={"Country"}
                  options={Countries}
                  textStyle={styles.dropdownModal}
                  dropdownStyle={styles.dropdown}
                  dropdownTextStyle={styles.textDropdown}
                  onSelect={(index,value)=>{this.state.country = value}}
                  />

             </Form>
               <Button block info onPress = {this.add.bind(this)} style={{marginTop:15}}>
                  <Text style={{color:'white'}}>Create New Account</Text>
               </Button>

             </Content>
           </Container>

    );
  }
}
const styles = StyleSheet.create({

  dropdownModal: {
    fontSize: 20,
    paddingLeft: 15,
    paddingTop: 10,
  },

  dropdown: {
    position: 'relative',
    //fontSize: 25,
    width: Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  textDropdown:{
    fontSize:15
  },
});
module.export = Signup;